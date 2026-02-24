from db.driver import DBDriver
from db.models import DBUser, DBBracketSource, DBPool, DBParticipant
from dotenv import load_dotenv
from utils import getDBTimestamp

if (load_dotenv() == False):
    raise "No .env file was found for setting environment variables"

session = DBDriver.startSession()
bracketSource = DBBracketSource(name="MML 2024-2025 Bracket", fetchUrl="https://sdataprod.ncaa.com/?operationName=scores_bracket_web&variables={\"seasonYear\":2024}&extensions={\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"9b3e0ae3018a2c3cc81877867705189763367a6fca416a36e5196bb4851470a4\"}}")
session.add(bracketSource)
session.commit()

now = getDBTimestamp()
session.refresh(bracketSource)
adminUser = DBUser(username="admin", password="password", displayName="ADMIN", createdEpoch=now)
session.add(adminUser)
pool = DBPool(title="Test Pool", createdEpoch=now, startEpoch=now, endEpoch=now, bracketSourceId=bracketSource.id, settings={}, active=True)
session.add(pool)
session.commit()

session.refresh(adminUser)
session.refresh(pool)
adminParticipant = DBParticipant(userId=adminUser.id, poolId=adminUser.id, joinedEpoch=now, hidden=False, balance=0)
session.add(adminParticipant)
session.commit()

session.close()

