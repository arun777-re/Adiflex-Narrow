
import { useMemo, useState } from "react";

import {
  Button,
  Chip,
  Box,
  Checkbox,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Autocomplete,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import DispatchDialog from "./DispatchDialog";

const DispatchTable = ({ rows = [], loading = false }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [open, setOpen] = useState(false);

  const [routeFilter, setRouteFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [soFilter, setSoFilter] = useState("");

  const routes = useMemo(
    () => [
      ...new Set(
        rows.map((row) => String(row.route || "").trim()).filter(Boolean)
      ),
    ].sort(),
    [rows]
  );

  const customers = useMemo(
    () => [
      ...new Set(
        rows.map((row) => String(row.customer || "").trim()).filter(Boolean)
      ),
    ].sort(),
    [rows]
  );

  const products = useMemo(
    () => [
      ...new Set(
        rows
          .map((row) => String(row.product_name || "").trim())
          .filter(Boolean)
      ),
    ].sort(),
    [rows]
  );

  const activeRows = useMemo(() => {
    if (!Array.isArray(rows)) return [];

    return rows.filter((row) => {
      if (Number(row.pending_dispatch_qty) <= 0) return false;

      if (
        routeFilter &&
        String(row.route || "").trim() !== routeFilter
      ) {
        return false;
      }

      if (
        customerFilter &&
        String(row.customer || "").trim() !== customerFilter
      ) {
        return false;
      }

      if (
        productFilter &&
        String(row.product_name || "").trim() !== productFilter
      ) {
        return false;
      }

      if (
        soFilter &&
        !String(row.so_no || "")
          .toLowerCase()
          .includes(soFilter.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [rows, routeFilter, customerFilter, productFilter, soFilter]);

  // Selected reservations are resolved from the original rows.
  const selectedOrders = useMemo(() => {
    const selectedSet = new Set(selectedIds.map(String));

    return rows.filter((row) =>
      selectedSet.has(String(row.reservation_id))
    );
  }, [rows, selectedIds]);

  const clearSelection = () => setSelectedIds([]);

  const toggleSelection = (row, checked) => {
    const reservationId = String(row.reservation_id);

    setSelectedIds((previous) => {
      if (checked) {
        return previous.includes(reservationId)
          ? previous
          : [...previous, reservationId];
      }

      return previous.filter((id) => id !== reservationId);
    });
  };

  const handleCreateChallan = () => {
    if (!selectedOrders.length) return;

    // All selected reservations must belong to the same dispatch group.
    const first = selectedOrders[0];

    const isSameDispatchGroup = selectedOrders.every((row) => {
      return (
        String(row.customer || "").trim() ===
          String(first.customer || "").trim() &&
        String(row.billing_location || "").trim() ===
          String(first.billing_location || "").trim() &&
        String(row.shipping_location || "").trim() ===
          String(first.shipping_location || "").trim() &&
        String(row.route || "").trim() ===
          String(first.route || "").trim()
      );
    });

    if (!isSameDispatchGroup) {
      window.alert(
        "Selected rows must have the same customer, billing location, shipping location and route."
      );
      return;
    }

    const hasInvalidReservation = selectedOrders.some(
      (row) =>
        !row.reservation_id ||
        Number(row.pending_dispatch_qty) <= 0
    );

    if (hasInvalidReservation) {
      window.alert(
        "One or more selected rows have an invalid reservation or pending quantity. Please refresh the dispatch list."
      );
      return;
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    clearSelection();
  };

  const handleClearFilters = () => {
    setRouteFilter("");
    setCustomerFilter("");
    setProductFilter("");
    setSoFilter("");
    clearSelection();
  };

  const columns = useMemo(
    () => [
      {
        field: "select",
        headerName: "Select",
        width: 75,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const reservationId = String(params.row.reservation_id);
          const checked = selectedIds.includes(reservationId);

          return (
            <Checkbox
              checked={checked}
              disabled={
                !params.row.reservation_id ||
                Number(params.row.pending_dispatch_qty) <= 0
              }
              onClick={(event) => event.stopPropagation()}
              onChange={(event) =>
                toggleSelection(params.row, event.target.checked)
              }
            />
          );
        },
      },
      {
        field: "customer",
        headerName: "Party Name",
        width: 150,
      },
      {
        field: "so_no",
        headerName: "Order No",
        width: 130,
      },
      {
        field: "sku_code",
        headerName: "SKU Code",
        width: 120,
      },
      {
        field: "product_name",
        headerName: "Product",
        flex: 1,
        minWidth: 180,
      },
      {
        field: "division",
        headerName: "Division",
        width: 110,
      },
      {
        field: "route",
        headerName: "Route",
        width: 120,
      },
      {
        field: "final_rate",
        headerName: "Rate (₹)",
        width: 100,
        type: "number",
      },
      {
        field: "shipping_location",
        headerName: "Shipping Location",
        width: 170,
      },
      {
        field: "billing_location",
        headerName: "Billing Location",
        width: 170,
      },
      {
        field: "freight",
        headerName: "Freight",
        width: 100,
        renderCell: (params) => (
          <Chip
            label={params.value ? "Yes" : "No"}
            color={params.value ? "success" : "default"}
            size="small"
          />
        ),
      },
      {
        field: "reserved_qty_meter",
        headerName: "Reserved Qty (m)",
        width: 130,
        type: "number",
      },
      {
        field: "dispatched_qty_meter",
        headerName: "Dispatched (m)",
        width: 130,
        type: "number",
      },
      {
        field: "pending_dispatch_qty",
        headerName: "Pending (m)",
        width: 130,
        type: "number",
      },
      {
        field: "status",
        headerName: "Status",
        width: 170,
        renderCell: (params) => {
          let color = "warning";

          if (params.value === "Partially Dispatched") color = "info";
          if (params.value === "Fully Dispatched") color = "success";

          return (
            <Chip
              label={params.value || "-"}
              color={color}
              size="small"
            />
          );
        },
      },
      {
        field: "reserved_at",
        headerName: "Reserved At",
        width: 170,
      },
    ],
    [selectedIds]
  );

  return (
    <>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1}
        sx={{ mb: 2, width: "100%" }}
      >
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Route</InputLabel>
          <Select
            value={routeFilter}
            label="Route"
            onChange={(e) => {
              setRouteFilter(e.target.value);
              clearSelection();
            }}
          >
            <MenuItem value="">All Routes</MenuItem>
            {routes.map((route) => (
              <MenuItem key={route} value={route}>
                {route}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel>Customer</InputLabel>
          <Select
            value={customerFilter}
            label="Customer"
            onChange={(e) => {
              setCustomerFilter(e.target.value);
              clearSelection();
            }}
          >
            <MenuItem value="">All Customers</MenuItem>
            {customers.map((customer) => (
              <MenuItem key={customer} value={customer}>
                {customer}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Autocomplete
          size="small"
          options={products}
          value={productFilter || null}
          onChange={(event, newValue) => {
            setProductFilter(newValue || "");
            clearSelection();
          }}
          getOptionLabel={(option) => String(option || "")}
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Product"
              placeholder="Search product..."
            />
          )}
          sx={{ minWidth: 200 }}
        />

        <TextField
          size="small"
          label="Search SO No"
          value={soFilter}
          onChange={(e) => {
            setSoFilter(e.target.value);
            clearSelection();
          }}
        />

        <Button variant="outlined" onClick={handleClearFilters}>
          Clear
        </Button>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 1 }}
      >
        <Chip
          label={`${selectedOrders.length} reservation(s) selected`}
          color={selectedOrders.length ? "primary" : "default"}
        />

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            disabled={!selectedIds.length}
            onClick={clearSelection}
          >
            Clear Selection
          </Button>

          <Button
            variant="contained"
            disabled={!selectedOrders.length}
            onClick={handleCreateChallan}
          >
            Create Challan ({selectedOrders.length})
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 210px)",
          minHeight: 400,
        }}
      >
        <DataGrid
          rows={activeRows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.reservation_id}
          disableRowSelectionOnClick
          density="compact"
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
        />
      </Box>

      <DispatchDialog
        open={open}
        onClose={handleClose}
        selectedOrders={selectedOrders}
      />
    </>
  );
};

export default DispatchTable;
