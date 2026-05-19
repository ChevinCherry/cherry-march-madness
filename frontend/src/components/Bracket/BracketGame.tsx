import React from "react";
import { Box } from "@mui/material";
import BracketGameTeam from "./BracketGameTeam";
import { MMLContest, MMLTeam } from "../../types/mml";
import { useBracketContext } from "../../contexts/bracket";
import { usePoolContext } from "../../contexts/pool";
import { useThemeContext } from "../../contexts/theme";

export interface BracketGameProps {
  mmlGameData: MMLContest;
  flipped?: boolean;
  pickState?: "correct" | "incorrect" | "neutral";
}

const BracketGame = (props: BracketGameProps) => {
  const { mmlGameData, flipped, pickState = "neutral" } = props;
  const { theme } = useThemeContext();
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
  const borderColor =
    pickState === "correct"
      ? theme.palette.correct.default
      : pickState === "incorrect"
        ? theme.palette.incorrect.default
        : theme.palette.neutral.default;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);",
        height: "5rem",
        width: "15rem",
        border: `1px solid ${borderColor}`,
        borderRadius: "0.5rem",
        backgroundColor:
          pickState === "correct"
            ? theme.palette.correct.light
            : pickState === "incorrect"
              ? theme.palette.incorrect.light
              : theme.palette.neutral.light,
      }}
    >
      <BracketGameTeam
        mmlContestId={mmlGameData.contestId}
        position="top"
        actualTeam={actualTopTeam}
        pickedTeam={topPickedTeam}
        flipped={flipped}
      />
      <Box sx={{ height: "1px", backgroundColor: "rgba(0, 0, 0, 0.1)" }} />
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
