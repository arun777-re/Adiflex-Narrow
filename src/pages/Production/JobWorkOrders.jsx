
import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Chip,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";

import {
  DataGrid,
} from "@mui/x-data-grid";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  getAllJobWorkProductions,
} from "../../redux/slices/productionSlice";

const JobWorkOrders = () => {
  const dispatch = useDispatch();

  const { jobOrders = [], loading } = useSelector(
    (state) => state.production
  );

  const currentDivision = useSelector(
    (state) => state.auth?.user?.user?.division
  );

  // ==========================================
  // FILTER
  // ==========================================

  const [statusFilter, setStatusFilter] = useState("All");

  // ==========================================
  // FETCH JOB WORK ORDERS
  // ==========================================

  useEffect(() => {
    if (!currentDivision) return;

    dispatch(
      getAllJobWorkProductions(currentDivision)
    );
  }, [dispatch, currentDivision]);

  // ==========================================
  // STATUS COUNTS
  // ==========================================

  const pendingCount = useMemo(() => {
    return jobOrders.filter(
      (order) =>
        String(order.jobWorkStatus)
          .trim()
          .toLowerCase() === "pending"
    ).length;
  }, [jobOrders]);

  const fulfilledCount = useMemo(() => {
    return jobOrders.filter(
      (order) =>
        String(order.jobWorkStatus)
          .trim()
          .toLowerCase() === "fulfilled"
    ).length;
  }, [jobOrders]);

  // ==========================================
  // FILTERED ORDERS
  // ==========================================

  const filteredOrders = useMemo(() => {
    if (statusFilter === "All") {
      return jobOrders;
    }

    return jobOrders.filter(
      (order) =>
        String(order.jobWorkStatus)
          .trim()
          .toLowerCase() ===
        statusFilter.toLowerCase()
    );
  }, [jobOrders, statusFilter]);

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
      field: "cycleID",
      headerName: "Cycle ID",
      width: 190,
    },

    {
      field: "productName",
      headerName: "Product",
      flex: 1,
      minWidth: 220,
    },

    {
      field: "skuCode",
      headerName: "SKU",
      width: 130,
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
      field: "productionTargetQty",
      headerName: "Target Qty",
      width: 120,
      type: "number",
    },

    {
      field: "productionQty",
      headerName: "Production Qty",
      width: 130,
      type: "number",
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
          variant="outlined"
        />
      ),
    },

    {
      field: "jobWorkStartTime",
      headerName: "Started At",
      width: 175,
    },

    {
      field: "jobWorkEndTime",
      headerName: "Ended At",
      width: 175,
    },

    {
      field: "jobWorkStatus",
      headerName: "Status",
      width: 130,

      renderCell: (params) => {
        const fulfilled =
          String(params.value)
            .trim()
            .toLowerCase() === "fulfilled";

        return (
          <Chip
            label={
              fulfilled
                ? "Fulfilled"
                : "Pending"
            }
            color={
              fulfilled
                ? "success"
                : "warning"
            }
            size="small"
            sx={{
              fontWeight: 600,
            }}
          />
        );
      },
    },
  ];

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <Box>
      {/* ==========================================
          HEADER
      ========================================== */}

      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
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
            Monitor sales orders currently
            marked for Job Work
          </Typography>
        </Box>

        {/* STATUS FILTER */}

        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          sx={{
            minWidth: 170,
          }}
        >
          <MenuItem value="All">
            All Orders
          </MenuItem>

          <MenuItem value="Pending">
            Pending
          </MenuItem>

          <MenuItem value="Fulfilled">
            Fulfilled
          </MenuItem>
        </TextField>
      </Box>

      {/* ==========================================
          SUMMARY CARDS
      ========================================== */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        mb={2}
      >
        {/* TOTAL */}

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Total Job Work
          </Typography>

          <Typography
            variant="h4"
            fontWeight={700}
            mt={0.5}
          >
            {jobOrders.length}
          </Typography>
        </Paper>

        {/* PENDING */}

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 2,
            border: "1px solid",
            borderColor: "warning.main",
            borderRadius: 2,
            cursor: "pointer",
          }}
          onClick={() =>
            setStatusFilter("Pending")
          }
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Pending
          </Typography>

          <Typography
            variant="h4"
            fontWeight={700}
            mt={0.5}
          >
            {pendingCount}
          </Typography>
        </Paper>

        {/* FULFILLED */}

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 2,
            border: "1px solid",
            borderColor: "success.main",
            borderRadius: 2,
            cursor: "pointer",
          }}
          onClick={() =>
            setStatusFilter("Fulfilled")
          }
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Fulfilled
          </Typography>

          <Typography
            variant="h4"
            fontWeight={700}
            mt={0.5}
          >
            {fulfilledCount}
          </Typography>
        </Paper>
      </Stack>

      {/* ==========================================
          ACTIVE FILTER
      ========================================== */}

      {statusFilter !== "All" && (
        <Box mb={1.5}>
          <Chip
            label={`Showing: ${statusFilter}`}
            onDelete={() =>
              setStatusFilter("All")
            }
            color={
              statusFilter === "Pending"
                ? "warning"
                : "success"
            }
            variant="outlined"
          />
        </Box>
      )}

      {/* ==========================================
          TABLE
      ========================================== */}

      <Box
        sx={{
          width: "100%",
          height:
            "calc(100vh - 250px)",
        }}
      >
        <DataGrid
          rows={filteredOrders}
          columns={columns}
          loading={loading}

          getRowId={(row) =>
            row.cycleID
          }

          disableRowSelectionOnClick
          density="compact"

          pageSizeOptions={[
            10,
            20,
            50,
            100,
          ]}

          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}

          sx={{
            border: 0,

            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 700,
            },

            "& .MuiDataGrid-cell": {
              borderBottom:
                "1px solid #eee",
              fontSize: 13,
            },

            "& .MuiDataGrid-row:nth-of-type(even)": {
              backgroundColor: "#fafafa",
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#fff8e1",
            },

            "& .MuiDataGrid-footerContainer": {
              borderTop:
                "1px solid #ddd",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default JobWorkOrders;

