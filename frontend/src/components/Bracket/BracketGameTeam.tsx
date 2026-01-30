import React from "react";
import { Box, Typography } from "@mui/material";
import { getNCAATeamLogoURL } from "../../utilts";

export interface BracketGameTeamProps {
  position: "top" | "bottom";
  pickedTeam?: MMLTeam;
  actualTeam?: MMLTeam;
  flipped?: boolean;
  onClick?: () => void;
}

const BracketGameTeam = (props: BracketGameTeamProps) => {
  const { position, pickedTeam, actualTeam, flipped, onClick } = props;
  const displayTeam = pickedTeam || actualTeam;
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
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius:
          position === "top" ? "0.5rem 0.5rem 0 0" : "0 0 0.5rem 0.5rem",
        borderBottom:
          position === "top" ? "1px solid rgb(212, 212, 212)" : undefined,
        overflow: "hidden",
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
