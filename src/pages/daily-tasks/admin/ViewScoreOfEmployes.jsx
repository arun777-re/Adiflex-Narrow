import { useMemo, useState } from "react";

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
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// =========================================================
// TEMPORARY DUMMY DATA
// =========================================================

const dummyEmployees = [
  {
    userId: "USER0008",
    name: "Employee One",
    department: "WOVEN",
    assigned: 25,
    completed: 23,
    pending: 2,
    onTime: 21,
    late: 2,
    score: 89,
  },
  {
    userId: "USER0009",
    name: "Employee Two",
    department: "CROCHET",
    assigned: 30,
    completed: 27,
    pending: 3,
    onTime: 25,
    late: 2,
    score: 87,
  },
  {
    userId: "USER0010",
    name: "Employee Three",
    department: "WOVEN",
    assigned: 22,
    completed: 20,
    pending: 2,
    onTime: 18,
    late: 2,
    score: 84,
  },
  {
    userId: "USER0011",
    name: "Employee Four",
    department: "CROCHET",
    assigned: 28,
    completed: 20,
    pending: 8,
    onTime: 17,
    late: 3,
    score: 71,
  },
];

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
  // =======================================================
  // WEEK STATE
  // =======================================================

  const [weekOffset, setWeekOffset] = useState(0);

  // =======================================================
  // TEMP DATA
  // =======================================================

  const employees = dummyEmployees;

  // =======================================================
  // WEEK LABEL
  // =======================================================

  const weekLabel = useMemo(() => {
    if (weekOffset === 0) {
      return "Current Week";
    }

    if (weekOffset === -1) {
      return "Previous Week";
    }

    if (weekOffset === 1) {
      return "Next Week";
    }

    return `${Math.abs(weekOffset)} Week${
      Math.abs(weekOffset) > 1 ? "s" : ""
    } ${weekOffset < 0 ? "Ago" : "Ahead"}`;
  }, [weekOffset]);

  // =======================================================
  // SUMMARY
  // =======================================================

  const summary = useMemo(() => {
    if (!employees.length) {
      return {
        totalEmployees: 0,
        averageScore: 0,
        topScore: 0,
        topEmployee: "--",
        totalAssigned: 0,
        totalCompleted: 0,
      };
    }

    const totalEmployees = employees.length;

    const totalScore = employees.reduce(
      (sum, employee) => sum + Number(employee.score || 0),
      0,
    );

    const totalAssigned = employees.reduce(
      (sum, employee) => sum + Number(employee.assigned || 0),
      0,
    );

    const totalCompleted = employees.reduce(
      (sum, employee) => sum + Number(employee.completed || 0),
      0,
    );

    const topEmployee = [...employees].sort(
      (a, b) => Number(b.score || 0) - Number(a.score || 0),
    )[0];

    return {
      totalEmployees,
      averageScore: Math.round(totalScore / totalEmployees),
      topScore: topEmployee?.score || 0,
      topEmployee: topEmployee?.name || "--",
      totalAssigned,
      totalCompleted,
    };
  }, [employees]);

  // =======================================================
  // DATAGRID COLUMNS
  // =======================================================

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "EMPLOYEE",
        width: 180,

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

            <Typography variant="caption" color="text.secondary" noWrap>
              {params.row.userId}
            </Typography>
          </Box>
        ),
      },

      {
        field: "department",
        headerName: "DEPARTMENT",
        width: 120,

        renderCell: (params) => (
          <Chip size="small" label={params.value || "--"} variant="outlined" />
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
          <Typography variant="body2" fontWeight={700} color="success.main">
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
              Number(params.value || 0) > 0 ? "error.main" : "success.main"
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
          <Typography variant="body2" fontWeight={700} color="success.main">
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
              Number(params.value || 0) > 0 ? "warning.main" : "success.main"
            }
          >
            {params.value || 0}
          </Typography>
        ),
      },

      {
        field: "score",
        headerName: "SCORE",
        width: 130,
        align: "center",
        headerAlign: "center",

        renderCell: (params) => {
          const score = Number(params.value || 0);

          return (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="body1"
                fontWeight={800}
                color={`${getScoreColor(score)}.main`}
              >
                {score}
              </Typography>

              <Chip
                size="small"
                label={getScoreLabel(score)}
                color={getScoreColor(score)}
                variant="outlined"
              />
            </Stack>
          );
        },
      },
    ],
    [],
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
    [employees],
  );

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <Box>
      {/* ===================================================
          HEADER
      =================================================== */}

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
          <Stack direction="row" spacing={1} alignItems="center">
            {onBack && (
              <IconButton size="small" onClick={onBack}>
                <ArrowBackIcon />
              </IconButton>
            )}

            <Box>
              <Typography variant="h5" fontWeight={700}>
                Weekly Employee Performance
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Employee task performance for the selected week
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* =================================================
            WEEK NAVIGATION
        ================================================= */}

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="outlined"
            size="small"
            startIcon={<ChevronLeftIcon />}
            onClick={() => setWeekOffset((prev) => prev - 1)}
          >
            Previous
          </Button>

          <Chip label={weekLabel} color="primary" variant="outlined" />

          <Button
            variant="outlined"
            size="small"
            endIcon={<ChevronRightIcon />}
            onClick={() => setWeekOffset((prev) => prev + 1)}
            disabled={weekOffset >= 0}
          >
            Next
          </Button>
        </Stack>
      </Stack>

      {/* ===================================================
          SUMMARY CARDS
      =================================================== */}

      <Grid container spacing={2} sx={{ mb: 3 }}>
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
                <Typography variant="body2" color="text.secondary">
                  Employees
                </Typography>

                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                  {summary.totalEmployees}
                </Typography>
              </Box>

              <AssignmentTurnedInIcon fontSize="large" />
            </Stack>
          </Paper>
        </Grid>

        {/* AVERAGE SCORE */}

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
                <Typography variant="body2" color="text.secondary">
                  Average Score
                </Typography>

                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                  {summary.averageScore}
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
                <Typography variant="body2" color="text.secondary">
                  Top Score
                </Typography>

                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                  {summary.topScore}
                </Typography>
              </Box>

              <EmojiEventsIcon fontSize="large" />
            </Stack>
          </Paper>
        </Grid>

        {/* TOTAL COMPLETION */}

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
                <Typography variant="body2" color="text.secondary">
                  Tasks Completed
                </Typography>

                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
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

      {/* ===================================================
          SCORE FORMULA
      =================================================== */}

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
            <Typography variant="subtitle1" fontWeight={700}>
              Weekly Score Formula
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Completion 60% + On-Time 30% + Consistency 10%
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label="Completion 60" color="primary" />
            <Chip label="On-Time 30" color="success" />
            <Chip label="Consistency 10" color="warning" />
          </Stack>
        </Stack>
      </Paper>

      {/* ===================================================
          EMPLOYEE TABLE
      =================================================== */}

      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Employee Scorecard
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Weekly task completion and punctuality
          </Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            width: "100%",
            height: 500,
          }}
        >
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
                backgroundColor: "rgba(0,0,0,0.25)",
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewScoreOfEmployes;
