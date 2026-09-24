import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, getAllUsers } from "../../services/authApi";

// ==========================================
// LOGIN
// ==========================================

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("🔐 login payload:", payload);

      const data = await loginUser(payload);

      console.log("🔐 login API response:", data);

      if (!data?.success) {
        return rejectWithValue(
          data?.message || "Invalid User ID or Password"
        );
      }

      return data;
    } catch (error) {
      console.error("❌ login thunk error:", error);

      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Login failed"
      );
    }
  }
);

// ==========================================
// GET ALL USERS
// ==========================================

export const getAllUsersData = createAsyncThunk(
  "auth/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllUsers();
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch users"
      );
    }
  }
);

// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
  user: null,
  users: [],
  loading: false,
  error: null,
};

// ==========================================
// SLICE
// ==========================================

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================
      // LOGIN
      // ==========================

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user || action.payload;
        state.error = null;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Login failed";
      })

      // ==========================
      // GET ALL USERS
      // ==========================

      .addCase(getAllUsersData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllUsersData.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })

      .addCase(getAllUsersData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to fetch users";
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;