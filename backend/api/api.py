import uvicorn
from fastapi import FastAPI
from services import PoolService, PickService, BracketService
from backend.db.driver import DBDriver
from backend.api.models import APIUpdatePicksRequestBody, APIPoolData, APIPool, APIPick
from dotenv import load_dotenv
import uuid

load_dotenv()

app = FastAPI(title="CherryMMApi", version="1.0.0")

@app.get("/")
async def helloWorld():
    return "Hello from the Cherry March Madness API!"

@app.get("/activePool")
async def getActivePool():
    session = DBDriver.startSession()
    pool = PoolService.getActivePoolData(session)
    participants = PoolService.getPoolParticipants(session, pool.id)
    picks = PickService.getAllPoolPicks(session, pool.id)
    session.close()
    return APIPoolData(pool=pool, participants=participants, picks=picks)

@app.get("/pool/{poolId}")
async def getPoolData(poolId: uuid.UUID):
    session = DBDriver.startSession()
    pool = PoolService.getPoolData(session, poolId)
    participants = PoolService.getPoolParticipants(session, participants)
    picks = PickService.getAllPoolPicks(session, poolId)
    session.close()
    return APIPoolData(pool=pool, participants=participants, picks=picks)

@app.post("/bracket/{bracketSourceId}")
async def getBracketUpdate(bracketSourceId: uuid.UUID):
    print(bracketSourceId)
    session = DBDriver.startSession()
    bracketData = BracketService.doBracketUpdate(session, bracketSourceId)
    session.commit()
    session.close()
    return bracketData

@app.post("/updatePicks")
async def updatePicks(body: APIUpdatePicksRequestBody):
    session = DBDriver.startSession()
    newPicks = PickService.makePicks(session=session, userId=body.userId, poolId=body.poolId, picks=body.newPicks)
    PickService.deletePicks(session, pickIds=body.deletePicks)
    session.commit()
    session.close()
    return newPicks

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)