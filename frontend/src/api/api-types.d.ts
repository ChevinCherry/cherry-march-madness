export interface Pick {
  playerId: string;
  epoch: number;
  contestId: number;
  teamId: number;
  poolId: string;
}

export interface Pool {
  id: string;
  title: string;
  creatorId: string;
  bracketSourceId: string;
  createdEpoch: number;
  startEpoch: number;
  endEpoch: number;
  active: boolean;
  settings: any;
}

export interface Participant {
  id: string;
  displayName: string;
}

export interface PoolData {
  pool: Pool;
  participants: Participant[];
  picks: Pick[];
}
