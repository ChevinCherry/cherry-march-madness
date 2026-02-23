from pydantic import BaseModel
from uuid import UUID
from typing import Any

class APIPickCreate(BaseModel):
    mmlTeamId: int
    mmlContestId: int

class APIPick(APIPickCreate):
    id: UUID
    userId: UUID
    poolId: UUID
    pickEpoch: int
    current: bool

class APIPool(BaseModel):
    id: UUID
    title: str
    creatorId: UUID
    bracketSourceId: UUID
    createdEpoch: int
    startEpoch: int
    endEpoch: int
    active: bool
    settings: Any

class APIParticipant(BaseModel):
    userId: str
    displayName: str

class APIPoolData(BaseModel):
    pool: APIPool
    participants: list[APIParticipant]
    picks: list[APIPick]

class APIUpdatePicksRequestBody(BaseModel):
    userId: UUID
    poolId: UUID
    newPicks: list[APIPickCreate]
    deletePicks: list[UUID]

class APIBracketSource(BaseModel):
    id: UUID
    name: str
    fetchUrl: str
    lastFetch: Any
    lastFetchEpoch: int