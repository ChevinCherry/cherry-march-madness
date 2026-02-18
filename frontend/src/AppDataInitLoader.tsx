import { useEffect } from "react";
import { useBracketContext } from "./contexts/bracket";
import { usePickContext } from "./contexts/pool";
import { getMMLTestData } from "./utilts";

export interface InitAppDataLoaderProps {
  children?: React.ReactNode;
}

const InitAppDataLoader = ({ children }: InitAppDataLoaderProps) => {
  const { loadMMLBracket } = useBracketContext();
  const { loadPool: loadPicks } = usePickContext();
  useEffect(() => {
    loadMMLBracket(getMMLTestData().data.mmlContests);
    loadPicks("");
  }, []);
  return children;
};

export default InitAppDataLoader;
