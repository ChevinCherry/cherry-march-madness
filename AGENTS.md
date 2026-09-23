## Overview
March Madness Bracket for my Family Pool. Manages score/standing calculations, user accounts, and picks. Bracket data is fetched live from March Madness Live.
React/Typescript, Vite frontend.
Python FastAPI backend using MySQL and SQLAlchemy 2.0.

## Project Structure
/frotntend
    /src
        /api        Client Side API calls (no fetch outside of here)
        /components Reusable components
        /contexts   useContext() hook definitions for global state
        /pages      Route-level components
        /themes     App UI theme definitions
        /types      Typescript type defininitions
/backend
    /api            FastAPI endpoints, no business logic here
    /db             Database table definitions, database scripts
        /data       *DO NOT TOUCH*
    /services       Business Logic services, organized by functionality

## Commands
cd frontend && npm run start        # Serve vite frontend
cd backend && python -m api.api     # Serve API
source backend/venv/bin/activate    # Activate backend virtual environment

## Conventions

### Frontend
- Do not use `any` in Typescript
- All API calls exist under the `api` directory. No fetch outside of this directory
- All components are functional
- Avoid prop drilling too many levels, if a state will be used elsewhere set up a `context`

### Backend
- Keep `api` very light, any business logic and db calls should happen under `services`
- API responses are strongly typed, if an endpoint returns any data, it should have a corresponding model under `api/models.py`. API models are always prefixed with `API`, DB models are always prefixed with `DB`
- Database sessions are handled by the DB driver. Sessions are passed into service functions. Service functions should NOT open or close sessions. If an endpoint should make database changes, commit and close at the end of the API function.
- Session commits happen outside the service function. Only if feasible.
- All errors within services should raise an `HTTPException`

## Examples
### FastAPI endpoint
```
@app.get("/pool/{poolId}")
async def getPoolData(poolId: uuid.UUID, accessToken: str = Cookie(None)):
    AuthService.validateAccessToken(accessToken)
    session = DBDriver.startSession()
    pool = PoolService.getPoolData(session, poolId)
    participants = PoolService.getPoolPublicParticipants(session, pool.id)
    picks = PickService.getAllPoolPicks(session, poolId)
    session.close()
    return APIPoolData(pool=pool, participants=participants, picks=picks)
```

### React Component
```
import { Box, SxProps } from "@mui/material";
import React from "react";

interface LogoProps {
  sx?: SxProps;
}

const Logo = (props: LogoProps) => {
  const { sx } = props;
  return <Box component="img" src="mmlogo.png" sx={sx} />;
};

export default Logo;
```

## DO NOT
- Do not add any dependencies without asking first, avoid dependencies unless it significantly reduces complexity
- Do not automatically run database migrations