export interface Round {
  title: string;
  roundNumber: number;
  subtitle?: string;
  label?: string;
  __typename: "Round";
}

export interface Region {
  sectionId: number;
  position: string;
  title: string;
  abbreviation: string;
  __typename: "RegionSection";
}

export interface Broadcaster {
  id: string;
  name: string;
  __typename: "Broadcaster";
}

export interface Team {
  isTop: boolean;
  isHome: boolean;
  score: number;
  color: string;
  ncaaOrgId: number;
  seed: number;
  seoname: string;
  nickname: string;
  nameShort: string;
  name6Char: string;
  isWinner: boolean;
  wins?: number;
  losses?: number;
  __typename: "ChampionshipTeam";
}

export interface Game {
  startDate: string;
  contestId: number;
  championshipId: number;
  startTimeEpoch: number;
  hasStartTime: true;
  bracketId: number;
  gameState: string;
  gameStateCode: number;
  gamestateDisplay: string;
  statusCodeDisplay: string;
  victorGamePosition: string;
  victorBracketPositionId: number;
  mmlVideo: boolean;
  round: Round;
  region: Region;
  broadcaster: Broadcaster;
  teams: Team[];
  __typename: "ChampionshipGame";
}

export interface MMLScoresBracketWebPayload {
  data: {
    mmlContests: Game[];
  };
}
