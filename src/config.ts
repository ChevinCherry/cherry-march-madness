import { PoolConfig } from "./types/pool";

export const CONFIG: PoolConfig = {
  scoresURL:
    'https://sdataprod.ncaa.com/?operationName=scores_bracket_web&variables={"seasonYear":2024}&extensions={"persistedQuery":{"version":1,"sha256Hash":"9b3e0ae3018a2c3cc81877867705189763367a6fca416a36e5196bb4851470a4"}}',
  bracketsPath: "../brackets",
  scoring: {
    1: 0,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 8,
  },
};
