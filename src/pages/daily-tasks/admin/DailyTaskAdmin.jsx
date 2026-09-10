import { useEffect, useMemo, useState } from "react";

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
  FormControlLabel,
  Switch,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { useDispatch, useSelector } from "react-redux";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import {
  createDailyTask,
  updateDailyTask,
  fetchDailyTasks,
} from "../../../redux/slices/dailtTask.slice.jsx";

import { getAllUsersData } from "../../../redux/slices/authSlices.jsx";

// =========================================================
// TASK TYPES
// =========================================================

const TASK_TYPE = {
  DAILY: "DAILY",
  DELEGATION: "DELEGATION",
};

// =========================================================
// INITIAL FORM
// =========================================================

const initialForm = {
  taskType: TASK_TYPE.DAILY,
  description: "",
  assignedTo: "",
  department: "",
  taskOrder: "",
  priority: "",
  dueTime: "",
  active: true,
};

// =========================================================
// PRIORITY COLORS
// =========================================================

const priorityColor = {
  Low: "default",
  Medium: "info",
  High: "warning",
  Urgent: "error",
};

// =========================================================
// ACTIVE VALUE HELPER
// =========================================================

const isTaskActive = (value) => {
  return value === true || value === "TRUE" || value === "true";
};

// =========================================================
// COMPONENT
// =========================================================

const DailyTaskAdmin = () => {
  // =======================================================
  // REDUX
  // =======================================================

  const dispatch = useDispatch();

  const {
    tasks = [],
    loading,
    creating,
    updating,
  } = useSelector((state) => state.dailyTask);

  // Logged-in user
  const authUser = useSelector((state) => state.auth?.user?.user);

  // Users
  const users = useSelector((state) => state.auth?.users?.data || []);

  // =======================================================
  // LOCAL UI STATE
  // =======================================================

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [editingTask, setEditingTask] = useState(null);

  const [form, setForm] = useState(initialForm);

  // =======================================================
  // FETCH TASKS + USERS
  // =======================================================

  useEffect(() => {
    dispatch(fetchDailyTasks());
    dispatch(getAllUsersData());
  }, [dispatch]);

  // =======================================================
  // EMPLOYEES
  // =======================================================

  const employees = useMemo(() => {
    return users?.map((user) => ({
      userId: user.userID,
      name: user.name,
      department: user.division,
      role: user.role,
    }));
  }, [users]);

  // =======================================================
  // DEBUG
  // =======================================================

  console.log("👤 Auth User:", authUser);
  console.log("👥 Employees:", employees);
  console.log("📋 Tasks:", tasks);

  // =======================================================
  // KPI
  // =======================================================

  const totalTasks = tasks.length;

  const activeTasks = useMemo(
    () => tasks.filter((task) => isTaskActive(task.active)).length,
    [tasks],
  );

  const inactiveTasks = totalTasks - activeTasks;

  // =======================================================
  // FORM CHANGE
  // =======================================================

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =======================================================
  // TASK TYPE CHANGE
  // =======================================================

  const handleTaskTypeChange = (taskType) => {
    setForm((prev) => ({
      ...prev,
      taskType,

      // Daily ke liye priority nahi
      priority: taskType === TASK_TYPE.DAILY ? "" : prev.priority || "Medium",

      // Delegation ke liye task order nahi
      taskOrder: taskType === TASK_TYPE.DELEGATION ? "" : prev.taskOrder || "",
    }));
  };

  // =======================================================
  // EMPLOYEE CHANGE
  // =======================================================

  const handleEmployeeChange = (userId) => {
    const employee = employees.find((item) => item.userId === userId);

    setForm((prev) => ({
      ...prev,
      assignedTo: userId,
      department: employee?.department || "",
    }));
  };

  // =======================================================
  // OPEN CREATE
  // =======================================================

  const handleOpenCreate = () => {
    setEditingTask(null);

    setForm({
      ...initialForm,
      taskType: TASK_TYPE.DAILY,
      priority: "",
    });

    setDrawerOpen(true);
  };

  // =======================================================
  // OPEN EDIT
  // =======================================================

  const handleOpenEdit = (task) => {
    setEditingTask(task);

    setForm({
      taskType: task.taskType || TASK_TYPE.DAILY,

      description: task.description || "",

      assignedTo: task.assignedTo || "",

      department: task.department || "",

      taskOrder: task.taskOrder || "",

      priority: task.priority || "",

      dueTime: task.dueTime || "",

      active: isTaskActive(task.active),
    });

    setDrawerOpen(true);
  };

  // =======================================================
  // CREATE / UPDATE
  // =======================================================

  const handleSubmit = async () => {
    // Description validation
    if (!form.description.trim()) {
      console.warn("Description is required");
      return;
    }

    // Assigned employee validation
    if (!form.assignedTo) {
      console.warn("Assigned To is required");
      return;
    }

    // Daily task order validation
    if (form.taskType === TASK_TYPE.DAILY && !form.taskOrder) {
      console.warn("Task Order is required for Daily Task");
      return;
    }

    // Delegation priority validation
    if (form.taskType === TASK_TYPE.DELEGATION && !form.priority) {
      console.warn("Priority is required for Delegation Task");
      return;
    }

    try {
      // =====================================================
      // TASK DATA
      // =====================================================

      const taskData = {
        taskType: form.taskType,

        description: form.description.trim(),

        assignedTo: form.assignedTo,

        // Logged-in admin
        assignedBy: authUser?.userId,

        department: form.department,

        // Daily only
        taskOrder: form.taskType === TASK_TYPE.DAILY ? form.taskOrder : "",

        // Delegation only
        priority: form.taskType === TASK_TYPE.DELEGATION ? form.priority : "",

        dueTime: form.dueTime,

        active: form.active,
      };

      console.log("📤 Task Data:", taskData);

      // =====================================================
      // CREATE
      // =====================================================

      if (!editingTask) {
        await dispatch(createDailyTask(taskData)).unwrap();
      }

      // =====================================================
      // UPDATE
      // =====================================================
      else {
        await dispatch(
          updateDailyTask({
            taskId: editingTask.taskId,
            taskData,
          }),
        ).unwrap();
      }

      // =====================================================
      // REFRESH
      // =====================================================

      await dispatch(fetchDailyTasks());

      // =====================================================
      // RESET
      // =====================================================

      setDrawerOpen(false);
      setEditingTask(null);
      setForm(initialForm);
    } catch (error) {
      console.error("❌ Daily Task submit error:", error);
    }
  };

  // =======================================================
  // CLOSE DRAWER
  // =======================================================

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingTask(null);
    setForm(initialForm);
  };

  // =======================================================
  // DATAGRID COLUMNS
  // =======================================================

  const columns = useMemo(
    () => [
      // ===================================================
      // TASK ID
      // ===================================================

      {
        field: "taskId",
        headerName: "TASK ID",
        width: 100,
        sortable: true,
      },

      // ===================================================
      // TASK TYPE
      // ===================================================

      {
        field: "taskType",
        headerName: "TASK TYPE",
        width: 115,

        renderCell: (params) => (
          <Chip
            size="small"
            label={
              params.value === TASK_TYPE.DELEGATION ? "Delegation" : "Daily"
            }
            color={params.value === TASK_TYPE.DELEGATION ? "warning" : "info"}
            variant="outlined"
            sx={{
              height: 24,
              fontSize: "0.7rem",
            }}
          />
        ),
      },

      // ===================================================
      // DESCRIPTION
      // ===================================================

      {
        field: "description",
        headerName: "DESCRIPTION",
        width: 260,
        sortable: true,

        renderCell: (params) => (
          <Typography
            variant="body2"
            fontWeight={600}
            noWrap
            title={params.value || ""}
          >
            {params.value || "--"}
          </Typography>
        ),
      },

      // ===================================================
      // ASSIGNED TO
      // ===================================================

      {
        field: "assignedTo",
        headerName: "ASSIGNED TO",
        width: 155,

        renderCell: (params) => {
          const employee = employees.find(
            (item) => item.userId === params.value,
          );

          return (
            <Box
              sx={{
                overflow: "hidden",
                width: "100%",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                noWrap
                title={employee?.name || params.value || ""}
              >
                {employee?.name || params.value || "--"}
              </Typography>

              {employee?.role && (
                <Typography variant="caption" color="text.secondary" noWrap>
                  {employee.role}
                </Typography>
              )}
            </Box>
          );
        },
      },

      // ===================================================
      // ASSIGNED BY
      // ===================================================

      {
        field: "assignedBy",
        headerName: "ASSIGNED BY",
        width: 120,

        renderCell: (params) => (
          <Typography variant="body2" noWrap title={params.value || ""}>
            {params.value || "--"}
          </Typography>
        ),
      },

      // ===================================================
      // DEPARTMENT
      // ===================================================

      {
        field: "department",
        headerName: "DEPARTMENT",
        width: 120,

        renderCell: (params) => (
          <Typography variant="body2" noWrap title={params.value || ""}>
            {params.value || "--"}
          </Typography>
        ),
      },

      // ===================================================
      // TASK ORDER
      // ===================================================

      {
        field: "taskOrder",
        headerName: "TASK ORDER",
        width: 95,
        align: "center",
        headerAlign: "center",

        renderCell: (params) => {
          if (params.row.taskType !== TASK_TYPE.DAILY) {
            return "--";
          }

          return (
            <Typography variant="body2" fontWeight={700}>
              {params.value || "--"}
            </Typography>
          );
        },
      },

      // ===================================================
      // PRIORITY
      // ===================================================

      {
        field: "priority",
        headerName: "PRIORITY",
        width: 100,

        renderCell: (params) => {
          if (params.row.taskType !== TASK_TYPE.DELEGATION) {
            return "--";
          }

          return (
            <Chip
              size="small"
              label={params.value || "--"}
              color={priorityColor[params.value] || "default"}
              sx={{
                height: 24,
                fontSize: "0.7rem",
              }}
            />
          );
        },
      },

      // ===================================================
      // DUE TIME
      // ===================================================

      {
        field: "dueTime",
        headerName: "DUE TIME",
        width: 90,

        renderCell: (params) => (
          <Typography variant="body2">{params.value || "--"}</Typography>
        ),
      },

      // ===================================================
      // ACTIVE
      // ===================================================

      {
        field: "active",
        headerName: "ACTIVE",
        width: 95,

        renderCell: (params) => {
          const active = isTaskActive(params.value);

          return (
            <Chip
              size="small"
              label={active ? "Active" : "Inactive"}
              color={active ? "success" : "default"}
              variant={active ? "filled" : "outlined"}
              sx={{
                height: 24,
                fontSize: "0.7rem",
              }}
            />
          );
        },
      },

      // ===================================================
      // CREATED AT
      // ===================================================

      {
        field: "createdAt",
        headerName: "CREATED AT",
        width: 155,

        renderCell: (params) => (
          <Typography variant="body2" noWrap title={params.value || ""}>
            {params.value || "--"}
          </Typography>
        ),
      },

      // ===================================================
      // UPDATED AT
      // ===================================================

      {
        field: "updatedAt",
        headerName: "UPDATED AT",
        width: 155,

        renderCell: (params) => (
          <Typography variant="body2" noWrap title={params.value || ""}>
            {params.value || "--"}
          </Typography>
        ),
      },

      // ===================================================
      // ACTION
      // ===================================================

      {
        field: "actions",
        headerName: "ACTION",
        width: 75,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,

        renderCell: (params) => (
          <IconButton size="small" onClick={() => handleOpenEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    [employees],
  );

  // =======================================================
  // DATAGRID ROWS
  // =======================================================

  const rows = useMemo(() => {
    return tasks.map((task) => ({
      ...task,

      // DataGrid requires unique id
      id: task.taskId,
    }));
  }, [tasks]);

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <Box sx={{ p: 3 }}>
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
          <Typography variant="h5" fontWeight={700}>
            Task Management
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage recurring daily tasks and delegated employee tasks
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Create Task
        </Button>
      </Stack>

      {/* =================================================
          KPI CARDS
      ================================================= */}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* TOTAL */}

        <Grid size={{ xs: 12, sm: 4 }}>
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
                  Total Tasks
                </Typography>

                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                  {totalTasks}
                </Typography>
              </Box>

              <TaskAltIcon fontSize="large" />
            </Stack>
          </Paper>
        </Grid>

        {/* ACTIVE */}

        <Grid size={{ xs: 12, sm: 4 }}>
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
                  Active Tasks
                </Typography>

                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                  {activeTasks}
                </Typography>
              </Box>

              <CheckCircleIcon fontSize="large" />
            </Stack>
          </Paper>
        </Grid>

        {/* INACTIVE */}

        <Grid size={{ xs: 12, sm: 4 }}>
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
                  Inactive Tasks
                </Typography>

                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                  {inactiveTasks}
                </Typography>
              </Box>

              <CancelIcon fontSize="large" />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* =================================================
    TASK TABLE
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
          <Typography variant="h6" fontWeight={700}>
            Tasks
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage recurring daily tasks and one-time delegated tasks.
          </Typography>
        </Box>

        <Divider />

        {/* =================================================
      DATAGRID
  ================================================= */}

        <Box
          sx={{
            width: "100%",
            height: 500,
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            rowHeight={42}
            columnHeaderHeight={40}
            hideFooter
            sx={{
              border: 0,

              // DataGrid itself handles both scrolls
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

              // Compact scrollbar
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

      {/* =================================================
          CREATE / EDIT DRAWER
      ================================================= */}

      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
        <Box
          sx={{
            width: {
              xs: "100vw",
              sm: 430,
            },
            p: 3,
          }}
        >
          {/* TITLE */}

          <Typography variant="h6" fontWeight={700}>
            {editingTask ? "Edit Task" : "Create Task"}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              mb: 3,
            }}
          >
            {form.taskType === TASK_TYPE.DELEGATION
              ? "Create a one-time task and assign it to an employee."
              : "Create a recurring task that remains assigned every working day until deactivated."}
          </Typography>

          <Stack spacing={2}>
            {/* =========================================
                TASK TYPE
            ========================================= */}

            <TextField
              select
              label="Task Type"
              fullWidth
              value={form.taskType}
              onChange={(e) => handleTaskTypeChange(e.target.value)}
            >
              <MenuItem value={TASK_TYPE.DAILY}>Daily Task</MenuItem>

              <MenuItem value={TASK_TYPE.DELEGATION}>Delegation Task</MenuItem>
            </TextField>

            {/* =========================================
                DESCRIPTION
            ========================================= */}

            <TextField
              label="Description"
              required
              fullWidth
              multiline
              minRows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />

            {/* =========================================
                ASSIGNED TO
            ========================================= */}

            <TextField
              select
              label="Assigned To"
              required
              fullWidth
              value={form.assignedTo}
              onChange={(e) => handleEmployeeChange(e.target.value)}
            >
              {employees.map((employee) => (
                <MenuItem key={employee.userId} value={employee.userId}>
                  {employee.name} ({employee.userId})
                </MenuItem>
              ))}
            </TextField>

            {/* =========================================
                DEPARTMENT
            ========================================= */}

            <TextField
              label="Department"
              fullWidth
              value={form.department}
              InputProps={{
                readOnly: true,
              }}
            />

            {/* =========================================
                TASK ORDER - DAILY ONLY
            ========================================= */}

            {form.taskType === TASK_TYPE.DAILY && (
              <TextField
                label="Task Order"
                type="number"
                required
                fullWidth
                value={form.taskOrder}
                onChange={(e) => handleChange("taskOrder", e.target.value)}
                inputProps={{
                  min: 1,
                }}
                helperText="Sequence in which the daily task should be performed"
              />
            )}

            {/* =========================================
                PRIORITY - DELEGATION ONLY
            ========================================= */}

            {form.taskType === TASK_TYPE.DELEGATION && (
              <TextField
                select
                label="Priority"
                required
                fullWidth
                value={form.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
              >
                <MenuItem value="Low">Low</MenuItem>

                <MenuItem value="Medium">Medium</MenuItem>

                <MenuItem value="High">High</MenuItem>

                <MenuItem value="Urgent">Urgent</MenuItem>
              </TextField>
            )}

            {/* =========================================
                DUE TIME
            ========================================= */}

            <TextField
              label="Due Time"
              type="time"
              fullWidth
              value={form.dueTime}
              onChange={(e) => handleChange("dueTime", e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />

            {/* =========================================
                ACTIVE
            ========================================= */}

            <FormControlLabel
              control={
                <Switch
                  checked={form.active}
                  onChange={(e) => handleChange("active", e.target.checked)}
                />
              }
              label={
                form.taskType === TASK_TYPE.DELEGATION
                  ? "Active Task"
                  : "Active Recurring Task"
              }
            />

            <Divider />

            {/* =========================================
                ACTIONS
            ========================================= */}

            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleCloseDrawer}
                disabled={creating || updating}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={creating || updating}
              >
                {creating
                  ? "Creating..."
                  : updating
                    ? "Updating..."
                    : editingTask
                      ? "Update Task"
                      : "Create Task"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
};

export default DailyTaskAdmin;
