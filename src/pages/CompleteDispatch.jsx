
import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Divider,
  TextField,
  MenuItem,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { useDispatch, useSelector } from "react-redux";

import {
  getAllCompletedDispatchOrders,
} from "../redux/slices/dispatchSlice";

// =============================================
// HELPERS
// =============================================

const formatAmount = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "0.00";

  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-IN");
};

// =============================================
// COMPONENT
// =============================================

const CompleteDispatch = () => {
  const dispatch = useDispatch();

  // =========================================
  // LOCAL STATE
  // =========================================

  const [selectedChallan, setSelectedChallan] = useState(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [itemPaginationModel, setItemPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  // Search
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Filters
  const [status, setStatus] = useState("");
  const [route, setRoute] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Sorting
  const [sortModel, setSortModel] = useState([
    {
      field: "createdAt",
      sort: "desc",
    },
  ]);

  // =========================================
  // REDUX STATE
  // =========================================

  const {
    completedDispatchOrders = [],
    completedDispatchPagination = {},
    loading = false,
  } = useSelector((state) => state.dispatch);

  const totalRecords =
    completedDispatchPagination?.totalRecords || 0;

  // =========================================
  // SEARCH DEBOUNCE
  // =========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  // =========================================
  // FETCH CHALLAN HISTORY
  // =========================================

  useEffect(() => {
    const currentSort = sortModel[0] || {
      field: "createdAt",
      sort: "desc",
    };

    dispatch(
      getAllCompletedDispatchOrders({
        page: paginationModel.page,
        limit: paginationModel.pageSize,

        search: debouncedSearch,
        status,
        route,
        fromDate,
        toDate,

        sortBy: currentSort.field,
        sortOrder: currentSort.sort,
      })
    );
  }, [
    dispatch,
    paginationModel,
    debouncedSearch,
    status,
    route,
    fromDate,
    toDate,
    sortModel,
  ]);

  // =========================================
  // NORMALIZE API RESPONSE
  // =========================================

  const challanRows = useMemo(() => {
    if (!Array.isArray(completedDispatchOrders)) {
      return [];
    }

    return completedDispatchOrders
      .filter((row) => row && row.id != null)
      .map((row) => ({
        ...row,
        items: Array.isArray(row.items) ? row.items : [],
      }));
  }, [completedDispatchOrders]);

  // =========================================
  // UPDATE SELECTED CHALLAN IF REFRESHED
  // =========================================

  useEffect(() => {
    if (!selectedChallan) return;

    const updatedChallan = challanRows.find(
      (row) =>
        String(row.id) === String(selectedChallan.id)
    );

    if (updatedChallan) {
      setSelectedChallan(updatedChallan);
    }
  }, [challanRows]);

  // =========================================
  // RESET PAGE WHEN FILTER CHANGES
  // =========================================

  const resetPage = () => {
    setPaginationModel((prev) => ({
      ...prev,
      page: 0,
    }));
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    resetPage();
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    resetPage();
  };

  const handleRouteChange = (event) => {
    setRoute(event.target.value);
    resetPage();
  };

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
    resetPage();
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
    resetPage();
  };

  // =========================================
  // CHALLAN COLUMNS
  // =========================================

  const challanColumns = useMemo(
    () => [
      {
        field: "challanNo",
        headerName: "Challan No",
        width: 140,
      },
      {
        field: "challanDate",
        headerName: "Challan Date",
        width: 175,
        valueFormatter: (value) => formatDate(value),
      },
      {
        field: "customerName",
        headerName: "Customer",
        width: 190,
      },
      {
        field: "driverName",
        headerName: "Driver",
        width: 140,
      },
      {
        field: "vehicleNo",
        headerName: "Vehicle No",
        width: 140,
      },
      {
        field: "route",
        headerName: "Route",
        width: 130,
      },
      {
        field: "totalRolls",
        headerName: "Total Rolls",
        width: 120,
        type: "number",
      },
      {
        field: "totalQtyMeter",
        headerName: "Total Qty (M)",
        width: 140,
        type: "number",
      },
      {
        field: "totalAmount",
        headerName: "Total Amount",
        width: 145,
        valueFormatter: (value) =>
          `₹${formatAmount(value)}`,
      },
      {
        field: "gstRate",
        headerName: "GST %",
        width: 100,
      },
      {
        field: "amountIncludingGst",
        headerName: "Amount + GST",
        width: 155,
        valueFormatter: (value) =>
          `₹${formatAmount(value)}`,
      },
      {
        field: "status",
        headerName: "Status",
        width: 130,
        sortable: true,
        renderCell: (params) => {
          const currentStatus = String(
            params.value || ""
          ).toUpperCase();

          return (
            <Chip
              label={params.value || "-"}
              size="small"
              color={
                currentStatus === "COMPLETED"
                  ? "success"
                  : currentStatus === "CANCELLED"
                  ? "error"
                  : "primary"
              }
            />
          );
        },
      },
    ],
    []
  );

  // =========================================
  // ITEM COLUMNS
  // =========================================

  const itemColumns = useMemo(
    () => [
      {
        field: "skuCode",
        headerName: "SKU Code",
        width: 130,
      },
      {
        field: "productName",
        headerName: "Product",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "dispatchedQtyMeter",
        headerName: "Dispatch Qty (M)",
        width: 150,
        type: "number",
      },
      {
        field: "meterPerRoll",
        headerName: "Meter / Roll",
        width: 120,
        type: "number",
      },
      {
        field: "rollQty",
        headerName: "Roll Qty",
        width: 110,
        type: "number",
      },
      {
        field: "ratePerMeter",
        headerName: "Rate / Meter",
        width: 130,
        valueFormatter: (value) =>
          `₹${formatAmount(value)}`,
      },
      {
        field: "amount",
        headerName: "Amount",
        width: 140,
        valueFormatter: (value) =>
          `₹${formatAmount(value)}`,
      },
    ],
    []
  );

  // =========================================
  // SELECTED CHALLAN
  // =========================================

  const selectedItems = selectedChallan?.items || [];

  const handleChallanClick = (params) => {
    setSelectedChallan(params.row);

    setItemPaginationModel({
      page: 0,
      pageSize: 5,
    });
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 100px)",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        Challan History
      </Typography>

      {/* ===================================
          SEARCH AND FILTERS
      =================================== */}

      <Paper elevation={2} sx={{ p: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          flexWrap="wrap"
        >
          <TextField
            label="Search Challan / Customer / SO / Driver / Vehicle"
            size="small"
            value={search}
            onChange={handleSearchChange}
            sx={{ flex: 2, minWidth: 220 }}
          />

          <TextField
            select
            label="Status"
            size="small"
            value={status}
            onChange={handleStatusChange}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
          </TextField>

          <TextField
            label="Route"
            size="small"
            value={route}
            onChange={handleRouteChange}
            sx={{ minWidth: 150 }}
          />

          <TextField
            label="From Date"
            type="date"
            size="small"
            value={fromDate}
            onChange={handleFromDateChange}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />

          <TextField
            label="To Date"
            type="date"
            size="small"
            value={toDate}
            onChange={handleToDateChange}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
        </Stack>
      </Paper>

      {/* ===================================
          CHALLAN LIST
      =================================== */}

      <Paper
        elevation={2}
        sx={{
          width: "100%",
          height: 430,
          p: 1,
        }}
      >
        <DataGrid
          rows={challanRows}
          columns={challanColumns}
          loading={loading}
          getRowId={(row) => row.id}

          rowCount={totalRecords}

          paginationMode="server"
          sortingMode="server"

          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}

          sortModel={sortModel}
          onSortModelChange={setSortModel}

          pageSizeOptions={[10, 20, 50]}

          onRowClick={handleChallanClick}
          disableRowSelectionOnClick
          disableColumnFilter
          density="compact"

          sx={{
            border: 0,
            "& .MuiDataGrid-row": {
              cursor: "pointer",
            },
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: "action.selected",
            },
          }}
        />
      </Paper>

      {/* ===================================
          SELECTED CHALLAN DETAILS
      =================================== */}

      {selectedChallan && (
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            p: 2,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={1}
            mb={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Challan: {selectedChallan.challanNo || "-"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {selectedChallan.customerName || "-"} |{" "}
                {selectedChallan.vehicleNo || "-"}
              </Typography>
            </Box>

            <Chip
              label={`${selectedItems.length} Items`}
              color="primary"
              variant="outlined"
            />
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* Challan Information */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Challan Date
              </Typography>
              <Typography fontWeight={600}>
                {formatDate(selectedChallan.challanDate)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Driver
              </Typography>
              <Typography fontWeight={600}>
                {selectedChallan.driverName || "-"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Route
              </Typography>
              <Typography fontWeight={600}>
                {selectedChallan.route || "-"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                GST Number
              </Typography>
              <Typography fontWeight={600}>
                {selectedChallan.gstNo || "-"}
              </Typography>
            </Box>
          </Box>

          <Typography variant="subtitle1" fontWeight={700} mb={1}>
            Dispatched Products
          </Typography>

          {/* Items DataGrid */}

          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={selectedItems}
              columns={itemColumns}
              getRowId={(row) => row.id}
              autoHeight
              density="compact"
              disableRowSelectionOnClick
              paginationModel={itemPaginationModel}
              onPaginationModelChange={setItemPaginationModel}
              pageSizeOptions={[5, 10, 20]}
              sx={{
                border: 1,
                borderColor: "divider",
              }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Challan Totals */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                sm: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Total Rolls
              </Typography>
              <Typography fontWeight={700}>
                {selectedChallan.totalRolls ?? 0}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Total Quantity
              </Typography>
              <Typography fontWeight={700}>
                {selectedChallan.totalQtyMeter ?? 0} M
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                GST ({selectedChallan.gstRate ?? 0}%)
              </Typography>
              <Typography fontWeight={700}>
                ₹{formatAmount(selectedChallan.taxOfGst)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Amount Including GST
              </Typography>
              <Typography fontWeight={700} color="success.main">
                ₹{formatAmount(selectedChallan.amountIncludingGst)}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Locations */}

          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Typography variant="body2">
              <strong>Billing:</strong>{" "}
              {selectedChallan.billingLocation || "-"}
            </Typography>

            <Typography variant="body2">
              <strong>Shipping:</strong>{" "}
              {selectedChallan.shippingLocation || "-"}
            </Typography>
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default CompleteDispatch;
