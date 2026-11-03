
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  completeDailyTasks,
  completeDelegationTask,
  getDelegationTasksofEmployee,
} from "../../../redux/slices/dailyTask.slice";

import useNotification from "../../../hooks/useNotification";

// ============================================================
// HELPERS
// ============================================================

const getTodayDate = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDueDate = (date) => {
  if (!date) return "--";

  const dateString = String(date).slice(0, 10);
  const parsedDate = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return dateString;

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getTaskDateStatus = (dueDate) => {
  if (!dueDate) return "unknown";

  const today = getTodayDate();
  const date = String(dueDate).slice(0, 10);

  if (date < today) return "overdue";
  if (date === today) return "today";

  return "upcoming";
};

// ============================================================
// COMPONENT
// ============================================================

const DelegationTask = () => {
  const dispatch = useDispatch();

  const { userID, name } = useSelector(
    (state) => state.auth?.user?.user || {}
  );

  const employeeTasksState = useSelector(
    (state) => state.dailyTask?.delegationTasks
  );

  const reduxTasks = employeeTasksState?.data || employeeTasksState || [];

  const [loading, setLoading] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState(null);
  const [completedTaskIds, setCompletedTaskIds] = useState(new Set());

  // ============================================================
  // FETCH DELEGATION TASKS
  // ============================================================

  const fetchDelegationTasks = useCallback(async () => {
    if (!userID) return;

    try {
      setLoading(true);

      await dispatch(
        getDelegationTasksofEmployee({ userID })
      ).unwrap();

    } catch (error) {
      console.error("Failed to fetch delegation tasks:", error);

      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to load delegation tasks"
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch, userID]);

  // ============================================================
  // NOTIFICATION REFRESH
  // ============================================================

  useNotification({
    refetch: fetchDelegationTasks,
  });

  // ============================================================
  // INITIAL FETCH
  // ============================================================

  useEffect(() => {
    fetchDelegationTasks();
  }, [fetchDelegationTasks]);

  // ============================================================
  // NORMALIZE TASK DATA
  // Actual backend fields:
  // id, task_type, due_date, is_active, department
  // ============================================================

  const tasks = useMemo(() => {
    if (!Array.isArray(reduxTasks)) return [];

    return reduxTasks.filter((task) => {
      return (
        task?.task_type === "delegation_task" &&
        task?.is_active === true
      );
    });
  }, [reduxTasks]);

  // ============================================================
  // COMPLETE TASK
  // ============================================================

  
const handleCompleteTask = async (task) => {
  const taskId = String(task?.id || "");

  if (!taskId) {
    toast.error("Task ID is missing");
    return;
  }

  if (completingTaskId === taskId) return;

  try {
    setCompletingTaskId(taskId);

    await dispatch(
      completeDelegationTask({
        taskId,
      })
    ).unwrap();

    setCompletedTaskIds((prev) => {
      const next = new Set(prev);
      next.add(taskId);
      return next;
    });

    toast.success("Delegation task completed successfully");

    await fetchDelegationTasks();

  } catch (error) {
    console.error("Complete delegation task error:", error);

    toast.error(
      typeof error === "string"
        ? error
        : error?.message || "Failed to complete delegation task"
    );
  } finally {
    setCompletingTaskId(null);
  }
};


  // ============================================================
  // COUNTS
  // ============================================================

  const pendingCount = tasks.filter(
    (task) => !completedTaskIds.has(String(task.id))
  ).length;

  const overdueCount = tasks.filter((task) => {
    if (completedTaskIds.has(String(task.id))) return false;

    return getTaskDateStatus(task.due_date) === "overdue";
  }).length;

  const todayCount = tasks.filter((task) => {
    if (completedTaskIds.has(String(task.id))) return false;

    return getTaskDateStatus(task.due_date) === "today";
  }).length;

  // ============================================================
  // UI
  // ============================================================

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 3 },
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
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#eff6ff",
                color: "#2563eb",
              }}
            >
              <AssignmentOutlinedIcon />
            </Box>

            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{ color: "#0f172a" }}
              >
                Delegation Tasks
              </Typography>

              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Complete tasks assigned to you.
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="outlined"
            startIcon={
              loading ? (
                <CircularProgress size={16} />
              ) : (
                <RefreshIcon />
              )
            }
            disabled={loading}
            onClick={fetchDelegationTasks}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </Stack>

        {/* SUMMARY */}

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          sx={{ mt: 2 }}
        >
          <Chip
            label={`Pending: ${pendingCount}`}
            color="primary"
            variant="outlined"
          />

          {todayCount > 0 && (
            <Chip
              label={`Due Today: ${todayCount}`}
              color="warning"
            />
          )}

          {overdueCount > 0 && (
            <Chip
              icon={<ErrorOutlineIcon />}
              label={`Overdue: ${overdueCount}`}
              color="error"
            />
          )}
        </Stack>
      </Paper>

      {/* LOADING */}

      {loading && tasks.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
          }}
        >
          <AssignmentOutlinedIcon
            sx={{
              fontSize: 52,
              color: "#94a3b8",
              mb: 1,
            }}
          />

          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ color: "#334155" }}
          >
            No active delegation tasks
          </Typography>

          <Typography
            variant="body2"
            sx={{ mt: 0.7, color: "#64748b" }}
          >
            You currently don't have any pending delegation tasks.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={1.5}>
          {tasks.map((task) => {
            const taskID = String(task.id);

            const isCompleted = completedTaskIds.has(taskID);
            const isCompleting = completingTaskId === taskID;

            const dateStatus = getTaskDateStatus(task.due_date);

            const isOverdue = dateStatus === "overdue";
            const isDueToday = dateStatus === "today";

            let borderColor = "#e2e8f0";
            let background = "#ffffff";

            if (isDueToday) {
              borderColor = "#f59e0b";
              background = "#fffbeb";
            }

            if (isOverdue) {
              borderColor = "#ef4444";
              background = "#fef2f2";
            }

            if (isCompleted) {
              borderColor = "#86efac";
              background = "#f0fdf4";
            }

            return (
              <Paper
                key={taskID}
                elevation={0}
                sx={{
                  p: { xs: 1.8, sm: 2.2 },
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor,
                  bgcolor: background,
                  transition: "all 0.2s ease",
                }}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "stretch", md: "center" }}
                  gap={2}
                >
                  {/* TASK DETAILS */}

                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          bgcolor: isCompleted
                            ? "#16a34a"
                            : isOverdue
                              ? "#fee2e2"
                              : isDueToday
                                ? "#fef3c7"
                                : "#eff6ff",
                          color: isCompleted
                            ? "#ffffff"
                            : isOverdue
                              ? "#dc2626"
                              : isDueToday
                                ? "#d97706"
                                : "#2563eb",
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircleOutlineIcon />
                        ) : (
                          <AssignmentOutlinedIcon />
                        )}
                      </Box>

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          flexWrap="wrap"
                        >
                          <Typography
                            fontWeight={800}
                            sx={{
                              color: isCompleted ? "#166534" : "#1e293b",
                              textDecoration: isCompleted
                                ? "line-through"
                                : "none",
                              wordBreak: "break-word",
                            }}
                          >
                            {task.description || "Delegation Task"}
                          </Typography>

                          <Chip
                            size="small"
                            label={
                              isCompleted ? "COMPLETED" : "DELEGATION"
                            }
                            color={isCompleted ? "success" : "primary"}
                            variant={isCompleted ? "filled" : "outlined"}
                            sx={{
                              height: 23,
                              fontSize: "0.7rem",
                              fontWeight: 700,
                            }}
                          />
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          sx={{ mt: 1 }}
                        >
                          <Chip
                            size="small"
                            label={`Task ID: ${taskID}`}
                            variant="outlined"
                            sx={{ height: 24, fontSize: "0.7rem" }}
                          />

                          {task.department && (
                            <Chip
                              size="small"
                              label={`Department: ${task.department}`}
                              variant="outlined"
                              sx={{ height: 24, fontSize: "0.7rem" }}
                            />
                          )}
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>

                  {/* DUE DATE + COMPLETE BUTTON */}

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.2}
                    alignItems={{ xs: "stretch", sm: "center" }}
                  >
                    <Box
                      sx={{
                        minWidth: { xs: "100%", sm: 155 },
                        px: 1.5,
                        py: 1,
                        borderRadius: 2,
                        bgcolor: isCompleted
                          ? "#dcfce7"
                          : isOverdue
                            ? "#fee2e2"
                            : isDueToday
                              ? "#fef3c7"
                              : "#f8fafc",
                        border: "1px solid",
                        borderColor: isCompleted
                          ? "#86efac"
                          : isOverdue
                            ? "#fca5a5"
                            : isDueToday
                              ? "#fcd34d"
                              : "#e2e8f0",
                        textAlign: "center",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={0.7}
                        alignItems="center"
                        justifyContent="center"
                      >
                        {isOverdue ? (
                          <ErrorOutlineIcon
                            sx={{ fontSize: 18, color: "#dc2626" }}
                          />
                        ) : (
                          <AccessTimeOutlinedIcon
                            sx={{ fontSize: 18, color: "#64748b" }}
                          />
                        )}

                        <Typography
                          variant="caption"
                          fontWeight={700}
                          sx={{
                            color: isOverdue
                              ? "#dc2626"
                              : isDueToday
                                ? "#b45309"
                                : "#64748b",
                          }}
                        >
                          {isCompleted
                            ? "COMPLETED"
                            : isOverdue
                              ? "OVERDUE"
                              : isDueToday
                                ? "DUE TODAY"
                                : "DUE DATE"}
                        </Typography>
                      </Stack>

                      <Typography
                        fontWeight={800}
                        sx={{
                          mt: 0.2,
                          fontSize: "1rem",
                          color: isOverdue ? "#dc2626" : "#334155",
                        }}
                      >
                        {formatDueDate(task.due_date)}
                      </Typography>
                    </Box>

                    <Button
                      variant={isCompleted ? "outlined" : "contained"}
                      color={isCompleted ? "success" : "primary"}
                      startIcon={
                        isCompleting ? (
                          <CircularProgress size={17} color="inherit" />
                        ) : (
                          <CheckCircleOutlineIcon />
                        )
                      }
                      disabled={isCompleted || isCompleting}
                      onClick={() => handleCompleteTask(task)}
                      sx={{
                        minWidth: { xs: "100%", sm: 135 },
                        minHeight: 42,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      {isCompleting
                        ? "Completing..."
                        : isCompleted
                          ? "Completed"
                          : "Complete"}
                    </Button>
                  </Stack>
                </Stack>

                {/* DATE WARNINGS */}

                {!isCompleted && isDueToday && (
                  <>
                    <Divider sx={{ my: 1.5 }} />

                    <Alert
                      severity="warning"
                      icon={<WarningAmberOutlinedIcon />}
                      sx={{
                        borderRadius: 2,
                        py: 0,
                        "& .MuiAlert-message": {
                          fontWeight: 600,
                        },
                      }}
                    >
                      This delegation task is due today.
                    </Alert>
                  </>
                )}

                {!isCompleted && isOverdue && (
                  <>
                    <Divider sx={{ my: 1.5 }} />

                    <Alert
                      severity="error"
                      icon={<ErrorOutlineIcon />}
                      sx={{
                        borderRadius: 2,
                        py: 0,
                        "& .MuiAlert-message": {
                          fontWeight: 600,
                        },
                      }}
                    >
                      This delegation task is overdue. Please complete it
                      as soon as possible.
                    </Alert>
                  </>
                )}
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default DelegationTask;
