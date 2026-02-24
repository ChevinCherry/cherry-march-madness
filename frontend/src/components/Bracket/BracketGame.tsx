import React from "react";
import { Box } from "@mui/material";
import BracketGameTeam from "./BracketGameTeam";
import { MMLContest, MMLTeam } from "../../types/mml";
import { useBracketContext } from "../../contexts/bracket";

export interface BracketGameProps {
  mmlGameData: MMLContest;
  topPickedTeamId?: number;
  bottomPickedTeamId?: number;
  flipped?: boolean;
}

const BracketGame = (props: BracketGameProps) => {
  const { mmlGameData, topPickedTeamId, bottomPickedTeamId, flipped } = props;
  const actualTopTeam = mmlGameData.teams.find((team) => team.isTop);
  const actualBottomTeam = mmlGameData.teams.find((team) => !team.isTop);

  const { teams } = useBracketContext();
  const topPickedTeam = topPickedTeamId && teams[topPickedTeamId];
  const bottomPickedTeam = bottomPickedTeamId && teams[bottomPickedTeamId];
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
        actualTeam={actualTopTeam}
        pickedTeam={topPickedTeam}
        flipped={flipped}
      />
      <BracketGameTeam
        position="bottom"
        actualTeam={actualBottomTeam}
        pickedTeam={bottomPickedTeam}
        flipped={flipped}
      />
    </Box>
  );
};

export default BracketGame;
