import React from "react";

import { DataGrid } from "@mui/x-data-grid";

import {
  Box,
  Paper,
  TextField,
  Chip,
  InputAdornment,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";

const InventoryDataGrid = ({
  data = [],
  loading = false,
  onEdit,
}) => {
  const [search, setSearch] = React.useState("");

  const columns = [
    {
      field: "sku",
      headerName: "SKU",
      width: 80,
    },
    {
      field: "product",
      headerName: "Product Name",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "division",
      headerName: "Division",
      width: 140,
    },
    {
      field: "unit",
      headerName: "Unit",
      width: 80,
    },
    {
      field: "availableQty",
      headerName: "Available Qty",
      width: 140,
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
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => onEdit?.(params.row.original)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const rows = Array.isArray(data)
    ? data.map((item) => ({
        id: item[0], // SKU as stable ID

        sku: item[0],
        product: item[1] || "",
        division: item[2] || "",
        unit: item[3] || "",
        availableQty: Number(item[4] || 0),

        // Original array parent ko bhejne ke liye
        original: item,
      }))
    : [];

  const searchValue = search.toLowerCase();

  const filteredRows = rows.filter(
    (row) =>
      row.sku?.toLowerCase().includes(searchValue) ||
      row.product?.toLowerCase().includes(searchValue)
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