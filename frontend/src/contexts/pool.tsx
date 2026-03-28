import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { APIPick, APIPickCreate, APIPoolData } from "../api/api-types";
import { API } from "../api/api";
import { useBracketContext } from "./bracket";
import { useAuthContext } from "./auth";

export type LocalPick = Pick<
  APIPick,
  "userId" | "poolId" | "mmlTeamId" | "mmlContestId"
> &
  Partial<APIPick>;

export type PickMap = { [mmlContestId: number]: LocalPick };

export type MyPickMap = { [mmlContestId: number]: number };

export interface LoadedPool {
  raw: APIPoolData;
  participantPicks: { [playerId: string]: PickMap };
}

interface PoolContext {
  pool: LoadedPool | null;
  myPicks: PickMap | null;
  loadPool: (poolId: string) => Promise<void>;
  loadActivePool: () => Promise<void>;
  reloadPool: () => Promise<void>;
  makePick: (contestId: number, teamId: number) => void;
}

const PoolContext = createContext<PoolContext>({
  pool: null,
  myPicks: null,
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
  const [myPicks, setMyPicks] = useState<PickMap | null>(null);

  const participantPicks = useMemo(() => {
    if (!loaded) {
      return null;
    }
    const participantPicks = loaded.picks.reduce(
      (acc, pick) => {
        const playerId = pick.userId;
        const contestId = pick.mmlContestId;
        const playerPickMap = acc[playerId] || {};
        playerPickMap[contestId] = pick;
        acc[playerId] = playerPickMap;
        return acc;
      },
      loaded.participants.reduce(
        (acc, participant) => {
          acc[participant.userId] = {};
          return acc;
        },
        {} as { [userId: string]: PickMap }
      )
    );
    return participantPicks;
  }, [loaded]);

  const { user } = useAuthContext();

  useEffect(() => {
    console.log(participantPicks);
    if (!user || !participantPicks) {
      setMyPicks(null);
      return;
    }
    setMyPicks(participantPicks[user.id] || null);
  }, [user, participantPicks]);

  const loadPool = useCallback(async (poolId: string) => {
    setLoaded(await API.getPool(poolId));
  }, []);

  const loadActivePool = useCallback(async () => {
    setLoaded(await API.getActivePool());
  }, []);

  const reloadPool = useCallback(async () => {
    if (loaded) {
      setLoaded(await API.getPool(loaded.pool.id));
    }
  }, [loaded]);

  const { progression } = useBracketContext();

  const makePick = useCallback(
    async (mmlContestId: number, mmlTeamId: number | null) => {
      if (!loaded || !myPicks || !user) {
        return;
      }
      const oldPickTeamId = myPicks[mmlContestId]?.mmlTeamId;
      if (oldPickTeamId === mmlTeamId) {
        return;
      }
      const deletePicks: string[] = [];
      const newPicks: APIPickCreate[] = [];
      const newPickMap = { ...myPicks };
      if (mmlTeamId === null) {
        const pickId = newPickMap[mmlContestId]?.id;
        if (pickId) {
          deletePicks.push(pickId);
        }
        delete newPickMap[mmlContestId];
      } else {
        newPickMap[mmlContestId] = {
          userId: user.id,
          mmlTeamId,
          mmlContestId,
          poolId: loaded.pool.id,
        };
        newPicks.push({ mmlTeamId, mmlContestId });
      }
      let nextGame = progression[mmlContestId] && progression[mmlContestId].to;
      while (nextGame !== undefined) {
        const nextPick = newPickMap[nextGame.gameData.contestId];
        if (nextPick && nextPick.mmlTeamId === oldPickTeamId) {
          delete newPickMap[nextGame.gameData.contestId];
        }
        nextGame = nextGame.to;
      }
      setMyPicks(newPickMap);
      await API.updatePicks(user.id, loaded.pool.id, newPicks, deletePicks);
      await reloadPool();
    },
    [myPicks, progression, user]
  );

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
        myPicks,
        reloadPool,
        loadActivePool,
        loadPool,
        makePick,
      }}
    >
      {children}
    </PoolContext.Provider>
  );
};

// 3. Create a custom hook for easy consumption
export const usePoolContext = () => {
  return useContext(PoolContext);
};
