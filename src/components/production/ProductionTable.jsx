
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
import PrintIcon from "@mui/icons-material/Print";

import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";

import UpdateProductionDialog from "./UpdateProductionDialog";

import {
  PROCESS_ORDER,
  getCurrentProcess,
  SUPERVISOR_PROCESSES,
} from "../../constant/productionProcess";

import SalesOrderPrint from "../salesOrder/salesorder-print/SalesOrderPrint";
import { productionPrintColumns } from "../../constant/printColumns/productionPrintColumn";

const PRODUCTION_PROCESSES = [
  "JOB_WORK",
  "WARPING",
  "FILLING",
  "MACHINE",
];

const normalize = (value) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

const ProductionTable = ({ rows = [], loading = false }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth?.user?.user);

  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [processFilter, setProcessFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [quickFilter, setQuickFilter] = useState("all");

  const userRole = String(
    user?.role || user?.roleName || user?.role_name || ""
  )
    .trim()
    .toLowerCase();

  const allowedProcesses = useMemo(() => {
    if (userRole === "admin") {
      return PROCESS_ORDER.map((process) => normalize(process.key))
        .filter((process) => PRODUCTION_PROCESSES.includes(process));
    }

    return (SUPERVISOR_PROCESSES?.[userRole] || [])
      .map(normalize)
      .filter((process) => PRODUCTION_PROCESSES.includes(process));
  }, [userRole]);

  const allowedProcessesSet = useMemo(
    () => new Set(allowedProcesses),
    [allowedProcesses]
  );

  // Only show active cycles whose current process is up to Machine.
  const activeRows = useMemo(() => {
    if (!Array.isArray(rows)) return [];

    return rows.filter((row) => {
      const masterStatus = normalize(row.production_status);

      if (!["PENDING", "IN_PROGRESS"].includes(masterStatus)) {
        return false;
      }

      const currentProcess = getCurrentProcess(row);
      const currentProcessKey = normalize(currentProcess?.key);

      return PRODUCTION_PROCESSES.includes(currentProcessKey);
    });
  }, [rows]);

  const filterOptions = useMemo(() => {
    const divisions = [
      ...new Set(activeRows.map((row) => row.division).filter(Boolean)),
    ].sort();

    const customers = [
      ...new Set(activeRows.map((row) => row.customer).filter(Boolean)),
    ].sort();

    const products = [
      ...new Set(activeRows.map((row) => row.product_name).filter(Boolean)),
    ].sort();

    return { divisions, customers, products };
  }, [activeRows]);

  const processOptions = useMemo(
    () =>
      PROCESS_ORDER.filter((process) =>
        allowedProcessesSet.has(normalize(process.key))
      ),
    [allowedProcessesSet]
  );

  const filteredRows = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return activeRows.filter((row) => {
      const currentProcess = getCurrentProcess(row);

      const searchableText = [
        row.so_no,
        row.cycle_id,
        row.customer,
        row.product_name,
        row.sku_code,
        row.division,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchValue || searchableText.includes(searchValue);

      const matchesDivision =
        divisionFilter === "all" ||
        String(row.division || "") === divisionFilter;

      const matchesCustomer =
        customerFilter === "all" ||
        String(row.customer || "") === customerFilter;

      const matchesProduct =
        productFilter === "all" ||
        String(row.product_name || "") === productFilter;

      const currentProcessKey = normalize(currentProcess?.key);

      const matchesProcess =
        processFilter === "all" ||
        currentProcessKey === normalize(processFilter);

      const matchesStatus =
        statusFilter === "all" ||
        currentProcess.status === statusFilter;

      let matchesQuickFilter = true;

      if (quickFilter === "ready") {
        matchesQuickFilter = currentProcess.status === "Pending";
      }

      if (quickFilter === "progress") {
        matchesQuickFilter = currentProcess.status === "In Progress";
      }

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

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setDivisionFilter("all");
    setCustomerFilter("all");
    setProductFilter("all");
    setProcessFilter("all");
    setStatusFilter("all");
    setQuickFilter("all");
  }, []);

  // Committed Date functionality remains enabled.
  const handleCommittedDateChange = useCallback(
    async (row, committedDate) => {
      if (!committedDate) {
        toast.error("Please select committed date");
        return;
      }

      try {
        const result = await dispatch(
          addCommitedDateToOrder({
            cycleID: row.cycle_id,
            division: row.division,
            committedDate,
            updatedBy: user?.userName || user?.name || "",
          })
        ).unwrap();

        toast.success(
          result?.message || "Committed date updated successfully"
        );

        await dispatch(getAllProductions(row.division)).unwrap();
      } catch (error) {
        console.error("Committed date update error:", error);

        const errorMessage =
          typeof error === "string"
            ? error
            : error?.message ||
              error?.error ||
              "Failed to update committed date";

        toast.error(
          typeof errorMessage === "string"
            ? errorMessage
            : JSON.stringify(errorMessage)
        );
      }
    },
    [dispatch, user]
  );

  const handleProcessAction = useCallback((row, action, process) => {
    setSelectedOrder({
      ...row,
      currentProcess: process,
    });

    setSelectedAction(action);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSelectedOrder(null);
    setSelectedAction(null);
  }, []);

  const columns = useMemo(
    () => [
      {
        field: "so_no",
        headerName: "SO No",
        width: 130,
      },
      {
        field: "created_at",
        headerName: "Received At",
        width: 170,
        valueFormatter: (value) =>
          value ? new Date(value).toLocaleDateString("en-IN") : "-",
      },
      {
        field: "cycle_id",
        headerName: "Cycle ID",
        width: 220,
      },
      {
        field: "customer",
        headerName: "Customer",
        width: 150,
      },
      {
        field: "product_name",
        headerName: "Product",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "division",
        headerName: "Division",
        width: 110,
        valueFormatter: (value) =>
          value ? String(value).toUpperCase() : "-",
      },
      {
        field: "commited_date",
        headerName: "Committed Date",
        width: 160,
        sortable: false,
        renderCell: (params) => {
          const value = params.row.commited_date || "";

          if (value) {
            return (
              <Typography
                variant="body2"
                sx={{
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {value}
              </Typography>
            );
          }

          return (
            <input
              type="date"
              value=""
              onChange={(event) =>
                handleCommittedDateChange(
                  params.row,
                  event.target.value
                )
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
      {
        field: "production_target_qty",
        headerName: "Target Qty (m)",
        type: "number",
        width: 140,
        align: "center",
        headerAlign: "center",
        valueFormatter: (value) =>
          value == null ? 0 : Number(value),
      },
      {
        field: "total_production_qty",
        headerName: "Total Produced Qty (m)",
        type: "number",
        width: 160,
        align: "center",
        headerAlign: "center",
        valueFormatter: (value) =>
          value == null ? 0 : Number(value),
      },
      {
        field: "production_qty",
        headerName: "Input Qty (m)",
        width: 140,
        align: "center",
        headerAlign: "center",
        sortable: false,
        valueGetter: (_value, row) => {
          const firstStage = row.stages?.find((stage) =>
            ["JOB_WORK", "WARPING"].includes(
              normalize(stage.stage_code)
            )
          );

          return Number(firstStage?.input_qty || 0);
        },
      },
      {
        field: "currentProcess",
        headerName: "Current Process",
        width: 160,
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
      {
        field: "currentStatus",
        headerName: "Status",
        width: 140,
        sortable: false,
        renderCell: (params) => {
          const process = getCurrentProcess(params.row);

          return (
            <Chip
              label={process.status}
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
      {
        field: "action",
        headerName: "Action",
        width: 220,
        sortable: false,
        renderCell: (params) => {
          const process = getCurrentProcess(params.row);
          const processKey = normalize(process?.key);

          if (
            userRole !== "admin" &&
            !allowedProcessesSet.has(processKey)
          ) {
            return (
              <Chip
                label="Other Department"
                variant="outlined"
                size="small"
              />
            );
          }

          if (process.status === "Completed") {
            return (
              <Chip
                label="Production Completed"
                color="success"
                size="small"
              />
            );
          }

          if (process.status === "Pending") {
            return (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() =>
                  handleProcessAction(
                    params.row,
                    "start",
                    process.key
                  )
                }
              >
                Start {process.label}
              </Button>
            );
          }

          if (
            ["In Progress", "Partially Released"].includes(
              process.status
            )
          ) {
            return (
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() =>
                  handleProcessAction(
                    params.row,
                    "complete",
                    process.key
                  )
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
    [
      handleCommittedDateChange,
      handleProcessAction,
      userRole,
      allowedProcessesSet,
    ]
  );

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#fafafa",
            border: "1px solid #e0e0e0",
          }}
        >
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
                Production cycles from Job Work through Machine
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

          <TextField
            fullWidth
            size="small"
            placeholder="Search SO No, Customer, Product, Cycle ID..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

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
            <TextField
              select
              size="small"
              label="Division"
              value={divisionFilter}
              onChange={(event) =>
                setDivisionFilter(event.target.value)
              }
            >
              <MenuItem value="all">All Divisions</MenuItem>
              {filterOptions.divisions.map((division) => (
                <MenuItem key={division} value={division}>
                  {division}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Customer"
              value={customerFilter}
              onChange={(event) =>
                setCustomerFilter(event.target.value)
              }
            >
              <MenuItem value="all">All Customers</MenuItem>
              {filterOptions.customers.map((customer) => (
                <MenuItem key={customer} value={customer}>
                  {customer}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Product"
              value={productFilter}
              onChange={(event) =>
                setProductFilter(event.target.value)
              }
            >
              <MenuItem value="all">All Products</MenuItem>
              {filterOptions.products.map((product) => (
                <MenuItem key={product} value={product}>
                  {product}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Process"
              value={processFilter}
              onChange={(event) =>
                setProcessFilter(event.target.value)
              }
            >
              <MenuItem value="all">All My Processes</MenuItem>
              {processOptions.map((process) => (
                <MenuItem key={process.key} value={process.key}>
                  {process.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Partially Released">
                Partially Released
              </MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
          </Box>

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
              sx={{ alignSelf: "center", mr: 0.5 }}
            >
              Quick:
            </Typography>

            <Button
              size="small"
              variant={
                quickFilter === "all" ? "contained" : "outlined"
              }
              onClick={() => setQuickFilter("all")}
            >
              All
            </Button>

            <Button
              size="small"
              variant={
                quickFilter === "ready" ? "contained" : "outlined"
              }
              color="warning"
              onClick={() => setQuickFilter("ready")}
            >
              Ready to Start
            </Button>

            <Button
              size="small"
              variant={
                quickFilter === "progress" ? "contained" : "outlined"
              }
              color="info"
              onClick={() => setQuickFilter("progress")}
            >
              In Progress
            </Button>

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
            getRowId={(row) =>
              row.production_id || row.cycle_id
            }
            disableRowSelectionOnClick
            density="compact"
            pageSizeOptions={[10, 20, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
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
