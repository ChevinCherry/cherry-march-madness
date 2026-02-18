from pydantic import BaseModel

class User(BaseModel):
    id: str
    username: str
    displayName: str
    picutre: str | None

class Pool(BaseModel):
    id: str
    title: str
    startEpoch: int
    endEpoch: int
    playerIds: list[str]


class Pick(BaseModel):
    id: str
    pickEpoch: int
    userId: str
    poolId: str
    gameId: int
    teamId: int

class FullPoolData(BaseModel):
     pool: Pool
     picks: list[Pick]


