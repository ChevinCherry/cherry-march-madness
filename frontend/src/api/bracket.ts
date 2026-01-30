export type ContestIdMap = {
  [mmlContestId: number]: MMLContest;
};

export type BracketIdMap = {
  [mmlBracketId: number]: MMLContest;
};

export type PickMap = {
  [mmlContestId: number]: number;
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

export const createTeamMap = (games: MMLContest[]) => {
  return games.reduce((acc, game) => {
    for (const team of game.teams) {
      acc[team.ncaaOrgId] = team;
    }
    return acc;
  }, {} as TeamMap);
};

export const createBracketIdMap = (games: MMLContest[]): BracketIdMap => {
  return games.reduce((acc, game) => {
    acc[game.bracketId] = game;
    return acc;
  }, {} as BracketIdMap);
};

export const createProgressionMap = (
  games: MMLContest[]
): BracketProgressionMap => {
  const bracketIdMap = createBracketIdMap(games);
  return games.reduce((acc, game) => {
    const entry = acc[game.contestId] || { gameData: game };
    if (!entry.to && game.victorBracketPositionId && game.victorGamePosition) {
      const toGame = bracketIdMap[game.victorBracketPositionId];
      if (toGame) {
        const toEntry: BracketProgressionNode = acc[toGame.contestId] || {
          gameData: toGame,
        };
        if (game.victorGamePosition === "Top") {
          toEntry.topFrom = entry;
        } else if (game.victorGamePosition === "Bottom") {
          toEntry.bottomFrom = entry;
        }
        acc[toGame.contestId] = toEntry;
      }
    }
    acc[game.contestId] = entry;
    return acc;
  }, {} as BracketProgressionMap);
};

export const getPickedTeam = (
  mmlContestId: number,
  pickMap: PickMap,
  teamMap: TeamMap,
  bracketProgressionMap: BracketProgressionMap,
  position: "bottom" | "top"
): MMLTeam | null => {
  const curGameProgression = bracketProgressionMap[mmlContestId];
  if (!curGameProgression) {
    return null;
  }
  const fromGame =
    position === "bottom"
      ? curGameProgression.bottomFrom
      : position === "top"
        ? curGameProgression.topFrom
        : undefined;
  if (!fromGame) {
    return null;
  }
  const fromGamePickTeamId = pickMap[fromGame.gameData.contestId];
  if (!fromGamePickTeamId) {
    return null;
  }
  return teamMap[fromGamePickTeamId] || null;
};

export const makePick = (
  pickMap: PickMap,
  bracketProgressionMap: BracketProgressionMap,
  contestId: number,
  pickedTeamId: number | null
) => {
  if (pickMap[contestId] === pickedTeamId) {
    return pickMap;
  }
  const newPickMap = { ...pickMap };
  if (pickedTeamId === null) {
    delete newPickMap[contestId];
  } else {
    newPickMap[contestId];
  }
  const curGameProgression = bracketProgressionMap[contestId];
  let nextGame = curGameProgression.to;
  while (nextGame !== undefined) {
    delete newPickMap[nextGame.gameData.contestId];
    nextGame = nextGame.to;
  }
  return pickMap;
};
