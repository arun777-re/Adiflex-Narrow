
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

// =========================================================
// GET ALL HOLIDAYS
// GET /holidays/
// =========================================================

export const getAllHolidays = createAsyncThunk(
  "holiday/getAllHolidays",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/holidays/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch holidays"
      );
    }
  }
);

// =========================================================
// CREATE HOLIDAY
// POST /holidays/create
// =========================================================

export const createHoliday = createAsyncThunk(
  "holiday/createHoliday",
  async (holidayData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/holidays/create",
        holidayData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create holiday"
      );
    }
  }
);

// =========================================================
// DELETE HOLIDAY
// DELETE /holidays/delete/:holiday_id
// =========================================================

export const deleteHoliday = createAsyncThunk(
  "holiday/deleteHoliday",
  async (holiday_id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/holidays/delete/${holiday_id}`
      );

      return {
        holiday_id,
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete holiday"
      );
    }
  }
);

// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {
  holidays: [],
  loading: false,
  creating: false,
  deleting: false,
  error: null,
  success: false,
  message: "",
};

// =========================================================
// SLICE
// =========================================================

const holidaySlice = createSlice({
  name: "holiday",
  initialState,

  reducers: {
    clearHolidayError: (state) => {
      state.error = null;
    },

    clearHolidaySuccess: (state) => {
      state.success = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // GET HOLIDAYS
      .addCase(getAllHolidays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllHolidays.fulfilled, (state, action) => {
        state.loading = false;
        state.holidays = action.payload?.data || [];
      })
      .addCase(getAllHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE HOLIDAY
      .addCase(createHoliday.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createHoliday.fulfilled, (state, action) => {
        state.creating = false;
        state.success = true;
        state.message =
          action.payload?.message || "Holiday created successfully";

        if (action.payload?.data) {
          state.holidays.push(action.payload.data);

          state.holidays.sort(
            (a, b) =>
              new Date(a.holiday_date) - new Date(b.holiday_date)
          );
        }
      })
      .addCase(createHoliday.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
        state.success = false;
      })

      // DELETE HOLIDAY
      .addCase(deleteHoliday.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteHoliday.fulfilled, (state, action) => {
        state.deleting = false;
        state.success = true;
        state.message =
          action.payload?.message || "Holiday deleted successfully";

        const deletedId = action.payload.holiday_id;

        state.holidays = state.holidays.filter(
          (holiday) => String(holiday.id) !== String(deletedId)
        );
      })
      .addCase(deleteHoliday.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearHolidayError,
  clearHolidaySuccess,
} = holidaySlice.actions;

export default holidaySlice.reducer;
