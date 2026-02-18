import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { Box } from "@mui/material";
import StandingsPage from "./pages/StandingsPage";
import { View } from "./types/types";
import MyPicksPage from "./pages/MyPicksPage";
import { BracketProvider } from "./contexts/bracket";
import { PoolProvider } from "./contexts/pool";
import AppDataProviders from "./AppDataProviders";
import InitAppDataLoader from "./AppDataInitLoader";

const App = () => {
  const [selectedView, setSelectedView] = useState<View>("standings");

  return (
    <AppDataProviders>
      <InitAppDataLoader>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <Navbar
            selectedView={selectedView}
            setSelectedView={setSelectedView}
          />
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: "auto",
              boxSizing: "border-box",
            }}
          >
            {selectedView === "standings" && <StandingsPage />}
            {selectedView === "my-picks" && <MyPicksPage />}
          </Box>
        </Box>
      </InitAppDataLoader>
    </AppDataProviders>
  );
};

export default App;
