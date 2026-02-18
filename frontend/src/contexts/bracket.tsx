import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  BracketIdMap,
  BracketProgressionMap,
  BracketProgressionNode,
  TeamMap,
} from "../types/bracket";
import { MMLContest } from "../../../shared/mml";

interface BracketContext {
  games: MMLContest[];
  teams: TeamMap;
  progression: BracketProgressionMap;
  loadMMLBracket: (games: MMLContest[]) => void;
}

const createTeamMap = (games: MMLContest[]) => {
  return games.reduce((acc, game) => {
    for (const team of game.teams) {
      acc[team.ncaaOrgId] = team;
    }
    return acc;
  }, {} as TeamMap);
};

const createBracketIdMap = (games: MMLContest[]): BracketIdMap => {
  return games.reduce((acc, game) => {
    acc[game.bracketId] = game;
    return acc;
  }, {} as BracketIdMap);
};

const createProgressionMap = (games: MMLContest[]): BracketProgressionMap => {
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

const BracketContext = createContext<BracketContext>({
  games: [],
  teams: {},
  progression: {},
  loadMMLBracket: () => {},
});

interface BracketProviderProps {
  children?: React.ReactNode;
}

export const BracketProvider = ({ children }: BracketProviderProps) => {
  const [games, setGames] = useState<MMLContest[]>([]);

  const progression = useMemo(() => createProgressionMap(games), [games]);

  const teams = useMemo(() => createTeamMap(games), [games]);

  const loadMMLBracket = useCallback((games: MMLContest[]) => {
    setGames(games);
  }, []);

  return (
    <BracketContext.Provider
      value={{ games, teams, progression, loadMMLBracket }}
    >
      {children}
    </BracketContext.Provider>
  );
};

export const useBracketContext = () => {
  return useContext(BracketContext);
};
