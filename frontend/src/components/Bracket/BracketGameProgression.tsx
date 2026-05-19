import { Box, Typography } from "@mui/material";
import React from "react";
import { MMLTeam } from "../../types/mml";
import { getNCAATeamLogoURL } from "../../utilts";
import { Check, Clear } from "@mui/icons-material";

interface BracketGameProgressionProps {
  direction: "forward" | "up" | "down" | "championship";
  pickState?: "correct" | "incorrect";
  pickedTeam?: MMLTeam;
  winningTeam?: MMLTeam;
  flipped?: boolean;
}

const correctGreen = "rgb(19, 134, 61)";
const incorrectRed = "rgb(204, 60, 60)";
const neutralGray = "rgb(212, 212, 212)";

interface ProgressionTeamLogoProps {
  seoname: string;
  incorrect?: boolean;
}

const ProgressionTeamLogo = (props: ProgressionTeamLogoProps) => {
  const { seoname, incorrect } = props;
  return (
    <Box sx={{ position: "relative", width: "2rem", height: "2rem" }}>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          pointerEvents: "none",
        }}
        component="img"
        src={getNCAATeamLogoURL(seoname)}
      />
      {incorrect === true && (
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            color: incorrectRed,
          }}
        >
          <Clear sx={{ fontSize: "3rem" }} />
        </Box>
      )}
    </Box>
  );
};

const BracketGameProgression = (props: BracketGameProgressionProps) => {
  const { direction, flipped, pickedTeam, winningTeam } = props;

  let correctPick: boolean | undefined = undefined;
  if (pickedTeam && winningTeam) {
    if (pickedTeam.ncaaOrgId === winningTeam.ncaaOrgId) {
      correctPick = true;
    } else {
      correctPick = false;
    }
  }

  const pathStartColor =
    correctPick === true
      ? correctGreen
      : correctPick === false
        ? incorrectRed
        : neutralGray;
  const pathEndColor = correctPick === true ? correctGreen : neutralGray;

  if (direction === "championship") {
    const championTeam = winningTeam || pickedTeam;
    return (
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          top: "50%",
          transform: "translateY(calc(-100% - 2.5rem))",
          boxSizing: "border-box",
        }}
      >
        {championTeam && (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                padding: 0,
                margin: 0,
                lineHeight: "1.75rem",
                fontSize: "2.5rem",
                color: pathEndColor,
                fontWeight: 800,
                fontStyle: "italic",
              }}
            >
              CHAMPION
            </Typography>
            <Box
              sx={{
                width: "100%",
                pointerEvents: "none",
                border: `2px solid ${pathEndColor}`,
                padding: "1rem",
                borderRadius: "0.5rem",
                boxSizing: "border-box",
                backgroundColor: "rgba(0, 0, 0, 0.05)",
              }}
            >
              {championTeam && (
                <Box
                  sx={{
                    width: "100%",
                    pointerEvents: "none",
                  }}
                  component="img"
                  src={getNCAATeamLogoURL(championTeam.seoname)}
                />
              )}
            </Box>
          </Box>
        )}
        <Box
          sx={{
            width: "2px",
            height: "1rem",
            backgroundColor: pathEndColor,
          }}
        />
        {pickedTeam && (
          <ProgressionTeamLogo
            seoname={pickedTeam.seoname}
            incorrect={correctPick === false}
          />
        )}
        <Box
          sx={{
            width: "2px",
            height: "1rem",
            backgroundColor: pathStartColor,
          }}
        />
      </Box>
    );
  }

  if (direction === "forward") {
    return (
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          flexDirection: flipped ? "row-reverse" : "row",
        }}
      >
        <Box
          sx={{
            height: "2px",
            flex: 1,
            backgroundColor: pathStartColor,
            transform: "translateY(25%)",
          }}
        />
        {pickedTeam && (
          <ProgressionTeamLogo
            seoname={pickedTeam.seoname}
            incorrect={correctPick === false}
          />
        )}
        <Box
          sx={{
            height: "2px",
            flex: 1,
            backgroundColor: pathEndColor,
            transform: "translateY(25%)",
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", height: "100%", flex: 1 }}>
      <Box
        sx={{
          position: "absolute",
          height: "2px",
          width: flipped ? "50%" : "calc(50% + 2px)",
          top: "50%",
          transform: "translateY(-25%)",
          left: flipped ? "50%" : 0,
          backgroundColor: pathStartColor,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "2px",
          display: "flex",
          flexDirection: direction === "up" ? "column-reverse" : "column",
          left: "50%",
          top: direction === "up" ? 0 : "50%",
          height: "50%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            flex: 1,
            width: "2px",
            backgroundColor: pathStartColor,
          }}
        />
        {pickedTeam && (
          <ProgressionTeamLogo
            seoname={pickedTeam.seoname}
            incorrect={correctPick === false}
          />
        )}
        <Box
          sx={{
            flex: 1,
            width: "2px",
            backgroundColor: pathEndColor,
          }}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          height: "2px",
          width: flipped ? "calc(50% + 2px)" : "50%",
          transform: "translateY(-25%)",
          top: direction === "up" ? 0 : "100%",
          left: flipped ? 0 : "50%",
          backgroundColor: pathEndColor,
        }}
      />
    </Box>
  );
};

export default BracketGameProgression;
