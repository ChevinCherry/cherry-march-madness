import uvicorn
from fastapi import FastAPI
from services import PoolService, PickService, BracketService
from db.driver import DBDriver
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
    picks = PickService.getAllPoolPicks(session, pool.id)
    session.close()
    return {"pool": pool, "picks": picks}

@app.get("/pool/{poolId}")
async def getPoolData(poolId: uuid.UUID):
    print(poolId, type(poolId))
    session = DBDriver.startSession()
    pool = PoolService.getPoolData(session, poolId)
    picks = PickService.getAllPoolPicks(session, poolId)
    print(pool, picks)
    session.close()
    return {"pool": pool, "picks": picks}

@app.post("/bracket/{bracketSourceId}")
async def getBracketUpdate(bracketSourceId: uuid.UUID):
    print(bracketSourceId)
    session = DBDriver.startSession()
    bracketData = BracketService.doBracketUpdate(session, bracketSourceId)
    session.commit()
    session.close()
    return bracketData

@app.post("/pick")
async def makePick():
    PickService.makePick()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)