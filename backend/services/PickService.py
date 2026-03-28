from sqlalchemy import select
from sqlalchemy.orm import Session
from db.models import DBPick
from api.models import APIPick, APIPickCreate
from uuid import UUID
from utils import getDBTimestamp

def DBPickToAPIPick(dbPick: DBPick) -> APIPick:
    print(dbPick.id, dbPick.poolId, dbPick.userId)
    return APIPick.model_validate(dbPick, from_attributes=True)

def getAllPoolPicks(session: Session, poolId: str) -> list[APIPick]:
    pickSelect = select(DBPick).where(DBPick.poolId == poolId, DBPick.current == True)
    dbPickList = list(session.scalars(pickSelect).all())
    return list(map(DBPickToAPIPick, dbPickList))

def updatePicks(session: Session, userId: UUID, poolId: UUID, makePicks: list[APIPickCreate], deletePicks: list[UUID]) -> list[APIPick]:
    dbPicks = []
    allDeletePickIds = deletePicks
    if (len(makePicks) > 0):
        existingPickSelect = select(DBPick.id).where(DBPick.poolId == poolId, DBPick.userId == userId, DBPick.current == True, DBPick.mmlContestId.in_([pick.mmlContestId for pick in makePicks]))
        existingPicksToDelete = list(session.scalars(existingPickSelect).all())
        allDeletePickIds = existingPicksToDelete + deletePicks
        now = getDBTimestamp()
        dbPicks = [DBPick(userId=userId, poolId=poolId, mmlContestId=pick.mmlContestId, mmlTeamId=pick.mmlTeamId, current=True, pickEpoch=now) for pick in makePicks]
        for dbPick in dbPicks:
            session.add(dbPick)
    session.query(DBPick).filter(DBPick.id.in_(allDeletePickIds)).update({"current": False})
    session.commit()
    for dbPick in dbPicks:
        session.refresh(dbPick)
    return list(map(DBPickToAPIPick, dbPicks))

