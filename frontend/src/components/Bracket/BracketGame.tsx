import React from "react";
import { Box } from "@mui/material";
import BracketGameTeam from "./BracketGameTeam";
import { MMLContest, MMLTeam } from "../../types/mml";
import { useBracketContext } from "../../contexts/bracket";
import { usePoolContext } from "../../contexts/pool";

export interface BracketGameProps {
  mmlGameData: MMLContest;
  flipped?: boolean;
}

const BracketGame = (props: BracketGameProps) => {
  const { mmlGameData, flipped } = props;
  const actualTopTeam = mmlGameData.teams.find((team) => team.isTop);
  const actualBottomTeam = mmlGameData.teams.find((team) => !team.isTop);

  const { teams, progression } = useBracketContext();
  const { myPicks } = usePoolContext();
  let topPickedTeam: MMLTeam | undefined = undefined;
  let bottomPickedTeam: MMLTeam | undefined = undefined;
  if (progression && myPicks) {
    const gameProgression = progression[mmlGameData.contestId];
    const topPick =
      gameProgression &&
      gameProgression.topFrom &&
      myPicks[gameProgression.topFrom.gameData.contestId];
    const bottomPick =
      gameProgression &&
      gameProgression.bottomFrom &&
      myPicks[gameProgression.bottomFrom.gameData.contestId];
    if (topPick) {
      topPickedTeam = teams[topPick.mmlTeamId];
    }
    if (bottomPick) {
      bottomPickedTeam = teams[bottomPick.mmlTeamId];
    }
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);",
        height: "5rem",
        width: "15rem",
        border: "1px solid rgba(212, 212, 212)",
        borderRadius: "0.5rem",
      }}
    >
      <BracketGameTeam
        mmlContestId={mmlGameData.contestId}
        position="top"
        actualTeam={actualTopTeam}
        pickedTeam={topPickedTeam}
        flipped={flipped}
      />
      <BracketGameTeam
        mmlContestId={mmlGameData.contestId}
        position="bottom"
        actualTeam={actualBottomTeam}
        pickedTeam={bottomPickedTeam}
        flipped={flipped}
      />
    </Box>
  );
};

export default BracketGame;
