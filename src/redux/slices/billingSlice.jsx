import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../services/api";

// ==========================================
// GET BILLING ORDERS
// ==========================================
export const getBillingOrders = createAsyncThunk(
  "billing/getBillingOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/billing");
console.log("response from billing slice",response);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch billing orders"
      );
    }
  }
);

// ==========================================
// UPDATE BILLING STATUS
// ==========================================
export const updateBillingStatus = createAsyncThunk(
  "billing/updateBillingStatus",
  async (
    { soNo, skuCode,billingID, status },
    { rejectWithValue }
  ) => {
    console.log("billing payload bhai",{soNo,skuCode,billingID,status});

    try {
      const response = await api.patch("/billing/status", {
        soNo,
        skuCode,
        billingID,
        status,
      });
      return {
        soNo,
        skuCode,
        billingID,
        status,
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to update billing status"
      );
    }
  }
);

// ==========================================
// INITIAL STATE
// ==========================================
const initialState = {
  orders: [],
  loading: false,
  updating: false,
  error: null,
};

// ==========================================
// SLICE
// ==========================================
const billingSlice = createSlice({
  name: "billing",

  initialState,

  reducers: {
    clearBillingError: (state) => {
      state.error = null;
    },

    clearBillingOrders: (state) => {
      state.orders = [];
    },
  },

  extraReducers: (builder) => {
    // ==========================================
    // GET BILLING ORDERS
    // ==========================================
    builder
      .addCase(getBillingOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getBillingOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })

      .addCase(getBillingOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ==========================================
    // UPDATE BILLING STATUS
    // ==========================================
    builder
      .addCase(updateBillingStatus.pending, (state) => {
        state.updating = true;
        state.error = null;
      })

      .addCase(updateBillingStatus.fulfilled, (state, action) => {
        state.updating = false;

        const {
          soNo,
          skuCode,
          billingID,
          status,
        } = action.payload;

        const order = state.orders.find(
          (item) =>
            String(item.soNo).trim() === String(soNo).trim() &&
            String(item.skuCode).trim() === String(skuCode).trim() &&
            String(item.billingID).trim() === String(billingID).trim()
        );

        if (order) {
          order.billing = status;
        }
      })

      .addCase(updateBillingStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearBillingError,
  clearBillingOrders,
} = billingSlice.actions;

export default billingSlice.reducer;