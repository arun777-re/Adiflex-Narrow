import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getSalesOrders,
  createSalesOrder,
  updateSalesOrder,
 
} from "../../services/salesApi";

//  get all sales orders from google sheets 

export const fetchSalesOrders = createAsyncThunk(
  "salesOrders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getSalesOrders();
      return data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// create sales order in google sheets

export const addSalesOrder = createAsyncThunk(
  "salesOrders/create",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createSalesOrder(payload);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ================= UPDATE =================

export const editSalesOrder = createAsyncThunk(
  "salesOrders/update",
  async ({ soNo, payload }, { rejectWithValue }) => {
    try {
      const data = await updateSalesOrder(soNo, payload);
      return data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);



const initialState = {
  salesOrders: [],
  loading: false,
  error: null,
  addSalesOrderSuccess:{},
};

const salesOrderSlice = createSlice({
  name: "salesOrders",

  initialState,

  reducers: {
    clearSalesError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= FETCH =================

      .addCase(fetchSalesOrders.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchSalesOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.salesOrders = action.payload;
      })

      .addCase(fetchSalesOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= CREATE =================

      .addCase(addSalesOrder.pending, (state) => {
        state.loading = true;
      })

      .addCase(addSalesOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.addSalesOrderSuccess = action.payload;
      })

      .addCase(addSalesOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= UPDATE =================

      .addCase(editSalesOrder.pending, (state) => {
        state.loading = true;
      })

      .addCase(editSalesOrder.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.salesOrders.findIndex(
          (item) => item.soNo === action.payload.soNo
        );

        if (index !== -1) {
          state.salesOrders[index] = action.payload;
        }
      })

      .addCase(editSalesOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearSalesError } = salesOrderSlice.actions;

export default salesOrderSlice.reducer;