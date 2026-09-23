import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  IconButton,
  Grid,
  Divider,
  TextField,
  CircularProgress,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SearchIcon from "@mui/icons-material/Search";

import { getPendingOrdersOfEMployee } from "../../../redux/slices/dailtTask.slice";
// =========================================================
// HELPERS
// =========================================================

const getScoreColor = (score) => {
  if (score >= 90) return "success";
  if (score >= 75) return "warning";
  return "error";
};

const getScoreLabel = (score) => {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Average";
  return "Needs Improvement";
};

// =========================================================
// COMPONENT
// =========================================================

const ViewScoreOfEmployes = ({ onBack }) => {
  const dispatch = useDispatch();

  // =======================================================
  // REDUX
  // =======================================================

  const {
    pendingTasks = [],
    weeklySummary = null,
    loading = false,
    error = null,
  } = useSelector((state) => state.dailyTask);

  // =======================================================
  // SEARCH STATE
  // =======================================================

  const [userID, setUserID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [searchedEmployee, setSearchedEmployee] = useState(null);

  // =======================================================
  // SEARCH PERFORMANCE
  // =======================================================

  const handleSearch = async () => {
    if (!userID.trim()) {
      return;
    }

    if (!startDate || !endDate) {
      return;
    }

    try {
      const result = await dispatch(
        getPendingOrdersOfEMployee({
          userID: userID.trim(),
          startDate,
          endDate,
        })
      ).unwrap();

      console.log("📊 WEEKLY PERFORMANCE:", result);

      const data = result?.data;

      setSearchedEmployee({
        userId: data?.userID || userID,

        name:
          data?.employeeName ||
          data?.userName ||
          data?.userID ||
          userID,

        department:
          data?.division ||
          data?.department ||
          "--",

        assigned:
          Number(data?.summary?.assigned || 0),

        completed:
          Number(data?.summary?.completed || 0),

        pending:
          Number(data?.summary?.pending || 0),

        onTime:
          Number(data?.summary?.onTime || 0),

        late:
          Number(data?.summary?.late || 0),

        score:
          Number(data?.summary?.score || 0),
      });
    } catch (error) {
      console.error(
        "❌ Weekly performance error:",
        error
      );

      setSearchedEmployee(null);
    }
  };

  // =======================================================
  // EMPLOYEE DATA
  // =======================================================

  const employees = useMemo(() => {
    if (!searchedEmployee) {
      return [];
    }

    return [searchedEmployee];
  }, [searchedEmployee]);

  // =======================================================
  // SUMMARY
  // =======================================================

  const summary = useMemo(() => {
    if (!searchedEmployee || !weeklySummary) {
      return {
        totalEmployees: 0,
        averageScore: 0,
        topScore: 0,
        topEmployee: "--",
        totalAssigned: 0,
        totalCompleted: 0,
        totalPending: 0,
      };
    }

    return {
      totalEmployees: 1,

      averageScore: Number(
        weeklySummary.score || 0
      ),

      topScore: Number(
        weeklySummary.score || 0
      ),

      topEmployee:
        searchedEmployee.name ||
        searchedEmployee.userId ||
        "--",

      totalAssigned: Number(
        weeklySummary.assigned || 0
      ),

      totalCompleted: Number(
        weeklySummary.completed || 0
      ),

      totalPending: Number(
        weeklySummary.pending || 0
      ),
    };
  }, [weeklySummary, searchedEmployee]);

  // =======================================================
  // DATAGRID COLUMNS
  // =======================================================

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "EMPLOYEE",
        width: 200,

        renderCell: (params) => (
          <Box>
            <Typography
              variant="body2"
              fontWeight={700}
              noWrap
              title={params.value || ""}
            >
              {params.value || "--"}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
            >
              {params.row.userId || "--"}
            </Typography>
          </Box>
        ),
      },

      {
        field: "department",
        headerName: "DEPARTMENT",
        width: 130,

        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value || "--"}
            variant="outlined"
          />
        ),
      },

      {
        field: "assigned",
        headerName: "ASSIGNED",
        width: 100,
        align: "center",
        headerAlign: "center",
      },

      {
        field: "completed",
        headerName: "DONE",
        width: 90,
        align: "center",
        headerAlign: "center",

        renderCell: (params) => (
          <Typography
            variant="body2"
            fontWeight={700}
            color="success.main"
          >
            {params.value || 0}
          </Typography>
        ),
      },

      {
        field: "pending",
        headerName: "PENDING",
        width: 100,
        align: "center",
        headerAlign: "center",

        renderCell: (params) => (
          <Typography
            variant="body2"
            fontWeight={700}
            color={
              Number(params.value || 0) > 0
                ? "error.main"
                : "success.main"
            }
          >
            {params.value || 0}
          </Typography>
        ),
      },

      {
        field: "onTime",
        headerName: "ON TIME",
        width: 100,
        align: "center",
        headerAlign: "center",

        renderCell: (params) => (
          <Typography
            variant="body2"
            fontWeight={700}
            color="success.main"
          >
            {params.value || 0}
          </Typography>
        ),
      },

      {
        field: "late",
        headerName: "LATE",
        width: 90,
        align: "center",
        headerAlign: "center",

        renderCell: (params) => (
          <Typography
            variant="body2"
            fontWeight={700}
            color={
              Number(params.value || 0) > 0
                ? "warning.main"
                : "success.main"
            }
          >
            {params.value || 0}
          </Typography>
        ),
      },

      {
        field: "score",
        headerName: "SCORE",
        width: 170,
        align: "center",
        headerAlign: "center",

        renderCell: (params) => {
          const score = Number(params.value || 0);

          const color = getScoreColor(score);

          return (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <Typography
                variant="body1"
                fontWeight={800}
                color={`${color}.main`}
              >
                {score.toFixed(2)}
              </Typography>

              <Chip
                size="small"
                label={getScoreLabel(score)}
                color={color}
                variant="outlined"
              />
            </Stack>
          );
        },
      },
    ],
    []
  );

  // =======================================================
  // ROWS
  // =======================================================

  const rows = useMemo(
    () =>
      employees.map((employee) => ({
        ...employee,
        id: employee.userId,
      })),
    [employees]
  );

  // =======================================================
  // PENDING TASK COLUMNS
  // =======================================================

  const pendingTaskColumns = useMemo(
    () => [
      {
        field: "taskID",
        headerName: "TASK ID",
        width: 150,
      },

      {
        field: "taskName",
        headerName: "TASK NAME",
        flex: 1,
        minWidth: 220,
      },

      {
        field: "taskDate",
        headerName: "DATE",
        width: 130,
      },

      {
        field: "status",
        headerName: "STATUS",
        width: 150,

        renderCell: (params) => (
          <Chip
            size="small"
            label="NOT COMPLETED"
            color="error"
            variant="outlined"
          />
        ),
      },
    ],
    []
  );

  const pendingTaskRows = useMemo(
    () =>
      (pendingTasks || []).map((task, index) => ({
        ...task,
        id:
          `${task.taskID || "TASK"}-` +
          `${task.taskDate || index}`,
      })),
    [pendingTasks]
  );

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <Box>
      {/* =================================================
          HEADER
      ================================================= */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            {onBack && (
              <IconButton
                size="small"
                onClick={onBack}
              >
                <ArrowBackIcon />
              </IconButton>
            )}

            <Box>
              <Typography
                variant="h5"
                fontWeight={700}
              >
                Weekly Employee Performance
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Employee task performance for the selected period
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>

      {/* =================================================
          SEARCH FILTER
      ================================================= */}

      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={2}
          alignItems={{
            xs: "stretch",
            md: "center",
          }}
        >
          <TextField
            size="small"
            label="Employee User ID"
            placeholder="USER0008"
            value={userID}
            onChange={(e) =>
              setUserID(e.target.value)
            }
            sx={{
              minWidth: 190,
            }}
          />

          <TextField
            size="small"
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            size="small"
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) =>
              setEndDate(e.target.value)
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Button
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <SearchIcon />
              )
            }
            onClick={handleSearch}
            disabled={
              loading ||
              !userID.trim() ||
              !startDate ||
              !endDate
            }
          >
            {loading
              ? "Loading..."
              : "Get Performance"}
          </Button>
        </Stack>

        {error && (
          <Typography
            variant="body2"
            color="error"
            sx={{ mt: 1.5 }}
          >
            {error}
          </Typography>
        )}
      </Paper>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        {/* EMPLOYEES */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Employees
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ mt: 0.5 }}
                >
                  {summary.totalEmployees}
                </Typography>
              </Box>

              <AssignmentTurnedInIcon fontSize="large" />
            </Stack>
          </Paper>
        </Grid>

        {/* SCORE */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Weekly Score
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ mt: 0.5 }}
                >
                  {Number(
                    summary.averageScore || 0
                  ).toFixed(2)}

                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    /100
                  </Typography>
                </Typography>
              </Box>

              <TrendingUpIcon fontSize="large" />
            </Stack>
          </Paper>
        </Grid>

        {/* TOP SCORE */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Score
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ mt: 0.5 }}
                >
                  {Number(
                    summary.topScore || 0
                  ).toFixed(2)}
                </Typography>
              </Box>

              <EmojiEventsIcon fontSize="large" />
            </Stack>
          </Paper>
        </Grid>

        {/* COMPLETION */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Tasks Completed
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ mt: 0.5 }}
                >
                  {summary.totalCompleted}

                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    /{summary.totalAssigned}
                  </Typography>
                </Typography>
              </Box>

              <AccessTimeIcon fontSize="large" />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* =================================================
          SCORE FORMULA
      ================================================= */}

      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          justifyContent="space-between"
        >
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
            >
              Weekly Score
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Score is currently based on task completion percentage.
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
          >
            <Chip
              label={`Completed ${
                weeklySummary?.completed || 0
              }`}
              color="success"
            />

            <Chip
              label={`Pending ${
                weeklySummary?.pending || 0
              }`}
              color="error"
            />

            <Chip
              label={`Completion ${
                weeklySummary?.completionPercentage || 0
              }%`}
              color="primary"
            />
          </Stack>
        </Stack>
      </Paper>

      {/* =================================================
          EMPLOYEE TABLE
      ================================================= */}

      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          mb: 3,
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Employee Scorecard
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Weekly task completion and performance
          </Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            width: "100%",
            height: searchedEmployee ? 500 : 220,
          }}
        >
          {!searchedEmployee ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                height: "100%",
                px: 2,
              }}
            >
              <Typography
                color="text.secondary"
              >
                Enter Employee User ID and date range to view performance.
              </Typography>
            </Stack>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              rowHeight={52}
              columnHeaderHeight={42}
              hideFooter
              sx={{
                border: 0,

                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "action.hover",
                },

                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 700,
                  fontSize: "0.72rem",
                },

                "& .MuiDataGrid-cell": {
                  fontSize: "0.8rem",
                  py: 0.5,
                },

                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "action.hover",
                },

                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },

                "& .MuiDataGrid-cell:focus-within": {
                  outline: "none",
                },

                "& ::-webkit-scrollbar": {
                  width: "8px",
                  height: "8px",
                },

                "& ::-webkit-scrollbar-thumb": {
                  borderRadius: "4px",
                  backgroundColor:
                    "rgba(0,0,0,0.25)",
                },
              }}
            />
          )}
        </Box>
      </Paper>

      {/* =================================================
          PENDING TASKS
      ================================================= */}

      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
              >
                Pending Tasks
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Tasks not completed during the selected period
              </Typography>
            </Box>

            <Chip
              label={`${pendingTasks.length} Pending`}
              color={
                pendingTasks.length > 0
                  ? "error"
                  : "success"
              }
              variant="outlined"
            />
          </Stack>
        </Box>

        <Divider />

        <Box
          sx={{
            width: "100%",
            height:
              pendingTasks.length > 0
                ? 400
                : 180,
          }}
        >
          {pendingTasks.length === 0 ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                height: "100%",
              }}
            >
              <Typography
                color="success.main"
                fontWeight={600}
              >
                No pending tasks 🎉
              </Typography>
            </Stack>
          ) : (
            <DataGrid
              rows={pendingTaskRows}
              columns={pendingTaskColumns}
              disableRowSelectionOnClick
              rowHeight={48}
              columnHeaderHeight={42}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                    page: 0,
                  },
                },
              }}
              sx={{
                border: 0,

                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "action.hover",
                },

                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 700,
                  fontSize: "0.72rem",
                },

                "& .MuiDataGrid-cell": {
                  fontSize: "0.8rem",
                },

                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "action.hover",
                },

                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },

                "& .MuiDataGrid-cell:focus-within": {
                  outline: "none",
                },
              }}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewScoreOfEmployes;