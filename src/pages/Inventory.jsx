import React, { useEffect } from "react";

import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFG, fetchFGAvailableQty } from "../redux/slices/fgSlice";
import InventoryDataGrid from "../components/InventoryDataGrid";

const Inventory = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllFG())
  }, []);

  const {inventory,loading} = useSelector((state)=> state.fginventory);
  const { user } = useSelector((state) => state.auth.user);

let finalData = inventory.data;

if (user?.division?.toLowerCase() !== "all") {
  finalData = inventory.data.filter(
    (item) =>
      item[2]?.trim().toLowerCase() ===
      user.division.trim().toLowerCase()
  );
}
console.log("finalllllllldatatatatat",finalData)
  const availableFGStock = Array.isArray(finalData) && finalData.reduce((sum,item)=>sum + Number(item[4] || 0),0)
  const lowStockItemsLength =
  Array.isArray(finalData)
    ? finalData.filter((i) => Number(i[4]) < 100).length
    : 0;

    const outOfStockItemsLength = Array.isArray(finalData) ? finalData.filter((i) => Number(i[4]) <=0 ).length : 0;
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
              {finalData.length || 0}
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
              {lowStockItemsLength}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

 

      {/* DataGrid */}
     
        <InventoryDataGrid data={finalData || []}
        loading = { loading}
        />
    </Box>
  );
};

export default Inventory;