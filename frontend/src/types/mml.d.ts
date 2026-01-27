interface MMLTeam {
  isTop: boolean;
  isHome: boolean;
  score: number;
  color: string;
  nickname: string;
  wins: number;
  losses: number;
  ncaaOrgId: number;
  seed: number;
  name6Char: string;
  seoname: string;
  nameShort: string;
  isWinner: boolean;
  __typename: string;
}

interface MMLRound {
  roundNumber: number;
  title: string;
  subtitle: string;
  label: string;
  __typename: string;
}

interface MMLContest {
  startDate: string;
  contestId: number;
  championshipId: number;
  startTimeEpoch: number;
  hasStartTime: boolean;
  bracketId: number;
  gameState: string;
  gameStateCode: number;
  gamestateDisplay: string;
  statusCodeDisplay: string;
  victorGamePosition: string;
  victorBracketPositionId: number;
  currentPeriod: string;
  contestClock: string;
  period: unknown | null;
  hasRecapVideo: boolean;
  hasPreviewVideo: boolean;
  hasReplayVideo: boolean;
  hasExcitementAlert: boolean;
  mmlVideo: boolean;
  mmlRadio: boolean;
  broadcaster: {
    id: string;
    name: string;
    __typename: string;
  };
  excitementAlerts: [];
  location: {
    id: string;
    venue: string;
    __typename: string;
  };
  mmlStreams: [
    {
      mediaId: string;
      __typename: string;
    },
  ];
  round: MMLRound;
  teams: MMLTeam[];
  winnerOf: number[];
  __typename: string;
}

interface MMLTournament {
  currentRound: string;
  rounds: MMLRound[];
  __typename: string;
}

interface MMLData {
  data: {
    mmlContests: MMLContest[];
    mmlTournament: MMLTournament[];
  };
}
