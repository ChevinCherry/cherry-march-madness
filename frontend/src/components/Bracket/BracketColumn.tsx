import { Box } from "@mui/material";
import React from "react";
import BracketGame from "./BracketGame";
import BracketGameProgression from "./BracketGameProgression";

interface BracketColumnProps {
  games: MMLContest[];
}

const BracketColumn = (props: BracketColumnProps) => {
  const { games } = props;
  return (
    <Box
      sx={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "auto 2rem",
        gridTemplateRows: "auto",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {games.map((game) => [
        <BracketGame mmlGameData={game} />,
        <BracketGameProgression />,
      ])}
    </Box>
  );
};

export default BracketColumn;
