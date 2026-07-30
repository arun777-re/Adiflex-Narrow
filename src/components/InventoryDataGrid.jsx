import React from "react";

import { DataGrid } from "@mui/x-data-grid";

import { Box, Paper, TextField, Chip, InputAdornment } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";

const columns = [
  {
    field: "sku",
    headerName: "SKU",
    width: 140,
  },
  {
    field: "product",
    headerName: "Product Name",
    flex: 1,
    minWidth: 280,
  },
  {
    field: "division",
    headerName: "Division",
    width: 140,
  },
  {
    field: "unit",
    headerName: "Unit",
    width: 120,
  },
  {
    field: "availableQty",
    headerName: "Available Qty",
    width: 170,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const qty = Number(params.value);

      let color = "success";

      if (qty === 0) color = "error";
      else if (qty < 100) color = "warning";

      return (
        <Chip
          label={qty}
          color={color}
          size="small"
          sx={{
            minWidth: 70,
            fontWeight: 700,
          }}
        />
      );
    },
  },
];

const InventoryDataGrid = ({ data = [], loading = false }) => {
  const [search, setSearch] = React.useState("");


const rows = Array.isArray(data)
  ? data.map((item, index) => ({
      id: index + 1,
      sku: item[0],
      product: item[1],
      division: item[2],
      unit: item[3],
      availableQty: Number(item[4] || 0),
    }))
  : [];

  const filteredRows = rows.filter(
    (row) =>
      row.sku.toLowerCase().includes(search.toLowerCase()) ||
      row.product.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Box>
      <TextField
        fullWidth
        size="small"
        placeholder="Search SKU / Product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Paper
        elevation={3}
        sx={{
          height: 600,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50, 100]}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#1976d2",
              color: "#fff",
              fontWeight: "bold",
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              color: "#fff",
              fontWeight: 700,
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default InventoryDataGrid;
