from sqlalchemy import select
from sqlalchemy.orm import Session
from db.models import DBBracketSource
from api.models import APIBracketSource
from utils import getDBTimestamp
import requests
import os

BRACKET_UPDATE_INTERVAL_MS = int(os.getenv('BRACKET_UPDATE_INTERVAL_MS') or 10000)

def getBracketSource(session: Session, bracketSourceId: str) -> APIBracketSource:
    bracketSourceSelect = select(DBBracketSource).where(DBBracketSource.id == bracketSourceId)
    bracketSource = session.scalars(bracketSourceSelect).first()
    return APIBracketSource(bracketSource)

def doBracketUpdate(session: Session, bracketSource: DBBracketSource) -> APIBracketSource:
    if (getDBTimestamp() - bracketSource.lastFetchEpoch < BRACKET_UPDATE_INTERVAL_MS):
        return DBBracketSource
    session.add(bracketSource)
    bracketSource.lastFetchEpoch = getDBTimestamp()
    latestData = requests.get(bracketSource.fetchUrl).json()
    bracketSource.lastFetch = latestData
    return APIBracketSource.model_validate(bracketSource, from_attributes=True)
