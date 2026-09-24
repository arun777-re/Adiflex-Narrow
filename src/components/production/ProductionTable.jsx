import { useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addCommitedDateToOrder,
  getAllProductions,
} from "../../redux/slices/productionSlice";

import {
  Button,
  Chip,
  Box,
  Stack,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

import { DataGrid } from "@mui/x-data-grid";

import UpdateProductionDialog from "./UpdateProductionDialog";
import {
  PROCESS_ORDER,
  getCurrentProcess,
} from "../../constant/productionProcess";
import PrintIcon from "@mui/icons-material/Print";
import SalesOrderPrint from "../salesOrder/salesorder-print/SalesOrderPrint";
import { productionPrintColumns } from "../../constant/printColumns/productionPrintColumn";
import toast from "react-hot-toast";

// =====================================================
// COMPONENT
// =====================================================

const ProductionTable = ({ rows = [], loading = false }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user?.user);

  const [open, setOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [selectedAction, setSelectedAction] = useState(null);

  // =====================================================
  // FILTER STATES
  // =====================================================

  const [search, setSearch] = useState("");

  const [divisionFilter, setDivisionFilter] = useState("all");

  const [customerFilter, setCustomerFilter] = useState("all");

  const [productFilter, setProductFilter] = useState("all");

  const [processFilter, setProcessFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  // =====================================================
  // QUICK FILTER
  // =====================================================

  const [quickFilter, setQuickFilter] = useState("all");

  // =====================================================
  // REMOVE COMPLETED ROWS
  // =====================================================

  const activeRows = useMemo(() => {
    if (!Array.isArray(rows)) {
      return [];
    }

    return rows.filter((row) => {
      return (
        row.status !== "Completed" &&
        row.status !== "Cycle Completed" &&
        row.overAllStatus !== "Completed" &&
        row.overAllStatus !== "Cycle Completed"
      );
    });
  }, [rows]);

  // =====================================================
  // DROPDOWN OPTIONS
  // =====================================================

  const filterOptions = useMemo(() => {
    const divisions = [
      ...new Set(activeRows.map((row) => row.division).filter(Boolean)),
    ].sort();

    const customers = [
      ...new Set(activeRows.map((row) => row.customer).filter(Boolean)),
    ].sort();

    const products = [
      ...new Set(activeRows.map((row) => row.product).filter(Boolean)),
    ].sort();

    return {
      divisions,
      customers,
      products,
    };
  }, [activeRows]);

  // =====================================================
  // FILTERED ROWS
  // =====================================================

  const filteredRows = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return activeRows.filter((row) => {
      const currentProcess = getCurrentProcess(row);

      // =================================================
      // SEARCH
      // =================================================

      const searchableText = [
        row.soNo,
        row.cycleID,
        row.customer,
        row.product,
        row.skuCode,
        row.division,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchValue || searchableText.includes(searchValue);

      // =================================================
      // DIVISION
      // =================================================

      const matchesDivision =
        divisionFilter === "all" ||
        String(row.division || "") === divisionFilter;

      // =================================================
      // CUSTOMER
      // =================================================

      const matchesCustomer =
        customerFilter === "all" ||
        String(row.customer || "") === customerFilter;

      // =================================================
      // PRODUCT
      // =================================================

      const matchesProduct =
        productFilter === "all" || String(row.product || "") === productFilter;

      // =================================================
      // PROCESS
      // =================================================

      const matchesProcess =
        processFilter === "all" || currentProcess.key === processFilter;

      // =================================================
      // STATUS
      // =================================================

      const matchesStatus =
        statusFilter === "all" || currentProcess.status === statusFilter;

      // =================================================
      // QUICK FILTER
      // =================================================

      let matchesQuickFilter = true;

      if (quickFilter === "ready") {
        matchesQuickFilter = currentProcess.status === "Pending";
      }

      if (quickFilter === "progress") {
        matchesQuickFilter = currentProcess.status === "In Progress";
      }

      // =================================================
      // FINAL
      // =================================================

      return (
        matchesSearch &&
        matchesDivision &&
        matchesCustomer &&
        matchesProduct &&
        matchesProcess &&
        matchesStatus &&
        matchesQuickFilter
      );
    });
  }, [
    activeRows,
    search,
    divisionFilter,
    customerFilter,
    productFilter,
    processFilter,
    statusFilter,
    quickFilter,
  ]);

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const handleResetFilters = () => {
    setSearch("");

    setDivisionFilter("all");

    setCustomerFilter("all");

    setProductFilter("all");

    setProcessFilter("all");

    setStatusFilter("all");

    setQuickFilter("all");
  };

  // =====================================================
  // UPDATE COMMITTED DATE
  // =====================================================

  const handleCommittedDateChange = useCallback(
    async (row, committedDate) => {
      console.log("📅 DATE SELECTED:", committedDate);

      if (!committedDate) {
        toast.error("Please select committed date");
        return;
      }

      try {
        const result = await dispatch(
          addCommitedDateToOrder({
            cycleID: row.cycleID,
            division: row.division,
            committedDate: committedDate,
            updatedBy: user?.userName || user?.name || "",
          }),
        ).unwrap();

        toast.success(result?.message || "Committed date updated successfully");
        await dispatch(getAllProductions(row.division)).unwrap();
      } catch (error) {
        console.error("❌ Committed date update error:", error);

        let errorMessage = "Failed to update committed date";

        if (typeof error === "string") {
          errorMessage = error;
        } else if (error?.message) {
          errorMessage =
            typeof error.message === "string"
              ? error.message
              : JSON.stringify(error.message);
        } else if (error?.error) {
          errorMessage =
            typeof error.error === "string"
              ? error.error
              : JSON.stringify(error.error);
        }

        toast.error(errorMessage);
      }
    },
    [dispatch, user],
  );
  // =====================================================
  // OPEN DIALOG
  // =====================================================

  const handleProcessAction = (row, action, process) => {
    setSelectedOrder({
      ...row,
      currentProcess: process,
    });

    setSelectedAction(action);

    setOpen(true);
  };

  // =====================================================
  // CLOSE DIALOG
  // =====================================================

  const handleClose = () => {
    setOpen(false);

    setSelectedOrder(null);

    setSelectedAction(null);
  };

  // =====================================================
  // COLUMNS
  // =====================================================

  const columns = useMemo(
    () => [
      // =================================================
      // SO NO
      // =================================================

      {
        field: "soNo",
        headerName: "SO No",
        width: 130,
      },
      {
        field: "receivedAt",
        headerName: "Received At",
        width: 130,
      },

      // =================================================
      // CYCLE
      // =================================================

      {
        field: "cycleID",

        headerName: "Cycle ID",

        width: 130,
      },

      // =================================================
      // CUSTOMER
      // =================================================

      {
        field: "customer",

        headerName: "Customer",

        width: 180,
      },

      // =================================================
      // PRODUCT
      // =================================================

      {
        field: "product",

        headerName: "Product",

        flex: 1.5,

        minWidth: 220,
      },

      // =================================================
      // DIVISION
      // =================================================
      {
        field: "committedDate",
        headerName: "Committed Date",
        width: 170,
        sortable: false,

        renderCell: (params) => {
          const value = params.row.committedDate || "";

          // Date already available
          if (value) {
            return (
              <Typography
                variant="body2"
                sx={{
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                onClick={() => handleCommittedDateChange(params.row, value)}
              >
                {value}
              </Typography>
            );
          }

          // Date not available → show calendar
          return (
            <input
              type="date"
              value=""
              onChange={(e) =>
                handleCommittedDateChange(params.row, e.target.value)
              }
              style={{
                width: "145px",
                height: "32px",
                padding: "4px 8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "13px",
                cursor: "pointer",
              }}
            />
          );
        },
      },

      // =================================================
      // TARGET
      // =================================================

      {
        field: "productionTargetQty",
        headerName: "Target Qty",
        type: "number",
        width: 130,
        align: "center",
        headerAlign: "center",
      },

      // =================================================
      // PRODUCTION QTY
      // =================================================

      {
        field: "productionQty",

        headerName: "Production Qty",

        type: "number",

        width: 150,

        align: "center",

        headerAlign: "center",
      },

      // =================================================
      // CURRENT PROCESS
      // =================================================

      {
        field: "currentProcess",

        headerName: "Current Process",

        width: 170,

        sortable: false,

        renderCell: (params) => {
          const process = getCurrentProcess(params.row);

          return (
            <Chip
              label={process.label}
              color={
                process.status === "Completed"
                  ? "success"
                  : process.status === "In Progress"
                    ? "info"
                    : "warning"
              }
              size="small"
            />
          );
        },
      },

      // =================================================
      // STATUS
      // =================================================

      {
        field: "currentStatus",

        headerName: "Status",

        width: 140,

        sortable: false,

        renderCell: (params) => {
          const process = getCurrentProcess(params.row);

          let color = "warning";

          if (process.status === "In Progress") {
            color = "info";
          }

          if (process.status === "Completed") {
            color = "success";
          }

          return <Chip label={process.status} color={color} size="small" />;
        },
      },

      // =================================================
      // ACTION
      // =================================================

      {
        field: "action",

        headerName: "Action",

        width: 220,

        sortable: false,

        renderCell: (params) => {
          const process = getCurrentProcess(params.row);

          // ALL COMPLETED

          if (process.status === "Completed") {
            return (
              <Chip label="Production Completed" color="success" size="small" />
            );
          }

          // PENDING

          if (process.status === "Pending") {
            return (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() =>
                  handleProcessAction(params.row, "start", process.key)
                }
              >
                Start {process.label}
              </Button>
            );
          }

          // IN PROGRESS

          if (process.status === "In Progress") {
            return (
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() =>
                  handleProcessAction(params.row, "complete", process.key)
                }
              >
                Complete {process.label}
              </Button>
            );
          }

          return null;
        },
      },
    ],
    [handleCommittedDateChange],
  );

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Box sx={{ width: "100%" }}>
        {/* =================================================
            FILTER PANEL
        ================================================= */}

        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#fafafa",
            border: "1px solid #e0e0e0",
          }}
        >
          {/* =============================================
              TITLE
          ============================================= */}

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Production Planning
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Find production cycles that need attention
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={`${filteredRows.length} Production Cycles`}
                color="primary"
                variant="outlined"
              />

              <Button
                variant="contained"
                size="small"
                startIcon={<PrintIcon />}
                onClick={() => window.print()}
              >
                Print
              </Button>
            </Stack>
          </Stack>

          {/* =============================================
              SEARCH
          ============================================= */}

          <TextField
            fullWidth
            size="small"
            placeholder="Search SO No, Customer, Product, Cycle ID..."
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

          {/* =============================================
              DROPDOWN FILTERS
          ============================================= */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(5, 1fr)",
              },
              gap: 1.5,
            }}
          >
            {/* DIVISION */}

            <TextField
              select
              size="small"
              label="Division"
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
            >
              <MenuItem value="all">All Divisions</MenuItem>

              {filterOptions.divisions.map((division) => (
                <MenuItem key={division} value={division}>
                  {division}
                </MenuItem>
              ))}
            </TextField>

            {/* CUSTOMER */}

            <TextField
              select
              size="small"
              label="Customer"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
            >
              <MenuItem value="all">All Customers</MenuItem>

              {filterOptions.customers.map((customer) => (
                <MenuItem key={customer} value={customer}>
                  {customer}
                </MenuItem>
              ))}
            </TextField>

            {/* PRODUCT */}

            <TextField
              select
              size="small"
              label="Product"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
            >
              <MenuItem value="all">All Products</MenuItem>

              {filterOptions.products.map((product) => (
                <MenuItem key={product} value={product}>
                  {product}
                </MenuItem>
              ))}
            </TextField>

            {/* PROCESS */}

            <TextField
              select
              size="small"
              label="Process"
              value={processFilter}
              onChange={(e) => setProcessFilter(e.target.value)}
            >
              <MenuItem value="all">All Processes</MenuItem>

              {PROCESS_ORDER.map((process) => (
                <MenuItem key={process.key} value={process.key}>
                  {process.label}
                </MenuItem>
              ))}

              <MenuItem value="jobWork">Job Work</MenuItem>
            </TextField>

            {/* STATUS */}

            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>

              <MenuItem value="Pending">Pending</MenuItem>

              <MenuItem value="In Progress">In Progress</MenuItem>
            </TextField>
          </Box>

          {/* =============================================
              QUICK FILTERS
          ============================================= */}

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: 2 }}
          >
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{
                alignSelf: "center",
                mr: 0.5,
              }}
            >
              Quick:
            </Typography>

            <Button
              size="small"
              variant={quickFilter === "all" ? "contained" : "outlined"}
              onClick={() => setQuickFilter("all")}
            >
              All
            </Button>

            <Button
              size="small"
              variant={quickFilter === "ready" ? "contained" : "outlined"}
              color="warning"
              onClick={() => setQuickFilter("ready")}
            >
              Ready to Start
            </Button>

            <Button
              size="small"
              variant={quickFilter === "progress" ? "contained" : "outlined"}
              color="info"
              onClick={() => setQuickFilter("progress")}
            >
              In Progress
            </Button>

            {/* RESET */}

            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<FilterAltOffIcon />}
              onClick={handleResetFilters}
              sx={{ ml: "auto" }}
            >
              Reset Filters
            </Button>
          </Stack>
        </Box>

        {/* =================================================
            DATA GRID
        ================================================= */}

        <Box
          sx={{
            width: "100%",
            height: "calc(100vh - 430px)",
            minHeight: 400,
          }}
        >
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id || row.cycleID}
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
            sx={{
              borderRadius: 2,

              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                fontWeight: 700,
              },

              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 700,
              },

              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f1f8ff",
              },
            }}
          />
        </Box>
      </Box>
      {/* =================================================
          PRINT ONLY
      ================================================= */}

      <Box className="production-print-only">
        <SalesOrderPrint
          title="PRODUCTION PLANNING REPORT"
          rows={filteredRows}
          columns={productionPrintColumns}
          meta={[
            {
              label: "Production Cycles",
              value: filteredRows.length,
            },
          ]}
        />
      </Box>
      {/* =================================================
          PROCESS DIALOG
      ================================================= */}

      <UpdateProductionDialog
        open={open}
        onClose={handleClose}
        order={selectedOrder}
        process={selectedOrder?.currentProcess}
        action={selectedAction}
      />
    </>
  );
};

export default ProductionTable;
