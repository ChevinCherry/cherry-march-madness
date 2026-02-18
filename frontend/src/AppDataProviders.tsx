import React from "react";
import { BracketProvider } from "./contexts/bracket";
import { PoolProvider } from "./contexts/pool";

export interface AppDataProvidersProps {
  children?: React.ReactNode;
}

const AppDataProviders = ({ children }: AppDataProvidersProps) => {
  return (
    <BracketProvider>
      <PoolProvider>{children}</PoolProvider>
    </BracketProvider>
  );
};

export default AppDataProviders;
