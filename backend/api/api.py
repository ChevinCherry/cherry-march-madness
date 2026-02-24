import uvicorn
from fastapi import FastAPI, HTTPException, status, Body, Cookie, Response
from fastapi.middleware.cors import CORSMiddleware
from services import AuthService, PoolService, PickService, BracketService
from db.driver import DBDriver
from api.models import APICreateUserRequestBody, APILoginRequestBody, APIAccessToken, APIUpdatePicksRequestBody, APIPoolData
from dotenv import load_dotenv
import uuid

load_dotenv()

app = FastAPI(title="CherryMMApi", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://0.0.0.0:5173", "http://localhost:5173","http://127.0.0.1:5173",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def helloWorld():
    return "Hello from the Cherry March Madness API!"

@app.post("/createUser")
async def createUser(body: APICreateUserRequestBody, response: Response):
    session = DBDriver.startSession()
    res = AuthService.createUser(session, username=body.username, password=body.password, displayName=body.displayName)
    session.commit()
    session.close()
    if (type(res) is str):
        raise HTTPException(HTTPException(status.HTTP_400_BAD_REQUEST), res)
    user = AuthService.login(session=session, response=response, username=body.username, password=body.password)
    if (user == None):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="User account was created, but failed to log in")
    return user


@app.post("/login")
async def login(body: APILoginRequestBody, response: Response):
    session = DBDriver.startSession()
    user = AuthService.login(session=session, response=response, username=body.username, password=body.password)
    session.commit()
    session.close()
    if (user == None):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username or Password is incorrect")
    return user

@app.post("/refreshToken")
async def refreshToken(refreshToken: uuid.UUID = Cookie()):
    session = DBDriver.startSession()
    accessToken = AuthService.refresh(session, refreshToken)
    session.commit()
    session.close()
    if accessToken == None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Refresh Token")
    return APIAccessToken(accessToken)

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
    if bracketData == None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bracket source with that ID does not exist")
    return bracketData

@app.post("/updatePicks")
async def updatePicks(body: APIUpdatePicksRequestBody = Body(), accessToken: uuid.UUID = Cookie(None)):
    authed = AuthService.validateAccessToken(accessToken, expectedOwnerUserId=body.userId)
    if (authed == False):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Access Token")
    session = DBDriver.startSession()
    newPicks = PickService.makePicks(session=session, userId=body.userId, poolId=body.poolId, picks=body.newPicks)
    PickService.deletePicks(session, pickIds=body.deletePicks)
    session.commit()
    session.close()
    return newPicks

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)