import { useEffect, useState, useMemo } from "react";
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

import RefreshIcon from "@mui/icons-material/Refresh";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import SalesOrderTable from "../../components/salesOrder/SalesOrderTable";

import { useDispatch, useSelector } from "react-redux";
import { fetchSalesOrders } from "../../redux/slices/salesOrderSlice";
import SalesOrderCards from "../../components/salesOrder/SalesOrderCards";

const SalesOrder = () => {
  const dispatch = useDispatch();

  const { salesOrders, loading } = useSelector((state) => state.salesOrder);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [customer, setCustomer] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [division, setDivision] = useState("All");
  const [isTable, setTable] = useState(false);

  useEffect(() => {
    dispatch(fetchSalesOrders());
  }, [dispatch]);

  console.log("salesOrders12345", salesOrders);
  const customers = [
    "All",
    ...new Set(salesOrders.map((item) => item.customer).filter(Boolean)),
  ];

  const totalOrders = salesOrders.length;

  const pendingOrders = salesOrders.filter(
    (item) =>
      item.productionstatus === "Pending Production" ||
      item.dispatchstatus === "Pending Dispatch",
  ).length;

  const completedOrders = salesOrders.filter(
    (item) =>
      item.productionstatus === "Completed" &&
      item.dispatchstatus === "Dispatched",
  ).length;

  const cancelledOrders = salesOrders.filter(
    (item) => item.status === "Cancelled",
  ).length;

  const filteredRows = useMemo(() => {
    const normalize = (value) =>
      String(value ?? "")
        .trim()
        .toLowerCase();

    // Today's local date: YYYY-MM-DD
    const today = new Date();

    const todayStr = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    // Start of current week - Sunday
    const startOfWeek = new Date(today);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(today.getDate() - today.getDay());

    // End of current week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Start of current month
    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );

    // End of current month
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
      const searchText = normalize(search);

      // ================= SEARCH =================
      const matchesSearch =
        searchText === "" ||
        normalize(row.soNo).includes(searchText) ||
        normalize(row.customer).includes(searchText) ||
        normalize(row.product).includes(searchText);

      // ================= STATUS =================
      const matchesStatus =
        status === "All" ||
        (status === "Pending" &&
          (normalize(row.productionstatus) === "pending production" ||
            normalize(row.dispatchstatus) === "pending dispatch")) ||
        (status === "Completed" &&
          normalize(row.productionstatus) === "completed" &&
          normalize(row.dispatchstatus) === "dispatched");

      // ================= CUSTOMER =================
      const matchesCustomer =
        customer === "All" || normalize(row.customer) === normalize(customer);

      // ================= DIVISION =================
      const matchesDivision =
        division === "All" || normalize(row.division) === normalize(division);

      // ================= DATE =================
      let matchesDate = true;

      if (row.date && dateFilter !== "All") {
        // Keep date as YYYY-MM-DD without UTC conversion
        const rowDateStr = String(row.date).slice(0, 10);

        if (dateFilter === "Today") {
          matchesDate = rowDateStr === todayStr;
        }

        if (dateFilter === "This Week") {
          const [year, month, day] = rowDateStr.split("-").map(Number);

          const orderDate = new Date(year, month - 1, day);

          matchesDate = orderDate >= startOfWeek && orderDate <= endOfWeek;
        }

        if (dateFilter === "This Month") {
          const [year, month, day] = rowDateStr.split("-").map(Number);

          const orderDate = new Date(year, month - 1, day);

          matchesDate = orderDate >= startOfMonth && orderDate <= endOfMonth;
        }
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCustomer &&
        matchesDivision &&
        matchesDate
      );
    });
  }, [salesOrders, search, status, customer, division, dateFilter]);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        bgcolor: "#f5f7fb",
        minHeight: "100vh",
        height: "auto",
      }}
    >
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        mb={3}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Sales Orders
          </Typography>

          <Typography color="text.secondary">
            Manage all customer sales orders
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => dispatch(fetchSalesOrders())}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
          }}
        >
          Refresh
        </Button>
      </Stack>

      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary">Total Orders</Typography>

                  <Typography variant="h4" fontWeight={700}>
                    {totalOrders}
                  </Typography>
                </Box>

                <ShoppingCartIcon color="primary" sx={{ fontSize: 42 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary">Pending</Typography>

                  <Typography variant="h4" fontWeight={700}>
                    {pendingOrders}
                  </Typography>
                </Box>

                <PendingActionsIcon color="warning" sx={{ fontSize: 42 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary">Completed</Typography>

                  <Typography variant="h4" fontWeight={700}>
                    {completedOrders}
                  </Typography>
                </Box>

                <CheckCircleIcon color="success" sx={{ fontSize: 42 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary">Cancelled</Typography>

                  <Typography variant="h4" fontWeight={700}>
                    {cancelledOrders}
                  </Typography>
                </Box>

                <CancelIcon color="error" sx={{ fontSize: 42 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 3,
          border: "1px solid #e5e7eb",
          position:"sticky",
          top:0,
          zIndex: 1,
          backgroundColor: "#fff",
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Search"
              placeholder="SO No / Customer / Product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              fullWidth
              select
              size="small"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {["All", "Pending", "Completed"].map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              fullWidth
              select
              size="small"
              label="Division"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>

              <MenuItem value="Woven">Woven</MenuItem>

              <MenuItem value="Crochet">Crochet</MenuItem>
            </TextField>
          </Grid>
          {/* customer search */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Autocomplete
              freeSolo
              options={customers}
              value={customer === "All" ? null : customer}
              onChange={(event, newValue) => {
                setCustomer(newValue || "All");
              }}
              onInputChange={(event, newInputValue) => {
                setCustomer(newInputValue || "All");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  label="Customer"
                  placeholder="Select or type customer"
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              fullWidth
              select
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

          <Grid size={{ xs: 12, md: 2 }} display="flex" alignItems="center">
            <Button
              fullWidth
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={() => dispatch(fetchSalesOrders())}
              sx={{
                height: 40,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Sales Order Table */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 24px rgba(0,0,0,.05)",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid #eee",
            bgcolor: "#fafafa",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Sales Order List
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Showing {filteredRows.length} of {salesOrders.length} Orders
          </Typography>
        </Box>

        <Box
          sx={{
            overflowX: "auto",
            minWidth: 0,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setTable((prev) => !prev)}
            sx={{
              mb: 2,
              ml: 3,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {isTable ? "View as Cards" : "View as Table"}
          </Button>
          {isTable ? (
            <SalesOrderTable rows={filteredRows} loading={loading} />
          ) : (
            <SalesOrderCards rows={filteredRows} loading={loading} />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default SalesOrder;
