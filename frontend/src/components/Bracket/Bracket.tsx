import React from "react";
import { Box } from "@mui/material";
import { segmentArray } from "../../utilts";
import BracketColumn from "./BracketColumn";
import CanvasController from "../CanvasController";
import { useBracketContext } from "../../contexts/bracket";

const Bracket = () => {
  const { raw } = useBracketContext();
  if (!raw) {
    return <Box></Box>;
  }

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
  ] = segmentArray(raw.data.mmlContests, 4, 16, 16, 8, 8, 4, 4, 2, 2, 1, 1, 1);

  return (
    <Box
      sx={{
        position: "relative",

        height: "100%",
        width: "100%",
      }}
    >
      <CanvasController>
        <Box sx={{ display: "flex" }}>
          <BracketColumn games={round64Left} />
          <BracketColumn games={round32Left} />
          <BracketColumn games={sweet16Left} />
          <BracketColumn games={elite8Left} />
          <BracketColumn games={final4Left} />
          <BracketColumn games={championship} noProgression={true} />
          <BracketColumn games={final4Right} flipped={true} />
          <BracketColumn games={elite8Right} flipped={true} />
          <BracketColumn games={sweet16Right} flipped={true} />
          <BracketColumn games={round32Right} flipped={true} />
          <BracketColumn games={round64Right} flipped={true} />
        </Box>
      </CanvasController>
    </Box>
  );
};

export default Bracket;
