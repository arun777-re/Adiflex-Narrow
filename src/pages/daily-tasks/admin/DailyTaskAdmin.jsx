import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
  createDelegationTask,
} from "../../../redux/slices/dailtTask.slice.jsx";

import { getAllUsersData } from "../../../redux/slices/authSlices.jsx";
import ViewScoreOfEmployes from "./ViewScoreOfEmployes.jsx";

const TASK_TYPE = {
  DAILY: "DAILY",
  DELEGATION: "DELEGATION",
};

const INITIAL_FORM = {
  taskType: TASK_TYPE.DAILY,
  assignedTo: "",
  department: "",
  taskOrder: "",
  priority: "",
  dueTime: "",
  active: true,
};

const priorityColor = {
  Low: "default",
  Medium: "info",
  High: "warning",
  Urgent: "error",
};

const isTaskActive = (value) =>
  value === true ||
  value === "TRUE" ||
  value === "true";

const DailyTaskAdmin = () => {
  const dispatch = useDispatch();

  const { tasks = [], loading, creating, updating } =
    useSelector((state) => state.dailyTask || {});

  const authUser = useSelector(
    (state) => state.auth?.user?.user,
  );

  const users = useSelector(
    (state) => state.auth?.users?.data || [],
  );

  // =========================================================
  // STATE
  // =========================================================

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [viewScore, setViewScore] = useState(false);

  // =========================================================
  // DESCRIPTION IS KEPT OUTSIDE REACT STATE
  // IMPORTANT: typing description will NOT call setForm()
  // =========================================================

  const descriptionRef = useRef(null);

  // =========================================================
  // INITIAL DATA
  // =========================================================

  useEffect(() => {
    dispatch(fetchDailyTasks());
    dispatch(getAllUsersData());
  }, [dispatch]);

  // =========================================================
  // EMPLOYEES
  // =========================================================

  const employees = useMemo(() => {
    if (!Array.isArray(users)) return [];

    return users.map((user) => ({
      userId: user?.userID || "",
      name: user?.name || "",
      department: user?.division || "",
      role: user?.role || "",
    }));
  }, [users]);

  // =========================================================
  // KPI
  // =========================================================

  const totalTasks = Array.isArray(tasks)
    ? tasks.length
    : 0;

  const activeTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return 0;

    return tasks.filter((task) =>
      isTaskActive(task?.active),
    ).length;
  }, [tasks]);

  const inactiveTasks =
    totalTasks - activeTasks;

  // =========================================================
  // NORMAL FORM CHANGE
  // DESCRIPTION IS NEVER SENT HERE
  // =========================================================

  const handleChange = useCallback(
    (field, value) => {
      // Description intentionally bypasses React state.
      if (field === "description") {
        return;
      }

      setForm((prev) => {
        if (prev[field] === value) {
          return prev;
        }

        return {
          ...prev,
          [field]: value,
        };
      });
    },
    [],
  );

  // =========================================================
  // TASK TYPE
  // =========================================================

  const handleTaskTypeChange = useCallback(
    (taskType) => {
      setForm((prev) => {
        const priority =
          taskType === TASK_TYPE.DAILY
            ? ""
            : prev.priority || "Medium";

        const taskOrder =
          taskType === TASK_TYPE.DELEGATION
            ? ""
            : prev.taskOrder || "";

        if (
          prev.taskType === taskType &&
          prev.priority === priority &&
          prev.taskOrder === taskOrder
        ) {
          return prev;
        }

        return {
          ...prev,
          taskType,
          priority,
          taskOrder,
        };
      });
    },
    [],
  );

  // =========================================================
  // EMPLOYEE
  // =========================================================

  const handleEmployeeChange = useCallback(
    (userId) => {
      const employee = employees.find(
        (item) => item.userId === userId,
      );

      const department =
        employee?.department || "";

      setForm((prev) => {
        if (
          prev.assignedTo === userId &&
          prev.department === department
        ) {
          return prev;
        }

        return {
          ...prev,
          assignedTo: userId,
          department,
        };
      });
    },
    [employees],
  );

  // =========================================================
  // CREATE
  // =========================================================

  const handleOpenCreate = useCallback(() => {
    setEditingTask(null);

    setForm({
      ...INITIAL_FORM,
    });

    // Clear uncontrolled textarea manually
    if (descriptionRef.current) {
      descriptionRef.current.value = "";
    }

    setDrawerOpen(true);
  }, []);

  // =========================================================
  // EDIT
  // =========================================================

  const handleOpenEdit = useCallback(
    (task) => {
      if (!task) return;

      setEditingTask(task);

      setForm({
        taskType:
          task.taskType || TASK_TYPE.DAILY,
        assignedTo: task.assignedTo || "",
        department: task.department || "",
        taskOrder: task.taskOrder || "",
        priority: task.priority || "",
        dueTime: task.dueTime || "",
        active: isTaskActive(task.active),
      });

      // Set description without React state
      requestAnimationFrame(() => {
        if (descriptionRef.current) {
          descriptionRef.current.value =
            task.description || "";
        }
      });

      setDrawerOpen(true);
    },
    [],
  );

  // =========================================================
  // CLOSE
  // =========================================================

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setEditingTask(null);

    setForm({
      ...INITIAL_FORM,
    });

    if (descriptionRef.current) {
      descriptionRef.current.value = "";
    }
  }, []);

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = useCallback(async () => {
    const description =
      descriptionRef.current?.value?.trim() || "";

    if (!description) {
      console.warn(
        "Description is required",
      );
      return;
    }

    if (!form.assignedTo) {
      console.warn(
        "Assigned To is required",
      );
      return;
    }

    if (
      form.taskType === TASK_TYPE.DAILY &&
      !form.taskOrder
    ) {
      console.warn(
        "Task Order is required for Daily Task",
      );
      return;
    }

    if (
      form.taskType === TASK_TYPE.DELEGATION &&
      !form.priority
    ) {
      console.warn(
        "Priority is required for Delegation Task",
      );
      return;
    }

    try {
      const taskData = {
        taskType: form.taskType,
        description,
        assignedTo: form.assignedTo,
        assignedBy: authUser?.userId || "",
        department: form.department,

        taskOrder:
          form.taskType === TASK_TYPE.DAILY
            ? form.taskOrder
            : "",

        priority:
          form.taskType === TASK_TYPE.DELEGATION
            ? form.priority
            : "",

        dueTime: form.dueTime,
        active: form.active,
      };

      console.log(
        "📤 Task Data:",
        taskData,
      );

      if (!editingTask) {
        if (
          form.taskType === TASK_TYPE.DAILY
        ) {
          await dispatch(
            createDailyTask(taskData),
          ).unwrap();
        } else {
          await dispatch(
            createDelegationTask(taskData),
          ).unwrap();
        }
      } else {
        await dispatch(
          updateDailyTask({
            taskId: editingTask.taskId,
            taskData,
          }),
        ).unwrap();
      }

      await dispatch(
        fetchDailyTasks(),
      ).unwrap();

      handleCloseDrawer();
    } catch (error) {
      console.error(
        "❌ Daily Task submit error:",
        error,
      );
    }
  }, [
    form,
    authUser,
    editingTask,
    dispatch,
    handleCloseDrawer,
  ]);

  // =========================================================
  // COLUMNS
  // =========================================================

  const columns = useMemo(
    () => [
      {
        field: "taskId",
        headerName: "TASK ID",
        width: 100,
      },

      {
        field: "taskType",
        headerName: "TASK TYPE",
        width: 115,
        renderCell: (params) => (
          <Chip
            size="small"
            label={
              params.value ===
              TASK_TYPE.DELEGATION
                ? "Delegation"
                : "Daily"
            }
            color={
              params.value ===
              TASK_TYPE.DELEGATION
                ? "warning"
                : "info"
            }
            variant="outlined"
            sx={{
              height: 24,
              fontSize: "0.7rem",
            }}
          />
        ),
      },

      {
        field: "description",
        headerName: "DESCRIPTION",
        width: 260,
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

      {
        field: "assignedTo",
        headerName: "ASSIGNED TO",
        width: 155,
        renderCell: (params) => {
          const employee =
            employees.find(
              (item) =>
                item.userId === params.value,
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
                title={
                  employee?.name ||
                  params.value ||
                  ""
                }
              >
                {employee?.name ||
                  params.value ||
                  "--"}
              </Typography>

              {employee?.role && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                >
                  {employee.role}
                </Typography>
              )}
            </Box>
          );
        },
      },

      {
        field: "assignedBy",
        headerName: "ASSIGNED BY",
        width: 120,
        renderCell: (params) => (
          <Typography
            variant="body2"
            noWrap
            title={params.value || ""}
          >
            {params.value || "--"}
          </Typography>
        ),
      },

      {
        field: "department",
        headerName: "DEPARTMENT",
        width: 120,
        renderCell: (params) => (
          <Typography
            variant="body2"
            noWrap
            title={params.value || ""}
          >
            {params.value || "--"}
          </Typography>
        ),
      },

      {
        field: "taskOrder",
        headerName: "TASK ORDER",
        width: 95,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          if (
            params.row.taskType !==
            TASK_TYPE.DAILY
          ) {
            return "--";
          }

          return (
            <Typography
              variant="body2"
              fontWeight={700}
            >
              {params.value || "--"}
            </Typography>
          );
        },
      },

      {
        field: "priority",
        headerName: "PRIORITY",
        width: 100,
        renderCell: (params) => {
          if (
            params.row.taskType !==
            TASK_TYPE.DELEGATION
          ) {
            return "--";
          }

          return (
            <Chip
              size="small"
              label={params.value || "--"}
              color={
                priorityColor[
                  params.value
                ] || "default"
              }
              sx={{
                height: 24,
                fontSize: "0.7rem",
              }}
            />
          );
        },
      },

      {
        field: "dueTime",
        headerName: "DUE TIME",
        width: 90,
        renderCell: (params) => (
          <Typography variant="body2">
            {params.value || "--"}
          </Typography>
        ),
      },

      {
        field: "active",
        headerName: "ACTIVE",
        width: 95,
        renderCell: (params) => {
          const active =
            isTaskActive(params.value);

          return (
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
              sx={{
                height: 24,
                fontSize: "0.7rem",
              }}
            />
          );
        },
      },

      {
        field: "createdAt",
        headerName: "CREATED AT",
        width: 155,
        renderCell: (params) => (
          <Typography
            variant="body2"
            noWrap
            title={params.value || ""}
          >
            {params.value || "--"}
          </Typography>
        ),
      },

      {
        field: "updatedAt",
        headerName: "UPDATED AT",
        width: 155,
        renderCell: (params) => (
          <Typography
            variant="body2"
            noWrap
            title={params.value || ""}
          >
            {params.value || "--"}
          </Typography>
        ),
      },

      {
        field: "actions",
        headerName: "ACTION",
        width: 75,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <IconButton
            size="small"
            onClick={() =>
              handleOpenEdit(params.row)
            }
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    [employees, handleOpenEdit],
  );

  // =========================================================
  // ROWS
  // =========================================================

  const rows = useMemo(() => {
    if (!Array.isArray(tasks)) return [];

    return tasks.map((task) => ({
      ...task,
      id: task.taskId,
    }));
  }, [tasks]);

  // =========================================================
  // SCORE SCREEN
  // =========================================================

  if (viewScore) {
    return (
      <Box sx={{ p: 3 }}>
        <ViewScoreOfEmployes
          onBack={() =>
            setViewScore(false)
          }
        />
      </Box>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}

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
            Manage recurring daily tasks
            and delegated employee tasks
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
        >
          <Button
            variant="outlined"
            onClick={() =>
              setViewScore(true)
            }
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

      {/* KPI */}

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Total Tasks
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {totalTasks}
                </Typography>
              </Box>

              <TaskAltIcon fontSize="large" />
            </Stack>
          </Paper>
        </Grid>

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
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Active Tasks
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {activeTasks}
                </Typography>
              </Box>

              <CheckCircleIcon fontSize="large" />
            </Stack>
          </Paper>
        </Grid>

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
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Inactive Tasks
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {inactiveTasks}
                </Typography>
              </Box>

              <CancelIcon fontSize="large" />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* TABLE */}

      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Tasks
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage recurring daily tasks
            and one-time delegated tasks.
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
            loading={loading}
            disableRowSelectionOnClick
            rowHeight={42}
            columnHeaderHeight={40}
            hideFooter
            sx={{
              border: 0,

              "& .MuiDataGrid-columnHeaders": {
                backgroundColor:
                  "action.hover",
              },

              "& .MuiDataGrid-columnHeaderTitle":
                {
                  fontWeight: 700,
                  fontSize: "0.72rem",
                },

              "& .MuiDataGrid-cell": {
                fontSize: "0.8rem",
              },

              "& .MuiDataGrid-row:hover": {
                backgroundColor:
                  "action.hover",
              },

              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },

              "& .MuiDataGrid-cell:focus-within":
                {
                  outline: "none",
                },
            }}
          />
        </Box>
      </Paper>

      {/* DRAWER */}

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
            {form.taskType ===
            TASK_TYPE.DELEGATION
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
                  e.target.value,
                )
              }
            >
              <MenuItem
                value={TASK_TYPE.DAILY}
              >
                Daily Task
              </MenuItem>

              <MenuItem
                value={TASK_TYPE.DELEGATION}
              >
                Delegation Task
              </MenuItem>
            </TextField>

            {/* DESCRIPTION */}

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Description *
              </Typography>

              <textarea
                ref={descriptionRef}
                defaultValue=""
                rows={4}
                placeholder="Enter task description..."
                style={{
                  width: "100%",
                  minHeight: "110px",
                  padding: "12px",
                  fontSize: "16px",
                  fontFamily: "inherit",
                  border:
                    "1px solid #c4c4c4",
                  borderRadius: "6px",
                  boxSizing: "border-box",
                  resize: "vertical",
                  outline: "none",
                }}
              />
            </Box>

            {/* ASSIGNED TO */}

            <TextField
              select
              label="Assigned To"
              required
              fullWidth
              value={form.assignedTo}
              onChange={(e) =>
                handleEmployeeChange(
                  e.target.value,
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

            {/* TASK ORDER */}

            {form.taskType ===
              TASK_TYPE.DAILY && (
              <TextField
                label="Task Order"
                type="number"
                required
                fullWidth
                value={form.taskOrder}
                onChange={(e) =>
                  handleChange(
                    "taskOrder",
                    e.target.value,
                  )
                }
              />
            )}

            {/* PRIORITY */}

            {form.taskType ===
              TASK_TYPE.DELEGATION && (
              <TextField
                select
                label="Priority"
                required
                fullWidth
                value={form.priority}
                onChange={(e) =>
                  handleChange(
                    "priority",
                    e.target.value,
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
            )}

            {/* DUE TIME */}

            <TextField
              label="Due Time"
              type="time"
              fullWidth
              value={form.dueTime}
              onChange={(e) =>
                handleChange(
                  "dueTime",
                  e.target.value,
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
                      e.target.checked,
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

            {/* BUTTONS */}

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

export default memo(DailyTaskAdmin);
