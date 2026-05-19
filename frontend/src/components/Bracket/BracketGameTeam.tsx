import React from "react";
import { Box, Typography } from "@mui/material";
import { getNCAATeamLogoURL } from "../../utilts";
import { MMLTeam } from "../../types/mml";
import { usePoolContext } from "../../contexts/pool";

export interface BracketGameTeamProps {
  mmlContestId: number;
  position: "top" | "bottom";
  pickedTeam?: MMLTeam;
  actualTeam?: MMLTeam;
  flipped?: boolean;
}

const BracketGameTeam = (props: BracketGameTeamProps) => {
  const { mmlContestId, position, pickedTeam, actualTeam, flipped } = props;
  const { makePick } = usePoolContext();
  const displayTeam = actualTeam || pickedTeam;
  return (
    <Box
      sx={{
        padding: "0.25rem 0.5rem 0.25rem 0.5rem",
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: flipped ? "row-reverse" : "row",
        gap: "1rem",
        alignItems: "center",
        justifyContent: "center",
        borderRadius:
          position === "top" ? "0.5rem 0.5rem 0 0" : "0 0 0.5rem 0.5rem",
        overflow: "hidden",
        ":hover": {
          backgroundColor: "rgba(0, 0, 0, 0.05)",
        },
        ":active": {
          boxShadow:
            "inset 4px 4px 8px rgba(0, 0, 0, 0.2), inset -4px -4px 8px rgba(255, 255, 255, 0.5)",
        },
      }}
      onClick={() => {
        if (displayTeam) {
          makePick(mmlContestId, displayTeam.ncaaOrgId);
        }
      }}
    >
      {displayTeam && (
        <>
          <Typography
            sx={{ width: "1rem", textAlign: flipped ? "end" : "start" }}
            variant="subtitle2"
          >
            {displayTeam.seed}
          </Typography>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: flipped ? "row-reverse" : "row",
              justifyContent: "flex-end",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <Box
              sx={{ height: "2rem" }}
              component="img"
              src={getNCAATeamLogoURL(displayTeam.seoname)}
            />
            <Typography
              sx={{
                flex: 1,
                textWrap: "nowrap",
                textOverflow: "clip",
                width: "2rem",
                textAlign: flipped ? "end" : "start",
              }}
            >
              {displayTeam.nameShort}
            </Typography>
          </Box>
          <Typography sx={{ textAlign: flipped ? "start" : "end" }}>
            {displayTeam.score}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default BracketGameTeam;
