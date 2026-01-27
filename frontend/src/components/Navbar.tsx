import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React from "react";
import { View } from "../types/types";
import Logo from "./Logo";
import ProfileIcon from "./ProfileIcon";

interface SelectorProps {
  selectedView: View;
  setSelectedView: (view: View) => void;
}

const Navbar = (props: SelectorProps) => {
  const { selectedView, setSelectedView } = props;

  return (
    <Box
      sx={{
        position: "relative",
        display: "grid",
        height: "8rem",
        width: "100%",
        gridTemplateColumns: "1fr auto 1fr",
        padding: "1rem",
        boxSizing: "border-box",
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);",
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Logo
          sx={{ objectFit: "contain", maxHeight: "100%", maxWidth: "100%" }}
        />
      </Box>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <ToggleButtonGroup size="large">
          <ToggleButton
            value="standings"
            selected={selectedView === "standings"}
            onClick={() => setSelectedView("standings")}
          >
            <Typography>Standings</Typography>
          </ToggleButton>
          <ToggleButton
            value="matchups"
            selected={selectedView === "matchups"}
            onClick={() => setSelectedView("matchups")}
          >
            <Typography>Matchups</Typography>
          </ToggleButton>
          <ToggleButton
            value="my-picks"
            selected={selectedView === "my-picks"}
            onClick={() => setSelectedView("my-picks")}
          >
            <Typography>My Picks</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <ProfileIcon />
      </Box>
    </Box>
  );
};

export default Navbar;
