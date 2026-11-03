
import React, { useEffect, useMemo, useState, useCallback } from "react";

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
} from "../../../redux/slices/dailyTask.slice";

import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const DailyTaskEmployee = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState(null);
  const [completedTaskIds, setCompletedTaskIds] = useState(new Set());

  const userID = useSelector(
    (state) => state.auth?.user?.user?.userID
  );

  const tasks = useSelector(
    (state) => state.dailyTask?.employeeTasks?.data || []
  );

  // FETCH EMPLOYEE TASKS
  const fetchEmployeeTasks = useCallback(async () => {
    if (!userID) return;

    try {
      setLoading(true);

      const result = await dispatch(
        getDailyTaskEmployees(userID)
      ).unwrap();

      // Backend should return completed: true/false
      if (Array.isArray(result)) {
        const completedIds = new Set(
          result
            .filter((task) => task.completed === true)
            .map((task) => String(task.id))
        );

        setCompletedTaskIds(completedIds);
      }
    } catch (error) {
      console.error("Fetch employee tasks error:", error);

      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to fetch daily tasks"
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch, userID]);

  // INITIAL FETCH
  useEffect(() => {
    fetchEmployeeTasks();
  }, [fetchEmployeeTasks]);

  // SORT TASKS
  const sortedTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];

    return [...tasks].sort(
      (a, b) => Number(a.id) - Number(b.id)
    );
  }, [tasks]);

  // COMPLETE TASK
  const handleCompleteTask = async (taskId) => {
    const id = String(taskId);

    if (!taskId) {
      toast.error("Task ID is missing");
      return;
    }

    if (
      completedTaskIds.has(id) ||
      completingTaskId === id
    ) {
      return;
    }

    try {
      setCompletingTaskId(id);

      await dispatch(
        completeDailyTasks({
          taskId: id,
        })
      ).unwrap();

      // Update local completed state
      setCompletedTaskIds((previous) => {
        const updated = new Set(previous);
        updated.add(id);
        return updated;
      });

      toast.success("Task completed successfully");

      // Fetch latest task status
      await fetchEmployeeTasks();

    } catch (error) {
      console.error("Complete task error:", error);

      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to complete task"
      );
    } finally {
      setCompletingTaskId(null);
    }
  };

  // LOADING UI
  if (loading && sortedTasks.length === 0) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2.5 },
        minHeight: "100%",
        bgcolor: "#f8fafc",
      }}
    >
      {/* HEADER */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          mb: 2,
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          gap={2}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              color="#0f172a"
            >
              My Daily Tasks
            </Typography>

            <Typography
              variant="body2"
              sx={{ mt: 0.5, color: "#64748b" }}
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
              alignSelf: { xs: "flex-start", sm: "auto" },
            }}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </Stack>
      </Paper>

      {/* TASK SUMMARY */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Chip
          label={`Total Tasks: ${sortedTasks.length}`}
          color="primary"
          variant="outlined"
        />

        <Chip
          label={`Completed: ${
            sortedTasks.filter(
              (task) =>
                completedTaskIds.has(String(task.id)) ||
                task.completed === true
            ).length
          }`}
          color="success"
          variant="outlined"
        />
      </Stack>

      {/* TASK LIST */}
      {sortedTasks.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            color="#334155"
          >
            No tasks assigned
          </Typography>

          <Typography
            variant="body2"
            sx={{ mt: 1, color: "#64748b" }}
          >
            You don't have any active tasks.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={1.5}>
          {sortedTasks.map((task, index) => {
            // IMPORTANT: Backend returns id, not taskId
            const taskId = String(task.id);

            const isCompleted =
              completedTaskIds.has(taskId) ||
              task.completed === true;

            const isCompleting =
              completingTaskId === taskId;

            const taskType =
              task.task_type === "daily_task"
                ? "DAILY TASK"
                : task.task_type === "delegation_task"
                  ? "DELEGATION TASK"
                  : task.task_type || "TASK";

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
                key={taskId}
                elevation={0}
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: cardBorder,
                  bgcolor: cardBackground,
                  transition: "all 0.25s ease",
                  boxShadow: isCompleted
                    ? "0 2px 8px rgba(22, 163, 74, 0.08)"
                    : "none",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "stretch", sm: "center" }}
                  justifyContent="space-between"
                  gap={2}
                >
                  {/* TASK INFORMATION */}
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                  >
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
                        color: isCompleted || isCompleting
                          ? "#ffffff"
                          : "#2563eb",
                        fontWeight: 700,
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircleOutlineIcon fontSize="small" />
                      ) : (
                        index + 1
                      )}
                    </Box>

                    <Box>
                      <Typography
                        fontWeight={700}
                        sx={{
                          color: isCompleted
                            ? "#166534"
                            : "#1e293b",
                          textDecoration: isCompleted
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {task.description}
                      </Typography>

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
                              : taskType
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

                        {task.task_type === "delegation_task" &&
                          task.effective_due_date && (
                            <Chip
                              icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
                              label={`Due: ${new Date(
                                task.effective_due_date
                              ).toLocaleDateString("en-IN")}`}
                              size="small"
                              variant="outlined"
                            />
                          )}

                        {task.department && (
                          <Chip
                            label={task.department}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </Box>
                  </Stack>

                  {/* COMPLETE BUTTON */}
                  <Button
                    variant={isCompleted ? "outlined" : "contained"}
                    color={isCompleted ? "success" : "primary"}
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
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={isCompleted || isCompleting}
                    sx={{
                      minWidth: {
                        xs: "100%",
                        sm: 130,
                      },
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
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
