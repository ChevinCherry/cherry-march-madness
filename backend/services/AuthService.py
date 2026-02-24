from sqlalchemy import select
from sqlalchemy.orm import Session
from uuid import UUID
from backend.db.models import DBUser, DBRefreshToken, DBUser
from backend.api.models import APIAuthTokens
from utils import getDBTimestamp
from fastapi import HTTPException
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

def login(session: Session, username: str, password: str) -> APIAuthTokens | None:
    userSelect = select(DBUser).where(DBUser.username == username and DBUser.password == password)
    user = session.scalars(userSelect).first()
    if (user == None):
        return None
    refreshToken = generateRefreshToken(session, user.id)
    accessToken = generateAuthJWT(user.id)
    return APIAuthTokens(refreshToken=refreshToken, accessToken=accessToken)
    
def generateAuthJWT(userId: UUID):
    secret = os.getenv('JWT_SECRET')
    if (secret == None):
        raise "Missing JWT_SECRET in env"
    lifetime = os.getenv('JWT_LIFETIME_MS')
    if (lifetime == None):
        raise "Missing JWT_LIFETIME_MS in env"
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

def generateRefreshToken(session: Session, userId: UUID) -> UUID:
    newToken = DBRefreshToken(userId=userId)
    session.add(newToken)
    session.commit()
    session.refresh(newToken)
    return newToken.token
    
def refresh(session: Session, refreshToken: UUID) -> str | None:
    refreshTokenSelect = select(DBRefreshToken).where(DBRefreshToken.token == refreshToken)
    dbRefreshToken = session.scalars(refreshTokenSelect).first()
    now = getDBTimestamp()
    if (dbRefreshToken.expiryEpoch > now):
        session.delete(dbRefreshToken)
        return None
    return generateAuthJWT(dbRefreshToken.userId)

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