
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
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
import ProcessCircle from '../../components/admin/ProcessCircle';
import { PROCESS_CONFIG } from "../../config/productionProcess.config";
import { getProcessStatus } from "../../utils/productionStatus.utils";


const AdminProduction = () => {
  const dispatch = useDispatch();

  // ==========================================================
  // REDUX
  // ==========================================================

  const {
    allProductionOrders = [],
    loading = false,
  } = useSelector(
    (state) => state.production
  );

  // ==========================================================
  // FILTER STATES
  // ==========================================================

  const [division, setDivision] =
    useState("WOVEN");

  const [process, setProcess] =
    useState("ALL");

  const [status, setStatus] =
    useState("ALL");

  const [search, setSearch] =
    useState("");

  // ==========================================================
  // LIVE CLOCK
  // ==========================================================

  const [now, setNow] =
    useState(new Date());

  useEffect(() => {
    const interval =
      setInterval(() => {
        setNow(new Date());
      }, 30000);

    return () =>
      clearInterval(interval);
  }, []);

  // ==========================================================
  // GET PRODUCTION DATA
  // ==========================================================

  useEffect(() => {
    if (!division) {
      return;
    }

    dispatch(
      getAllProductions(division)
    )
      .unwrap()
      .catch((error) => {
        console.error(
          "❌ getAllProductions failed:",
          error
        );
      });
  }, [dispatch, division]);

  // ==========================================================
  // ONE ROW = ONE PRODUCTION ORDER
  // ==========================================================

  const productionRows =
    useMemo(() => {
      return allProductionOrders.map(
        (order, index) => ({
          id:
            order.id ||
            `${index}-${order.soNo}-${order.cycleID}`,

          soNo:
            order.soNo || "-",

          cycleID:
            order.cycleID || "-",

          skuCode:
            order.skuCode || "-",

          productName:
            order.productName ||
            order.product ||
            "-",

          customer:
            order.customer || "-",

          productionQty:
            order.productionQty ??
            order.productionTargetQty ??
            0,

          division:
            order.division ||
            division,

          order,
        })
      );
    }, [
      allProductionOrders,
      division,
    ]);

  // ==========================================================
  // FILTERED ROWS
  // ==========================================================

  const filteredRows =
    useMemo(() => {
      const searchText =
        search
          .toLowerCase()
          .trim();

      return productionRows.filter(
        (row) => {
          const order =
            row.order;

          // --------------------------------------------------
          // SEARCH
          // --------------------------------------------------

          const searchMatch =
            !searchText ||
            String(row.soNo)
              .toLowerCase()
              .includes(searchText) ||
            String(row.cycleID)
              .toLowerCase()
              .includes(searchText) ||
            String(row.skuCode)
              .toLowerCase()
              .includes(searchText) ||
            String(row.productName)
              .toLowerCase()
              .includes(searchText) ||
            String(row.customer)
              .toLowerCase()
              .includes(searchText);

          if (!searchMatch) {
            return false;
          }

          // --------------------------------------------------
          // PROCESS FILTER
          // --------------------------------------------------

          if (
            process !== "ALL"
          ) {
            const selectedProcess =
              PROCESS_CONFIG.find(
                (item) =>
                  item.name ===
                  process
              );

            if (selectedProcess) {
              const processStatus =
                getProcessStatus(
                  order,
                  selectedProcess
                );

              if (
                processStatus.type ===
                  "notApplicable" ||
                processStatus.type ===
                  "notStarted"
              ) {
                return false;
              }
            }
          }

          // --------------------------------------------------
          // STATUS FILTER
          // --------------------------------------------------

          if (
            status !== "ALL"
          ) {
            const processStatuses =
              PROCESS_CONFIG.map(
                (config) =>
                  getProcessStatus(
                    order,
                    config
                  )
              );

            let statusMatch =
              false;

            if (
              status ===
              "RUNNING"
            ) {
              statusMatch =
                processStatuses.some(
                  (item) =>
                    item.type ===
                    "running"
                );
            }

            if (
              status === "LATE"
            ) {
              statusMatch =
                processStatuses.some(
                  (item) =>
                    item.type ===
                    "late"
                );
            }

            if (
              status ===
              "ON_TIME"
            ) {
              statusMatch =
                processStatuses.some(
                  (item) =>
                    item.type ===
                    "ontime"
                );
            }

            if (
              status ===
              "FASTER"
            ) {
              statusMatch =
                processStatuses.some(
                  (item) =>
                    item.type ===
                    "faster"
                );
            }

            if (
              status ===
              "COMPLETED"
            ) {
              statusMatch =
                processStatuses.some(
                  (item) =>
                    item.type ===
                      "completed" ||
                    item.type ===
                      "ontime" ||
                    item.type ===
                      "faster"
                );
            }

            if (!statusMatch) {
              return false;
            }
          }

          return true;
        }
      );
    }, [
      productionRows,
      process,
      status,
      search,
      now,
    ]);

  // ==========================================================
  // COLUMNS
  // ==========================================================

  const columns = useMemo(() => {
    return [
      {
        field: "soNo",
        headerName: "SO No.",
        width: 110,
      },

      {
        field: "cycleID",
        headerName: "Cycle ID",
        width: 180,
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
        width: 180,
      },

      {
        field: "productionQty",
        headerName: "Production Qty",
        width: 130,
        type: "number",
      },

      // ======================================================
      // PROCESS COLUMNS
      // ======================================================

      ...PROCESS_CONFIG.map(
        (processConfig) => ({
          field: processConfig.name,
          headerName:
            processConfig.name,
          width: 110,

          sortable: false,
          filterable: false,

          renderCell: (params) => (
            <Box
              sx={{
                width: "100%",
                height: "100%",

                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
              }}
            >
              <ProcessCircle
                order={
                  params.row
                    .order
                }
                processConfig={
                  processConfig
                }
              />
            </Box>
          ),
        })
      ),
    ];
  }, [now]);

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <Box
      sx={{
        width: "100%",
        p: {
          xs: 1.5,
          md: 2,
        },
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
          {
            filteredRows.length
          }{" "}
          production orders
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
          {/* ==================================================
              DIVISION
          ================================================== */}

          <FormControl
            size="small"
            sx={{
              minWidth: 150,
            }}
          >
            <InputLabel>
              Division
            </InputLabel>

            <Select
              value={division}
              label="Division"
              onChange={(e) => {
                setDivision(
                  e.target.value
                );

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

          {/* ==================================================
              PROCESS
          ================================================== */}

          <FormControl
            size="small"
            sx={{
              minWidth: 150,
            }}
          >
            <InputLabel>
              Process
            </InputLabel>

            <Select
              value={process}
              label="Process"
              onChange={(e) =>
                setProcess(
                  e.target.value
                )
              }
            >
              <MenuItem value="ALL">
                All Processes
              </MenuItem>

              {PROCESS_CONFIG.map(
                (item) => (
                  <MenuItem
                    key={item.name}
                    value={item.name}
                  >
                    {item.name}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          {/* ==================================================
              STATUS
          ================================================== */}

          <FormControl
            size="small"
            sx={{
              minWidth: 150,
            }}
          >
            <InputLabel>
              Status
            </InputLabel>

            <Select
              value={status}
              label="Status"
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
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

              <MenuItem value="COMPLETED">
                Completed
              </MenuItem>
            </Select>
          </FormControl>

          {/* ==================================================
              SEARCH
          ================================================== */}

          <TextField
            size="small"
            fullWidth
            label="Search SO / Cycle / SKU / Product"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
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
          pageSizeOptions={[
            10,
            25,
            50,
          ]}
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

            "& .MuiDataGrid-columnHeaders":
              {
                fontWeight: 700,
              },

            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems:
                "center",
            },

            "& .MuiDataGrid-row:hover":
              {
                backgroundColor:
                  "action.hover",
              },
          }}
        />
      </Paper>
    </Box>
  );
};

export default AdminProduction;

