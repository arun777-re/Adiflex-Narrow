import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../services/api";
import { getAllcompletedDispatch } from "../../services/dispatchApi";

// =====================================================
// GET ALL DISPATCH
// =====================================================

export const getAllDispatch = createAsyncThunk(
  "dispatch/getAllDispatch",

  async (_, thunkAPI) => {
    try {
      const response = await api.get("/dispatch");
console.log("response..................",response.data);
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
    console.log("payload from dispatch page.....",payload)
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

export const getAllCompletedDispatchOrders = createAsyncThunk('/dispatch/complete',async(params={},thunkAPI)=>{
  try {
      const response = await getAllcompletedDispatch(params);
       console.log("response in api lala",response);

      return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
  }
})

// =====================================================
// BILLING DONE
// =====================================================

export const billingDone = createAsyncThunk(
  "dispatch/billingDone",

  async (payload, thunkAPI) => {
    try {
      const response = await api.post(
        "/dispatch/billing",
        payload
      );

      return response.data;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);


// confirm-dispatch 
export const confirmDispatchSlice = createAsyncThunk('/confirm-dispatch',async({
  items,vehicleNo,gstNo,gstRate,driverName},{rejectWithValue})=>{
try {
  const response = await api.post('/dispatch/confirm',{
    items,
    vehicleNo,
    driverName,
    gstNo,
    gstRate
  });
  return response.data
} catch (error) {
   return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to confirm dispatch"
      );
}
})
// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  dispatchOrders: [],
  completedDispatchOrders:[],
  loading: false,
  dispatching: false,
  billing:false,
  error: null,
  lastChallan:null,
  success: false,
  completeDispatchPagination:{
    totalRecords:0,
    totalPages:0,
    currentPage:0,
    pageSize:10
  },

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
    clearLastChallan:(state)=>{
      state.lastChallan = null;
    }
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

          state.dispatchOrders = action.payload.data || [];
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
      )
     // ==========================================
// GET COMPLETED DISPATCH ORDERS
// ==========================================


  .addCase(
    getAllCompletedDispatchOrders.pending,
    (state) => {
      state.loading = true;
      state.error = null;
    }
  )

  .addCase(
    getAllCompletedDispatchOrders.fulfilled,
    (state, action) => {
      state.loading = false;

      state.completedDispatchOrders =
        action.payload?.data || [];
    
    state.completeDispatchPagination = action?.payload?.pagination || {
      totalPages:0,
      totalRecords:0,
      currentPage:0,
      pageSize:10,
    }
  })

  .addCase(
    getAllCompletedDispatchOrders.rejected,
    (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  ) 
  //  .addCase(
  //   billingDone.pending,
  //   (state) => {
  //     state.billing = true;
  //     state.error = null;
  //   }
  // )

  // .addCase(
  //   billingDone.fulfilled,
  //   (state, action) => {
  //     state.billing = false;
  //     state.success = true;

  //     const { soNo, skuCode, cycleID } = action.meta.arg;

  //     const index = state.completedDispatchOrders.findIndex(
  //       (order) =>
  //         String(order.soNo).trim() === String(soNo).trim() &&
  //         String(order.skuCode).trim() === String(skuCode).trim() &&
  //         String(order.cycleID || "").trim() === String(cycleID || "").trim()
  //     );

  //     if (index !== -1) {
  //       state.completedDispatchOrders[index].billing = "Done";
  //     }
  //   }
  // )

  // .addCase(
  //   billingDone.rejected,
  //   (state, action) => {
  //     state.billing = false;
  //     state.error = action.payload;
  //   }
  // )
  // Confirm dispatch
      .addCase(confirmDispatchSlice.pending, (state) => {
        state.dispatching = true;
        state.error = null;
      })
      .addCase(confirmDispatchSlice.fulfilled, (state, action) => {
        state.dispatching = false;
        state.lastChallan = action.payload;

        // Remove reservation if no pending dispatch quantity remains.
        // Otherwise update its remaining quantity/status.
        const dispatchedReservationId =
          action.payload?.reservationId ??
          action.payload?.data?.reservationId;

        if (dispatchedReservationId != null) {
          state.pendingDispatches = state.pendingDispatches.filter(
            (item) => item.reservation_id !== dispatchedReservationId
          );
        }
      })
      .addCase(confirmDispatchSlice.rejected, (state, action) => {
        state.dispatching = false;
        state.error = action.payload || "Failed to confirm dispatch";
      });
  },
});

export const {
  clearDispatchError,

  clearDispatchSuccess,
} = dispatchSlice.actions;

export default dispatchSlice.reducer;
