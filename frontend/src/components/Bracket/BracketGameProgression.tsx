import { Box } from "@mui/material";
import React from "react";

interface BracketGameProgressionProps {
  color: string;
  direction: "forward" | "up" | "down";
  flipped?: boolean;
}

const BracketGameProgression = (props: BracketGameProgressionProps) => {
  const { direction, flipped, color } = props;

  const nestedElems =
    direction === "forward"
      ? [
          <Box
            sx={{
              position: "absolute",
              height: "2px",
              width: "100%",
              left: 0,
              top: "50%",
              transform: "translateY(-25%)",
              backgroundColor: color,
            }}
          />,
        ]
      : [
          <Box
            sx={{
              position: "absolute",
              height: "2px",
              width: flipped ? "50%" : "calc(50% + 2px)",
              top: "50%",
              transform: "translateY(-25%)",
              left: flipped ? "50%" : 0,
              backgroundColor: color,
            }}
          />,
          <Box
            sx={{
              position: "absolute",
              height: "50%",
              left: "50%",
              top: direction === "up" ? 0 : "50%",
              width: "2px",
              backgroundColor: color,
            }}
          />,
          <Box
            sx={{
              position: "absolute",
              height: "2px",
              width: flipped ? "calc(50% + 2px)" : "50%",
              transform: "translateY(-25%)",
              top: direction === "up" ? 0 : "100%",
              left: flipped ? 0 : "50%",
              backgroundColor: color,
            }}
          />,
        ];
  return (
    <Box
      sx={{
        position: "relative",
        flex: 1,
        height: "100%",
      }}
    >
      {nestedElems}
    </Box>
  );
};

export default BracketGameProgression;
