import React, { useEffect, useMemo, useRef, useState } from "react";

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

import { fetchAllFG, updateFG } from "../redux/slices/fgSlice";

import InventoryDataGrid from "../components/InventoryDataGrid";
import UpdateInventoryDialog from "../components/inventory/UpdateInventoryDialog";

const Inventory = () => {
  const dispatch = useDispatch();

  // ============================================================
  // STATE
  // ============================================================

  const [editOpen, setEditOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const [newFGQty, setNewFGQty] = useState("");
  const [stockUnit, setStockUnit] = useState("METER");

  // Product filter
  const [productFilter, setProductFilter] = useState("");
const stockUnitRef = useRef("METER");
  // SKU filter
  const [skuFilter, setSkuFilter] = useState("");

  // ============================================================
  // REDUX
  // ============================================================

  const { inventory, loading } = useSelector((state) => state?.fginventory);

  const { user } = useSelector((state) => state.auth?.user || {});

  // ============================================================
  // FETCH INVENTORY
  // ============================================================

  useEffect(() => {
    dispatch(fetchAllFG());
  }, [dispatch]);

  // ============================================================
  // INVENTORY DATA
  // ============================================================

  const inventoryData = Array.isArray(inventory?.data) ? inventory.data : [];

  // ============================================================
  // DIVISION FILTER
  // ============================================================

  const divisionData = useMemo(() => {
  const userDivision = String(user?.division || "")
    .trim()
    .toLowerCase();

  if (!userDivision || userDivision === "all") {
    return inventoryData;
  }

  return inventoryData.filter((item) => {
    const itemDivision = String(item?.division || "")
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
        .map((item) => String(item?.productName || "").trim())
        .filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b));
}, [divisionData]);

  // ============================================================
  // SKU OPTIONS
  // ============================================================

  const skuOptions = useMemo(() => {
  return [
    ...new Set(
      divisionData
        .map((item) => String(item?.sku || "").trim())
        .filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b));
}, [divisionData]);

  // ============================================================
  // FILTERED DATA
  // ============================================================

 const filteredData = useMemo(() => {
  return divisionData.filter((item) => {
    const product = String(item?.productName || "").trim();
    const skuCode = String(item?.sku || "").trim();

    if (
      productFilter &&
      product.toLowerCase() !== productFilter.toLowerCase()
    ) {
      return false;
    }

    if (
      skuFilter &&
      skuCode.toLowerCase() !== skuFilter.toLowerCase()
    ) {
      return false;
    }

    return true;
  });
}, [divisionData, productFilter, skuFilter]);

  // ============================================================
  // SUMMARY
  // ============================================================

 const availableFGStock = useMemo(() => {
  return filteredData.reduce(
    (sum, item) => sum + Number(item?.availableQty || 0),
    0
  );
}, [filteredData]);

const lowStockItemsLength = useMemo(() => {
  return filteredData.filter(
    (item) => {

    const qty = Number(item?.availableQty);
 return Number.isFinite(qty) && qty<=1000;
}).length;
}, [filteredData]);

const outOfStockItemsLength = useMemo(() => {
  return filteredData.filter(
    (item) => {
      const qty = Number(item?.availableQty);
      return Number.isFinite(qty) && qty <= 0;
}).length;
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

  setNewFGQty(item?.availableQty ?? "");

  setStockUnit("METER");
  stockUnitRef.current = "METER";

  setEditOpen(true);
};


const handleStockUnitChange = (value) => {
  setStockUnit(value);
  stockUnitRef.current = value;
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
  if (!selectedItem) return;

  const skucode = selectedItem.sku;
  const enteredQty = Number(newFGQty);
  const selectedUnit = stockUnitRef.current;
  const meterPerRoll = Number(selectedItem.meterPerRoll);

  if (!skucode || !Number.isFinite(enteredQty) || enteredQty < 0) {
    console.error("Invalid SKU or quantity");
    return;
  }

  if (
    selectedUnit === "ROLL" &&
    (!Number.isFinite(meterPerRoll) || meterPerRoll <= 0)
  ) {
    console.error("Invalid meter per roll");
    return;
  }

  const qtyInMeter =
    selectedUnit === "ROLL"
      ? enteredQty * meterPerRoll
      : enteredQty;

  try {
    console.log("FINAL STOCK UPDATE:", {
      skucode,
      selectedUnit,
      enteredQty,
      qtyInMeter,
    });

    const result = await dispatch(
      updateFG({
        skucode,
        newFGQty: qtyInMeter,
      })
    ).unwrap();

    console.log("Stock updated:", result);

    handleCloseEdit();
    await dispatch(fetchAllFG());
  } catch (error) {
    console.error("Stock update failed:", error);
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
      <Typography variant="h5" fontWeight={600} mb={3}>
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
        <Grid container spacing={2} alignItems="center">
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
              value={productFilter || null}
              onChange={(event, newValue) => {
                setProductFilter(newValue || "");
              }}
              getOptionLabel={(option) => String(option || "")}
              isOptionEqualToValue={(option, value) =>
                String(option) === String(value)
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
              value={skuFilter || null}
              onChange={(event, newValue) => {
                setSkuFilter(newValue || "");
              }}
              getOptionLabel={(option) => String(option || "")}
              isOptionEqualToValue={(option, value) =>
                String(option) === String(value)
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
              onClick={handleClearFilters}
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

      <Grid container spacing={2} mb={3}>
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
            <Typography variant="body2">Total SKU</Typography>

            <Typography variant="h5">{filteredData.length}</Typography>
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
            <Typography variant="body2">Available Qty(meter)</Typography>

            <Typography variant="h5">{availableFGStock}</Typography>
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
            <Typography variant="body2">Low Stock</Typography>

            <Typography variant="h5">{lowStockItemsLength}</Typography>
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
            <Typography variant="body2">Out Of Stock</Typography>

            <Typography variant="h5">{outOfStockItemsLength}</Typography>
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
      <UpdateInventoryDialog
        editOpen={editOpen}
        handleCloseEdit={handleCloseEdit}
        handleUpdateStock={handleUpdateStock}
        selectedItem={selectedItem}
        newFGQty={newFGQty}
        setNewFGQty={setNewFGQty}
        loading={loading}
        stockUnit={stockUnit}
        setStockUnit={handleStockUnitChange}
        stockUnitRef={stockUnitRef}
      />
    </Box>
  );
};

export default Inventory;
