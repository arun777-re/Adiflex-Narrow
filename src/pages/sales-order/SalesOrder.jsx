import { useEffect, useMemo, useState, useCallback } from "react";

import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Stack,
  Autocomplete,
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import SalesOrderPrint from "../../components/salesOrder/salesorder-print/SalesOrderPrint";
import "../../components/salesOrder/salesorder-print/SalesOrderPrint.css";

import SalesOrderTable from "../../components/salesOrder/SalesOrderTable";
import SalesOrderCards from "../../components/salesOrder/SalesOrderCards";
import EditSalesOrderDialog from "../../components/salesOrder/EditSalesOrderDialog";

import { useDispatch, useSelector } from "react-redux";
import { fetchSalesOrders } from "../../redux/slices/salesOrderSlice";

const SalesOrder = () => {
  const dispatch = useDispatch();

  const { salesOrders = [], loading } = useSelector(
    (state) => state.salesOrder,
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [customer, setCustomer] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [division, setDivision] = useState("All");

  // Table by default = better for large datasets
  const [isTable, setTable] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --------------------------------------------------
  // FETCH SALES ORDERS
  // --------------------------------------------------

  const loadSalesOrders = useCallback(() => {
    dispatch(fetchSalesOrders());
  }, [dispatch]);

  useEffect(() => {
    loadSalesOrders();
  }, [loadSalesOrders]);

  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  const handleEdit = useCallback((row) => {
    setSelectedOrder(row);
    setEditOpen(true);
  }, []);

  const handleEditClose = useCallback(() => {
    setEditOpen(false);
    setSelectedOrder(null);
  }, []);

  const handleEditSuccess = useCallback(() => {
    setEditOpen(false);
    setSelectedOrder(null);

    // Refresh only after successful edit
    dispatch(fetchSalesOrders());
  }, [dispatch]);

  // --------------------------------------------------
  // CUSTOMERS
  // --------------------------------------------------

  const customers = useMemo(() => {
    const customerSet = new Set();

    for (const item of salesOrders) {
      if (item.customer) {
        customerSet.add(item.customer);
      }
    }

    return ["All", ...customerSet];
  }, [salesOrders]);

  // --------------------------------------------------
  // KPI
  // --------------------------------------------------

  const summary = useMemo(() => {
    let pending = 0;
    let completed = 0;
    let cancelled = 0;

    for (const item of salesOrders) {
      const productionStatus = String(item.productionstatus || "")
        .trim()
        .toLowerCase();

      const dispatchStatus = String(item.dispatchstatus || "")
        .trim()
        .toLowerCase();

      const orderStatus = String(item.status || "")
        .trim()
        .toLowerCase();

      if (
        productionStatus === "pending production" ||
        dispatchStatus === "pending dispatch"
      ) {
        pending++;
      }

      if (productionStatus === "completed" && dispatchStatus === "dispatched") {
        completed++;
      }

      if (orderStatus === "cancelled") {
        cancelled++;
      }
    }

    return {
      total: salesOrders.length,
      pending,
      completed,
      cancelled,
    };
  }, [salesOrders]);

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredRows = useMemo(() => {
    const normalizedSearch = String(search).trim().toLowerCase();

    const normalizedCustomer = String(customer).trim().toLowerCase();

    const normalizedDivision = String(division).trim().toLowerCase();

    const today = new Date();

    const todayStr = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    const startOfWeek = new Date(today);
    startOfWeek.setHours(0, 0, 0, 0);

    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(startOfWeek);

    endOfWeek.setDate(startOfWeek.getDate() + 6);

    endOfWeek.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    return salesOrders.filter((row) => {
      // -------------------------
      // SEARCH
      // -------------------------

      const matchesSearch =
        !normalizedSearch ||
        String(row.soNo || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(row.customer || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(row.product || "")
          .toLowerCase()
          .includes(normalizedSearch);

      if (!matchesSearch) return false;

      // -------------------------
      // STATUS
      // -------------------------

      if (status !== "All") {
        const productionStatus = String(row.productionstatus || "")
          .trim()
          .toLowerCase();

        const dispatchStatus = String(row.dispatchstatus || "")
          .trim()
          .toLowerCase();

        if (status === "Pending") {
          const pending =
            productionStatus === "pending production" ||
            dispatchStatus === "pending dispatch";

          if (!pending) return false;
        }

        if (status === "Completed") {
          const completed =
            productionStatus === "completed" && dispatchStatus === "dispatched";

          if (!completed) return false;
        }
      }

      // -------------------------
      // CUSTOMER
      // -------------------------

      if (
        normalizedCustomer !== "all" &&
        String(row.customer || "")
          .trim()
          .toLowerCase() !== normalizedCustomer
      ) {
        return false;
      }

      // -------------------------
      // DIVISION
      // -------------------------

      if (
        normalizedDivision !== "all" &&
        String(row.division || "")
          .trim()
          .toLowerCase() !== normalizedDivision
      ) {
        return false;
      }

      // -------------------------
      // DATE
      // -------------------------

      if (dateFilter !== "All" && row.date) {
        const rowDateStr = String(row.date).slice(0, 10);

        if (dateFilter === "Today" && rowDateStr !== todayStr) {
          return false;
        }

        if (dateFilter === "This Week" || dateFilter === "This Month") {
          const [year, month, day] = rowDateStr.split("-").map(Number);

          const rowDate = new Date(year, month - 1, day);

          if (
            dateFilter === "This Week" &&
            (rowDate < startOfWeek || rowDate > endOfWeek)
          ) {
            return false;
          }

          if (
            dateFilter === "This Month" &&
            (rowDate < startOfMonth || rowDate > endOfMonth)
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [salesOrders, search, status, customer, division, dateFilter]);

  // --------------------------------------------------
  // REFRESH
  // --------------------------------------------------

  const handleRefresh = useCallback(() => {
    dispatch(fetchSalesOrders());
  }, [dispatch]);

  // --------------------------------------------------
  // PRINT
  // --------------------------------------------------

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 3,
        },
        bgcolor: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* =========================================
          HEADER
      ========================================= */}

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Sales Orders
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Manage and track all sales orders
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print
          </Button>
        </Stack>
      </Stack>

      {/* =========================================
          KPI CARDS
      ========================================= */}

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>

                  <Typography variant="h4" fontWeight={700}>
                    {summary.total}
                  </Typography>
                </Box>

                <ShoppingCartIcon />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>

                  <Typography variant="h4" fontWeight={700}>
                    {summary.pending}
                  </Typography>
                </Box>

                <PendingActionsIcon />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>

                  <Typography variant="h4" fontWeight={700}>
                    {summary.completed}
                  </Typography>
                </Box>

                <CheckCircleIcon />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Cancelled
                  </Typography>

                  <Typography variant="h4" fontWeight={700}>
                    {summary.cancelled}
                  </Typography>
                </Box>

                <CancelIcon />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* =========================================
          FILTERS
      ========================================= */}

      <Paper
        sx={{
          p: 2,
          mb: 3,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>

              <MenuItem value="Pending">Pending</MenuItem>

              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Autocomplete
              size="small"
              options={customers}
              value={customer}
              onChange={(_, value) => setCustomer(value || "All")}
              renderInput={(params) => (
                <TextField {...params} label="Customer" />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="Division"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>

              <MenuItem value="WOVEN">WOVEN</MenuItem>

              <MenuItem value="CROCHET">CROCHET</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="Date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>

              <MenuItem value="Today">Today</MenuItem>

              <MenuItem value="This Week">This Week</MenuItem>

              <MenuItem value="This Month">This Month</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setTable((prev) => !prev)}
            >
              {isTable ? "Cards" : "Table"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* =========================================
          RESULTS
      ========================================= */}

      <Box
        className="sales-order-print-area"
        sx={{
          width: "100%",
          minWidth: 0,
        }}
      >
        {isTable ? (
          <SalesOrderTable rows={filteredRows} loading={loading} />
        ) : (
          <SalesOrderCards
            rows={filteredRows}
            loading={loading}
            onEdit={handleEdit}
          />
        )}
      </Box>

      {/* =========================================
          PRINT COMPONENT
          IMPORTANT:
          Do NOT render on normal page load
      ========================================= */}

      <Box
        className="sales-order-print-only"
        sx={{
          display: "none",
        }}
      >
        <SalesOrderPrint rows={filteredRows} />
      </Box>

      {/* =========================================
          EDIT
      ========================================= */}

      <EditSalesOrderDialog
        open={editOpen}
        row={selectedOrder}
        onClose={handleEditClose}
        onSuccess={handleEditSuccess}
      />
    </Box>
  );
};

export default SalesOrder;
