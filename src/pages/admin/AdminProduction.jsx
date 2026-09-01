
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { getAllProductions } from "../../redux/slices/productionSlice";

// ============================================================
// IDEAL PROCESS TIME - MINUTES
// ============================================================

const IDEAL_PROCESS_TIMES = {
  "Job Work": 120,
  Warping: 120,
  Filling: 90,
  Machine: 180,
  Finishing: 120,
  Quality: 30,
  Rolling: 60,
  Packing: 45,
};

// ============================================================
// PROCESS CONFIGURATION
// ============================================================

const PROCESS_CONFIG = [
  {
    name: "Job Work",
    startKey: "jobWorkStartTime",
    endKey: "jobWorkEndTime",
  },
  {
    name: "Warping",
    startKey: "warpingStartAt",
    endKey: "warpingEndsAt",
  },
  {
    name: "Filling",
    startKey: "fillingStartsAt",
    endKey: "fillingEndsAt",
  },
  {
    name: "Machine",
    startKey: "machineStartsAt",
    endKey: "machineEndsAt",
  },
  {
    name: "Finishing",
    startKey: "finishingStartsAt",
    endKey: "finishingEndsAt",
  },
  {
    name: "Quality",
    startKey: "qualityStartsAt",
    endKey: "qualityEndsAt",
  },
  {
    name: "Rolling",
    startKey: "rollingStartsAt",
    endKey: "rollingEndsAt",
  },
  {
    name: "Packing",
    startKey: "packingStartsAt",
    endKey: "packingEndsAt",
  },
];

// ============================================================
// HELPERS
// ============================================================

const getValue = (row, keys = []) => {
  for (const key of keys) {
    if (
      row?.[key] !== undefined &&
      row?.[key] !== null &&
      String(row[key]).trim() !== ""
    ) {
      return row[key];
    }
  }

  return "";
};

// ------------------------------------------------------------
// DATE PARSER
// ------------------------------------------------------------

const parseDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

// ------------------------------------------------------------
// DURATION
// ------------------------------------------------------------

const getDurationMinutes = (startValue, endValue) => {
  const start = parseDate(startValue);

  if (!start) {
    return null;
  }

  const end = endValue ? parseDate(endValue) : new Date();

  if (!end) {
    return null;
  }

  const diff = (end - start) / (1000 * 60);

  if (diff < 0) {
    return null;
  }

  return diff;
};

// ------------------------------------------------------------
// FORMAT DURATION
// ------------------------------------------------------------

const formatDuration = (minutes) => {
  if (minutes === null || minutes === undefined) {
    return "-";
  }

  const totalMinutes = Math.round(minutes);

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }

  return `${mins}m`;
};

// ------------------------------------------------------------
// PERFORMANCE STATUS
// ------------------------------------------------------------

const getPerformance = (actual, ideal, isRunning) => {
  if (actual === null || ideal === null) {
    return {
      type: "pending",
      label: "Not Started",
    };
  }

  const difference = actual - ideal;

  // Running and already crossed ideal time
  if (difference > 0) {
    return {
      type: "late",
      label: `Late +${formatDuration(difference)}`,
    };
  }

  // Completed exactly around ideal
  if (Math.abs(difference) <= 1) {
    return {
      type: "ontime",
      label: isRunning ? "On Time" : "On Time",
    };
  }

  // Still under ideal time
  return {
    type: "faster",
    label: `${formatDuration(Math.abs(difference))} Faster`,
  };
};

// ============================================================
// COMPONENT
// ============================================================

const AdminProduction = () => {
  const dispatch = useDispatch();

  // ==========================================================
  // REDUX
  // ==========================================================

  const {
    productionOrders = [],
    loading = false,
  } = useSelector((state) => state.production);

  // ==========================================================
  // FILTER STATES
  // ==========================================================

  const [division, setDivision] = useState("WOVEN");
  const [process, setProcess] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  // ==========================================================
  // LIVE CLOCK
  // Re-render every 30 seconds so running process time updates.
  // ==========================================================

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================================
  // GET PRODUCTION DATA
  // ==========================================================

useEffect(() => {
  console.log("====================================");
  console.log("🔥 ADMIN PRODUCTION EFFECT RUNNING");
  console.log("🔥 SELECTED DIVISION:", division);

  if (!division) {
    console.log("❌ DIVISION EMPTY - API CALL SKIPPED");
    return;
  }

  console.log("🚀 DISPATCHING getAllProductions...");
  console.log("🚀 DIVISION SENT TO THUNK:", division);

  dispatch(getAllProductions(division))
    .unwrap()
    .then((data) => {
      console.log("✅ THUNK SUCCESS");
      console.log("🔥 PRODUCTION DATA FROM THUNK:", data);
      console.log("🔥 DATA LENGTH:", data?.length);
      console.log("🔥 FIRST PRODUCTION ORDER:", data?.[0]);
    })
    .catch((error) => {
      console.error("❌ THUNK FAILED");
      console.error("❌ ERROR:", error);
    });

}, [dispatch, division]);

  // ==========================================================
  // CREATE PROCESS-WISE ROWS
  // ==========================================================

  const processRows = useMemo(() => {
    const result = [];

    productionOrders.forEach((order, orderIndex) => {
      PROCESS_CONFIG.forEach((processConfig, processIndex) => {
        // ----------------------------------------------------
        // Job Work only when Is Job Work is true
        // ----------------------------------------------------

        if (processConfig.name === "Job Work") {
          const isJobWork =
            order.isJobWork === true ||
            String(order.isJobWork).toUpperCase() === "TRUE";

          if (!isJobWork) {
            return;
          }
        }

        const start = getValue(order, [
          processConfig.startKey,
          processConfig.startKey.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`),
        ]);

        const end = getValue(order, [
          processConfig.endKey,
          processConfig.endKey.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`),
        ]);

        // Process not started
        if (!start) {
          return;
        }

        const actualMinutes = getDurationMinutes(start, end);

        if (actualMinutes === null) {
          return;
        }

        const idealMinutes =
          IDEAL_PROCESS_TIMES[processConfig.name] || null;

        const isRunning = !end;

        const performance = getPerformance(
          actualMinutes,
          idealMinutes,
          isRunning
        );

        result.push({
          id: `${orderIndex}-${processIndex}-${order.soNo}-${order.cycleID}`,
          soNo: order.soNo || "-",
          cycleID: order.cycleID || "-",
          skuCode: order.skuCode || "-",
          productName: order.productName || order.product || "-",
          customer: order.customer || "-",
          orderType: order.orderType || "-",
          division: order.division || division,
          process: processConfig.name,
          productionQty:
            order.productionQty ??
            order.productionTargetQty ??
            "-",
          startTime: start,
          endTime: end,
          idealMinutes,
          actualMinutes,
          idealTime: formatDuration(idealMinutes),
          actualTime: formatDuration(actualMinutes),
          performance,
          running: isRunning,
          now,
        });
      });
    });

    return result;
  }, [productionOrders, now, division]);

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredRows = useMemo(() => {
    return processRows.filter((row) => {
      const processMatch =
        process === "ALL" || row.process === process;

      const statusMatch =
        status === "ALL" ||
        (status === "LATE" && row.performance.type === "late") ||
        (status === "ON_TIME" && row.performance.type === "ontime") ||
        (status === "FASTER" && row.performance.type === "faster") ||
        (status === "RUNNING" && row.running);

      const searchText = search.toLowerCase().trim();

      const searchMatch =
        !searchText ||
        String(row.soNo).toLowerCase().includes(searchText) ||
        String(row.cycleID).toLowerCase().includes(searchText) ||
        String(row.skuCode).toLowerCase().includes(searchText) ||
        String(row.productName).toLowerCase().includes(searchText) ||
        String(row.customer).toLowerCase().includes(searchText);

      return processMatch && statusMatch && searchMatch;
    });
  }, [processRows, process, status, search]);

  // ==========================================================
  // COLUMNS
  // ==========================================================

  const columns = [
    {
      field: "soNo",
      headerName: "SO No.",
      width: 110,
    },
    {
      field: "cycleID",
      headerName: "Cycle ID",
      width: 150,
    },
    {
      field: "skuCode",
      headerName: "SKU Code",
      width: 110,
    },
    {
      field: "productName",
      headerName: "Product",
      minWidth: 220,
      flex: 1,
    },
    {
      field: "customer",
      headerName: "Customer",
      width: 150,
    },
    {
      field: "process",
      headerName: "Process",
      width: 120,
    },
    {
      field: "productionQty",
      headerName: "Production Qty",
      width: 130,
    },
    {
      field: "idealTime",
      headerName: "Ideal Time",
      width: 110,
    },
    {
      field: "actualTime",
      headerName: "Actual Time",
      width: 115,
      renderCell: (params) => (
        <Box>
          <Typography
            variant="body2"
            fontWeight={700}
          >
            {params.value}
          </Typography>

          {params.row.running && (
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Running
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "performance",
      headerName: "Performance",
      width: 160,
      renderCell: (params) => {
        const { type, label } = params.value;

        let color = "default";

        if (type === "late") {
          color = "error";
        }

        if (type === "ontime") {
          color = "success";
        }

        if (type === "faster") {
          color = "info";
        }

        return (
          <Chip
            size="small"
            color={color}
            label={label}
            sx={{
              fontWeight: 700,
            }}
          />
        );
      },
    },
    {
      field: "startTime",
      headerName: "Started At",
      width: 180,
      valueGetter: (value) => {
        if (!value) return "-";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
          return value;
        }

        return date.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
    {
      field: "endTime",
      headerName: "Ended At",
      width: 180,
      valueGetter: (value) => {
        if (!value) return "Running";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
          return value;
        }

        return date.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
  ];

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 1.5, md: 2 },
      }}
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
        >
          Production Management
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {filteredRows.length} processes
        </Typography>
      </Stack>

      {/* ======================================================
          FILTER BAR
      ====================================================== */}

      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          mb: 1.5,
          borderRadius: 2,
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1.5}
        >
          {/* Division */}

          <FormControl
            size="small"
            sx={{
              minWidth: 150,
            }}
          >
            <InputLabel>Division</InputLabel>

            <Select
              value={division}
              label="Division"
              onChange={(e) => {
                setDivision(e.target.value);
                setProcess("ALL");
                setStatus("ALL");
              }}
            >
              <MenuItem value="WOVEN">
                Woven
              </MenuItem>

              <MenuItem value="CROCHET">
                Crochet
              </MenuItem>
            </Select>
          </FormControl>

          {/* Process */}

          <FormControl
            size="small"
            sx={{
              minWidth: 150,
            }}
          >
            <InputLabel>Process</InputLabel>

            <Select
              value={process}
              label="Process"
              onChange={(e) => setProcess(e.target.value)}
            >
              <MenuItem value="ALL">
                All Processes
              </MenuItem>

              {PROCESS_CONFIG.map((item) => (
                <MenuItem
                  key={item.name}
                  value={item.name}
                >
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Status */}

          <FormControl
            size="small"
            sx={{
              minWidth: 150,
            }}
          >
            <InputLabel>Status</InputLabel>

            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="ALL">
                All Status
              </MenuItem>

              <MenuItem value="RUNNING">
                Running
              </MenuItem>

              <MenuItem value="LATE">
                Late
              </MenuItem>

              <MenuItem value="ON_TIME">
                On Time
              </MenuItem>

              <MenuItem value="FASTER">
                Faster
              </MenuItem>
            </Select>
          </FormControl>

          {/* Search */}

          <TextField
            size="small"
            fullWidth
            label="Search SO / Cycle / SKU / Product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Stack>
      </Paper>

      {/* ======================================================
          TABLE
      ====================================================== */}

      <Paper
        elevation={1}
        sx={{
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          autoHeight
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: 10,
              },
            },
          }}
          sx={{
            border: 0,

            "& .MuiDataGrid-columnHeaders": {
              fontWeight: 700,
            },

            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: "action.hover",
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default AdminProduction;

