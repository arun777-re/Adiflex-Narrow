
import React, { useMemo, useState } from "react";

import { DataGrid } from "@mui/x-data-grid";

import {
  Box,
  Paper,
  TextField,
  Chip,
  InputAdornment,
  Button,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

const formatQty = (value) =>
  `${Number(value ?? 0).toLocaleString("en-IN")} m`;

const InventoryDataGrid = ({
  data = [],
  loading = false,
  onEdit,
}) => {
  const [search, setSearch] = useState("");
  const [selectedInventory, setSelectedInventory] = useState(null);

  // MAP API DATA TO DATAGRID ROWS
  const rows = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.map((item, index) => ({
      id: String(item?.id ?? item?.sku ?? index),

      sku: String(item?.sku ?? ""),
      product: String(item?.productName ?? ""),
      division: String(item?.division ?? ""),
      unit: "METER",

      availableQty: Number(item?.availableQty ?? 0),
      reservedQty: Number(item?.reservedQty ?? 0),
      dispatchedQty: Number(item?.dispatchedQty ?? 0),
      pendingDispatchQty: Number(item?.pendingDispatchQty ?? 0),

      totalReservations: Number(item?.totalReservations ?? 0),
      activeReservations: Number(item?.activeReservations ?? 0),

      reservations: Array.isArray(item?.reservations)
        ? item.reservations
        : [],

      original: item,
    }));
  }, [data]);

  // SEARCH
  const searchValue = search.trim().toLowerCase();

  const filteredRows = useMemo(() => {
    return rows.filter(
      (row) =>
        row.sku.toLowerCase().includes(searchValue) ||
        row.product.toLowerCase().includes(searchValue) ||
        row.division.toLowerCase().includes(searchValue)
    );
  }, [rows, searchValue]);

  // VIEW RESERVATIONS
  const handleViewReservations = (row) => {
    setSelectedInventory(row);
  };

  const handleCloseReservations = () => {
    setSelectedInventory(null);
  };

  // MAIN GRID COLUMNS
  const columns = useMemo(
    () => [
      {
        field: "sku",
        headerName: "SKU",
        width: 120,
      },
      {
        field: "product",
        headerName: "Product Name",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "division",
        headerName: "Division",
        width: 120,
      },
      {
        field: "unit",
        headerName: "Unit",
        width: 90,
      },
      {
        field: "availableQty",
        headerName: "Available Qty",
        width: 135,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const qty = Number(params.value ?? 0);

          let color = "success";
          if (qty <= 0) color = "error";
          else if (qty < 100) color = "warning";

          return (
            <Chip
              label={formatQty(qty)}
              color={color}
              size="small"
              sx={{ fontWeight: 700 }}
            />
          );
        },
      },
      {
        field: "reservedQty",
        headerName: "Reserved Qty",
        width: 125,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Typography mt={2} fontWeight={600}>
            {formatQty(params.value)}
          </Typography>
        ),
      },
      {
        field: "pendingDispatchQty",
        headerName: "Pending Dispatch",
        width: 145,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={formatQty(params.value)}
            color={Number(params.value) > 0 ? "warning" : "default"}
            size="small"
          />
        ),
      },
      {
        field: "dispatchedQty",
        headerName: "Dispatched Qty",
        width: 135,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Typography mt={2} fontWeight={600}>
            {formatQty(params.value)}
          </Typography>
        ),
      },
      {
        field: "activeReservations",
        headerName: "Active Reservations",
        width: 155,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={params.value ?? 0}
            color={Number(params.value) > 0 ? "info" : "default"}
            size="small"
          />
        ),
      },
      {
        field: "viewOrders",
        headerName: "Reserved Against",
        width: 155,
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<VisibilityIcon />}
            onClick={() => handleViewReservations(params.row)}
          >
            View Orders
          </Button>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 110,
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
    ],
    [onEdit]
  );

  // SELECTED PRODUCT RESERVATIONS
  const reservations = selectedInventory?.reservations ?? [];

  return (
    <Box>
      <TextField
        fullWidth
        size="small"
        placeholder="Search SKU / Product / Division..."
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
          width: "100%",
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
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0,
              },
            },
          }}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#1976d2",
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#1976d2",
              color: "#fff",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "#fff",
              fontWeight: 700,
            },
          }}
        />
      </Paper>

      {/* RESERVATION DETAILS DIALOG */}
      <Dialog
        open={Boolean(selectedInventory)}
        onClose={handleCloseReservations}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Reserved Orders
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {selectedInventory?.sku} - {selectedInventory?.product}
              </Typography>
            </Box>

            <IconButton onClick={handleCloseReservations}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            useFlexGap
            sx={{ mb: 2 }}
          >
            <Chip
              label={`Total Reserved: ${formatQty(
                selectedInventory?.reservedQty
              )}`}
              color="info"
            />

            <Chip
              label={`Pending Dispatch: ${formatQty(
                selectedInventory?.pendingDispatchQty
              )}`}
              color="warning"
            />

            <Chip
              label={`Total Dispatched: ${formatQty(
                selectedInventory?.dispatchedQty
              )}`}
              color="success"
            />
          </Stack>

          {reservations.length === 0 ? (
            <Typography
              textAlign="center"
              color="text.secondary"
              py={4}
            >
              No reservation records found for this product.
            </Typography>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f3f6fa" }}>
                    <TableCell><b>SO No.</b></TableCell>
                    <TableCell><b>Party / Customer</b></TableCell>
                    <TableCell align="right"><b>Reserved</b></TableCell>
                    <TableCell align="right"><b>Dispatched</b></TableCell>
                    <TableCell align="right"><b>Remaining</b></TableCell>
                    <TableCell align="right"><b>Released</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {reservations.map((item) => (
                    <TableRow key={item.reservationId}>
                      <TableCell>
                        <Typography fontWeight={600}>
                          {item.soNo || "-"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {item.customer || "-"}
                      </TableCell>

                      <TableCell align="right">
                        {formatQty(item.reservedQty)}
                      </TableCell>

                      <TableCell align="right">
                        {formatQty(item.dispatchedQty)}
                      </TableCell>

                      <TableCell align="right">
                        <Typography fontWeight={600}>
                          {formatQty(item.remainingQty)}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        {formatQty(item.releasedQty)}
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={item.status || "UNKNOWN"}
                          color={
                            item.status === "DISPATCHED"
                              ? "success"
                              : item.status === "RELEASED"
                              ? "default"
                              : item.status === "PARTIALLY_DISPATCHED"
                              ? "warning"
                              : "info"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseReservations}
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryDataGrid;
