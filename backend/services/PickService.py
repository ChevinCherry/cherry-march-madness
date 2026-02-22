from sqlalchemy import select
from sqlalchemy.orm import Session
from db.models import Pick
from uuid import UUID
from utils import getDBTimestamp

def getAllPoolPicks(session: Session, poolId: str) -> list[Pick]:
    pickSelect = select(Pick).where(Pick.poolId == poolId)
    return list(session.scalars(pickSelect).all())

def makePick(session: Session, userId: UUID, poolId: UUID, mmlContestId: int, mmlTeamId: int):
    newPick = Pick(userId=userId, poolId=poolId, mmlContestId=mmlContestId, mmlTeamId=mmlTeamId, pickEpoch=getDBTimestamp())
    session.add(newPick)
    return newPick