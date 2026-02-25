from pydantic import SecretStr
from sqlalchemy import select
from sqlalchemy.orm import Session
from uuid import UUID
from db.models import DBUser, DBRefreshToken, DBUser
from api.models import APIUser
from utils import getDBTimestamp
from fastapi import Response, HTTPException, status, Cookie
from typing import Any
import jwt
import os

def generateRefreshToken(session: Session, userId: UUID) -> UUID:
    refreshTokenLifetime = os.getenv('REFRESH_TOKEN_LIFETIME_MS')
    if refreshTokenLifetime == None:
        raise "Missing JWT_LIFETIME_MS in env"
    newToken = DBRefreshToken(userId=userId, expiryEpoch=getDBTimestamp()+int(refreshTokenLifetime))
    session.add(newToken)
    session.commit()
    session.refresh(newToken)
    return newToken.token

def generateAuthJWT(userId: UUID):
    secret = os.getenv('JWT_SECRET')
    if (secret == None):
        raise "Missing JWT_SECRET in env"
    accessTokenLifetime = os.getenv('JWT_LIFETIME_MS')
    if accessTokenLifetime == None:
        raise "Missing JWT_LIFETIME_MS in env"
    payload = {
        "userId": str(userId),
        "exp": getDBTimestamp() + int(accessTokenLifetime)
    }
    return jwt.encode(payload, secret, "HS256")

def decodeJWT(token: str):
    secret = os.getenv('JWT_SECRET')
    if (secret == None):
        raise "Missing JWT_SECRET in env"
    return jwt.decode(token, secret, algorithms=["HS256"])

def setRefreshTokenCookie(response: Response, refreshToken: UUID):
    refreshTokenLifetime = os.getenv('REFRESH_TOKEN_LIFETIME_MS')
    if refreshTokenLifetime == None:
        raise "Missing REFRESH_TOKEN_LIFETIME_MS in env"
    response.set_cookie(key="refreshToken", value=refreshToken, max_age=int(refreshTokenLifetime), httponly=True, samesite="lax")

def deleteRefreshTokenCookie(response: Response):
    response.delete_cookie(key="refreshToken")

def setAccessTokenCookie(response: Response, accessToken: str):
    accessTokenLifetime = os.getenv('JWT_LIFETIME_MS')
    if accessTokenLifetime == None:
        raise "Missing JWT_LIFETIME_MS in env"
    response.set_cookie(key="accessToken", value=accessToken, max_age=int(accessTokenLifetime), httponly=True, samesite="lax")

def deleteAccessTokenCookie(response: Response):
    response.delete_cookie(key="accessToken")

def createUser(session: Session, username: str, password: SecretStr, displayName:str) -> DBUser | str:
    selectExistingUserName = select(DBUser).where(DBUser.username == username)
    existingUser = session.scalars(selectExistingUserName).first()
    if (existingUser != None):
        return "Username is taken."
    user = DBUser(username=username, password=password.get_secret_value(), displayName=displayName, createdEpoch=getDBTimestamp())
    session.add(user)
    return user

def login(session: Session, response: Response, username: str, password: SecretStr) -> APIUser:
    userSelect = select(DBUser).where(DBUser.username == username, DBUser.password == password.get_secret_value())
    user = session.scalars(userSelect).first()
    if (user == None):
        session.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username or Password is incorrect.")
    refreshToken = generateRefreshToken(session, user.id)
    accessToken = generateAuthJWT(user.id)
    setRefreshTokenCookie(response, refreshToken)
    setAccessTokenCookie(response, accessToken)
    return APIUser.model_validate(user, from_attributes=True)

def logout(session: Session, response: Response, userId: UUID):
    session.query(DBRefreshToken).filter(DBRefreshToken.userId == userId).delete()
    deleteAccessTokenCookie(response)
    deleteRefreshTokenCookie(response)
    
def refreshAccessToken(session: Session, response: Response, refreshToken: UUID) -> str | None:
    refreshTokenSelect = select(DBRefreshToken).where(DBRefreshToken.token == refreshToken)
    dbRefreshToken = session.scalars(refreshTokenSelect).first()
    if (dbRefreshToken == None):
        return None
    now = getDBTimestamp()
    if (dbRefreshToken.expiryEpoch > now):
        session.delete(dbRefreshToken)
        return None
    accessToken = generateAuthJWT(dbRefreshToken.userId)
    setAccessTokenCookie(response, accessToken)

def validateAccessToken(accessToken: str | None):
    if (accessToken == None):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Access Token")
    tokenData =  decodeJWT(accessToken)
    expiryEpoch = tokenData['exp']
    if type(expiryEpoch) != int or expiryEpoch < getDBTimestamp():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Expired Access Token")
    return tokenData

def accessTokenBelongsTo(tokenData: dict[str, Any], userId: UUID):
    tokenUserId = tokenData['userId']
    if type(tokenUserId) != str:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    tokenUserId = UUID(tokenUserId)
    if tokenUserId != userId:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

def getAccessTokenUserId(tokenData: dict[str, Any]) -> UUID:
    tokenUserId = tokenData['userId']
    if type(tokenUserId) != str:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return UUID(tokenUserId)
    
def getUserById(session: Session, userId: UUID) -> APIUser | None:
    userSelect = select(DBUser).where(DBUser.id == userId)
    dbUser = session.scalars(userSelect).first()
    if (dbUser == None):
        return None
    return APIUser.model_validate(dbUser, from_attributes=True)