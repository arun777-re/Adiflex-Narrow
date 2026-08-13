import React, { useEffect } from "react";

import { Box } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { useDispatch, useSelector } from "react-redux";

import {
  getAllCompletedDispatchOrders,
} from "../redux/slices/dispatchSlice";
import toast from "react-hot-toast";

const CompleteDispatch = () => {
  const dispatch = useDispatch();

  const {
    completedDispatchOrders = [],
    loading,
  } = useSelector((state) => state.dispatch);

  useEffect(() => {
    dispatch(getAllCompletedDispatchOrders());
  }, [dispatch]);

useEffect(() => {
  if (!loading && completedDispatchOrders.length === 0) {
    toast.success("No order to show");
  }
}, [loading, completedDispatchOrders]);


  const columns = [
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
      width: 180,
    },
    {
      field: "product",
      headerName: "Product",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "customer",
      headerName: "Customer",
      width: 130,
    },
    {
      field: "driverName",
      headerName: "Driver",
      width: 150,
    },
    {
      field: "vehicleNo",
      headerName: "Vehicle No",
      width: 140,
    },
    {
      field: "partyPO",
      headerName: "Party PO",
      width: 130,
    },
    {
      field: "route",
      headerName: "Route",
      width: 120,
    },
    {
      field: "division",
      headerName: "Division",
      width: 120,
    },
    {
      field: "productionQty",
      headerName: "Production Qty",
      width: 140,
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
      headerName: "Wastage Qty",
      width: 130,
      type: "number",
    },
    {
      field: "dispatchQty",
      headerName: "Dispatch Qty",
      width: 130,
      type: "number",
    },
    {
      field: "availableQty",
      headerName: "Available Qty",
      width: 130,
      type: "number",
    },
    {
      field: "freightRs",
      headerName: "Freight Rs",
      width: 120,
      type: "number",
    },
    {
      field: "shippinglocation",
      headerName: "Shipping Location",
      width: 180,
    },
    {
      field: "billinglocation",
      headerName: "Billing Location",
      width: 180,
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 170,
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 170,
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 100px)",
        p: 2,
      }}
    >
      <DataGrid
        rows={completedDispatchOrders}
        columns={columns}
        loading={loading}
        getRowId={(row) =>
          row.cycleID ||
          row.id ||
          `${row.soNo}-${row.skuCode}-${row.rowNumber}`
        }
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
  );
};

export default CompleteDispatch;