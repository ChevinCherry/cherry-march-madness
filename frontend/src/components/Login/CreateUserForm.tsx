import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useAuthContext } from "../../contexts/auth";

interface CreateUserFormProps {
  onCancel: () => void;
}

const CreateUserForm = (props: CreateUserFormProps) => {
  const { onCancel } = props;
  const { createUser } = useAuthContext();
  const [username, setUsername] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
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
        label="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <TextField
        title="Password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <TextField
        title="Password"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
      />
      <Button
        variant="contained"
        onClick={() => {
          createUser(username, password, displayName);
        }}
      >
        Create User
      </Button>
      <Button variant="outlined" onClick={onCancel}>
        Cancel
      </Button>
    </Box>
  );
};

export default CreateUserForm;
