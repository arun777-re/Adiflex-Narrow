import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import {
  getDailyTaskEmployees,
  completeDailyTasks,
} from "../../../redux/slices/dailtTask.slice";

import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const DailyTaskEmployee = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Currently completing task
  const [completingTaskId, setCompletingTaskId] = useState(null);

  // Local completed state
  const [completedTaskIds, setCompletedTaskIds] = useState(
    new Set()
  );

  const dispatch = useDispatch();

  const userID = useSelector(
    (state) => state.auth?.user?.user?.userID
  );

  // =========================================================
  // FETCH EMPLOYEE TASKS
  // =========================================================

  const fetchEmployeeTasks = async () => {
    if (!userID) return;

    try {
      setLoading(true);
      setError("");

      const result = await dispatch(
        getDailyTaskEmployees(userID)
      ).unwrap();

      // =====================================================
      // IF BACKEND ALREADY RETURNS completed: true
      // =====================================================

      if (Array.isArray(result)) {
        const completedIds = new Set(
          result
            .filter((task) => task.completed === true)
            .map((task) => task.taskId)
        );

        setCompletedTaskIds(completedIds);
      }

    } catch (err) {
      console.error(
        "Failed to fetch employee tasks:",
        err
      );

      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to fetch daily tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchEmployeeTasks();
  }, [userID]);

  // =========================================================
  // GET TASKS
  // =========================================================

  const tasks = useSelector(
    (state) =>
      state.dailyTask.employeeTasks?.data || []
  );

  // =========================================================
  // SORT TASKS
  // =========================================================

  const sortedTasks = useMemo(() => {
    return [...tasks].sort(
      (a, b) =>
        Number(a.taskOrder || 999) -
        Number(b.taskOrder || 999)
    );
  }, [tasks]);

  // =========================================================
  // ERROR TOAST
  // =========================================================

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // =========================================================
  // COMPLETE TASK
  // =========================================================

  const handleCompleteTask = async (taskId) => {
    if (!taskId || !userID) {
      setError("Task ID or User ID is missing");
      return;
    }

    // Already completed
    if (completedTaskIds.has(taskId)) {
      return;
    }

    // Same task already being completed
    if (completingTaskId === taskId) {
      return;
    }

    try {
      setError("");

      // Show completing state only for this task
      setCompletingTaskId(taskId);

      await dispatch(
        completeDailyTasks({
          taskId,
          userID,
        })
      ).unwrap();

      // =====================================================
      // IMMEDIATELY MARK TASK AS COMPLETED
      // =====================================================

      setCompletedTaskIds((prev) => {
        const next = new Set(prev);
        next.add(taskId);
        return next;
      });

      toast.success("Task completed successfully");

      // =====================================================
      // FETCH LATEST TASKS
      // =====================================================

      await dispatch(
        getDailyTaskEmployees(userID)
      ).unwrap();

    } catch (err) {
      console.error(
        "Failed to complete daily task:",
        err
      );

      setError(
        typeof err === "string"
          ? err
          : err?.message ||
              "Failed to complete daily task"
      );
    } finally {
      setCompletingTaskId(null);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2.5 },
        minHeight: "100%",
        bgcolor: "#f8fafc",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          mb: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "#e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "stretch",
            sm: "center",
          }}
          gap={2}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                color: "#0f172a",
              }}
            >
              My Daily Tasks
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                color: "#64748b",
              }}
            >
              Complete your assigned tasks for today.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={fetchEmployeeTasks}
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              alignSelf: {
                xs: "flex-start",
                sm: "auto",
              },
            }}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </Stack>
      </Paper>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress />
        </Box>
      ) : sortedTasks.length === 0 ? (
        // =====================================================
        // NO TASKS
        // =====================================================

        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "#e2e8f0",
            bgcolor: "#ffffff",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ color: "#334155" }}
          >
            No tasks assigned
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: "#64748b",
            }}
          >
            You don't have any active daily tasks.
          </Typography>
        </Paper>
      ) : (
        // =====================================================
        // TASK LIST
        // =====================================================

        <Stack spacing={1.5}>
          {sortedTasks.map((task, index) => {
            // =================================================
            // TASK STATE
            // =================================================

            const isCompleted =
              completedTaskIds.has(task.taskId) ||
              task.completed === true;

            const isCompleting =
              completingTaskId === task.taskId;

            // =================================================
            // CARD COLORS
            // =================================================

            const cardBackground = isCompleted
              ? "#f0fdf4"
              : isCompleting
                ? "#fffbeb"
                : "#ffffff";

            const cardBorder = isCompleted
              ? "#86efac"
              : isCompleting
                ? "#fcd34d"
                : "#e2e8f0";

            return (
              <Paper
                key={task.taskId}
                elevation={0}
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: 3,

                  border: "1px solid",
                  borderColor: cardBorder,

                  bgcolor: cardBackground,

                  transition:
                    "all 0.25s ease",

                  boxShadow: isCompleted
                    ? "0 2px 8px rgba(22, 163, 74, 0.08)"
                    : "none",
                }}
              >
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  alignItems={{
                    xs: "stretch",
                    sm: "center",
                  }}
                  justifyContent="space-between"
                  gap={2}
                >
                  {/* =================================================
                      TASK INFO
                  ================================================= */}

                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                  >
                    {/* NUMBER / CHECK CIRCLE */}

                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        flexShrink: 0,

                        bgcolor: isCompleted
                          ? "#16a34a"
                          : isCompleting
                            ? "#f59e0b"
                            : "#eff6ff",

                        color: isCompleted
                          ? "#ffffff"
                          : isCompleting
                            ? "#ffffff"
                            : "#2563eb",

                        fontWeight: 700,

                        transition:
                          "all 0.25s ease",
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircleOutlineIcon
                          fontSize="small"
                        />
                      ) : (
                        index + 1
                      )}
                    </Box>

                    {/* TASK DETAILS */}

                    <Box>
                      <Typography
                        fontWeight={700}
                        sx={{
                          color: isCompleted
                            ? "#166534"
                            : "#1e293b",

                          textDecoration:
                            isCompleted
                              ? "line-through"
                              : "none",

                          transition:
                            "all 0.25s ease",
                        }}
                      >
                        {task.description}
                      </Typography>

                      {/* CHIPS */}

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          mt: 0.8,
                          flexWrap: "wrap",
                          gap: 0.5,
                        }}
                      >
                        <Chip
                          label={
                            isCompleted
                              ? "COMPLETED"
                              : task.taskType
                          }
                          size="small"
                          sx={{
                            fontWeight: 600,

                            bgcolor: isCompleted
                              ? "#dcfce7"
                              : "#eff6ff",

                            color: isCompleted
                              ? "#166534"
                              : "#1d4ed8",
                          }}
                        />

                        {task.dueTime && (
                          <Chip
                            icon={
                              <AccessTimeIcon
                                sx={{
                                  fontSize: 16,
                                }}
                              />
                            }
                            label={task.dueTime}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor:
                                isCompleted
                                  ? "#86efac"
                                  : "#cbd5e1",

                              color:
                                isCompleted
                                  ? "#166534"
                                  : "#475569",
                            }}
                          />
                        )}
                      </Stack>
                    </Box>
                  </Stack>

                  {/* =================================================
                      COMPLETE BUTTON
                  ================================================= */}

                  <Button
                    variant={
                      isCompleted
                        ? "outlined"
                        : "contained"
                    }
                    color={
                      isCompleted
                        ? "success"
                        : "primary"
                    }
                    startIcon={
                      isCompleting ? (
                        <CircularProgress
                          size={17}
                          color="inherit"
                        />
                      ) : (
                        <CheckCircleOutlineIcon />
                      )
                    }
                    onClick={() =>
                      handleCompleteTask(
                        task.taskId
                      )
                    }
                    disabled={
                      isCompleted ||
                      isCompleting
                    }
                    sx={{
                      minWidth: {
                        xs: "100%",
                        sm: 130,
                      },

                      borderRadius: 2,

                      textTransform: "none",

                      fontWeight: 600,

                      transition:
                        "all 0.2s ease",
                    }}
                  >
                    {isCompleting
                      ? "Completing..."
                      : isCompleted
                        ? "Completed"
                        : "Complete"}
                  </Button>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default DailyTaskEmployee;

