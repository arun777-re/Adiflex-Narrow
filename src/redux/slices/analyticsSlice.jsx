import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// =========================================================
// GET ANALYTICS SUMMARY
// =========================================================

export const getAnalyticsSummary = createAsyncThunk(
  "analytics/getSummary",
  async ({ period = "all", division = "ALL" } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/analytics/summary`,
        {
          params: {
            period,
            division,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Analytics Summary Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch analytics summary"
      );
    }
  }
);

// =========================================================
// GET ORDERS ANALYTICS
// =========================================================

export const getOrdersAnalytics = createAsyncThunk(
  "analytics/getOrders",
  async ({ period = "all", division = "ALL" } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/analytics/orders`,
        {
          params: {
            period,
            division,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Orders Analytics Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch orders analytics"
      );
    }
  }
);

// =========================================================
// GET SALES ANALYTICS
// =========================================================

export const getSalesAnalytics = createAsyncThunk(
  "analytics/getSales",
  async ({ period = "all", division = "ALL" } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/analytics/sales`,
        {
          params: {
            period,
            division,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Sales Analytics Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch sales analytics"
      );
    }
  }
);

// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {
  summary: {
    ordersReceived: 0,
    ordersCompleted: 0,
    pendingOrders: 0,
    sales: 0,
    previousOrdersReceived: 0,
    previousOrdersCompleted: 0,
    previousPendingOrders: 0,
    previousSales: 0,
  },

  orders: {
    weekly: [],
    division: [],
  },

  sales: {
    weekly: [],
    division: [],
  },

  loading: {
    summary: false,
    orders: false,
    sales: false,
  },

  error: {
    summary: null,
    orders: null,
    sales: null,
  },
};

// =========================================================
// SLICE
// =========================================================

const analyticsSlice = createSlice({
  name: "analytics",

  initialState,

  reducers: {
    clearAnalyticsErrors: (state) => {
      state.error.summary = null;
      state.error.orders = null;
      state.error.sales = null;
    },

    resetAnalytics: () => initialState,
  },

  extraReducers: (builder) => {
    // =====================================================
    // SUMMARY
    // =====================================================

    builder
      .addCase(getAnalyticsSummary.pending, (state) => {
        state.loading.summary = true;
        state.error.summary = null;
      })

      .addCase(getAnalyticsSummary.fulfilled, (state, action) => {
        state.loading.summary = false;
        state.summary = action.payload;
      })

      .addCase(getAnalyticsSummary.rejected, (state, action) => {
        state.loading.summary = false;
        state.error.summary = action.payload;
      });

    // =====================================================
    // ORDERS
    // =====================================================

    builder
      .addCase(getOrdersAnalytics.pending, (state) => {
        state.loading.orders = true;
        state.error.orders = null;
      })

      .addCase(getOrdersAnalytics.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.orders = action.payload;
      })

      .addCase(getOrdersAnalytics.rejected, (state, action) => {
        state.loading.orders = false;
        state.error.orders = action.payload;
      });

    // =====================================================
    // SALES
    // =====================================================

    builder
      .addCase(getSalesAnalytics.pending, (state) => {
        state.loading.sales = true;
        state.error.sales = null;
      })

      .addCase(getSalesAnalytics.fulfilled, (state, action) => {
        state.loading.sales = false;
        state.sales = action.payload;
      })

      .addCase(getSalesAnalytics.rejected, (state, action) => {
        state.loading.sales = false;
        state.error.sales = action.payload;
      });
  },
});

export const {
  clearAnalyticsErrors,
  resetAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;