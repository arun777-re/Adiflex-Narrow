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
// DUMMY EMPLOYEES
// =========================================================
// Baad mein existing Users Redux/API se replace kar denge.



// =========================================================
// INITIAL FORM
// =========================================================

const initialForm = {
  taskName: "",
  taskType: TASK_TYPE.DAILY,
  description: "",
  assignedTo: "",
  department: "",
  priority: "Medium",
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
  return (
    value === true ||
    value === "TRUE" ||
    value === "true"
  );
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

  // =======================================================
  // LOCAL UI STATE
  // =======================================================

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [editingTask, setEditingTask] = useState(null);

  const [form, setForm] = useState(initialForm);

  // =======================================================
  // FETCH TASKS
  // =======================================================

  useEffect(() => {
    dispatch(fetchDailyTasks());
    dispatch(getAllUsersData());
  }, [dispatch]);

  const users = useSelector((state)=> state.auth?.users?.data || []);
  const employees = useMemo(() => {
    return  users?.map((user) => ({
        userId: user.userID,
        name: user.name,
        department: user.division,
        role:user.role
      }));
  }, [users]);

  console.log("👥 Employees:", employees,"Users...",users);

  // =======================================================
  // KPI
  // =======================================================

  const totalTasks = tasks.length;

  const activeTasks = useMemo(
    () =>
      tasks.filter((task) =>
        isTaskActive(task.active)
      ).length,
    [tasks]
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
    }));
  };

  // =======================================================
  // EMPLOYEE CHANGE
  // =======================================================

  const handleEmployeeChange = (userId) => {
    const employee = employees.find(
      (item) => item.userId === userId
    );

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
    });

    setDrawerOpen(true);
  };

  // =======================================================
  // OPEN EDIT
  // =======================================================

  const handleOpenEdit = (task) => {
    setEditingTask(task);

    setForm({
      taskName: task.taskName || "",
      taskType: task.taskType || TASK_TYPE.DAILY,
      description: task.description || "",
      assignedTo: task.assignedTo || "",
      department: task.department || "",
      priority: task.priority || "Medium",
      dueTime: task.dueTime || "",
      active: isTaskActive(task.active),
    });

    setDrawerOpen(true);
  };

  // =======================================================
  // CREATE / UPDATE
  // =======================================================

const handleSubmit = async () => {
  if (!form.taskName.trim()) {
    return;
  }

  if (!form.assignedTo) {
    return;
  }

  try {
    // =========================================================
    // COMMON TASK DATA
    // =========================================================

    const taskData = {
      taskName: form.taskName.trim(),
      taskType: form.taskType,
      description: form.description.trim(),
      assignedTo: form.assignedTo,

      // IMPORTANT:
      // Yahan logged-in user ki actual ID deni hai.
      // Field confirm karne ke baad exact kar denge.
      assignedBy: authUser?.userId,

      department: form.department,
      priority: form.priority,
      dueTime: form.dueTime,
      active: form.active,
    };

    // =========================================================
    // CREATE
    // =========================================================

    if (!editingTask) {
      await dispatch(
        createDailyTask(taskData)
      ).unwrap();
    }

    // =========================================================
    // UPDATE
    // =========================================================

    else {
      await dispatch(
        updateDailyTask({
          taskId: editingTask.taskId,
          taskData,
        })
      ).unwrap();
    }

    // =========================================================
    // REFRESH
    // =========================================================

    dispatch(fetchDailyTasks());

    // =========================================================
    // RESET
    // =========================================================

    setDrawerOpen(false);
    setEditingTask(null);
    setForm(initialForm);

  } catch (error) {
    console.error(
      "Daily Task submit error:",
      error
    );
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
  // RENDER
  // =======================================================

  return (
    <Box sx={{ p: 3 }}>

      {/* =================================================
          HEADER
      ================================================= */}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
          >
            Task Management
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage recurring daily tasks and delegated
            employee tasks
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

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        {/* TOTAL */}

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            sx={{
              p: 2.5,
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
                  Total Tasks
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ mt: 0.5 }}
                >
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
              p: 2.5,
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
                  Active Tasks
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ mt: 0.5 }}
                >
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
              p: 2.5,
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
                  Inactive Tasks
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ mt: 0.5 }}
                >
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
        <Box sx={{ p: 2.5 }}>
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Tasks
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage recurring daily tasks and one-time
            delegated tasks.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ overflowX: "auto" }}>

          <Box sx={{ minWidth: 1050 }}>

            {/* TABLE HEADER */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "100px 1.5fr 120px 140px 130px 100px 90px 70px",
                alignItems: "center",
                px: 2,
                py: 1.5,
                bgcolor: "action.hover",
              }}
            >
              <Typography
                variant="caption"
                fontWeight={700}
              >
                TASK ID
              </Typography>

              <Typography
                variant="caption"
                fontWeight={700}
              >
                TASK
              </Typography>

              <Typography
                variant="caption"
                fontWeight={700}
              >
                TYPE
              </Typography>

              <Typography
                variant="caption"
                fontWeight={700}
              >
                ASSIGNED TO
              </Typography>

              <Typography
                variant="caption"
                fontWeight={700}
              >
                DEPARTMENT
              </Typography>

              <Typography
                variant="caption"
                fontWeight={700}
              >
                PRIORITY
              </Typography>

              <Typography
                variant="caption"
                fontWeight={700}
              >
                STATUS
              </Typography>

              <Typography
                variant="caption"
                fontWeight={700}
                textAlign="center"
              >
                ACTION
              </Typography>
            </Box>

            {/* LOADING */}

            {loading && (
              <Box sx={{ p: 3 }}>
                <Typography
                  color="text.secondary"
                  textAlign="center"
                >
                  Loading tasks...
                </Typography>
              </Box>
            )}

            {/* EMPTY */}

            {!loading && tasks.length === 0 && (
              <Box sx={{ p: 4 }}>
                <Typography
                  color="text.secondary"
                  textAlign="center"
                >
                  No tasks found.
                </Typography>
              </Box>
            )}

            {/* TASK ROWS */}

            {!loading &&
              tasks.map((task) => {
                const active = isTaskActive(
                  task.active
                );

                const employee = employees.find(
                  (item) =>
                    item.userId === task.assignedTo
                );

                return (
                  <Box
                    key={task.taskId}
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "100px 1.5fr 120px 140px 130px 100px 90px 70px",
                      alignItems: "center",
                      px: 2,
                      py: 1.5,
                      borderTop: "1px solid",
                      borderColor: "divider",

                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    {/* TASK ID */}

                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {task.taskId}
                    </Typography>

                    {/* TASK */}

                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {task.taskName}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {task.description || "--"}
                      </Typography>
                    </Box>

                    {/* TYPE */}

                    <Chip
                      size="small"
                      label={
                        task.taskType ===
                        TASK_TYPE.DELEGATION
                          ? "Delegation"
                          : "Daily"
                      }
                      color={
                        task.taskType ===
                        TASK_TYPE.DELEGATION
                          ? "warning"
                          : "info"
                      }
                      variant="outlined"
                    />

                    {/* ASSIGNED TO */}

                    <Typography variant="body2">
                      {employee?.name ||
                        task.assignedTo ||
                        "--"}
                    </Typography>

                    {/* DEPARTMENT */}

                    <Typography variant="body2">
                      {task.department || "--"}
                    </Typography>

                    {/* PRIORITY */}

                    <Chip
                      size="small"
                      label={
                        task.priority || "Medium"
                      }
                      color={
                        priorityColor[
                          task.priority
                        ] || "default"
                      }
                    />

                    {/* STATUS */}

                    <Chip
                      size="small"
                      label={
                        active
                          ? "Active"
                          : "Inactive"
                      }
                      color={
                        active
                          ? "success"
                          : "default"
                      }
                      variant={
                        active
                          ? "filled"
                          : "outlined"
                      }
                    />

                    {/* ACTION */}

                    <Stack
                      direction="row"
                      justifyContent="center"
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleOpenEdit(task)
                        }
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                );
              })}
          </Box>
        </Box>
      </Paper>

      {/* =================================================
          CREATE / EDIT DRAWER
      ================================================= */}

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
      >
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

          <Typography
            variant="h6"
            fontWeight={700}
          >
            {editingTask
              ? "Edit Task"
              : "Create Task"}
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

            {/* TASK TYPE */}

            <TextField
              select
              label="Task Type"
              fullWidth
              value={form.taskType}
              onChange={(e) =>
                handleTaskTypeChange(
                  e.target.value
                )
              }
            >
              <MenuItem value={TASK_TYPE.DAILY}>
                Daily Task
              </MenuItem>

              <MenuItem
                value={TASK_TYPE.DELEGATION}
              >
                Delegation Task
              </MenuItem>
            </TextField>

            {/* DESCRIPTION */}

            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={3}
              value={form.description}
              onChange={(e) =>
                handleChange(
                  "description",
                  e.target.value
                )
              }
            />

            {/* ASSIGNED TO */}

            <TextField
              select
              label="Assigned To"
              required
              fullWidth
              value={form.assignedTo}
              onChange={(e) =>
                handleEmployeeChange(
                  e.target.value
                )
              }
            >
              {employees.map((employee) => (
                <MenuItem
                  key={employee.userId}
                  value={employee.userId}
                >
                  {employee.name} (
                  {employee.userId})
                </MenuItem>
              ))}
            </TextField>

            {/* DEPARTMENT */}

            <TextField
              label="Department"
              fullWidth
              value={form.department}
              InputProps={{
                readOnly: true,
              }}
            />

            {/* PRIORITY */}

            <TextField
              select
              label="Priority"
              fullWidth
              value={form.priority}
              onChange={(e) =>
                handleChange(
                  "priority",
                  e.target.value
                )
              }
            >
              <MenuItem value="Low">
                Low
              </MenuItem>

              <MenuItem value="Medium">
                Medium
              </MenuItem>

              <MenuItem value="High">
                High
              </MenuItem>

              <MenuItem value="Urgent">
                Urgent
              </MenuItem>
            </TextField>

            {/* DUE TIME */}

            <TextField
              label="Due Time"
              type="time"
              fullWidth
              value={form.dueTime}
              onChange={(e) =>
                handleChange(
                  "dueTime",
                  e.target.value
                )
              }
              InputLabelProps={{
                shrink: true,
              }}
            />

            {/* ACTIVE */}

            <FormControlLabel
              control={
                <Switch
                  checked={form.active}
                  onChange={(e) =>
                    handleChange(
                      "active",
                      e.target.checked
                    )
                  }
                />
              }
              label={
                form.taskType ===
                TASK_TYPE.DELEGATION
                  ? "Active Task"
                  : "Active Recurring Task"
              }
            />

            <Divider />

            {/* ACTIONS */}

            <Stack
              direction="row"
              spacing={1.5}
              justifyContent="flex-end"
            >
              <Button
                variant="outlined"
                onClick={handleCloseDrawer}
                disabled={
                  creating || updating
                }
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={
                  creating || updating
                }
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