import React from "react";
import { Box } from "@mui/material";
import BracketGameTeam from "./BracketGameTeam";

interface BracketGameTeamPlaceholder {
  actual?: MMLTeam;
  picked?: MMLTeam;
}

interface BracketGameProps {
  topTeam: BracketGameTeamPlaceholder;
  bottomTeam: BracketGameTeamPlaceholder;
  startTime: Date;
  flipped?: boolean;
}

const BracketGame = (props: BracketGameProps) => {
  const { topTeam, bottomTeam, flipped } = props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(212, 212, 212)",
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);",
        height: "5rem",
        width: "15rem",
        borderRadius: "0.5rem",
      }}
    >
      <BracketGameTeam
        position="top"
        pickedTeam={topTeam.picked}
        actualTeam={topTeam.actual}
        flipped={flipped}
      />
      <BracketGameTeam
        position="bottom"
        pickedTeam={bottomTeam.picked}
        actualTeam={bottomTeam.actual}
        flipped={flipped}
      />
    </Box>
  );
};

export default BracketGame;
