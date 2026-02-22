from sqlalchemy import select
from sqlalchemy.orm import Session
from db.models import BracketSource
from utils import getDBTimestamp
import requests
import os

BRACKET_UPDATE_INTERVAL_MS = int(os.getenv('BRACKET_UPDATE_INTERVAL_MS') or 10000)

def getBracketSource(session: Session, bracketSourceId: str):
    bracketSourceSelect = select(BracketSource).where(BracketSource.id == bracketSourceId)
    return session.scalars(bracketSourceSelect).first()

def doBracketUpdate(session: Session, bracketSource: BracketSource) -> BracketSource:
    if (getDBTimestamp() - bracketSource.lastFetchEpoch < BRACKET_UPDATE_INTERVAL_MS):
        return BracketSource
    session.add(bracketSource)
    bracketSource.lastFetchEpoch = getDBTimestamp()
    latestData = requests.get(bracketSource.fetchUrl).json()
    bracketSource.lastFetch = latestData
    return bracketSource
