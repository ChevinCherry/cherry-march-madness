export type ContestIdMap = {
  [mmlContestId: number]: MMLContest;
};

export type BracketIdMap = {
  [mmlBracketId: number]: MMLContest;
};

export type TeamMap = {
  [mmlTeamId: number]: MMLTeam;
};

export type BracketProgressionNode = {
  gameData: MMLContest;
  bottomFrom?: BracketProgressionNode;
  topFrom?: BracketProgressionNode;
  to?: BracketProgressionNode;
};

export type BracketProgressionMap = {
  [mmlContestId: number]: BracketProgressionNode;
};
