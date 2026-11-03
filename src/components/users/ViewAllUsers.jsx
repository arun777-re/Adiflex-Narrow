import React from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import { DataGrid } from "@mui/x-data-grid";
import { getAllUsersData } from "../../redux/slices/authSlices";
import { useDispatch } from "react-redux";

const columns = [
  {
    field: "user_id",
    headerName: "User ID",
    minWidth: 130,
    flex: 0.8,
  },
  {
    field: "name",
    headerName: "Name",
    minWidth: 170,
    flex: 1,
  },
  {
    field: "role",
    headerName: "Role",
    minWidth: 180,
    flex: 1,
  },
  {
    field: "division",
    headerName: "Division",
    minWidth: 120,
    flex: 0.7,
    valueFormatter: (value) => String(value ?? "").toUpperCase(),
  },
  {
    field: "department",
    headerName: "Department",
    minWidth: 150,
    flex: 1,
    valueGetter: (value) => value || "—",
  },
  {
    field: "is_active",
    headerName: "Status",
    minWidth: 120,
    renderCell: (params) => (
      <Chip
        size="small"
        label={params.value ? "Active" : "Inactive"}
        color={params.value ? "success" : "default"}
        variant="outlined"
      />
    ),
  },
  {
    field: "created_at",
    headerName: "Created At",
    minWidth: 170,
    flex: 1,
    valueFormatter: (value) =>
      value ? new Date(value).toLocaleDateString("en-IN") : "—",
  },
];

const ViewAllUsers = () => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const dispatch = useDispatch();

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await dispatch(getAllUsersData()).unwrap();

      // Supports either a direct API response or a thunk returning response.data.
      const payload = result?.data ?? result;
      const rows = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      setUsers(
        rows.map((user) => ({
          ...user,
          id: user.id ?? user.user_id,
        }))
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Users fetch karte waqt error aaya."
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            All Users
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Total users: {users.length}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchUsers}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={fetchUsers}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Box sx={{ height: 520, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: 10,
              },
            },
          }}
          slots={{
            loadingOverlay: () => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  gap: 1,
                }}
              >
                <CircularProgress size={24} />
                <Typography>Loading users...</Typography>
              </Box>
            ),
          }}
        />
      </Box>
    </Paper>
  );
};

export default ViewAllUsers;