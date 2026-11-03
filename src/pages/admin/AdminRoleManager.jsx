
import React from "react";
import { Box, Button, Stack } from "@mui/material";

import CreateUser from "../../components/users/CreateUser";
import ViewAllUsers from "../../components/users/ViewAllUsers";

const AdminRoleManager = () => {
  const [isCreate, setIsCreate] = React.useState(true);

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Button
          variant={isCreate ? "contained" : "outlined"}
          onClick={() => setIsCreate(true)}
        >
          Create User
        </Button>

        <Button
          variant={!isCreate ? "contained" : "outlined"}
          onClick={() => setIsCreate(false)}
        >
          View All Users
        </Button>
      </Stack>

      {isCreate ? <CreateUser /> : <ViewAllUsers />}
    </Box>
  );
};

export default AdminRoleManager;
