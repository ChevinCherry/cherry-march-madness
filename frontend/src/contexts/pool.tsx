import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useBracketContext } from "./bracket";
import { Pick, User } from "../../../shared/api-types";

interface APIPoolData {
  id: string;
  players: User[];
  picks: Pick[];
}

export type PickMap = { [contestId: number]: Pick };

export interface PoolData {
  id: string;
  playerPicks: { [playerId: string]: PickMap };
}

interface PoolContext {
  loaded: PoolData | null;
  myPicks: PickMap;
  loadPool: (poolId: string) => void;
  makePick: (contestId: number, teamId: number) => void;
  revertMyPicks: () => void;
  saveMyPicks: () => void;
}

const PoolContext = createContext<PoolContext>({
  loaded: null,
  myPicks: {},
  loadPool: () => {},
  makePick: () => {},
  revertMyPicks: () => {},
  saveMyPicks: () => {},
});

interface PoolProviderProps {
  children?: React.ReactNode;
}

export const PoolProvider = ({ children }: PoolProviderProps) => {
  const [loadedAPIData, setLoadedAPIData] = useState<APIPoolData | null>(null);
  const [myPicks, setMyPicks] = useState<PickMap>({});

  useEffect(() => {
    setMyPicks({});
  }, [loadedAPIData]);

  const loaded = useMemo(() => {
    if (!loadedAPIData) {
      return null;
    }
    const playerPicks = loadedAPIData.picks.reduce(
      (acc, pick) => {
        const playerId = pick.playerId;
        const contestId = pick.contestId;
        const playerPickMap = acc[playerId] || {};
        playerPickMap[contestId] = pick;
        acc[playerId] = playerPickMap;
        return acc;
      },
      {} as { [playerPick: string]: PickMap }
    );

    return { id: loadedAPIData.id, playerPicks };
  }, [loadedAPIData]);

  const loadPool = useCallback((poolId: string) => {
    setLoadedAPIData({ id: poolId, picks: [], players: [] });
  }, []);

  const { progression } = useBracketContext();

  const makePick = useCallback(
    (contestId: number, teamId: number | null) => {
      if (myPicks[contestId]?.teamId === teamId) {
        return;
      }
      const newPickMap = { ...myPicks };
      if (teamId === null) {
        delete newPickMap[contestId];
      } else {
        newPickMap[contestId];
      }
      let nextGame = progression[contestId] && progression[contestId].to;
      while (nextGame !== undefined) {
        delete newPickMap[nextGame.gameData.contestId];
        nextGame = nextGame.to;
      }
      setMyPicks(newPickMap);
    },
    [myPicks, progression]
  );

  const revertPicks = useCallback(() => {
    setMyPicks({});
  }, [loaded]);

  const savePicks = useCallback(() => {
    console.log("SAVING", myPicks);
  }, [myPicks]);

  return (
    <PoolContext.Provider
      value={{
        loaded,
        myPicks,
        loadPool,
        makePick,
        revertMyPicks: revertPicks,
        saveMyPicks: savePicks,
      }}
    >
      {children}
    </PoolContext.Provider>
  );
};

// 3. Create a custom hook for easy consumption
export const usePickContext = () => {
  return useContext(PoolContext);
};
