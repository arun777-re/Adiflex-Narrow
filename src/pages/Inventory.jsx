import React, { useEffect, useState } from "react";

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
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { fetchAllFG, updateFG } from "../redux/slices/fgSlice";
import InventoryDataGrid from "../components/InventoryDataGrid";

const Inventory = () => {
  const dispatch = useDispatch();

  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newFGQty, setNewFGQty] = useState("");

  useEffect(() => {
    dispatch(fetchAllFG());
  }, [dispatch]);

  const { inventory, loading } = useSelector(
    (state) => state?.fginventory
  );

  const { user } = useSelector((state) => state.auth.user);

  let finalData = inventory?.data || [];

  // -----------------------------
  // Edit Stock
  // -----------------------------
  const handleEditStock = (item) => {
    if (!item) return;

    setSelectedItem(item);
    setNewFGQty(item[4] ?? "");
    setEditOpen(true);
  };

  // -----------------------------
  // Close Edit Dialog
  // -----------------------------
  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedItem(null);
    setNewFGQty("");
  };

  if (user?.division?.toLowerCase() !== "all") {
    finalData = inventory?.data?.filter(
      (item) =>
        item[2]?.trim().toLowerCase() ===
        user.division.trim().toLowerCase()
    );
  }

  const availableFGStock =
    Array.isArray(finalData)
      ? finalData.reduce(
          (sum, item) => sum + Number(item[4] || 0),
          0
        )
      : 0;

  const lowStockItemsLength =
    Array.isArray(finalData)
      ? finalData.filter((i) => Number(i[4]) < 100).length
      : 0;

  const outOfStockItemsLength =
    Array.isArray(finalData)
      ? finalData.filter((i) => Number(i[4]) <= 0).length
      : 0;


 // update stock functionallity
const handleUpdateStock = async () => {
  if (!selectedItem) return;
  const skucode = selectedItem[0];
  const qty = Number(newFGQty);

  if (!Number.isFinite(qty) || qty < 0) {
    return;
  }
  try {
    console.log("fgfgfggfgStock in component bhai......l",qty);
  const result =  await dispatch(updateFG({skucode,newFGQty:qty})).unwrap();
    console.log("✅ Stock updated:", result);

    // Close dialog
    handleCloseEdit();

    // Refresh inventory
    dispatch(fetchAllFG());
  } catch (error) {
    console.error("❌ Stock update failed:", error);
  }
};

  return (
    <Box p={3}>
      {/* Heading */}
      <Typography variant="h5" fontWeight={600} mb={3}>
        Finished Goods Inventory
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2">
              Total SKU
            </Typography>

            <Typography variant="h5">
              {finalData?.length || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2">
              Available Qty
            </Typography>

            <Typography variant="h5">
              {availableFGStock}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2">
              Low Stock
            </Typography>

            <Typography variant="h5">
              {lowStockItemsLength}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2">
              Out Of Stock
            </Typography>

            <Typography variant="h5">
              {outOfStockItemsLength}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* DataGrid */}
      <InventoryDataGrid
        data={finalData || []}
        loading={loading}
        onEdit={handleEditStock}
      />

      {/* Edit Stock Dialog */}
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
          <TextField
            fullWidth
            label="SKU Code"
            value={selectedItem?.[0] || ""}
            disabled
            margin="normal"
          />

          <TextField
            fullWidth
            label="Current FG Qty"
            value={selectedItem?.[4] ?? ""}
            disabled
            margin="normal"
          />

          <TextField
            fullWidth
            label="New FG Qty"
            type="number"
            value={newFGQty}
            onChange={(e) => setNewFGQty(e.target.value)}
            margin="normal"
            inputProps={{ min: 0 }}
            autoFocus
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseEdit}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdateStock}
            disabled={newFGQty === ""}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;