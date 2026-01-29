import React from "react";
import { Box } from "@mui/material";
import BracketGame from "./BracketGame";
import { getMMLTestData, segmentArray } from "../../utilts";
import BracketGameProgression from "./BracketGameProgression";
import BracketColumn from "./BracketColumn";
import CanvasController from "../CanvasController";

const Bracket = () => {
  const mmlData = getMMLTestData();

  const mmlGames = mmlData.data.mmlContests.sort(
    (game1, game2) => game1.bracketId - game2.bracketId
  );

  const [
    first4,
    round64Left,
    round64Right,
    round32Left,
    round32Right,
    sweet16Left,
    sweet16Right,
    elite8Left,
    elite8Right,
    final4Left,
    final4Right,
    championship,
  ] = segmentArray<MMLContest>(mmlGames, 4, 16, 16, 8, 8, 4, 4, 2, 2, 1, 1, 1);

  return (
    <Box
      sx={{
        position: "relative",

        height: "100%",
        width: "100%",
      }}
    >
      <CanvasController>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(11, 1fr)" }}>
          <BracketColumn games={round64Left} />
          <BracketColumn games={round32Left} />
          <BracketColumn games={sweet16Left} />
          <BracketColumn games={elite8Left} />
          <BracketColumn games={final4Left} />
          <BracketColumn games={championship} />
          <BracketColumn games={final4Right} />
          <BracketColumn games={elite8Right} />
          <BracketColumn games={sweet16Right} />
          <BracketColumn games={round32Right} />
          <BracketColumn games={round64Right} />
        </Box>
      </CanvasController>
    </Box>
  );
};

export default Bracket;
