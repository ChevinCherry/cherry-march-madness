from sqlalchemy import select
from sqlalchemy.orm import Session
from uuid import UUID
from backend.db.models import DBUser, DBRefreshToken, DBUser
from backend.api.models import APIUser
from utils import getDBTimestamp
from fastapi import Response
import jwt
import os

def createUser(session: Session, username: str, password: str, displayName:str) -> DBUser | str:
    selectExistingUserName = select(DBUser).where(DBUser.username == username)
    existingUser = session.scalars(selectExistingUserName).first()
    if (existingUser != None):
        return "Username is taken."
    user = DBUser(username=username, password=password, displayName=displayName)
    session.add(user)
    return user

def login(session: Session, response: Response, username: str, password: str) -> APIUser | None:
    userSelect = select(DBUser).where(DBUser.username == username and DBUser.password == password)
    user = session.scalars(userSelect).first()
    if (user == None):
        return False
    accessTokenLifetime = os.getenv('JWT_LIFETIME_MS')
    if accessTokenLifetime == None:
        raise "Missing JWT_LIFETIME_MS in env"
    refreshTokenLifetime = os.getenv('REFRESH_TOKEN_LIFETIME_MS')
    if refreshTokenLifetime == None:
        raise "Missing REFRESH_TOKEN_LIFETIME_MS in env"
    refreshToken = generateRefreshToken(session, user.id, int(refreshTokenLifetime))
    accessToken = generateAuthJWT(user.id, int(accessTokenLifetime))
    response.set_cookie(key="refreshToken", value=refreshToken, max_age=int(refreshTokenLifetime), httponly=True, samesite="lax")
    response.set_cookie(key="accessToken", value=accessToken, max_age=int(accessTokenLifetime), httponly=True, samesite="lax")
    return APIUser.model_validate(user, from_attributes=True)
    
def generateAuthJWT(userId: UUID, lifetime: int):
    secret = os.getenv('JWT_SECRET')
    if (secret == None):
        raise "Missing JWT_SECRET in env"
    payload = {
        "userId": userId,
        "exp": getDBTimestamp() + lifetime
    }
    return jwt.encode(payload, secret, "HS256")

def decodeJWT(token: str):
    secret = os.getenv('JWT_SECRET')
    if (secret == None):
        raise "Missing JWT_SECRET in env"
    return jwt.decode(token, secret, algorithms=["HS256"])

def generateRefreshToken(session: Session, userId: UUID, lifetimeMS: int) -> UUID:
    newToken = DBRefreshToken(userId=userId, expiryEpoch=getDBTimestamp()+lifetimeMS)
    session.add(newToken)
    session.commit()
    session.refresh(newToken)
    return newToken.token
    
def refresh(session: Session, refreshToken: UUID) -> str | None:
    tokenLifetime = os.getenv('JWT_LIFETIME_MS')
    if tokenLifetime == None:
        raise "Missing JWT_LIFETIME_MS in env"
    refreshTokenSelect = select(DBRefreshToken).where(DBRefreshToken.token == refreshToken)
    dbRefreshToken = session.scalars(refreshTokenSelect).first()
    if (dbRefreshToken == None):
        return None
    now = getDBTimestamp()
    if (dbRefreshToken.expiryEpoch > now):
        session.delete(dbRefreshToken)
        return None
    return generateAuthJWT(dbRefreshToken.userId, int(tokenLifetime))

def validateAccessToken(token: str | None, expectedOwnerUserId: UUID | None) -> bool:
    if (token == None):
        return False
    tokenPayload =  decodeJWT(token)
    expiryEpoch = tokenPayload['exp']
    if type(expiryEpoch) == "int" and expiryEpoch > getDBTimestamp():
        return False
    if expectedOwnerUserId != None & expectedOwnerUserId != UUID(tokenPayload['userId']):
        return False
    return True