import { MMLData } from "../types/mml";

export interface APIUser {
  id: string;
  username: string;
  displayName: string;
  createdEpoch: number;
}

export interface APIPick {
  id: string;
  userId: string;
  epoch: number;
  mmlContestId: number;
  mmlTeamId: number;
  poolId: string;
}

export interface APIPickCreate {
  mmlTeamId: number;
  mmlContestId: number;
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
  userId: string;
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
