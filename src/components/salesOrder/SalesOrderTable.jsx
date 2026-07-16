import { useMemo } from "react";
import { Chip, Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const SalesOrderTable = ({ rows = [], loading = false }) => {


 const columns = useMemo(()=>[
  { field: "soNo", headerName: "SO No", width: 110 },

  { field: "date", headerName: "Date", width: 120 },

  {
    field: "customer",
    headerName: "Customer",
    minWidth: 200,
    flex: 1,
  },

  {
    field: "product",
    headerName: "Product",
    minWidth: 220,
    flex: 1.2,
  },

  {
    field: "division",
    headerName: "Division",
    width: 110,
  },

  {
    field: "qty",
    headerName: "SO Qty",
    type: "number",
    width: 100,
    align: "center",
    headerAlign: "center",
  },

  {
    field: "rate",
    headerName: "Rate",
    type: "number",
    width: 100,
    align: "center",
    headerAlign: "center",
     renderCell: (params) => (
   <>₹ {Number(params.row.rate || 0).toFixed(2)}</>
     ),
  },

  {
    field: "unit",
    headerName: "Unit",
    width: 90,
    align: "center",
    headerAlign: "center",
  },

  {
    field: "openingFgQty",
    headerName: "Opening FG",
    type: "number",
    width: 120,
    align: "center",
    headerAlign: "center",
  },

  {
    field: "productionQty",
    headerName: "Production",
    type: "number",
    width: 120,
    align: "center",
    headerAlign: "center",
  },

  {
    field: "manufacturedQty",
    headerName: "Manufactured",
    type: "number",
    width: 130,
    align: "center",
    headerAlign: "center",
  },

  {
    field: "dispatchedQty",
    headerName: "Dispatched",
    type: "number",
    width: 120,
    align: "center",
    headerAlign: "center",
  },

  {
    field: "orderReceivedBy",
    headerName: "Created By",
    width: 150,
  },

  {
    field: "status",
    headerName: "Status",
    width: 140,
  },
]);

  return (
<Box
  sx={{
    width: "100%",
    height: "calc(100vh - 180px)",
    overflow: "auto",
    borderRadius: 2,
  }}
>
<DataGrid
  rows={rows}
  columns={columns}
  loading={loading}
  getRowId={(row) => row.soNo}
  disableRowSelectionOnClick
  pageSizeOptions={[10, 20, 50, 100]}
  density="compact"
  columnHeaderHeight={48}
  rowHeight={42}
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
      borderBottom: "1px solid #eee",
      fontSize: 13,
    },

    "& .MuiDataGrid-row:nth-of-type(even)": {
      backgroundColor: "#fafafa",
    },

    "& .MuiDataGrid-row:hover": {
      backgroundColor: "#e3f2fd",
    },

    "& .MuiDataGrid-footerContainer": {
      borderTop: "1px solid #ddd",
    },

    "& .MuiDataGrid-virtualScroller": {
      overflowX: "auto",
    },
  }}
/>
    </Box>
  );
};

export default SalesOrderTable;