import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createProduct,
  getProducts,
  getProductBySku,
  updateProduct,
  updateProductStatus,
} from "../../services/product.js";

// CREATE PRODUCT
export const addProduct = createAsyncThunk(
  "product/create",
  async (payload, thunkAPI) => {
    try {
      return await createProduct(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message,
        },
      );
    }
  },
);

// GET ALL PRODUCTS
export const fetchProducts = createAsyncThunk(
  "product/getAll",
  async (_, thunkAPI) => {
    try {
      return await getProducts();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message,
        },
      );
    }
  },
);

// GET PRODUCT BY SKU
export const fetchProductBySku = createAsyncThunk(
  "product/getBySku",
  async (sku, thunkAPI) => {
    try {
      return await getProductBySku(sku);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message,
        },
      );
    }
  },
);

// UPDATE PRODUCT
export const editProduct = createAsyncThunk(
  "product/update",
  async (payload, thunkAPI) => {
    try {
      return await updateProduct(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message,
        },
      );
    }
  },
);

// UPDATE PRODUCT STATUS
export const changeProductStatus = createAsyncThunk(
  "product/updateStatus",
  async (payload, thunkAPI) => {
    try {
      return await updateProductStatus(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message,
        },
      );
    }
  },
);

// SLICE
const initialState = {
  allproducts: [],
  product: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProduct(state) {
      state.product = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE PRODUCT
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.allproducts.push(action.payload.data);
      })

      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload?.message;
      })

      // GET PRODUCTS
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        state.allproducts = action.payload.data;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload?.message;
      })

      // GET PRODUCT BY SKU
      .addCase(fetchProductBySku.fulfilled, (state, action) => {
        state.product = action.payload.data;
      })

      // UPDATE PRODUCT
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;

        const updatedProduct = action.payload.data;

        state.allproducts = state.allproducts.map((item) =>
          item.sku === updatedProduct.sku ? updatedProduct : item,
        );

        // Edit mode close
        state.product = null;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload?.message;
      })

      // UPDATE STATUS
      .addCase(changeProductStatus.pending, (state) => {
        state.loading = true;
      })

      .addCase(changeProductStatus.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(changeProductStatus.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload?.message;
      });
  },
});

export const { clearProduct } = productSlice.actions;

export default productSlice.reducer;
