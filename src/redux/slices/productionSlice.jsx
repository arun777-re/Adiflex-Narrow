import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getProductionByProcess,
  startProductionProcess,
  completeProductionProcess,
  completeQualityWithWastage,
  getAllProduction,
  getAllJobWorkProductionOrders,
} from "../../services/productionApi";

// fetch production orders by process
export const fetchProductionByProcess = createAsyncThunk(
  "production/fetchProductionByProcess",

  async (
    {
      process,
      division,
    },
    thunkAPI
  ) => {

    try {

      const data =
        await getProductionByProcess({

          process,

          division,

        });

      return data.data;

    } catch (error) {

      return thunkAPI.rejectWithValue(

        error.response?.data?.message ||
        error.message

      );

    }

  }

);

// start production process
export const startProduction = createAsyncThunk(
  "production/startProduction",

  async (payload, thunkAPI) => {
    try {
      const data = await startProductionProcess(payload);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// get all production orders
export const getAllProductions = createAsyncThunk(
  "/get-all",
  async (division, thunkAPI) => {
    if(!division){
      throw Error("Division required");
    }
    try {

      console.log("🔥 THUNK DIVISION:", division);

      const data = await getAllProduction(division);

      return data.productionOrders;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
// get all production jobwork orders
export const getAllJobWorkProductions = createAsyncThunk(
  "/get-alljobwork",
  async (division, thunkAPI) => {
    if(!division){
      throw Error("Division required");
    }
    try {

      console.log("🔥 THUNK DIVISION:", division);

      const data = await getAllJobWorkProductionOrders(division);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// complete production process
export const completeProduction = createAsyncThunk(
  "production/completeProduction",

  async (payload, thunkAPI) => {
    try {
      const data = await completeProductionProcess(payload);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// complete quality plus wastage
export const completeQuality = createAsyncThunk(
  "production/completeQuality",

  async (payload, thunkAPI) => {
    try {
      const data = await completeQualityWithWastage(payload);

      return data;
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
  allProductionOrders: [],
  productionOrders: [],
  jobOrders:[],
  loading: false,
  starting: false,
  completing: false,
  completingQuality: false,
  error: null,
};

// =====================================================
// SLICE
// =====================================================

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

      // ==========================================
      // FETCH PRODUCTION
      // ==========================================

      .addCase(
        fetchProductionByProcess.pending,

        (state) => {
          state.loading = true;

          state.error = null;
        },
      )

      .addCase(
        fetchProductionByProcess.fulfilled,

        (state, action) => {
          state.loading = false;

          state.productionOrders = action.payload;
        },
      )

      .addCase(
        fetchProductionByProcess.rejected,

        (state, action) => {
          state.loading = false;

          state.error = action.payload;
        },
      )

      // ==========================================
      // START PROCESS
      // ==========================================

      .addCase(
        startProduction.pending,

        (state) => {
          state.starting = true;

          state.error = null;
        },
      )

      .addCase(
        startProduction.fulfilled,

        (state) => {
          state.starting = false;
        },
      )

      .addCase(
        startProduction.rejected,

        (state, action) => {
          state.starting = false;

          state.error = action.payload;
        },
      )

      // ==========================================
      // COMPLETE NORMAL PROCESS
      // ==========================================

      .addCase(
        completeProduction.pending,

        (state) => {
          state.completing = true;

          state.error = null;
        },
      )

      .addCase(
        completeProduction.fulfilled,

        (state) => {
          state.completing = false;
        },
      )

      .addCase(
        completeProduction.rejected,

        (state, action) => {
          state.completing = false;

          state.error = action.payload;
        },
      )

      // ==========================================
      // COMPLETE QUALITY + WASTAGE
      // ==========================================

      .addCase(
        completeQuality.pending,

        (state) => {
          state.completingQuality = true;

          state.error = null;
        },
      )

      .addCase(
        completeQuality.fulfilled,

        (state) => {
          state.completingQuality = false;
        },
      )

      .addCase(
        completeQuality.rejected,

        (state, action) => {
          state.completingQuality = false;

          state.error = action.payload;
        },
      )
      .addCase(
        getAllProductions.pending,

        (state) => {
          state.allOrdersLoading = true;

          state.error = null;
        },
      )

      .addCase(
        getAllProductions.fulfilled,

        (state, action) => {
          state.allOrdersLoading = false;

          state.allProductionOrders = action.payload;
        },
      )

      .addCase(
        getAllProductions.rejected,

        (state, action) => {
          state.allOrdersLoading = false;

          state.error = action.payload;
        },
      )
      .addCase(
        getAllJobWorkProductions.pending,

        (state) => {
          state.loading = true;

          state.error = null;
        },
      )

      .addCase(
        getAllJobWorkProductions.fulfilled,

        (state, action) => {
          state.loading = false;

          state.jobOrders = action.payload;
        },
      )

      .addCase(
        getAllJobWorkProductions.rejected,

        (state, action) => {
          state.loading = false;

          state.error = action.payload;
        },
      );
  },
});

// =====================================================
// ACTIONS
// =====================================================

export const { clearProductionError } = productionSlice.actions;

// =====================================================
// REDUCER
// =====================================================

export default productionSlice.reducer;
