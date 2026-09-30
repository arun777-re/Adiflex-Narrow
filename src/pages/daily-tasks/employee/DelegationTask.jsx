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
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  completeDelegationTask,
  getDelegationTasksofEmployee,
  notCompleteDelegationTask,
} from "../../../redux/slices/dailtTask.slice";
import useNotification from '../../../hooks/useNotification';

// ============================================================
// HELPERS
// ============================================================

const getTodayDueTime = (dueTime) => {
  if (!dueTime) return null;

  const [hours, minutes] = String(dueTime).split(":").map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  const now = new Date();

  const due = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0,
    0,
  );

  return due;
};

const getRemainingTime = (dueTime, now) => {
  const due = getTodayDueTime(dueTime);

  if (!due) {
    return {
      totalMs: null,
      label: "--",
      state: "unknown",
    };
  }

  const diff = due.getTime() - now.getTime();

  if (diff <= 0) {
    return {
      totalMs: diff,
      label: "Overdue",
      state: "overdue",
    };
  }

  const totalSeconds = Math.floor(diff / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let label = "";

  if (hours > 0) {
    label = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(2, "0")}`;
  } else {
    label = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  }

  // Warning when 30 minutes or less remain
  const state = diff <= 30 * 60 * 1000 ? "warning" : "normal";

  return {
    totalMs: diff,
    label,
    state,
  };
};

// ============================================================
// COMPONENT
// ============================================================

const DelegationTask = () => {
  const dispatch = useDispatch();

  const { userID, name } = useSelector((state) => state.auth?.user?.user);

  const employeeTasksState = useSelector(
    (state) => state.dailyTask?.delegationTasks,
  );

  const reduxTasks = employeeTasksState?.data || employeeTasksState || [];

  const [loading, setLoading] = useState(false);

  const [completingTaskId, setCompletingTaskId] = useState(null);

  const [completedTaskIds, setCompletedTaskIds] = useState(new Set());

  // Prevent same expired task from firing multiple times
  const [processingExpiredTaskIds, setProcessingExpiredTaskIds] = useState(
    new Set(),
  );

  const [now, setNow] = useState(new Date());

  // ============================================================
  // FETCH TASKS
  // ============================================================

  const fetchDelegationTasks = useCallback(async () => {
    if (!userID) return;

    try {
      setLoading(true);

      await dispatch(getDelegationTasksofEmployee({ userID })).unwrap();
    } catch (error) {
      console.error("❌ Failed to fetch delegation tasks:", error);

      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to load delegation tasks",
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch, userID]);


  useNotification({
    refetch:fetchDelegationTasks
  });


  // ============================================================
  // INITIAL FETCH
  // ============================================================

  useEffect(() => {
    fetchDelegationTasks();
  }, [fetchDelegationTasks]);

  // ============================================================
  // LIVE TIMER
  // ============================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ============================================================
  // NORMALIZE TASK DATA
  // ============================================================

  const tasks = useMemo(() => {
    if (!Array.isArray(reduxTasks)) {
      return [];
    }

    return reduxTasks.filter((task) => {
      const status = String(task?.status || "")
        .trim()
        .toLowerCase();

      return status === "pending" || status === "active";
    });
  }, [reduxTasks]);

  // ============================================================
  // COMPLETE TASK
  // ============================================================

  const handleCompleteTask = async (task) => {
    const taskID = task?.taskID;

    if (!taskID) {
      toast.error("Task ID is missing");
      return;
    }

    if (completingTaskId === taskID) {
      return;
    }

    if (completedTaskIds.has(taskID)) {
      return;
    }

    try {
      setCompletingTaskId(taskID);

      await dispatch(
        completeDelegationTask({
          userID,
          taskID,
          userName: name,
        }),
      ).unwrap();

      setCompletedTaskIds((prev) => {
        const next = new Set(prev);
        next.add(taskID);
        return next;
      });

      toast.success("Delegation task completed successfully");

      await fetchDelegationTasks();
    } catch (error) {
      console.error("❌ Complete delegation task error:", error);

      toast.error(error?.message || "Failed to complete delegation task");
    } finally {
      setCompletingTaskId(null);
    }
  };

  // ============================================================
  // TASK COUNTS
  // ============================================================

  const pendingCount = tasks.filter(
    (task) => !completedTaskIds.has(task.taskID),
  ).length;

  const warningCount = tasks.filter((task) => {
    if (completedTaskIds.has(task.taskID)) {
      return false;
    }

    return getRemainingTime(task.dueTime, now).state === "warning";
  }).length;

  const overdueCount = tasks.filter((task) => {
    if (completedTaskIds.has(task.taskID)) {
      return false;
    }

    return getRemainingTime(task.dueTime, now).state === "overdue";
  }).length;

  // ============================================================
  // AUTO NOT COMPLETED WHEN TIME ENDS
  // ============================================================

  useEffect(() => {
    if (!userID || !tasks.length) return;

    const expiredTasks = tasks.filter((task) => {
      const taskID = task?.taskID;

      if (!taskID) {
        return false;
      }

      const timer = getRemainingTime(task.dueTime, now);

      return (
        timer.state === "overdue" &&
        !completedTaskIds.has(taskID) &&
        !processingExpiredTaskIds.has(taskID)
      );
    });

    if (!expiredTasks.length) {
      return;
    }

    expiredTasks.forEach(async (task) => {
      const taskID = task?.taskID;

      if (!taskID) {
        return;
      }

      try {
        // ======================================================
        // MARK AS PROCESSING FIRST
        // Prevent duplicate API calls
        // ======================================================

        setProcessingExpiredTaskIds((prev) => {
          const next = new Set(prev);
          next.add(taskID);
          return next;
        });

        // ======================================================
        // CALL NOT COMPLETED API
        // ======================================================

        await dispatch(
          notCompleteDelegationTask({
            userID,
            taskID,
            userName: name,
          }),
        ).unwrap();

        // ======================================================
        // MARK LOCALLY AS COMPLETED/PROCESSED
        // So it won't fire again
        // ======================================================

        setCompletedTaskIds((prev) => {
          const next = new Set(prev);
          next.add(taskID);
          return next;
        });

        toast.error(
          `Task "${task.description || taskID}" was not completed on time`,
        );

        // ======================================================
        // REFRESH TASKS
        // ======================================================

        await fetchDelegationTasks();
      } catch (error) {
        console.error("❌ Not completed delegation task error:", error);

        // If API failed, allow retry on next timer tick
        setProcessingExpiredTaskIds((prev) => {
          const next = new Set(prev);
          next.delete(taskID);
          return next;
        });
      }
    });
  }, [
    now,
    tasks,
    userID,
    name,
    dispatch,
    completedTaskIds,
    processingExpiredTaskIds,
    fetchDelegationTasks,
  ]);

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
      {/* ======================================================
          HEADER
      ====================================================== */}

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
              loading ? <CircularProgress size={16} /> : <RefreshIcon />
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

        {/* ====================================================
            SUMMARY
        ==================================================== */}

        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
          <Chip
            label={`Pending: ${pendingCount}`}
            color="primary"
            variant="outlined"
          />

          {warningCount > 0 && (
            <Chip
              icon={<WarningAmberOutlinedIcon />}
              label={`Warning: ${warningCount}`}
              color="warning"
            />
          )}

          {overdueCount > 0 && (
            <Chip
              icon={<ErrorOutlineOutlinedIcon />}
              label={`Overdue: ${overdueCount}`}
              color="error"
            />
          )}
        </Stack>
      </Paper>

      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && tasks.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        // ======================================================
        // NO TASKS
        // ======================================================

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

          <Typography variant="h6" fontWeight={700} sx={{ color: "#334155" }}>
            No active delegation tasks
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.7,
              color: "#64748b",
            }}
          >
            You currently don't have any pending delegation tasks.
          </Typography>
        </Paper>
      ) : (
        // ======================================================
        // TASK LIST
        // ======================================================

        <Stack spacing={1.5}>
          {tasks.map((task) => {
            const taskID = task.taskID;

            const isCompleted = completedTaskIds.has(taskID);

            const isCompleting = completingTaskId === taskID;

            const timer = getRemainingTime(task.dueTime, now);

            const isWarning = timer.state === "warning";

            const isOverdue = timer.state === "overdue";

            let borderColor = "#e2e8f0";
            let background = "#ffffff";

            if (isWarning) {
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
                  direction={{
                    xs: "column",
                    md: "row",
                  }}
                  justifyContent="space-between"
                  alignItems={{
                    xs: "stretch",
                    md: "center",
                  }}
                  gap={2}
                >
                  {/* =================================================
                      LEFT SIDE
                  ================================================= */}

                  <Box
                    sx={{
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
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
                              : isWarning
                                ? "#fef3c7"
                                : "#eff6ff",

                          color: isCompleted
                            ? "#ffffff"
                            : isOverdue
                              ? "#dc2626"
                              : isWarning
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

                      <Box
                        sx={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
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
                            label={isCompleted ? "COMPLETED" : "DELEGATION"}
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
                            label={`Task ID: ${taskID || "--"}`}
                            variant="outlined"
                            sx={{
                              height: 24,
                              fontSize: "0.7rem",
                            }}
                          />

                          {task.priority && (
                            <Chip
                              size="small"
                              label={task.priority}
                              color={
                                String(task.priority).toLowerCase() === "urgent"
                                  ? "error"
                                  : String(task.priority).toLowerCase() ===
                                      "high"
                                    ? "warning"
                                    : "default"
                              }
                              sx={{
                                height: 24,
                                fontSize: "0.7rem",
                                fontWeight: 700,
                              }}
                            />
                          )}

                          {task.assignedBy && (
                            <Chip
                              size="small"
                              label={`By: ${task.assignedBy}`}
                              variant="outlined"
                              sx={{
                                height: 24,
                                fontSize: "0.7rem",
                              }}
                            />
                          )}
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>

                  {/* =================================================
                      TIMER + BUTTON
                  ================================================= */}

                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={1.2}
                    alignItems={{
                      xs: "stretch",
                      sm: "center",
                    }}
                  >
                    {/* TIMER */}

                    <Box
                      sx={{
                        minWidth: {
                          xs: "100%",
                          sm: 145,
                        },
                        px: 1.5,
                        py: 1,
                        borderRadius: 2,

                        bgcolor: isCompleted
                          ? "#dcfce7"
                          : isOverdue
                            ? "#fee2e2"
                            : isWarning
                              ? "#fef3c7"
                              : "#f8fafc",

                        border: "1px solid",

                        borderColor: isCompleted
                          ? "#86efac"
                          : isOverdue
                            ? "#fca5a5"
                            : isWarning
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
                            sx={{
                              fontSize: 18,
                              color: "#dc2626",
                            }}
                          />
                        ) : (
                          <AccessTimeOutlinedIcon
                            sx={{
                              fontSize: 18,
                              color: isWarning ? "#d97706" : "#64748b",
                            }}
                          />
                        )}

                        <Typography
                          variant="caption"
                          fontWeight={700}
                          sx={{
                            color: isOverdue
                              ? "#dc2626"
                              : isWarning
                                ? "#b45309"
                                : "#64748b",
                          }}
                        >
                          {isOverdue
                            ? "OVERDUE"
                            : isWarning
                              ? "TIME RUNNING OUT"
                              : "TIME LEFT"}
                        </Typography>
                      </Stack>

                      <Typography
                        fontWeight={800}
                        sx={{
                          mt: 0.2,
                          fontSize: "1rem",
                          fontVariantNumeric: "tabular-nums",

                          color: isOverdue
                            ? "#dc2626"
                            : isWarning
                              ? "#b45309"
                              : "#334155",
                        }}
                      >
                        {isCompleted ? "Completed" : timer.label}
                      </Typography>

                      {task.dueTime && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#64748b",
                          }}
                        >
                          Due: {task.dueTime}
                        </Typography>
                      )}
                    </Box>

                    {/* COMPLETE BUTTON */}

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
                        minWidth: {
                          xs: "100%",
                          sm: 135,
                        },
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

                {/* =================================================
                    WARNING
                ================================================= */}

                {!isCompleted && isWarning && !isOverdue && (
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
                      This task is due soon. Please complete it before{" "}
                      <strong>{task.dueTime}</strong>.
                    </Alert>
                  </>
                )}

                {/* =================================================
                    OVERDUE WARNING
                ================================================= */}

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
                      This delegation task is overdue. Please complete it as
                      soon as possible.
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
