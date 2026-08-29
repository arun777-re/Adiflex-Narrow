import { useMemo, useState, useEffect } from "react";

import {
  Box,
  Grid,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";


import { DataGrid } from "@mui/x-data-grid";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchProductBySku,
  changeProductStatus,
  fetchProducts,
  editProduct as updateProductThunk
} from "../../redux/slices/productSlice";
import { productColumns } from "../../constant/productColumn";
import toast from "react-hot-toast";

const ProductTable = () => {
  const dispatch = useDispatch();

  // =====================================================
  // PRODUCTS
  // =====================================================

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const { allproducts, loading, selectedProduct } = useSelector(
    (state) => state.product,
  );

  const { user } = useSelector((state) => state.auth);

  // =====================================================
  // FILTER STATES
  // =====================================================

  const [search, setSearch] = useState("");
  const [division, setDivision] = useState("All");
  const [size, setSize] = useState("All");
  const [status, setStatus] = useState("All");

  // =====================================================
  // EDIT STATES
  // =====================================================

  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    sku: "",
    productName: "",
    division: "",
    unit: "",
    meterPerKG: "",
    meterPerRoll: "",
    color: "",
    size: "",
    rate: "",
  });

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const handleEdit = async (sku) => {
    try {
      setEditLoading(true);

      const res = await dispatch(fetchProductBySku(sku));

      if (fetchProductBySku.fulfilled.match(res)) {
        const product = res.payload?.data || res.payload;
        setEditProduct(product);
        setEditOpen(true);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    if (editProduct) {
      setEditForm({
        sku: editProduct.sku || "",
        productName: editProduct.productName || "",
        division: editProduct.division || "",
        unit: editProduct.unit || "",
        meterPerKG: editProduct.meterPerKG || "",
        meterPerRoll: editProduct.meterPerRoll || "",
        color: editProduct.color || "",
        size: editProduct.size || "",
        rate: editProduct.rate || "",
      });
    }
  }, [editProduct]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // CLOSE EDIT
  // =====================================================

  const handleEditClose = () => {
    setEditOpen(false);
    setEditProduct(null);
  };

  const handleUpdateProduct = async () => {
  try {
    setEditLoading(true);

    const res = await dispatch(
      updateProductThunk({
        sku: editForm.sku,
        productName: editForm.productName,
        division: editForm.division,
        unit: editForm.unit,
        meterPerKG: editForm.meterPerKG,
        meterPerRoll: editForm.meterPerRoll,
        color: editForm.color,
        size: editForm.size,
        rate: editForm.rate,
        updatedBy: user?.user?.name,
      }),
    );

    if (updateProductThunk.fulfilled.match(res)) {
      toast.success("Product updated successfully");

      setEditOpen(false);
      setEditProduct(null);

      // latest product data
      dispatch(fetchProducts());
    } else {
      toast.error(
        res.payload?.message || "Failed to update product",
      );
    }
  } catch (error) {
    console.error("Update product error:", error);

    toast.error("Something went wrong while updating product");
  } finally {
    setEditLoading(false);
  }
};

  // =====================================================
  // STATUS CHANGE
  // =====================================================

  const handleStatus = async (sku, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    const res = await dispatch(
      changeProductStatus({
        sku,
        status: newStatus,
        updatedBy: user?.user?.name,
      }),
    );

    if (res.payload?.success) {
      dispatch(fetchProducts());
    }
  };

  // =====================================================
  // FILTERED DATA
  // =====================================================

  const filteredRows = useMemo(() => {
    const products = Array.isArray(allproducts) ? allproducts : [];

    const normalize = (value) =>
      String(value ?? "")
        .trim()
        .toLowerCase();

    return products.filter((item) => {
      const searchValue = normalize(search);

      const searchMatch =
        searchValue === "" ||
        [item.sku, item.productName, item.color, item.size]
          .join(" ")
          .toLowerCase()
          .includes(searchValue);

      const divisionMatch =
        division === "All" || normalize(item.division) === normalize(division);

      const statusMatch =
        status === "All" || normalize(item.status) === normalize(status);

      const sizeMatch =
        size === "All" || normalize(item.size) === normalize(size);

      return searchMatch && divisionMatch && statusMatch && sizeMatch;
    });
  }, [allproducts, search, division, status, size]);

  // =====================================================
  // DATAGRID COLUMNS
  // =====================================================
  const columns = productColumns({
    handleEdit,
    handleStatus,
  });

  // =====================================================
  // UNIQUE SIZES
  // =====================================================

  const uniqueSizes = useMemo(() => {
    return [
      ...new Set(
        (allproducts || [])
          .map((item) => String(item.size ?? "").trim())
          .filter(Boolean),
      ),
    ].sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);

      if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
        return numA - numB;
      }

      return a.localeCompare(b);
    });
  }, [allproducts]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Box>
      {/* =================================================
          FILTERS
      ================================================= */}

      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <TextField
            fullWidth
            label="Search Product"
            placeholder="SKU, Product, Color..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 2.3 }}>
          <TextField
            select
            fullWidth
            label="Division"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>

            <MenuItem value="Woven">Woven</MenuItem>

            <MenuItem value="Crochet">Crochet</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 2.3 }}>
          <TextField
            select
            fullWidth
            label="Size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>

            {uniqueSizes.map((itemSize) => (
              <MenuItem key={itemSize} value={itemSize}>
                {itemSize}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 2.3 }}>
          <TextField
            select
            fullWidth
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>

            <MenuItem value="Active">Active</MenuItem>

            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* =================================================
          DATA GRID
      ================================================= */}

      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 260px)",
        }}
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.sku}
          disableRowSelectionOnClick
          density="compact"
          pageSizeOptions={[10, 20, 50, 100]}
          columnHeaderHeight={48}
          rowHeight={42}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          sx={{
            border: 0,

            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 700,
            },

            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #eee",
              fontSize: 13,
            },

            "& .MuiDataGrid-row:nth-of-type(even)": {
              backgroundColor: "#fafafa",
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#e3f2fd",
            },

            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #ddd",
            },
          }}
        />
      </Box>

      {/* =================================================
          EDIT PRODUCT DIALOG
      ================================================= */}

      <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="md">
        <DialogTitle>Edit Product</DialogTitle>

        <DialogContent dividers>
          {editLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 5,
              }}
            >
              <CircularProgress />
            </Box>
          ) : editProduct ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
                pt: 1,
              }}
            >
              {/* SKU */}

              <TextField
                label="SKU Code"
                name="sku"
                value={editForm.sku}
                disabled
                fullWidth
              />

              {/* PRODUCT NAME */}

              <TextField
                label="Product Name"
                name="productName"
                value={editForm.productName}
                onChange={handleEditChange}
                fullWidth
              />

              {/* DIVISION */}

              <TextField
                select
                label="Division"
                name="division"
                value={editForm.division}
                onChange={handleEditChange}
                fullWidth
              >
                <MenuItem value="Woven">Woven</MenuItem>

                <MenuItem value="Crochet">Crochet</MenuItem>
              </TextField>

              {/* UNIT */}

              <TextField
                select
                label="Unit"
                name="unit"
                value={editForm.unit}
                onChange={handleEditChange}
                fullWidth
              >
                <MenuItem value="Meter">Meter</MenuItem>
              </TextField>

              {/* METER / KG */}

              <TextField
                label="Meter / KG"
                name="meterPerKG"
                type="number"
                value={editForm.meterPerKG}
                onChange={handleEditChange}
                fullWidth
                inputProps={{
                  min: 0,
                  step: "0.01",
                }}
              />

              {/* METER / ROLL */}

              <TextField
                label="Meter / Roll"
                name="meterPerRoll"
                type="number"
                value={editForm.meterPerRoll}
                onChange={handleEditChange}
                fullWidth
                inputProps={{
                  min: 0,
                  step: "0.01",
                }}
              />

              {/* COLOR */}

              <TextField
                label="Color"
                name="color"
                value={editForm.color}
                onChange={handleEditChange}
                fullWidth
              />

              {/* SIZE */}

              <TextField
                label="Size"
                name="size"
                type="number"
                value={editForm.size}
                onChange={handleEditChange}
                fullWidth
                inputProps={{
                  min: 0,
                  step: "0.01",
                }}
              />

              {/* RATE */}

              <TextField
                label="Rate"
                name="rate"
                type="number"
                value={editForm.rate}
                onChange={handleEditChange}
                fullWidth
                inputProps={{
                  min: 0,
                  step: "0.01",
                }}
              />
            </Box>
          ) : (
            "Product not found"
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>

          <Button
            variant="contained"
            disabled={!editProduct || editLoading}
            onClick={handleUpdateProduct}
          >
            Update Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductTable;
