from sqlalchemy import select
from sqlalchemy.orm import Session
from db.models import DBBracketSource
from api.models import APIBracketSource
from uuid import UUID
from utils import getDBTimestamp
import requests
import os

BRACKET_UPDATE_INTERVAL_MS = int(os.getenv('BRACKET_UPDATE_INTERVAL_MS') or 10000)

def doBracketUpdate(session: Session, bracketSourceId: UUID) -> APIBracketSource | None:
    bracketSourceSelect = select(DBBracketSource).where(DBBracketSource.id == bracketSourceId)
    bracketSource = session.scalars(bracketSourceSelect).first()
    print(bracketSource)
    if (bracketSource == None):
        return None
    if ((bracketSource.lastFetchEpoch != None) and (getDBTimestamp() - bracketSource.lastFetchEpoch < BRACKET_UPDATE_INTERVAL_MS)):
        return APIBracketSource.model_validate(bracketSource, from_attributes=True)
    session.add(bracketSource)
    bracketSource.lastFetchEpoch = getDBTimestamp()
    latestData = requests.get(bracketSource.fetchUrl).json()
    bracketSource.lastFetch = latestData
    return APIBracketSource.model_validate(bracketSource, from_attributes=True)
