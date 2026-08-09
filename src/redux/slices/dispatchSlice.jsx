import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../services/api";

// =====================================================
// GET ALL DISPATCH
// =====================================================

export const getAllDispatch = createAsyncThunk(
  "dispatch/getAllDispatch",

  async (_, thunkAPI) => {
    try {
      const response = await api.get("/dispatch");

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// =====================================================
// DISPATCH ORDER
// =====================================================

export const dispatchOrder = createAsyncThunk(
  "dispatch/dispatchOrder",

  async (payload, thunkAPI) => {
    try {
      const response = await api.post(
        "/dispatch",

        payload,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  dispatchOrders: [],

  loading: false,

  dispatching: false,

  error: null,

  success: false,
};

// =====================================================
// SLICE
// =====================================================

const dispatchSlice = createSlice({
  name: "dispatch",

  initialState,

  reducers: {
    clearDispatchError: (state) => {
      state.error = null;
    },

    clearDispatchSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    // ==========================================
    // GET ALL
    // ==========================================

    builder

      .addCase(
        getAllDispatch.pending,

        (state) => {
          state.loading = true;

          state.error = null;
        },
      )

      .addCase(
        getAllDispatch.fulfilled,

        (state, action) => {
          state.loading = false;

          state.dispatchOrders = action.payload?.dispatchOrders || [];
        },
      )

      .addCase(
        getAllDispatch.rejected,

        (state, action) => {
          state.loading = false;

          state.error = action.payload;
        },
      );

    // ==========================================
    // DISPATCH ORDER
    // ==========================================

    builder

      .addCase(
        dispatchOrder.pending,

        (state) => {
          state.dispatching = true;

          state.error = null;

          state.success = false;
        },
      )

      .addCase(
        dispatchOrder.fulfilled,

        (state) => {
          state.dispatching = false;

          state.success = true;
        },
      )

      .addCase(
        dispatchOrder.rejected,

        (state, action) => {
          state.dispatching = false;

          state.error = action.payload;
        },
      );
  },
});

export const {
  clearDispatchError,

  clearDispatchSuccess,
} = dispatchSlice.actions;

export default dispatchSlice.reducer;
