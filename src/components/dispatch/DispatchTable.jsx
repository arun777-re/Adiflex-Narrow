import { useMemo, useState } from "react";

import { Button, Chip, Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
 } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import DispatchDialog from "./DispatchDialog";

const DispatchTable = ({
  rows = [],

  loading = false,
}) => {
  const [open, setOpen] = useState(false);
  const [routeFilter, setRouteFilter] = useState("");
const [customerFilter, setCustomerFilter] = useState("");
const [soFilter, setSoFilter] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);

  // filtered values for route
const routes = useMemo(() => {
  return [
    ...new Set(
      rows
        .map((row) => String(row.route || "").trim())
        .filter(Boolean)
    ),
  ].sort();
}, [rows]);

// filtered values for customers
const customers = useMemo(() => {
  return [
    ...new Set(
      rows
        .map((row) => String(row.customer || "").trim())
        .filter(Boolean)
    ),
  ].sort();
}, [rows]);
const activeRows = useMemo(() => {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.filter((row) => {
    // Fully dispatched orders hide
    if (row.status === "Fully Dispatched") {
      return false;
    }

    // Route filter
    if (
      routeFilter &&
      String(row.route || "").trim() !== routeFilter
    ) {
      return false;
    }

    // Customer filter
    if (
      customerFilter &&
      String(row.customer || "").trim() !== customerFilter
    ) {
      return false;
    }

    // SO No filter
    if (
      soFilter &&
      !String(row.soNo || "")
        .toLowerCase()
        .includes(soFilter.toLowerCase())
    ) {
      return false;
    }

    return true;
  });
}, [rows, routeFilter, customerFilter, soFilter]);

  const handleOpen = (row) => {
    setSelectedOrder(row);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    setSelectedOrder(null);
  };
console.log(
  "DATAGRID ROW COUNT:",
  rows.length
);



// column for table
  const columns = useMemo(
    () => [
      {
        field: "soNo",
        headerName: "SO No",
        width: 130,
      },
      {
        field: "skuCode",
        headerName: "SKU Code",
        width: 130,
      },

      {
        field: "product",
        headerName: "Product",
        flex: 1.5,
        minWidth: 220,
      },

      {
        field: "division",
        headerName: "Division",
        width: 120,
      },
      {
        field: "route",
        headerName: "Route",
        width: 120,
      },

      {
        field: "productionQty",
        headerName: "Production Qty",
        width: 150,
        type: "number",
      },

      {
        field: "rate",
        headerName: "Rate",
        width: 110,
        type: "number",
      },

      {
        field: "shippinglocation",
        headerName: "Shipping Location",
        width: 180,
      },

      {
        field: "billinglocation",
        headerName: "Billing Location",
        width: 180,
      },
      {
        field: "freight",
        headerName: "Freight",
        width: 140,
        renderCell: (params) => (
          <Chip
            label={params.value ? "Yes" : "No"}
            color={params.value ? "success" : "default"}
            size="small"
          />
        ),
      },

      {
        field: "wastageQty",
        headerName: "Wastage Qty",
        width: 130,
        type: "number",
      },

      {
        field: "dispatchQty",
        headerName: "Dispatch Qty",
        width: 140,
        type: "number",
      },

      {
        field: "availableQty",
        headerName: "Available Qty",
        width: 140,
        type: "number",
      },

      {
        field: "status",
        headerName: "Status",
        width: 180,
        renderCell: (params) => {
          let color = "warning";

          if (params.value === "Partially Dispatched") color = "info";

          if (params.value === "Fully Dispatched") color = "success";

          return <Chip label={params.value} color={color} size="small" />;
        },
      },

      {
        field: "createdAt",
        headerName: "Created At",
        width: 170,
      },

      {
        field: "updatedAt",
        headerName: "Updated At",
        width: 170,
      },

      {
        field: "action",
        headerName: "Action",
        width: 170,
        sortable: false,
        renderCell: (params) => {
          if (Number(params.row.availableQty) <= 0) {
            return (
              <Chip label="Fully Dispatched" color="success" size="small" />
            );
          }

          return (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleOpen(params.row)}
            >
              Dispatch
            </Button>
          );
        },
      },
    ],
    [],
  );

  console.log("DispatchTable Rendered",activeRows);

  return (
    <>
    <Stack
  direction={{ xs: "column", md: "row" }}
  spacing={2}
  sx={{ mb: 2 }}
>
  {/* ROUTE */}

  <FormControl
    size="small"
    sx={{ minWidth: 180 }}
  >
    <InputLabel>Route</InputLabel>

    <Select
      value={routeFilter}
      label="Route"
      onChange={(e) =>
        setRouteFilter(e.target.value)
      }
    >
      <MenuItem value="">
        All Routes
      </MenuItem>

      {routes.map((route) => (
        <MenuItem
          key={route}
          value={route}
        >
          {route}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  {/* CUSTOMER */}

  <FormControl
    size="small"
    sx={{ minWidth: 180 }}
  >
    <InputLabel>Customer</InputLabel>

    <Select
      value={customerFilter}
      label="Customer"
      onChange={(e) =>
        setCustomerFilter(e.target.value)
      }
    >
      <MenuItem value="">
        All Customers
      </MenuItem>

      {customers.map((customer) => (
        <MenuItem
          key={customer}
          value={customer}
        >
          {customer}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  {/* SO NO */}

  <TextField
    size="small"
    label="Search SO No"
    value={soFilter}
    onChange={(e) =>
      setSoFilter(e.target.value)
    }
  />

  {/* CLEAR */}

  <Button
    variant="outlined"
    onClick={() => {
      setRouteFilter("");
      setCustomerFilter("");
      setSoFilter("");
    }}
  >
    Clear
  </Button>
</Stack>
      <Box
        sx={{
          width: "100%",

          height: "calc(100vh - 250px)",
        }}
      >
     <DataGrid
  rows={activeRows}
  columns={columns}
  loading={loading}
  getRowId={(row) =>
    row.cycleID ||
    row.id ||
    `${row.soNo}-${row.skuCode}-${row.rowNumber}`
  }
  disableRowSelectionOnClick
  density="compact"
  pageSizeOptions={[10, 20, 50]}
  initialState={{
    pagination: {
      paginationModel: {
        pageSize: 10,
      },
    },
  }}
/>
      </Box>

      <DispatchDialog open={open} onClose={handleClose} order={selectedOrder} />
    </>
  );
};

export default DispatchTable;
