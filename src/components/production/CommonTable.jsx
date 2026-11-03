import { useMemo, useState, useCallback } from "react";

import { Box, Button, Chip, Stack, TextField, Typography } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import UpdateProductionDialog from "./UpdateProductionDialog";

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

const getStages = (row) => (Array.isArray(row?.stages) ? row.stages : []);

const getStage = (row, stageCode) =>
  getStages(row).find(
    (stage) => normalize(stage?.stage_code) === normalize(stageCode),
  );

const getNumber = (value) => {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
};

const getPendingInputQty = (stage) => {
  if (!stage) return 0;

  if (
    stage.pending_input_qty !== undefined &&
    stage.pending_input_qty !== null
  ) {
    return Math.max(0, getNumber(stage.pending_input_qty));
  }

  return Math.max(
    0,
    getNumber(stage.input_qty) - getNumber(stage.accepted_qty),
  );
};

const getRemainingQty = (stage) => Math.max(0, getNumber(stage?.remaining_qty));

const hasPendingWork = (stage) =>
  Boolean(stage) &&
  (getPendingInputQty(stage) > 0 || getRemainingQty(stage) > 0);

const getAction = (stage) => {
  const status = normalize(stage?.status);

  if (["IN_PROGRESS", "PARTIALLY_RELEASED"].includes(status)) {
    return "complete";
  }

  return "start";
};

const statusLabel = (status) => {
  const labels = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    PARTIALLY_RELEASED: "Partially Released",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  return labels[normalize(status)] || normalize(status) || "Pending";
};

const getStageColor = (status) => {
  const normalizedStatus = normalize(status);

  if (normalizedStatus === "COMPLETED") return "success";
  if (normalizedStatus === "IN_PROGRESS") return "info";
  if (normalizedStatus === "PARTIALLY_RELEASED") return "warning";
  if (normalizedStatus === "CANCELLED") return "error";

  return "default";
};

const getDepartmentConfig = (department) => {
  const dept = normalize(department);

  if (["PACKING", "ROLLING"].includes(dept)) {
    return {
      title: "Packing Supervisor",
      stages: [
        { key: "ROLLING", label: "Rolling" },
        { key: "PACKING", label: "Packing" },
      ],
    };
  }

  return {
    title: "Finishing & Quality Supervisor",
    stages: [
      { key: "FINISHING", label: "Finishing" },
      { key: "QUALITY", label: "Quality" },
    ],
  };
};

const CommonTable = ({
  rows = [],
  department = "quality",
  loading = false,
}) => {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [action, setAction] = useState("start");

  const safeRows = Array.isArray(rows) ? rows : [];

  const config = useMemo(() => getDepartmentConfig(department), [department]);

  // Prepare both stage buttons independently for every order.
  const departmentRows = useMemo(() => {
    return safeRows
      .map((row) => {
        console.log("DEPARTMENT:", department);
        console.log("CYCLE:", row.cycle_id);

        console.table(
          getStages(row).map((stage) => ({
            stage_code: stage.stage_code,
            accepted_qty: stage.accepted_qty,
            released_qty: stage.released_qty,
            remaining_qty: stage.remaining_qty,
            pending_input_qty: stage.pending_input_qty,
            status: stage.status,
          })),
        );
        const stageProcesses = config.stages.map((stageConfig) => {
          const stage = getStage(row, stageConfig.key);
          const remainingQty = getRemainingQty(stage);

          return {
            ...stageConfig,
            stage,
            pendingInputQty: getPendingInputQty(stage),
            remainingQty,
            disabled:
              !stage ||
              remainingQty <= 0 ||
              normalize(stage?.status) === "CANCELLED",
          };
        });

        return {
          ...row,
          stageProcesses,
        };
      })
      .filter((row) =>
        row.stageProcesses.some((process) => hasPendingWork(process.stage)),
      );
  }, [safeRows, config]);

  // Search orders.
  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return departmentRows;

    return departmentRows.filter((row) =>
      [
        row.so_no,
        row.cycle_id,
        row.customer,
        row.sku_code,
        row.product_name,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [departmentRows, search]);

  // Open the dialog for exactly the stage whose button was clicked.
  const handleStageAction = useCallback((row, process) => {
    if (!process?.stage || process.disabled) return;

    setSelectedOrder({
      ...row,
      currentProcess: {
        key: process.key,
        label: process.label,
        stage: process.stage,
      },
    });

    setSelectedProcess(process);
    setAction(getAction(process.stage));
    setDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setDialogOpen(false);
    setSelectedOrder(null);
    setSelectedProcess(null);
    setAction("start");
  }, []);

  const columns = useMemo(
    () => [
      {
        field: "so_no",
        headerName: "SO No.",
        minWidth: 125,
        flex: 0.8,
      },
      {
        field: "cycle_id",
        headerName: "Cycle ID",
        minWidth: 190,
        flex: 1.2,
      },
      {
        field: "customer",
        headerName: "Customer",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "sku_code",
        headerName: "SKU",
        minWidth: 100,
      },
      {
        field: "product_name",
        headerName: "Product",
        minWidth: 160,
        flex: 1,
      },
      {
        field: "production_target_qty",
        headerName: "Target Qty (m)",
        minWidth: 125,
        type: "number",
        valueFormatter: (value) => getNumber(value).toLocaleString("en-IN"),
      },
      {
        field: "so_qty",
        headerName: "SO Qty (m)",
        minWidth: 115,
        type: "number",
        valueFormatter: (value) => getNumber(value).toLocaleString("en-IN"),
      },

      // Show the status of both stages separately.
      ...config.stages.map((stageConfig) => ({
        field: `${stageConfig.key}_status`,
        headerName: `${stageConfig.label} Status`,
        minWidth: 155,
        sortable: false,
        renderCell: (params) => {
          const stage = getStage(params.row, stageConfig.key);

          if (!stage) {
            return <Chip size="small" label="Stage Missing" />;
          }

          return (
            <Chip
              size="small"
              label={statusLabel(stage.status)}
              color={getStageColor(stage.status)}
            />
          );
        },
      })),

      // Show accepted quantity for each stage.
      ...config.stages.map((stageConfig) => ({
        field: `${stageConfig.key}_accepted_qty`,
        headerName: `${stageConfig.label} Accepted (m)`,
        minWidth: 165,
        type: "number",
        sortable: false,
        valueGetter: (_value, row) =>
          getNumber(getStage(row, stageConfig.key)?.accepted_qty),
        valueFormatter: (value) => getNumber(value).toLocaleString("en-IN"),
      })),

      // Show remaining quantity for each stage.
      ...config.stages.map((stageConfig) => ({
        field: `${stageConfig.key}_remaining_qty`,
        headerName: `${stageConfig.label} Remaining (m)`,
        minWidth: 175,
        type: "number",
        sortable: false,
        valueGetter: (_value, row) =>
          getRemainingQty(getStage(row, stageConfig.key)),
        valueFormatter: (value) => getNumber(value).toLocaleString("en-IN"),
      })),

      // Both buttons always appear for the configured department.
      {
        field: "actions",
        headerName: "Stage Actions",
        minWidth: 300,
        flex: 1,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const row = params.row;

          return (
            <Stack direction="row" spacing={1} alignItems="center">
              {row.stageProcesses.map((process) => {
                const isStarted = getAction(process.stage) === "complete";

                return (
                  <Button
                    key={process.key}
                    size="small"
                    variant="contained"
                    color={isStarted ? "success" : "primary"}
                    disabled={process.disabled}
                    onClick={() => handleStageAction(row, process)}
                  >
                    {process.disabled
                      ? `${process.label} Unavailable`
                      : `${isStarted ? "Complete" : "Start"} ${process.label}`}
                  </Button>
                );
              })}
            </Stack>
          );
        },
      },
    ],
    [config, handleStageAction],
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {config.title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Eligible orders: {filteredRows.length} · Received from API:{" "}
            {safeRows.length}
          </Typography>
        </Box>

        <TextField
          size="small"
          label="Search orders"
          placeholder="SO, customer, SKU..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ minWidth: { sm: 280 } }}
        />
      </Stack>

      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.production_id ?? row.id ?? row.cycle_id}
          autoHeight
          density="compact"
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: 10,
              },
            },
          }}
          disableRowSelectionOnClick
          slots={{
            noRowsOverlay: () => (
              <Box
                sx={{
                  minHeight: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                }}
              >
                <Typography color="text.secondary">
                  {safeRows.length === 0
                    ? "API se koi rows receive nahi hui."
                    : "Abhi is department ke liye koi pending ya releasable quantity nahi hai."}
                </Typography>
              </Box>
            ),
          }}
          sx={{
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
            },
          }}
        />
      </Box>

      {selectedOrder && selectedProcess && (
        <UpdateProductionDialog
          open={dialogOpen}
          onClose={handleClose}
          order={selectedOrder}
          process={selectedProcess.key}
          action={action}
        />
      )}
    </Box>
  );
};

export default CommonTable;
