
import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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

import {
  fetchProductBySku,
  changeProductStatus,
  fetchProducts,
  editProduct as updateProductThunk,
} from "../../redux/slices/productSlice";

import { productColumns } from "../../constant/productColumn";

import toast from "react-hot-toast";

const initialEditForm = {
  sku: "",
  productName: "",
  division: "",
  unit: "",
  meterPerKG: "",
  meterPerRoll: "",
  color: "",
  size: "",
  rate: "",
};

// Normalize product fields returned by API
const normalizeProduct = (product) => ({
  sku:
    product?.sku ??
    product?.sku_code ??
    product?.skucode ??
    "",

  productName:
    product?.productName ??
    product?.product_name ??
    "",

  division: product?.division ?? "",

  unit:
    product?.unit ??
    product?.basicUnit ??
    product?.basic_unit ??
    "",

  meterPerKG:
    product?.meterPerKG ??
    product?.meterPerKg ??
    product?.meter_per_kg ??
    "",

  meterPerRoll:
    product?.meterPerRoll ??
    product?.meter_per_roll ??
    "",

  color: product?.color ?? "",
  size: product?.size ?? "",
  rate: product?.rate ?? "",
});

const ProductTable = () => {
  const dispatch = useDispatch();

  // =====================================================
  // AUTH USER - SINGLE SELECTOR
  // =====================================================

  const authUser = useSelector(
    (state) => state.auth?.user?.user
  );

  const role = authUser?.role;
  const updatedBy = authUser?.name ?? "";

  // Only dispatch can edit products
  const canEditProduct = role === "dispatch";

  // =====================================================
  // PRODUCT REDUX STATE
  // =====================================================

  const {
    allproducts,
    loading,
  } = useSelector((state) => state.product);

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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

  const [editForm, setEditForm] = useState(initialEditForm);

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const handleEdit = async (sku) => {
    if (!canEditProduct) {
      toast.error("You don't have permission to edit products");
      return;
    }

    if (!sku) {
      toast.error("Product SKU is missing");
      return;
    }

    try {
      setEditLoading(true);

      const res = await dispatch(fetchProductBySku(sku));

      if (fetchProductBySku.fulfilled.match(res)) {
        const responseData = res.payload?.data ?? res.payload;

        const product =
          responseData?.data ??
          responseData?.product ??
          responseData;

        if (!product || typeof product !== "object") {
          toast.error("Product data not found");
          return;
        }

        setEditProduct(product);
        setEditForm(normalizeProduct(product));
        setEditOpen(true);
      } else {
        toast.error(
          res.payload?.message || "Failed to fetch product"
        );
      }
    } catch (error) {
      console.error("Fetch product error:", error);

      toast.error("Something went wrong while fetching product");
    } finally {
      setEditLoading(false);
    }
  };

  // =====================================================
  // EDIT FORM CHANGE
  // =====================================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // CLOSE EDIT DIALOG
  // =====================================================

  const handleEditClose = () => {
    if (editLoading) return;

    setEditOpen(false);
    setEditProduct(null);
    setEditForm(initialEditForm);
  };

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const handleUpdateProduct = async () => {
    if (!canEditProduct) {
      toast.error("You don't have permission to update products");
      return;
    }

    if (!editForm.sku) {
      toast.error("Product SKU is missing");
      return;
    }

    if (!editForm.productName.trim()) {
      toast.error("Product name is required");
      return;
    }

    try {
      setEditLoading(true);

      const res = await dispatch(
        updateProductThunk({
          sku: editForm.sku,
          productName: editForm.productName.trim(),
          division: editForm.division,
          unit: editForm.unit,
          meterPerKG: editForm.meterPerKG,
          meterPerRoll: editForm.meterPerRoll,
          color: editForm.color,
          size: editForm.size,
          rate: editForm.rate,
          updatedBy,
        })
      );

      if (updateProductThunk.fulfilled.match(res)) {
        toast.success("Product updated successfully");

        setEditOpen(false);
        setEditProduct(null);
        setEditForm(initialEditForm);

        dispatch(fetchProducts());
      } else {
        toast.error(
          res.payload?.message || "Failed to update product"
        );
      }
    } catch (error) {
      console.error("Update product error:", error);

      toast.error(
        "Something went wrong while updating product"
      );
    } finally {
      setEditLoading(false);
    }
  };

  // =====================================================
  // CHANGE PRODUCT STATUS
  // =====================================================

  const handleStatus = async (sku, currentStatus) => {
    if (!sku) {
      toast.error("Product SKU is missing");
      return;
    }

    try {
      const isActive =
        String(currentStatus || "").toUpperCase() === "ACTIVE";

      const newStatus = isActive ? "Inactive" : "Active";

      const res = await dispatch(
        changeProductStatus({
          sku,
          status: newStatus,
          updatedBy,
        })
      );

      if (res.payload?.success) {
        toast.success(`Product ${newStatus} successfully`);
        dispatch(fetchProducts());
      } else {
        toast.error(
          res.payload?.message || "Failed to change product status"
        );
      }
    } catch (error) {
      console.error("Change product status error:", error);

      toast.error("Something went wrong while changing status");
    }
  };

  // =====================================================
  // FILTERED PRODUCTS
  // =====================================================

  const filteredRows = useMemo(() => {
    const products = Array.isArray(allproducts)
      ? allproducts
      : [];

    const normalize = (value) =>
      String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

    return products.filter((item) => {
      const searchValue = normalize(search);

      const searchableText = [
        item.sku,
        item.sku_code,
        item.skucode,
        item.productName,
        item.product_name,
        item.color,
        item.size,
      ]
        .map(normalize)
        .join(" ");

      const searchMatch =
        !searchValue || searchableText.includes(searchValue);

      const divisionMatch =
        division === "All" ||
        normalize(item.division) === normalize(division);

      const statusMatch =
        status === "All" ||
        normalize(item.status) === normalize(status);

      const sizeMatch =
        size === "All" ||
        normalize(item.size) === normalize(size);

      return (
        searchMatch &&
        divisionMatch &&
        statusMatch &&
        sizeMatch
      );
    });
  }, [allproducts, search, division, status, size]);

  // =====================================================
  // DATAGRID COLUMNS
  // =====================================================

  const columns = useMemo(
    () =>
      productColumns({
        handleEdit,
        handleStatus,
        canEditProduct,
      }),
    [canEditProduct]
  );

  // =====================================================
  // UNIQUE SIZES
  // =====================================================

  const uniqueSizes = useMemo(() => {
    return [
      ...new Set(
        (allproducts || [])
          .map((item) => String(item.size ?? "").trim())
          .filter(Boolean)
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
      {/* FILTERS */}

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

      {/* DATA GRID */}

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
          getRowId={(row) => String(row.id)}
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
            border: "none",
          }}
        />
      </Box>

      {/* EDIT PRODUCT DIALOG */}

      <Dialog
        open={canEditProduct && editOpen}
        onClose={handleEditClose}
        fullWidth
        maxWidth="md"
      >
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
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                gap: 2,
                pt: 1,
              }}
            >
              <TextField
                label="SKU Code"
                name="sku"
                value={editForm.sku}
                disabled
                fullWidth
              />

              <TextField
                label="Product Name"
                name="productName"
                value={editForm.productName}
                onChange={handleEditChange}
                fullWidth
              />

              <TextField
                select
                label="Division"
                name="division"
                value={editForm.division}
                onChange={handleEditChange}
                fullWidth
              >
                <MenuItem value="Woven">WOVEN</MenuItem>
                <MenuItem value="Crochet">CROCHET</MenuItem>
              </TextField>

              <TextField
                select
                label="Unit"
                name="unit"
                value={editForm.unit}
                onChange={handleEditChange}
                fullWidth
              >
                <MenuItem value="Meter">Meter</MenuItem>
                <MenuItem value="Roll">Roll</MenuItem>
                <MenuItem value="KG">KG</MenuItem>
              </TextField>

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

              <TextField
                label="Color"
                name="color"
                value={editForm.color}
                onChange={handleEditChange}
                fullWidth
              />

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
          <Button
            onClick={handleEditClose}
            disabled={editLoading}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={
              !canEditProduct ||
              !editProduct ||
              editLoading
            }
            onClick={handleUpdateProduct}
          >
            {editLoading ? "Updating..." : "Update Product"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductTable;
