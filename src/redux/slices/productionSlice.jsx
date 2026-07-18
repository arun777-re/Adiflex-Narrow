import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getProductionByProcess,
  startProductionProcess,
  completeProductionProcess,
  updateWastage,
} from "../../services/productionApi";


// fetch production by process 

export const fetchProductionByProcess =
  createAsyncThunk(
    "production/fetchProductionByProcess",

    async (process, thunkAPI) => {

      try {

        const data =
          await getProductionByProcess(process);

        console.log(
          "Production data:",
          data.data
        );

        return data.data;

      } catch (error) {

        return thunkAPI.rejectWithValue(

          error.response?.data?.message ||
          error.message

        );

      }

    }
  );


// =====================================================
// START PRODUCTION PROCESS
// =====================================================

export const startProduction =
  createAsyncThunk(

    "production/startProduction",

    async (payload, thunkAPI) => {

      try {

        const data =
          await startProductionProcess(
            payload
          );

        return data;

      } catch (error) {

        return thunkAPI.rejectWithValue(

          error.response?.data?.message ||
          error.message

        );

      }

    }

  );


// =====================================================
// COMPLETE PRODUCTION PROCESS
// =====================================================

export const completeProduction =
  createAsyncThunk(

    "production/completeProduction",

    async (payload, thunkAPI) => {

      try {

        const data =
          await completeProductionProcess(
            payload
          );

        return data;

      } catch (error) {

        return thunkAPI.rejectWithValue(

          error.response?.data?.message ||
          error.message

        );

      }

    }

  );


// =====================================================
// UPDATE WASTAGE
// =====================================================

export const updateProductionWastage =
  createAsyncThunk(

    "production/updateProductionWastage",

    async (payload, thunkAPI) => {

      try {

        const data =
          await updateWastage(
            payload
          );

        return data;

      } catch (error) {

        return thunkAPI.rejectWithValue(

          error.response?.data?.message ||
          error.message

        );

      }

    }

  );


// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {

  productionOrders: [],

  loading: false,

  starting: false,

  completing: false,

  updating: false,

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

        }

      )


      .addCase(

        fetchProductionByProcess.fulfilled,

        (state, action) => {

          state.loading = false;

          state.productionOrders =
            action.payload;

        }

      )


      .addCase(

        fetchProductionByProcess.rejected,

        (state, action) => {

          state.loading = false;

          state.error =
            action.payload;

        }

      )


      // ==========================================
      // START PROCESS
      // ==========================================

      .addCase(

        startProduction.pending,

        (state) => {

          state.starting = true;

          state.error = null;

        }

      )


      .addCase(

        startProduction.fulfilled,

        (state) => {

          state.starting = false;

        }

      )


      .addCase(

        startProduction.rejected,

        (state, action) => {

          state.starting = false;

          state.error =
            action.payload;

        }

      )


      // ==========================================
      // COMPLETE PROCESS
      // ==========================================

      .addCase(

        completeProduction.pending,

        (state) => {

          state.completing = true;

          state.error = null;

        }

      )


      .addCase(

        completeProduction.fulfilled,

        (state) => {

          state.completing = false;

        }

      )


      .addCase(

        completeProduction.rejected,

        (state, action) => {

          state.completing = false;

          state.error =
            action.payload;

        }

      )


      // ==========================================
      // UPDATE WASTAGE
      // ==========================================

      .addCase(

        updateProductionWastage.pending,

        (state) => {

          state.updating = true;

          state.error = null;

        }

      )


      .addCase(

        updateProductionWastage.fulfilled,

        (state) => {

          state.updating = false;

        }

      )


      .addCase(

        updateProductionWastage.rejected,

        (state, action) => {

          state.updating = false;

          state.error =
            action.payload;

        }

      );

  },

});


export const {
  clearProductionError,
} = productionSlice.actions;


export default productionSlice.reducer;