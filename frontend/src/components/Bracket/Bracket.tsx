import React from "react";
import { Box } from "@mui/material";
import BracketGame from "./BracketGame";
import { getMMLTestData } from "../../utilts";

const Bracket = () => {
  const mmlData = getMMLTestData();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {mmlData.data.mmlContests.map((game, index) => (
        <BracketGame
          topTeam={{ actual: game.teams[0] }}
          bottomTeam={{ actual: game.teams[1] }}
          startTime={new Date(game.startTimeEpoch)}
          flipped={index % 2 !== 0}
        />
      ))}
    </Box>
  );
};

export default Bracket;
