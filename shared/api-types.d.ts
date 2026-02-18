export interface Pick {
  playerId: string;
  epoch: number;
  contestId: number;
  teamId: number;
  poolId: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
}

export interface UserPickData {
  player: User;
  picks: Pick[];
}

interface PoolData {
  poolId: string;
  picks: Pick[];
  users: User[];
}
