import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// =========================================================
// GET ALL ACTIVITIES
// =========================================================

export const getAllActivities = createAsyncThunk(
  "activity/getAllActivities",
  async (date, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/activities/getAll",
        {
          params: {
            date,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching activities:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch activities"
      );
    }
  }
);

// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {
  activities: [],
  loading: false,
  error: null,
};

// =========================================================
// SLICE
// =========================================================

const activitySlice = createSlice({
  name: "activity",
  initialState,

  reducers: {
    clearActivities: (state) => {
      state.activities = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // -----------------------------------------------------
      // GET ALL ACTIVITIES - PENDING
      // -----------------------------------------------------

      .addCase(getAllActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // -----------------------------------------------------
      // GET ALL ACTIVITIES - SUCCESS
      // -----------------------------------------------------

      .addCase(getAllActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.activities || [];
      })

      // -----------------------------------------------------
      // GET ALL ACTIVITIES - FAILED
      // -----------------------------------------------------

      .addCase(getAllActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearActivities } = activitySlice.actions;

export default activitySlice.reducer;