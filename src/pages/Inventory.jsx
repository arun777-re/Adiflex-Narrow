import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchAllFG,
  updateFG,
} from "../redux/slices/fgSlice";

import InventoryDataGrid from "../components/InventoryDataGrid";

const Inventory = () => {
  const dispatch = useDispatch();

  // ============================================================
  // STATE
  // ============================================================

  const [editOpen, setEditOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const [newFGQty, setNewFGQty] = useState("");

  // Product filter
  const [productFilter, setProductFilter] = useState("");

  // SKU filter
  const [skuFilter, setSkuFilter] = useState("");

  // ============================================================
  // REDUX
  // ============================================================

  const { inventory, loading } = useSelector(
    (state) => state?.fginventory
  );

  const { user } = useSelector(
    (state) => state.auth?.user || {}
  );

  // ============================================================
  // FETCH INVENTORY
  // ============================================================

  useEffect(() => {
    dispatch(fetchAllFG());
  }, [dispatch]);

  // ============================================================
  // INVENTORY DATA
  // ============================================================

  const inventoryData = Array.isArray(inventory?.data)
    ? inventory.data
    : [];

  // ============================================================
  // DIVISION FILTER
  // ============================================================

  const divisionData = useMemo(() => {
    if (!Array.isArray(inventoryData)) {
      return [];
    }

    const userDivision = String(
      user?.division || ""
    )
      .trim()
      .toLowerCase();

    // Admin / All division
    if (!userDivision || userDivision === "all") {
      return inventoryData;
    }

    return inventoryData.filter((item) => {
      const itemDivision = String(item?.[2] || "")
        .trim()
        .toLowerCase();

      return itemDivision === userDivision;
    });
  }, [inventoryData, user?.division]);

  // ============================================================
  // PRODUCT OPTIONS
  // ============================================================

  const productOptions = useMemo(() => {
    return [
      ...new Set(
        divisionData
          .map((item) =>
            String(item?.[1] || "").trim()
          )
          .filter(Boolean)
      ),
    ].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [divisionData]);

  // ============================================================
  // SKU OPTIONS
  // ============================================================

  const skuOptions = useMemo(() => {
    return [
      ...new Set(
        divisionData
          .map((item) =>
            String(item?.[0] || "").trim()
          )
          .filter(Boolean)
      ),
    ].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [divisionData]);

  // ============================================================
  // FILTERED DATA
  // ============================================================

  const filteredData = useMemo(() => {
    return divisionData.filter((item) => {
      const product = String(
        item?.[1] || ""
      ).trim();

      const skuCode = String(
        item?.[0] || ""
      ).trim();

      // --------------------------------------------------------
      // PRODUCT FILTER
      // --------------------------------------------------------

      if (
        productFilter &&
        product.toLowerCase() !==
          productFilter.toLowerCase()
      ) {
        return false;
      }

      // --------------------------------------------------------
      // SKU FILTER
      // --------------------------------------------------------

      if (
        skuFilter &&
        skuCode.toLowerCase() !==
          skuFilter.toLowerCase()
      ) {
        return false;
      }

      return true;
    });
  }, [
    divisionData,
    productFilter,
    skuFilter,
  ]);

  // ============================================================
  // SUMMARY
  // ============================================================

  const availableFGStock = useMemo(() => {
    return filteredData.reduce(
      (sum, item) =>
        sum + Number(item?.[4] || 0),
      0
    );
  }, [filteredData]);

  const lowStockItemsLength = useMemo(() => {
    return filteredData.filter(
      (item) =>
        Number(item?.[4] || 0) < 100
    ).length;
  }, [filteredData]);

  const outOfStockItemsLength = useMemo(() => {
    return filteredData.filter(
      (item) =>
        Number(item?.[4] || 0) <= 0
    ).length;
  }, [filteredData]);

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const handleClearFilters = () => {
    setProductFilter("");
    setSkuFilter("");
  };

  // ============================================================
  // EDIT STOCK
  // ============================================================

  const handleEditStock = (item) => {
    if (!item) return;

    setSelectedItem(item);

    setNewFGQty(
      item?.[4] ?? ""
    );

    setEditOpen(true);
  };

  // ============================================================
  // CLOSE EDIT DIALOG
  // ============================================================

  const handleCloseEdit = () => {
    setEditOpen(false);

    setSelectedItem(null);

    setNewFGQty("");
  };

  // ============================================================
  // UPDATE STOCK
  // ============================================================

  const handleUpdateStock = async () => {
    if (!selectedItem) {
      return;
    }

    const skucode = selectedItem?.[0];

    const qty = Number(newFGQty);

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!Number.isFinite(qty) || qty < 0) {
      return;
    }

    if (!skucode) {
      console.error("❌ SKU Code missing");

      return;
    }

    try {
      console.log(
        "📦 Updating FG Stock:",
        {
          skucode,
          qty,
        }
      );

      const result = await dispatch(
        updateFG({
          skucode,
          newFGQty: qty,
        })
      ).unwrap();

      console.log(
        "✅ Stock updated:",
        result
      );

      // Close dialog
      handleCloseEdit();

      // Refresh inventory
      await dispatch(
        fetchAllFG()
      );
    } catch (error) {
      console.error(
        "❌ Stock update failed:",
        error
      );
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Box
      p={{
        xs: 1.5,
        sm: 2,
        md: 3,
      }}
    >
      {/* ======================================================
          HEADING
      ====================================================== */}

      <Typography
        variant="h5"
        fontWeight={600}
        mb={3}
      >
        Finished Goods Inventory
      </Typography>

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
        >
          {/* ==================================================
              PRODUCT NAME
          ================================================== */}

          <Grid
            size={{
              xs: 12,
              md: 5,
            }}
          >
            <Autocomplete
              size="small"
              options={productOptions}
              value={
                productFilter || null
              }
              onChange={(
                event,
                newValue
              ) => {
                setProductFilter(
                  newValue || ""
                );
              }}
              getOptionLabel={(option) =>
                String(option || "")
              }
              isOptionEqualToValue={(
                option,
                value
              ) =>
                String(option) ===
                String(value)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Product Name"
                  placeholder="Type product name..."
                />
              )}
              fullWidth
            />
          </Grid>

          {/* ==================================================
              SKU CODE
          ================================================== */}

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Autocomplete
              size="small"
              options={skuOptions}
              value={
                skuFilter || null
              }
              onChange={(
                event,
                newValue
              ) => {
                setSkuFilter(
                  newValue || ""
                );
              }}
              getOptionLabel={(option) =>
                String(option || "")
              }
              isOptionEqualToValue={(
                option,
                value
              ) =>
                String(option) ===
                String(value)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="SKU Code"
                  placeholder="Type SKU code..."
                />
              )}
              fullWidth
            />
          </Grid>

          {/* ==================================================
              CLEAR FILTERS
          ================================================== */}

          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
          >
            <Button
              variant="outlined"
              fullWidth
              onClick={
                handleClearFilters
              }
              sx={{
                height: 40,
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <Grid
        container
        spacing={2}
        mb={3}
      >
        {/* TOTAL SKU */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Paper
            sx={{
              p: 2,
            }}
          >
            <Typography variant="body2">
              Total SKU
            </Typography>

            <Typography variant="h5">
              {filteredData.length}
            </Typography>
          </Paper>
        </Grid>

        {/* AVAILABLE QTY */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Paper
            sx={{
              p: 2,
            }}
          >
            <Typography variant="body2">
              Available Qty
            </Typography>

            <Typography variant="h5">
              {availableFGStock}
            </Typography>
          </Paper>
        </Grid>

        {/* LOW STOCK */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Paper
            sx={{
              p: 2,
            }}
          >
            <Typography variant="body2">
              Low Stock
            </Typography>

            <Typography variant="h5">
              {lowStockItemsLength}
            </Typography>
          </Paper>
        </Grid>

        {/* OUT OF STOCK */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Paper
            sx={{
              p: 2,
            }}
          >
            <Typography variant="body2">
              Out Of Stock
            </Typography>

            <Typography variant="h5">
              {outOfStockItemsLength}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ======================================================
          DATA GRID
      ====================================================== */}

      <InventoryDataGrid
        data={filteredData}
        loading={loading}
        onEdit={handleEditStock}
      />

      {/* ======================================================
          EDIT STOCK DIALOG
      ====================================================== */}

      <Dialog
        open={editOpen}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Edit FG Stock
        </DialogTitle>

        <DialogContent>
          {/* SKU */}

          <TextField
            fullWidth
            label="SKU Code"
            value={
              selectedItem?.[0] || ""
            }
            disabled
            margin="normal"
          />

          {/* CURRENT STOCK */}

          <TextField
            fullWidth
            label="Current FG Qty"
            value={
              selectedItem?.[4] ?? ""
            }
            disabled
            margin="normal"
          />

          {/* NEW STOCK */}

          <TextField
            fullWidth
            label="New FG Qty"
            type="number"
            value={newFGQty}
            onChange={(e) =>
              setNewFGQty(
                e.target.value
              )
            }
            margin="normal"
            inputProps={{
              min: 0,
            }}
            autoFocus
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              handleCloseEdit
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleUpdateStock
            }
            disabled={
              newFGQty === ""
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;

