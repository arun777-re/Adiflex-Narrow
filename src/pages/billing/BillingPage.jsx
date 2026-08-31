import React, { useEffect, useMemo, useState } from "react";

import { Box, Button, Chip, Paper, TextField, Typography } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";

import {
  getBillingOrders,
  updateBillingStatus,
} from "../../redux/slices/billingSlice";

import useNotification from "../../hooks/useNotification";

import { subscribeToPush } from "../../service-worker/webpushworker";

const BillingPage = () => {
  const dispatch = useDispatch();

  const {
    orders = [],
    loading,
    updating,
  } = useSelector((state) => state.billing);

  const [billingRow, setBillingRow] = useState(null);

  // =====================================================
  // SEARCH
  // =====================================================

  const [searchTerm, setSearchTerm] = useState("");

  // =====================================================
  // PENDING BILLING ORDERS
  // =====================================================

  const billingPendingOrders = useMemo(() => {
    const pendingOrders = orders.filter(
      (item) =>
        String(item.billing || "")
          .trim()
          .toLowerCase() !== "done",
    );

    const search = searchTerm.trim().toLowerCase();

    // No search
    if (!search) {
      return pendingOrders;
    }

    // Search Customer OR SO No
    return pendingOrders.filter((item) => {
      const customer = String(item.customer || "").toLowerCase();

      const soNo = String(item.soNo || "").toLowerCase();

      return customer.includes(search) || soNo.includes(search);
    });
  }, [orders, searchTerm]);

  // =====================================================
  // GET BILLING ORDERS
  // =====================================================

  useEffect(() => {
    dispatch(getBillingOrders());
  }, [dispatch]);

  // =====================================================
  // SOCKET NOTIFICATION
  // =====================================================

  useNotification({
    event: "new-notification",
    refetch: getBillingOrders,
  });

  // =====================================================
  // PUSH NOTIFICATION SUBSCRIPTION
  // =====================================================

  useEffect(() => {
    console.log("hello i am in push barrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");

    subscribeToPush()
      .then(() => {
        console.log("✅ Push subscription ready");
      })

      .catch((error) => {
        console.error("❌ Push setup failed:", error);
      });
  }, []);

  // =====================================================
  // DEBUG
  // =====================================================

  console.log("billing Orders.......", orders);

  // =====================================================
  // BILLING DONE
  // =====================================================

  const handleBillingDone = async (row) => {
    try {
      setBillingRow(row);
      // console.log("billing row",billingRow);
      console.log("🔥 BILLING UPDATE DATA:", {
        soNo: row.soNo,
        skuCode: row.skuCode,
        billingID: row.billingID,
      });
      await dispatch(
        updateBillingStatus({
          soNo: row.soNo,

          skuCode: row.skuCode,

          billingID: row.billingID || "",

          status: "Done",
        }),
      ).unwrap();

      toast.success(`Billing done for ${row.soNo}`);

      // Refresh billing orders
      dispatch(getBillingOrders());
    } catch (error) {
      console.error("❌ Billing failed:", error);

      toast.error(
        typeof error === "string" ? error : error?.message || "Billing failed",
      );
    } finally {
      setBillingRow(null);
    }
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const handleClearSearch = () => {
    setSearchTerm("");
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
        field: "shippinglocation",
        headerName: "Shipping Location",
        width: 120,
      },
      {
        field: "billinglocation",
        headerName: "Billining Location",
        width: 120,
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
        width: 180,
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
        field: "dispatchQty",
        headerName: "Dispatch Qty",
        width: 120,
        type: "number",
      },

      {
        field: "billing",
        headerName: "Billing",
        width: 160,

        renderCell: (params) => {
          const isDone =
            String(params.row.billing || "")
              .trim()
              .toLowerCase() === "done";

          const isUpdating =
            updating && billingRow?.rowNumber === params.row.rowNumber;

          return isDone ? (
            <Chip label="Done" color="success" size="small" />
          ) : (
            <Button
              variant="contained"
              size="small"
              startIcon={<ReceiptLongIcon />}
              disabled={isUpdating}
              onClick={() => handleBillingDone(params.row)}
            >
              {isUpdating ? "Saving..." : "Billing Done"}
            </Button>
          );
        },
      },

      {
        field: "createdAt",
        headerName: "Created At",
        width: 180,
      },
    ],

    [updating, billingRow],
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
      {/* =================================================
          HEADER
      ================================================= */}

      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Billing
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.5,
          }}
        >
          Fully and partially dispatched orders pending for billing.
        </Typography>

        {/* =================================================
            SEARCH
        ================================================= */}

        <Box
          sx={{
            mt: 2,

            display: "flex",

            gap: 2,

            alignItems: "center",

            flexWrap: "wrap",
          }}
        >
          <TextField
            size="small"
            label="Search Customer / SO No"
            placeholder="Enter customer or SO number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              minWidth: 320,
            }}
          />

          {searchTerm && (
            <Button variant="outlined" onClick={handleClearSearch}>
              Clear
            </Button>
          )}

          {/* RESULT COUNT */}

          <Typography variant="body2" color="text.secondary">
            Showing <strong>{billingPendingOrders.length}</strong> pending
            orders
          </Typography>
        </Box>
      </Paper>

      {/* =================================================
          TABLE
      ================================================= */}

      <Paper
        elevation={2}
        sx={{
          width: "100%",

          height: "calc(100vh - 180px)",

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
          pageSizeOptions={[10, 20, 50, 100]}
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
