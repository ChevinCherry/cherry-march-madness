from sqlalchemy import select
from sqlalchemy.orm import Session
from db.models import DBPool, DBParticipant, DBUser
from api.models import APIPool, APIPublicParticipant

def getPoolData(session: Session, poolId: str) -> (APIPool | None):
    poolSelect = select(DBPool).where(DBPool.id == poolId)
    pool = session.scalars(poolSelect).first()
    if (pool == None):
        return None
    return APIPool.model_validate(pool, from_attributes=True)

def getActivePoolData(session: Session) -> (APIPool | None):
    poolSelect = select(DBPool).where(DBPool.active == True)
    pool = session.scalars(poolSelect).first()
    if (pool == None):
        return None
    print(pool)
    return APIPool.model_validate(pool, from_attributes=True)

def getPoolPublicParticipants(session: Session, poolId: str) -> list[APIPublicParticipant]:
    participantsSelect = select(DBParticipant.userId, DBUser.displayName).join(DBUser).where(DBParticipant.poolId == poolId)
    return [APIPublicParticipant.model_validate(dict(row), from_attributes=True) for row in session.execute(participantsSelect).mappings()]
