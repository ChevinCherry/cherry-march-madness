import React from "react";
import { BracketProvider } from "./contexts/bracket";
import { PoolProvider } from "./contexts/pool";
import { AuthProvider } from "./contexts/auth";

export interface AppDataProvidersProps {
  children?: React.ReactNode;
}

const AppDataProviders = ({ children }: AppDataProvidersProps) => {
  return (
    <AuthProvider>
      <BracketProvider>
        <PoolProvider>{children}</PoolProvider>
      </BracketProvider>
    </AuthProvider>
  );
};

export default AppDataProviders;
