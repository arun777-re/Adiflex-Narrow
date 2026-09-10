import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  getDailyTaskEmployees,
  completeDailyTasks,
} from "../../../redux/slices/dailtTask.slice";

import { useDispatch, useSelector } from "react-redux";

const DailyTaskEmployee = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const userID = useSelector((state) => state.auth?.user?.user?.userID);

  // =========================================================
  // FETCH EMPLOYEE TASKS
  // =========================================================

  const fetchEmployeeTasks = async () => {
    if (!userID) return;

    try {
      setLoading(true);
      setError("");

      await dispatch(getDailyTaskEmployees(userID)).unwrap();
    } catch (err) {
      console.error("Failed to fetch employee tasks:", err);
      setError(err || "Failed to fetch daily tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeTasks();
  }, [userID]);

  // =========================================================
  // GET TASKS
  // =========================================================

  const tasks = useSelector(
    (state) => state.dailyTask.employeeTasks?.data || [],
  );

  // =========================================================
  // SORT TASKS
  // =========================================================

  const sortedTasks = useMemo(() => {
    return [...tasks].sort(
      (a, b) => Number(a.taskOrder || 999) - Number(b.taskOrder || 999),
    );
  }, [tasks]);

  const handleCompleteTask = async (taskId) => {
    if (!taskId || !userID) {
      setError("Task ID or User ID is missing");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await dispatch(
        completeDailyTasks({
          taskId,
          userID,
        }),
      ).unwrap();

      // Complete hone ke baad latest tasks dobara fetch
      await dispatch(getDailyTaskEmployees(userID)).unwrap();
    } catch (err) {
      console.error("Failed to complete daily task:", err);

      setError(err || "Failed to complete daily task");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <Box sx={{ p: 2.5 }}>
      {/* HEADER */}

      <Paper
        sx={{
          p: 2.5,
          mb: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              My Daily Tasks
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Complete your assigned tasks for today.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={fetchEmployeeTasks}
            disabled={loading}
          >
            Refresh
          </Button>
        </Stack>
      </Paper>

      {/* ERROR */}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* LOADING */}

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
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            No tasks assigned
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            You don't have any active daily tasks.
          </Typography>
        </Paper>
      ) : (
        // =====================================================
        // TASK LIST
        // =====================================================

        <Stack spacing={1.5}>
          {sortedTasks.map((task, index) => (
            <Paper
              key={task.taskId}
              sx={{
                p: 2,
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
                alignItems={{
                  xs: "stretch",
                  sm: "center",
                }}
                justifyContent="space-between"
                gap={2}
              >
                {/* TASK INFO */}

                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "action.hover",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </Box>

                  <Box>
                    <Typography fontWeight={700}>{task.description}</Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: 0.8 }}>
                      <Chip label={task.taskType} size="small" />

                      {task.dueTime && (
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={task.dueTime}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  </Box>
                </Stack>

                {/* COMPLETE BUTTON */}
                <Button
                  variant="contained"
                  startIcon={<CheckCircleOutlineIcon />}
                  onClick={() => handleCompleteTask(task.taskId)}
                  disabled={loading}
                >
                  Complete
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default DailyTaskEmployee;
