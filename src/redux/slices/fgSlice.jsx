import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getFGAvailableQty,
  consumeFGStock,
  addFGStock,
  allFGInventory,
  updateFGStock,
} from "../../services/fgApi";

// ==========================================
// GET FG AVAILABLE QTY
// ==========================================

export const fetchFGAvailableQty = createAsyncThunk(
  "fg/getAvailableQty",
  async (sku, { rejectWithValue }) => {
    try {
      const response = await getFGAvailableQty(sku);

      console.log("🔥 THUNK RAW RESPONSE:", response);
      console.log("🔥 THUNK RESPONSE DATA:", response?.data);

      return response;

    } catch (error) {
      console.error("❌ THUNK ERROR:", error);

      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const fetchAllFG = createAsyncThunk(
  "fg/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await allFGInventory();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// ==========================================
// CONSUME FG STOCK
// ==========================================

export const consumeFG = createAsyncThunk(
  "fg/consume",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await consumeFGStock(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// ==========================================
// ADD FG STOCK
// ==========================================

export const addFG = createAsyncThunk(
  "fg/add",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await addFGStock(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);


// update fg stock 
export const updateFG = createAsyncThunk("fg/update",
  async({skucode,newFGQty},{rejectWithValue})=>{
    console.log("fgggggfgfgfgfgfgfggf........",newFGQty)
    try {
      const res = await updateFGStock({skucode,newFGQty});
      return res;
    } catch (error) {
       return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
)

const initialState = {
  fgStock: null,

  inventory: [],

  loading: false,

  success: false,

  error: null,
};

const fgSlice = createSlice({
  name: "fg",

  initialState,

  reducers: {
    reducers: {
      clearFGState: (state) => {
        state.loading = false;
        state.success = false;
        state.error = null;
        state.fgStock = null;
        state.inventory = [];
      },
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================================
      // GET FG
      // ==========================================
      .addCase(fetchAllFG.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAllFG.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.inventory = action.payload;
      })

      .addCase(fetchAllFG.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFGAvailableQty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchFGAvailableQty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.fgStock = action.payload;
      })

      .addCase(fetchFGAvailableQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================================
      // CONSUME FG
      // ==========================================

      .addCase(consumeFG.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(consumeFG.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(consumeFG.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================================
      // ADD FG
      // ==========================================

      .addCase(addFG.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addFG.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(addFG.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateFG.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      });
  },
});

export const { clearFGState } = fgSlice.actions;

export default fgSlice.reducer;
