import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useAuthContext } from "../../contexts/auth";

interface LoginFormProps {
  onCreateAccount: () => void;
}

const LoginForm = (props: LoginFormProps) => {
  const { onCreateAccount } = props;
  const { login } = useAuthContext();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        maxWidth: "20rem",
      }}
    >
      <TextField
        title="Username"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        title="Password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <Button variant="contained" onClick={() => login(username, password)}>
        Login
      </Button>
      <Box sx={{ height: "1px", backgroundColor: "rgb(212, 212, 212)" }} />
      <Typography variant="caption" color="textSecondary">
        First time here? Create an account to join the pool!
      </Typography>
      <Button variant="outlined" onClick={onCreateAccount}>
        Create Account
      </Button>
    </Box>
  );
};

export default LoginForm;
