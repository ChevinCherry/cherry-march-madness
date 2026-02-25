import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Box } from "@mui/material";
import StandingsPage from "./pages/StandingsPage";
import { View } from "./types/types";
import MyPicksPage from "./pages/MyPicksPage";
import AppDataProviders from "./AppDataProviders";
import InitAppDataLoader from "./AppDataInitLoader";
import { useAuthContext } from "./contexts/auth";
import LoginPage from "./pages/LoginPage";

const App = () => {
  const [selectedView, setSelectedView] = useState<View>("standings");

  const { user, checkAuth } = useAuthContext();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
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
      {user === null ? (
        <LoginPage />
      ) : (
        <AppDataProviders>
          <InitAppDataLoader>
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
          </InitAppDataLoader>
        </AppDataProviders>
      )}
    </Box>
  );
};

export default App;
