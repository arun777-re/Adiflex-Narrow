import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/daily-tasks`;

// =========================================================
// GET ALL DAILY / RECURRING TASKS
// =========================================================

export const fetchDailyTasks = createAsyncThunk(
  "dailyTask/fetchDailyTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/get`);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch daily tasks",
      );
    }
  },
);

// =========================================================
// CREATE DAILY / RECURRING TASK
// =========================================================

export const createDailyTask = createAsyncThunk(
  "dailyTask/createDailyTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/create`,
        taskData,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create task",
      );
    }
  },
);

// =========================================================
// UPDATE DAILY / RECURRING TASK
// =========================================================

export const updateDailyTask = createAsyncThunk(
  "dailyTask/updateDailyTask",
  async ({ taskId, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/update/${taskId}`,
        updates,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update task",
      );
    }
  },
);

// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {
  tasks: [],
  loading: false,
  creating: false,
  updating: false,
  error: null,
  success: false,
  message: "",
};

// =========================================================
// SLICE
// =========================================================

const dailyTaskSlice = createSlice({
  name: "dailyTask",
  initialState,

  reducers: {
    clearDailyTaskError: (state) => {
      state.error = null;
    },

    clearDailyTaskSuccess: (state) => {
      state.success = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    // =====================================================
    // FETCH
    // =====================================================

    builder
      .addCase(fetchDailyTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchDailyTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload?.data || action.payload || [];
      })

      .addCase(fetchDailyTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // =====================================================
    // CREATE
    // =====================================================

    builder
      .addCase(createDailyTask.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createDailyTask.fulfilled, (state, action) => {
        state.creating = false;
        state.success = true;

        state.message =
          action.payload?.message || "Task created successfully";

        const newTask = action.payload?.data;

        if (newTask) {
          state.tasks.push(newTask);
        }
      })

      .addCase(createDailyTask.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
        state.success = false;
      });

    // =====================================================
    // UPDATE
    // =====================================================

    builder
      .addCase(updateDailyTask.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.success = false;
      })

      .addCase(updateDailyTask.fulfilled, (state, action) => {
        state.updating = false;
        state.success = true;

        state.message =
          action.payload?.message || "Task updated successfully";

        const updatedTask = action.payload?.data;

        if (updatedTask) {
          const index = state.tasks.findIndex(
            (task) => task.taskId === updatedTask.taskId,
          );

          if (index !== -1) {
            state.tasks[index] = updatedTask;
          }
        }
      })

      .addCase(updateDailyTask.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const {
  clearDailyTaskError,
  clearDailyTaskSuccess,
} = dailyTaskSlice.actions;

export default dailyTaskSlice.reducer;