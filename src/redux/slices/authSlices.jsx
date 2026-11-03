
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  loginUser,
  getAllUsers,
  updateUser,
  createUser,
  deleteUser,
} from "../../services/authApi";

// LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await loginUser(payload);

      if (!data.success) {
        return rejectWithValue(data.message);
      }
      localStorage.setItem("token",data.data.token)
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// GET ALL USERS
export const getAllUsersData = createAsyncThunk(
  "auth/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllUsers();

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// CREATE USER
export const createUserData = createAsyncThunk(
  "auth/createUser",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("payload....",payload)
      const data = await createUser(payload);

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// UPDATE USER
export const updateUserData = createAsyncThunk(
  "auth/updateUser",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = await updateUser(id, payload);

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// DEACTIVATE USER
export const deleteUserData = createAsyncThunk(
  "auth/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteUser(id);

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return {
        ...data,
        deletedId: Number(id),
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const initialState = {
  user: null,
  users: [],
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearAuthMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.successMessage = action.payload.message;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL USERS
      .addCase(getAllUsersData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsersData.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
      })
      .addCase(getAllUsersData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE USER
      .addCase(createUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createUserData.fulfilled, (state, action) => {
        state.loading = false;

        const newUser = action.payload.data;

        if (newUser?.id != null) {
          state.users = [
            newUser,
            ...state.users.filter(
              (user) => String(user.id) !== String(newUser.id)
            ),
          ];
        }

        state.successMessage = action.payload.message;
      })
      .addCase(createUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE USER
      .addCase(updateUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.loading = false;

        const updatedUser = action.payload.data;

        if (updatedUser?.id != null) {
          state.users = state.users.map((user) =>
            String(user.id) === String(updatedUser.id)
              ? { ...user, ...updatedUser }
              : user
          );
        }

        state.successMessage = action.payload.message;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DEACTIVATE USER
      .addCase(deleteUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteUserData.fulfilled, (state, action) => {
        state.loading = false;

        const updatedUser = action.payload.data;
        const deletedId = updatedUser?.id ?? action.payload.deletedId;

        state.users = state.users.map((user) =>
          String(user.id) === String(deletedId)
            ? { ...user, is_active: false }
            : user
        );

        state.successMessage = action.payload.message;
      })
      .addCase(deleteUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  logout,
  clearError,
  clearAuthMessages,
} = authSlice.actions;

export default authSlice.reducer;
