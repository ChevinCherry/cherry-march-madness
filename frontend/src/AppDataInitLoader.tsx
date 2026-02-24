import { useEffect } from "react";
import { useBracketContext } from "./contexts/bracket";
import { usePoolContext } from "./contexts/pool";
import { getMMLTestData } from "./utilts";

export interface InitAppDataLoaderProps {
  children?: React.ReactNode;
}

const InitAppDataLoader = ({ children }: InitAppDataLoaderProps) => {
  const { pool, loadActivePool } = usePoolContext();
  const { setBracketSourceId } = useBracketContext();
  useEffect(() => {
    loadActivePool();
  }, []);

  useEffect(() => {
    if (pool) {
      setBracketSourceId(pool.raw.pool.bracketSourceId);
    }
  }, [pool]);
  return children;
};

export default InitAppDataLoader;
