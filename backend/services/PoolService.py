from sqlalchemy import select
from sqlalchemy.orm import Session
from db.models import Pool

def getPoolData(session: Session, poolId: str) -> (Pool | None):
    poolSelect = select(Pool).where(Pool.id == poolId)
    return session.scalars(poolSelect).first()

def getActivePoolData(session: Session) -> (Pool | None):
    poolSelect = select(Pool).where(Pool.active == True)
    return session.scalars(poolSelect).first()
