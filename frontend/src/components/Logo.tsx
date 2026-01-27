import { Box, SxProps } from "@mui/material";
import React from "react";

interface LogoProps {
  sx?: SxProps;
}

const Logo = (props: LogoProps) => {
  const { sx } = props;
  return <Box component="img" src="mmlogo.png" sx={sx} />;
};

export default Logo;
