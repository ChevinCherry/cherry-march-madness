import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import LoginForm from "../components/Login/LoginForm";
import CreateUserForm from "../components/Login/CreateUserForm";

export const LoginPage = () => {
  const [pageState, setPageState] = useState<"login" | "create">("login");

  return (
    <Box
      sx={{
        display: "grid",
        flexDirection: "column",
        justifyItems: "center",
        alignItems: "center",
        gridTemplateRows: "1fr 1fr 1fr",
        width: "100%",
        height: "100%",
        gap: "0.5rem",
      }}
    >
      <Typography variant="h1">
        Welcome to Cherry March Madness 2026!
      </Typography>
      {pageState === "login" && (
        <LoginForm onCreateAccount={() => setPageState("create")} />
      )}
      {pageState === "create" && (
        <CreateUserForm onCancel={() => setPageState("login")} />
      )}
    </Box>
  );
};

export default LoginPage;
