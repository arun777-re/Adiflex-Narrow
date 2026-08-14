import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

import {
  DataGrid,
} from "@mui/x-data-grid";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import toast from "react-hot-toast";

import {
  billingDone,
  getAllCompletedDispatchOrders,
} from "../redux/slices/dispatchSlice";


const BillingPage = () => {

  const dispatch = useDispatch();

  const {
    completedDispatchOrders = [],
    loading,
    billingLoading,
  } = useSelector(
    (state) => state.dispatch
  );

  const [billingRow, setBillingRow] = useState(null);


  const billingPendingOrders = completedDispatchOrders.filter((item) => String(item.billing || "").trim().toLowerCase()
   !== "done")

  // =====================================================
  // GET DISPATCHED ORDERS
  // =====================================================

  useEffect(() => {

    dispatch(
      getAllCompletedDispatchOrders()
    );

  }, [dispatch]);


  // =====================================================
  // BILLING DONE
  // =====================================================

  const handleBillingDone = async (row) => {

    try {

      setBillingRow(row);

      await dispatch(
        billingDone({
          soNo: row.soNo,
          skuCode: row.skuCode,
          cycleID: row.cycleID || "",
        })
      ).unwrap();

      toast.success(
        `Billing done for ${row.soNo}`
      );

    } catch (error) {

      toast.error(
        error || "Billing failed"
      );

    } finally {

      setBillingRow(null);

    }
  };


  // =====================================================
  // COLUMNS
  // =====================================================

  const columns = useMemo(
    () => [

      {
        field: "soNo",
        headerName: "SO No",
        width: 130,
      },

      {
        field: "skuCode",
        headerName: "SKU Code",
        width: 120,
      },

      {
        field: "cycleID",
        headerName: "Cycle ID",
        width: 150,

        valueGetter: (value) =>
          value || "-",
      },

      {
        field: "product",
        headerName: "Product",
        minWidth: 240,
        flex: 1,
      },

      {
        field: "customer",
        headerName: "Customer",
        width: 140,
      },

      {
        field: "partyPO",
        headerName: "Party PO",
        width: 120,
      },

      {
        field: "route",
        headerName: "Route",
        width: 120,
      },

      {
        field: "division",
        headerName: "Division",
        width: 110,
      },

      {
        field: "productionQty",
        headerName: "Production Qty",
        width: 130,
        type: "number",
      },

      {
        field: "dispatchQty",
        headerName: "Dispatch Qty",
        width: 120,
        type: "number",
      },

      {
        field: "availableQty",
        headerName: "Available Qty",
        width: 120,
        type: "number",
      },

      {
        field: "rate",
        headerName: "Rate",
        width: 100,
        type: "number",
      },

      {
        field: "wastageQty",
        headerName: "Wastage",
        width: 100,
        type: "number",
      },

      {
        field: "freightRs",
        headerName: "Freight Rs",
        width: 110,
        type: "number",
      },

      {
        field: "status",
        headerName: "Dispatch Status",
        width: 170,

        renderCell: (params) => {

          const status =
            String(params.value || "")
              .toLowerCase();

          return (
            <Chip
              label={params.value}
              size="small"
              color={
                status === "fully dispatched"
                  ? "success"
                  : "warning"
              }
            />
          );
        },
      },

      {
        field: "billing",
        headerName: "Billing",
        width: 140,

        renderCell: (params) => {

          const isDone =
            String(params.row.billing || "")
              .trim()
              .toLowerCase() === "done";

          return isDone ? (
            <Chip
              label="Done"
              color="success"
              size="small"
            />
          ) : (
            <Button
              variant="contained"
              size="small"
              startIcon={
                <ReceiptLongIcon />
              }
              disabled={
                billingLoading &&
                billingRow?.rowNumber ===
                  params.row.rowNumber
              }
              onClick={() =>
                handleBillingDone(params.row)
              }
            >
              {billingLoading &&
              billingRow?.rowNumber ===
                params.row.rowNumber
                ? "Saving..."
                : "Billing Done"}
            </Button>
          );
        },
      },

    ],
    [
      billingLoading,
      billingRow
    ]
  );


  // =====================================================
  // UI
  // =====================================================

  return (

    <Box
      sx={{
        width: "100%",
        p: 2,
      }}
    >

      {/* HEADER */}

      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
        }}
      >

        <Typography
          variant="h5"
          fontWeight={700}
        >
          Billing
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Fully and partially dispatched orders
          pending for billing.
        </Typography>

      </Paper>


      {/* TABLE */}

      <Paper
        elevation={2}
        sx={{
          width: "100%",
          height: "calc(100vh - 220px)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >

        <DataGrid
          rows={billingPendingOrders}
          columns={columns}
          loading={loading}

          getRowId={(row) =>
            `${row.soNo}-${row.skuCode}-${row.cycleID || "NO-CYCLE"}-${row.rowNumber}`
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
                pageSize: 20,
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
          }}
        />

      </Paper>

    </Box>
  );
};


export default BillingPage;