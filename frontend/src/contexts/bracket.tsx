import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BracketIdMap,
  BracketProgressionMap,
  BracketProgressionNode,
  TeamMap,
} from "../types/bracket";
import { MMLContest, MMLData } from "../types/mml";
import { API } from "../api/api";

interface BracketContext {
  bracketSourceId: string | null;
  setBracketSourceId: (id: string) => void;
  raw: MMLData | null;
  lastFetchEpoch: number | null;
  teams: TeamMap;
  progression: BracketProgressionMap;
  getLatestBracket: () => Promise<void>;
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
  bracketSourceId: null,
  setBracketSourceId: () => {},
  raw: null,
  lastFetchEpoch: null,
  teams: {},
  progression: {},
  getLatestBracket: async () => {},
});

interface BracketProviderProps {
  children?: React.ReactNode;
}

export const BracketProvider = ({ children }: BracketProviderProps) => {
  const [bracketSourceId, setBracketSourceId] = useState<string | null>(null);
  const [raw, setRaw] = useState<MMLData | null>(null);
  const [lastFetchEpoch, setLastFetchEpoch] = useState<number | null>(null);

  const games = raw?.data.mmlContests;

  const progression = useMemo(
    () => (games ? createProgressionMap(games) : {}),
    [games]
  );

  const teams = useMemo(() => (games ? createTeamMap(games) : {}), [games]);

  const getLatestBracket = useCallback(async () => {
    if (!bracketSourceId) {
      return;
    }
    const update = await API.getBracketUpdate(bracketSourceId);
    setRaw(update.lastFetch);
    setLastFetchEpoch(update.lastFetchEpoch);
  }, [bracketSourceId]);

  useEffect(() => {
    getLatestBracket();
  }, [bracketSourceId]);

  return (
    <BracketContext.Provider
      value={{
        bracketSourceId,
        setBracketSourceId,
        raw,
        lastFetchEpoch,
        teams,
        progression,
        getLatestBracket,
      }}
    >
      {children}
    </BracketContext.Provider>
  );
};

export const useBracketContext = () => {
  return useContext(BracketContext);
};
