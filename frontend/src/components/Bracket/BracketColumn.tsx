import { Box } from "@mui/material";
import React from "react";
import BracketGame from "./BracketGame";
import BracketGameProgression from "./BracketGameProgression";
import { MMLContest } from "../../types/mml";

interface BracketColumnProps {
  games: MMLContest[];
  flipped?: boolean;
  noProgression?: boolean;
}

const BracketColumn = (props: BracketColumnProps) => {
  const { games, flipped, noProgression } = props;
  return (
    <Box
      sx={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: noProgression
          ? "auto"
          : flipped
            ? "3rem auto"
            : "auto 3rem",
        gridTemplateRows: "auto",
        justifyContent: "center",
        alignItems: "center",
        rowGap: "2rem",
      }}
    >
      {games.map((game, index) => {
        const elemArray = [
          <BracketGame
            key={`game-${game.contestId}`}
            mmlGameData={game}
            flipped={flipped}
          />,
          <BracketGameProgression
            key={`prog-${game.bracketId}`}
            direction={
              games.length <= 1 ? "forward" : index % 2 === 0 ? "down" : "up"
            }
            flipped={flipped}
            color={"rgb(212, 212, 212)"}
          />,
        ];

        if (noProgression) {
          elemArray.pop();
        }
        return flipped ? elemArray.reverse() : elemArray;
      })}
    </Box>
  );
};

export default BracketColumn;
