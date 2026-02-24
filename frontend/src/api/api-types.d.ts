import { MMLData } from "../types/mml";

export interface APIUser {
  id: string;
  username: string;
  displayName: string;
  createdEpoch: number;
}

export interface APIPick {
  playerId: string;
  epoch: number;
  contestId: number;
  teamId: number;
  poolId: string;
}

export interface APIPool {
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

export interface APIParticipant {
  id: string;
  displayName: string;
}

export interface APIPoolData {
  pool: APIPool;
  participants: APIParticipant[];
  picks: APIPick[];
}

export interface APICreateUserBody {
  username: string;
  password: string;
  displayName: string;
}

export interface APILoginBody {
  username: string;
  password: string;
}

export interface APIBracketSource {
  id: string;
  name: string;
  fetchUrl: string;
  lastFetch: MMLData;
  lastFetchEpoch: number;
}
