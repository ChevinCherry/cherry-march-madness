import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { APIPick, APIPoolData } from "../api/api-types";
import { getPool, getActivePool } from "../api/api";
import { useBracketContext } from "./bracket";

export type PickMap = { [contestId: number]: APIPick };

export interface LoadedPool {
  raw: APIPoolData;
  participantPicks: { [playerId: string]: PickMap };
}

interface PoolContext {
  pool: LoadedPool | null;
  loadPool: (poolId: string) => Promise<void>;
  loadActivePool: () => Promise<void>;
  reloadPool: () => Promise<void>;
  makePick: (contestId: number, teamId: number) => void;
}

const PoolContext = createContext<PoolContext>({
  pool: null,
  loadPool: async () => {},
  loadActivePool: async () => {},
  reloadPool: async () => {},
  makePick: () => {},
});

interface PoolProviderProps {
  children?: React.ReactNode;
}

export const PoolProvider = ({ children }: PoolProviderProps) => {
  const [loaded, setLoaded] = useState<APIPoolData | null>(null);

  const participantPicks = useMemo(() => {
    if (!loaded) {
      return null;
    }
    const participantPicks = loaded.picks.reduce(
      (acc, pick) => {
        const playerId = pick.playerId;
        const contestId = pick.contestId;
        const playerPickMap = acc[playerId] || {};
        playerPickMap[contestId] = pick;
        acc[playerId] = playerPickMap;
        return acc;
      },
      {} as { [userId: string]: PickMap }
    );

    return participantPicks;
  }, [loaded]);

  const loadPool = useCallback(async (poolId: string) => {
    setLoaded(await getPool(poolId));
  }, []);

  const loadActivePool = useCallback(async () => {
    setLoaded(await getActivePool());
  }, []);

  const reloadPool = useCallback(async () => {
    if (loaded) {
      setLoaded(await getPool(loaded.pool.id));
    }
  }, [loaded]);

  const { progression } = useBracketContext();

  // const makePick = useCallback(
  //   (contestId: number, teamId: number | null) => {
  //     if (myPicks[contestId]?.teamId === teamId) {
  //       return;
  //     }
  //     const newPickMap = { ...myPicks };
  //     if (teamId === null) {
  //       delete newPickMap[contestId];
  //     } else {
  //       newPickMap[contestId];
  //     }
  //     let nextGame = progression[contestId] && progression[contestId].to;
  //     while (nextGame !== undefined) {
  //       delete newPickMap[nextGame.gameData.contestId];
  //       nextGame = nextGame.to;
  //     }
  //     setMyPicks(newPickMap);
  //   },
  //   [myPicks, progression]
  // );

  return (
    <PoolContext.Provider
      value={{
        pool:
          loaded && participantPicks
            ? {
                raw: loaded,
                participantPicks,
              }
            : null,
        reloadPool,
        loadActivePool,
        loadPool,
        makePick: () => {},
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
