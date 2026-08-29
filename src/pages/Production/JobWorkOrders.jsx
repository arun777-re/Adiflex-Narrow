import React, { useEffect, useMemo } from "react";

import {
  Box,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { useDispatch, useSelector } from "react-redux";

import { fetchSalesOrders } from "../../redux/slices/salesOrderSlice";

const JobWorkOrders = () => {
  const dispatch = useDispatch();

  const { salesOrders, loading } = useSelector(
    (state) => state.salesOrder
  );

  // ==========================================
  // FETCH SALES ORDERS
  // ==========================================
const currentDivision = useSelector((state)=> state.auth?.user?.user?.division);
useEffect(() => {
  console.log("🔥 JobWorkOrders mounted",currentDivision);
  dispatch(fetchSalesOrders(currentDivision));
}, [dispatch]);

  // ==========================================
  // JOB WORK ORDERS ONLY
  // ==========================================

  const jobWorkOrders = useMemo(() => {
    if (!Array.isArray(salesOrders)) {
      return [];
    }

    return salesOrders.filter(
      (order) =>
        order.jobWork === true ||
        String(order.jobWork).toLowerCase() === "true"
    );
  }, [salesOrders]);

  // ==========================================
  // COLUMNS
  // ==========================================

  const columns = [
    {
      field: "soNo",
      headerName: "SO No.",
      width: 140,
    },

    {
      field: "date",
      headerName: "Date",
      width: 130,
    },

    {
      field: "product",
      headerName: "Product",
      flex: 1,
      minWidth: 220,
    },

    {
      field: "skucode",
      headerName: "SKU",
      width: 140,
    },

    {
      field: "customer",
      headerName: "Customer",
      flex: 1,
      minWidth: 180,
    },

    {
      field: "division",
      headerName: "Division",
      width: 120,
    },

    {
      field: "qtyInMeter",
      headerName: "Order Qty",
      width: 120,
    },

    {
      field: "jobWork",
      headerName: "Job Work",
      width: 120,

      renderCell: () => (
        <Chip
          label="JOB WORK"
          color="warning"
          size="small"
        />
      ),
    },

    {
      field: "status",
      headerName: "Status",
      width: 160,

      renderCell: (params) => (
        <Chip
          label={params.value || "Pending"}
          color={
            params.value === "Completed"
              ? "success"
              : "warning"
          }
          size="small"
        />
      ),
    },
  ];

  return (
    <Box>
      {/* ==========================================
          HEADER
      ========================================== */}

      <Box mb={3}>
        <Typography
          variant="h5"
          fontWeight={700}
        >
          Job Work Orders
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mt={0.5}
        >
          Sales orders currently marked for Job Work
        </Typography>
      </Box>

      {/* ==========================================
          SUMMARY
      ========================================== */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Total Job Work Orders
        </Typography>

        <Typography
          variant="h4"
          fontWeight={700}
        >
          {jobWorkOrders.length}
        </Typography>
      </Paper>

      {/* ==========================================
          TABLE
      ========================================== */}

      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 300px)",
        }}
      >
        <DataGrid
          rows={jobWorkOrders}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.soNo}
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
    </Box>
  );
};

export default JobWorkOrders;