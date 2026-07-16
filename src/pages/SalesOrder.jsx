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
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import SalesOrderTable from "../components/salesOrder/SalesOrderTable";

import { useDispatch, useSelector } from "react-redux";
import { fetchSalesOrders } from "../redux/slices/salesOrderSlice";

const SalesOrder = () => {
  const dispatch = useDispatch();

  const { salesOrders, loading } = useSelector(
    (state) => state.salesOrder
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [customer, setCustomer] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchSalesOrders());
  }, [dispatch]);

  console.log("salesOrders12345", salesOrders);
  const customers = [
    "All",
    ...new Set(
      salesOrders
        .map((item) => item.customer)
        .filter(Boolean)
    ),
  ];

  const totalOrders = salesOrders.length;

  const pendingOrders = salesOrders.filter(
    (item) =>
      item.status !== "Completed" &&
      item.status !== "Cancelled"
  ).length;

  const completedOrders = salesOrders.filter(
    (item) => item.status === "Completed"
  ).length;

  const cancelledOrders = salesOrders.filter(
    (item) => item.status === "Cancelled"
  ).length;

  const filteredRows = useMemo(() => {
    return salesOrders.filter((row) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        searchText === "" ||
        row.soNo?.toLowerCase().includes(searchText) ||
        row.customer?.toLowerCase().includes(searchText) ||
        row.product?.toLowerCase().includes(searchText);

      const matchesStatus =
        status === "All" || row.status === status;

      const matchesCustomer =
        customer === "All" || row.customer === customer;

      let matchesDate = true;

      const today = new Date();

      if (dateFilter === "Today") {
        matchesDate =
          row.date === today.toISOString().slice(0, 10);
      }

      if (dateFilter === "This Week") {
        const orderDate = new Date(row.date);

        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() - today.getDay());

        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);

        matchesDate =
          orderDate >= firstDay &&
          orderDate <= lastDay;
      }

      if (dateFilter === "This Month") {
        const orderDate = new Date(row.date);

        matchesDate =
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() ===
            today.getFullYear();
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCustomer &&
        matchesDate
      );
    });
  }, [
    salesOrders,
    search,
    status,
    customer,
    dateFilter,
  ]);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        bgcolor: "#f5f7fb",
        minHeight: "100vh",
        height:"auto",
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
          <Typography
            variant="h4"
            fontWeight={700}
          >
            Sales Orders
          </Typography>

          <Typography color="text.secondary">
            Manage all customer sales orders
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() =>
            dispatch(fetchSalesOrders())
          }
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
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    color="text.secondary"
                  >
                    Total Orders
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                  >
                    {totalOrders}
                  </Typography>
                </Box>

                <ShoppingCartIcon
                  color="primary"
                  sx={{ fontSize: 42 }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    color="text.secondary"
                  >
                    Pending
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                  >
                    {pendingOrders}
                  </Typography>
                </Box>

                <PendingActionsIcon
                  color="warning"
                  sx={{ fontSize: 42 }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    color="text.secondary"
                  >
                    Completed
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                  >
                    {completedOrders}
                  </Typography>
                </Box>

                <CheckCircleIcon
                  color="success"
                  sx={{ fontSize: 42 }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    color="text.secondary"
                  >
                    Cancelled
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                  >
                    {cancelledOrders}
                  </Typography>
                </Box>

                <CancelIcon
                  color="error"
                  sx={{ fontSize: 42 }}
                />
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
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              fullWidth
              select
              size="small"
              label="Status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              {[
                "All",
                "Start",
                "Printing",
                "Lamination",
                "Cutting",
                "Packing",
                "Completed",
                "Cancelled",
              ].map((item) => (
                <MenuItem
                  key={item}
                  value={item}
                >
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              select
              size="small"
              label="Customer"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            >
              {customers.map((item) => (
                <MenuItem
                  key={item}
                  value={item}
                >
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

          <Grid
            size={{ xs: 12, md: 2 }}
            display="flex"
            alignItems="center"
          >
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
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Sales Order List
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Showing {filteredRows.length} of {salesOrders.length} Orders
          </Typography>
        </Box>

        <Box
          sx={{
            overflowX: "auto",
            minWidth: 0,
          }}
        >
          <SalesOrderTable
            rows={filteredRows}
            loading={loading}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default SalesOrder;