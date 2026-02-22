from db.driver import DBDriver
from db.models import User, BracketSource, Pool, Participant
from dotenv import load_dotenv
from utils import getDBTimestamp

if (load_dotenv() == False):
    raise "No .env file was found for setting environment variables"

session = DBDriver.startSession()
bracketSource = BracketSource(name="MML 2024-2025 Bracket", fetchUrl="https://sdataprod.ncaa.com/?operationName=scores_bracket_web&variables={\"seasonYear\":2024}&extensions={\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"9b3e0ae3018a2c3cc81877867705189763367a6fca416a36e5196bb4851470a4\"}}")
session.add(bracketSource)
session.commit()

now = getDBTimestamp()
session.refresh(bracketSource)
adminUser = User(username="admin", password="password", displayName="ADMIN")
session.add(adminUser)
pool = Pool(title="Test Pool", createdEpoch=now, startEpoch=now, endEpoch=now, bracketSourceId=bracketSource.id, settings={}, active=True)
session.add(pool)
session.commit()

session.refresh(adminUser)
session.refresh(pool)
adminParticipant = Participant(userId=adminUser.id, poolId=adminUser.id, joinedEpoch=now, hidden=False, balance=0)
session.add(adminParticipant)
session.commit()

session.close()

