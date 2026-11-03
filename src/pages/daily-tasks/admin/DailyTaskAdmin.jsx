
import { memo, useCallback, useEffect, useMemo, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Stack,
  Drawer,
  Divider,
  CircularProgress,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  createDailyTask,
  updateDailyTask,
  fetchDailyTasks,
  createDelegationTask,
} from "../../../redux/slices/dailyTask.slice.jsx";

import { getAllUsersData } from "../../../redux/slices/authSlices.jsx";
import ViewScoreOfEmployes from "./ViewScoreOfEmployes.jsx";

const TASK_TYPE = {
  DAILY: "daily_task",
  DELEGATION: "delegation_task",
};

const INITIAL_FORM = {
  taskType: TASK_TYPE.DAILY,
  description: "",
  assignedTo: "",
  department: "",
  dueDate: "",
};

const isTaskActive = (value) =>
  value === true || value === "TRUE" || value === "true";

const formatDate = (value) => {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN");
};

const DailyTaskAdmin = () => {
  const dispatch = useDispatch();

  const {
    tasks = [],
    loading = false,
    creating = false,
    updating = false,
  } = useSelector((state) => state.dailyTask || {});

  const authUser = useSelector((state) => state.auth?.user?.user);
  const users = useSelector((state) => state.auth?.users || []);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewScore, setViewScore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    dispatch(fetchDailyTasks());
    dispatch(getAllUsersData());
  }, [dispatch]);

  const employees = useMemo(() => {
    if (!Array.isArray(users)) return [];

    return users.map((user) => ({
      userId: user?.user_id || "",
      name: user?.name || "",
      department: user?.division || "",
      role: user?.role || "",
    }));
  }, [users]);

  console.log("DailyTaskAdmin Rendered", employees)

  const totalTasks = Array.isArray(tasks) ? tasks.length : 0;

  const activeTasks = useMemo(
    () =>
      tasks.filter((task) =>
        isTaskActive(task.is_active ?? task.active)
      ).length,
    [tasks]
  );

  const inactiveTasks = totalTasks - activeTasks;

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleTaskTypeChange = useCallback((taskType) => {
    setForm((prev) => ({
      ...prev,
      taskType,
      dueDate:
        taskType === TASK_TYPE.DAILY ? "" : prev.dueDate,
    }));
  }, []);

  const handleEmployeeChange = useCallback(
    (userId) => {
      const employee = employees.find(
        (item) => item.userId === userId
      );

      setForm((prev) => ({
        ...prev,
        assignedTo: userId,
        department: employee?.department || "",
      }));
    },
    [employees]
  );

  const handleOpenCreate = useCallback(() => {
    setEditingTask(null);
    setForm({ ...INITIAL_FORM });
    setDrawerOpen(true);
  }, []);

  const handleOpenEdit = useCallback((task) => {
    setEditingTask(task);

    setForm({
      taskType: task.task_type || task.taskType || TASK_TYPE.DAILY,
      description: task.description || "",
      assignedTo: task.user_id || task.assignedTo || "",
      department: task.department || "",
      dueDate: task.due_date
        ? String(task.due_date).slice(0, 10)
        : "",
    });

    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    if (submitting) return;

    setDrawerOpen(false);
    setEditingTask(null);
    setForm({ ...INITIAL_FORM });
  }, [submitting]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;

    const description = form.description.trim();

    if (!description) {
      toast.error("Description is required");
      return;
    }

    if (!form.assignedTo) {
      toast.error("Please select an employee");
      return;
    }

    if (!form.department) {
      toast.error("Department is required");
      return;
    }

    if (
      form.taskType === TASK_TYPE.DELEGATION &&
      !form.dueDate
    ) {
      toast.error("Due date is required for delegation task");
      return;
    }

    const taskData = {
      description,
      department: form.department,
      task_type: form.taskType,
      due_date:
        form.taskType === TASK_TYPE.DELEGATION
          ? form.dueDate
          : null,
      user_id: form.assignedTo,
    };

    try {
      setSubmitting(true);

      if (editingTask) {
        const taskId = editingTask.id ?? editingTask.taskId;

        if (!taskId) {
          throw new Error("Task ID is missing");
        }

        await dispatch(
          updateDailyTask({
            taskId,
            taskData,
          })
        ).unwrap();

        toast.success("Task updated successfully");
      } else {
          await dispatch(createDailyTask(taskData)).unwrap();
        toast.success("Task created successfully");
      }

      await dispatch(fetchDailyTasks()).unwrap();

      setDrawerOpen(false);
      setEditingTask(null);
      setForm({ ...INITIAL_FORM });
    } catch (error) {
      console.error("Task submit error:", error);

      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Unable to save task"
      );
    } finally {
      setSubmitting(false);
    }
  }, [dispatch, editingTask, form, submitting]);

  const rows = useMemo(() => {
    if (!Array.isArray(tasks)) return [];

    return tasks.map((task) => ({
      ...task,
      id: task.id ?? task.taskId,
      taskId: task.id ?? task.taskId,
      taskType: task.task_type ?? task.taskType,
      assignedTo: task.user_id ?? task.assignedTo,
      dueDate: task.due_date ?? task.dueDate,
      effectiveDueDate:
        task.effective_due_date ?? task.effectiveDueDate,
      active: task.is_active ?? task.active,
      createdAt: task.created_at ?? task.createdAt,
    }));
  }, [tasks]);

  const columns = useMemo(
    () => [
      {
        field: "taskId",
        headerName: "TASK ID",
        width: 90,
      },
      {
        field: "taskType",
        headerName: "TASK TYPE",
        width: 140,
        renderCell: (params) => {
          const isDelegation =
            params.value === TASK_TYPE.DELEGATION;

          return (
            <Chip
              size="small"
              label={isDelegation ? "Delegation" : "Daily"}
              color={isDelegation ? "warning" : "info"}
              variant="outlined"
            />
          );
        },
      },
      {
        field: "description",
        headerName: "DESCRIPTION",
        minWidth: 220,
        flex: 1,
      },
      {
        field: "assignedTo",
        headerName: "ASSIGNED TO",
        width: 170,
        renderCell: (params) => {
          const employee = employees.find(
            (item) => item.userId === params.value
          );

          return (
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {employee?.name || params.value || "--"}
              </Typography>
              {employee?.role && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {employee.role}
                </Typography>
              )}
            </Box>
          );
        },
      },
      {
        field: "department",
        headerName: "DEPARTMENT",
        width: 130,
      },
      {
        field: "dueDate",
        headerName: "DUE DATE",
        width: 115,
        renderCell: (params) => {
          if (params.row.taskType === TASK_TYPE.DAILY) {
            return "--";
          }

          return formatDate(
            params.row.effectiveDueDate || params.value
          );
        },
      },
      {
        field: "active",
        headerName: "STATUS",
        width: 110,
        renderCell: (params) => {
          const active = isTaskActive(params.value);

          return (
            <Chip
              size="small"
              label={active ? "Active" : "Inactive"}
              color={active ? "success" : "default"}
              variant={active ? "filled" : "outlined"}
            />
          );
        },
      },
      {
        field: "createdAt",
        headerName: "CREATED AT",
        width: 125,
        renderCell: (params) => formatDate(params.value),
      },
      {
        field: "actions",
        headerName: "ACTION",
        width: 75,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <IconButton
            size="small"
            onClick={() => handleOpenEdit(params.row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    [employees, handleOpenEdit]
  );

  if (viewScore) {
    return (
      <Box sx={{ p: 3 }}>
        <ViewScoreOfEmployes
          onBack={() => setViewScore(false)}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Task Management
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage recurring daily tasks and one-time delegated tasks
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => setViewScore(true)}
          >
            View Score Card
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Create Task
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography color="text.secondary">
                  Total Tasks
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {totalTasks}
                </Typography>
              </Box>
              <TaskAltIcon fontSize="large" />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography color="text.secondary">
                  Active Tasks
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {activeTasks}
                </Typography>
              </Box>
              <CheckCircleIcon fontSize="large" />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography color="text.secondary">
                  Inactive Tasks
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {inactiveTasks}
                </Typography>
              </Box>
              <CancelIcon fontSize="large" />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

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
            Tasks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Daily tasks repeat on working days. Delegation tasks are one-time.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ width: "100%", height: 500 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            rowHeight={48}
            columnHeaderHeight={42}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize: 10,
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
                fontSize: "0.75rem",
              },
              "& .MuiDataGrid-cell": {
                fontSize: "0.8rem",
              },
            }}
          />
        </Box>
      </Paper>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
      >
        <Box
          sx={{
            width: { xs: "100vw", sm: 430 },
            p: 3,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            {editingTask ? "Edit Task" : "Create Task"}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, mb: 3 }}
          >
            {form.taskType === TASK_TYPE.DELEGATION
              ? "Create a one-time task with a deadline."
              : "Create a recurring task for every working day."}
          </Typography>

          <Stack spacing={2}>
            <TextField
              select
              label="Task Type"
              fullWidth
              value={form.taskType}
              disabled={Boolean(editingTask)}
              onChange={(e) =>
                handleTaskTypeChange(e.target.value)
              }
            >
              <MenuItem value={TASK_TYPE.DAILY}>
                Daily Task
              </MenuItem>

              <MenuItem value={TASK_TYPE.DELEGATION}>
                Delegation Task
              </MenuItem>
            </TextField>

            <TextField
              label="Description"
              multiline
              minRows={4}
              fullWidth
              required
              value={form.description}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
              placeholder="Enter task description..."
            />

            <TextField
              select
              label="Assigned To"
              required
              fullWidth
              value={form.assignedTo}
              onChange={(e) =>
                handleEmployeeChange(e.target.value)
              }
            >
              {employees.map((employee) => (
                <MenuItem
                  key={employee.userId}
                  value={employee.userId}
                >
                  {employee.name} ({employee.userId})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Department"
              fullWidth
              value={form.department}
              InputProps={{
                readOnly: true,
              }}
            />

            {form.taskType === TASK_TYPE.DELEGATION && (
              <TextField
                label="Due Date"
                type="date"
                required
                fullWidth
                value={form.dueDate}
                onChange={(e) =>
                  handleChange("dueDate", e.target.value)
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}

            <Divider />

            <Stack
              direction="row"
              spacing={1.5}
              justifyContent="flex-end"
            >
              <Button
                variant="outlined"
                onClick={handleCloseDrawer}
                disabled={submitting}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting || creating || updating}
              >
                {submitting ? (
                  <>
                    <CircularProgress
                      size={18}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    Saving...
                  </>
                ) : editingTask ? (
                  "Update Task"
                ) : (
                  "Create Task"
                )}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
};

export default memo(DailyTaskAdmin);
