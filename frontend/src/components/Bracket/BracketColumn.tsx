import { Box } from "@mui/material";
import React from "react";
import BracketGame from "./BracketGame";
import BracketGameProgression from "./BracketGameProgression";
import { MMLContest, MMLTeam } from "../../types/mml";
import { usePoolContext } from "../../contexts/pool";
import { useBracketContext } from "../../contexts/bracket";

interface BracketColumnProps {
  games: MMLContest[];
  flipped?: boolean;
  championship?: boolean;
}

const BracketColumn = (props: BracketColumnProps) => {
  const { games, flipped, championship } = props;
  const { teams } = useBracketContext();
  const { myPicks } = usePoolContext();

  return (
    <Box
      sx={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: championship
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
        let myPickedTeam: MMLTeam | undefined = undefined;
        if (myPicks) {
          const teamId = myPicks[game.contestId]?.mmlTeamId;
          if (teamId) {
            myPickedTeam = teams[teamId];
          }
        }
        const winningTeam = game.teams.reduce(
          (winner, team) => {
            if (!team.score) {
              return winner;
            } else if (!winner || !winner.score) {
              return team;
            } else if (winner.score === team.score) {
              return undefined;
            } else if (team.score > winner.score) {
              return team;
            }
            return winner;
          },
          undefined as MMLTeam | undefined
        );
        const elemArray = [
          <BracketGame
            key={`game-${game.contestId}`}
            mmlGameData={game}
            flipped={flipped}
            pickState={
              !winningTeam
                ? "neutral"
                : winningTeam.ncaaOrgId !== myPickedTeam?.ncaaOrgId
                  ? "incorrect"
                  : "correct"
            }
          />,
          <BracketGameProgression
            key={`prog-${game.bracketId}`}
            pickedTeam={myPickedTeam}
            winningTeam={winningTeam}
            direction={
              championship
                ? "championship"
                : games.length <= 1
                  ? "forward"
                  : index % 2 === 0
                    ? "down"
                    : "up"
            }
            flipped={flipped}
          />,
        ];
        return flipped ? elemArray.reverse() : elemArray;
      })}
    </Box>
  );
};

export default BracketColumn;
