from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.db.models import DBPool, DBParticipant
from backend.api.models import APIPool, APIParticipant

def getPoolData(session: Session, poolId: str) -> (APIPool | None):
    poolSelect = select(DBPool).where(DBPool.id == poolId)
    pool = session.scalars(poolSelect).first()
    if (pool == None):
        return None
    return APIPool(pool)

def getActivePoolData(session: Session) -> (APIPool | None):
    poolSelect = select(DBPool).where(DBPool.active == True)
    pool = session.scalars(poolSelect).first()
    if (pool == None):
        return None
    return APIPool(pool)

def getPoolParticipants(session: Session, poolId: str) -> list[APIParticipant]:
    participantsSelect = select(DBParticipant).where(DBParticipant.poolId == poolId)
    participants = list(session.scalars(participantsSelect).all())
    return list(map(APIParticipant, participants))
