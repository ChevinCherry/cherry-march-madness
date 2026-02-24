from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.db.models import DBPick
from backend.api.models import APIPick, APIPickCreate
from uuid import UUID
from utils import getDBTimestamp

def DBPickToAPIPick(dbPick: DBPick) -> APIPick:
    return APIPick.model_validate(dbPick, from_attributes=True)

def getAllPoolPicks(session: Session, poolId: str) -> list[APIPick]:
    pickSelect = select(DBPick).where(DBPick.poolId == poolId)
    dbPickList = list(session.scalars(pickSelect).all())
    return list(map(DBPickToAPIPick, dbPickList))

def makePick(session: Session, userId: UUID, poolId: UUID, pick: APIPickCreate, timestamp: int | None) -> APIPick:
    dbPick = DBPick(userId=userId, poolId=poolId, mmlContestId=pick.mmlContestId, mmlTeamId=pick.mmlTeamId, current=True, pickEpoch=timestamp or getDBTimestamp())
    session.add(dbPick)
    return DBPickToAPIPick(dbPick)

def makePicks(session: Session, userId: UUID, poolId: UUID, picks: list[APIPickCreate]) -> list[APIPick]: 
    now = getDBTimestamp()
    return list(map(lambda pick: makePick(session, userId, poolId, pick, now), picks))

def deletePicks(session: Session, pickIds: list[UUID]):
    for pickId in pickIds:
        session.query(DBPick).filter(DBPick.id == pickId).update({"current": False}, synchronize_session=True)