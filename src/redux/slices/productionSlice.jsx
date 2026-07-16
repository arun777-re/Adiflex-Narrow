import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProductionByProcess,
  updateProductionProcess,
  updateWastage,
} from "../../services/productionApi";

// ================= Fetch Production Orders =================

export const fetchProductionByProcess = createAsyncThunk(
  "production/fetchProductionByProcess",
  async (process, thunkAPI) => {
    try {
      const data = await getProductionByProcess(process);
      console.log("data coming to slice:",data)
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ================= Update Process =================

export const updateProduction = createAsyncThunk(
  "production/updateProduction",
  async (payload, thunkAPI) => {
    try {
      const data = await updateProductionProcess(payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ================= Update Wastage =================

export const updateProductionWastage = createAsyncThunk(
  "production/updateProductionWastage",
  async (payload, thunkAPI) => {
    try {
      const data = await updateWastage(payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ================= Initial State =================

const initialState = {
  productionOrders: [],
  loading: false,
  updating: false,
  error: null,
};

// ================= Slice =================

const productionSlice = createSlice({
  name: "production",
  initialState,
  reducers: {
    clearProductionError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Fetch =================

      .addCase(fetchProductionByProcess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProductionByProcess.fulfilled, (state, action) => {
        state.loading = false;
        state.productionOrders = action.payload;
      })

      .addCase(fetchProductionByProcess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Update Process =================

      .addCase(updateProduction.pending, (state) => {
        state.updating = true;
      })

      .addCase(updateProduction.fulfilled, (state) => {
        state.updating = false;
      })

      .addCase(updateProduction.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // ================= Update Wastage =================

      .addCase(updateProductionWastage.pending, (state) => {
        state.updating = true;
      })

      .addCase(updateProductionWastage.fulfilled, (state) => {
        state.updating = false;
      })

      .addCase(updateProductionWastage.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductionError } = productionSlice.actions;

export default productionSlice.reducer;