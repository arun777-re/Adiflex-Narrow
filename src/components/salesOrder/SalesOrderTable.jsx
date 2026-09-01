import { useMemo } from "react";
import { Box, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const SalesOrderTable = ({ rows = [], loading = false }) => {
  const columns = useMemo(
    () => [
      {
        field: "soNo",
        headerName: "SO No",
        width: 100,
      },

      {
        field: "date",
        headerName: "Date",
        width: 100,
      },

      {
        field: "skucode",
        headerName: "SKU Code",
        width: 100,
      },

      {
        field: "customer",
        headerName: "Customer",
        minWidth: 200,
        flex: 1,
      },

      {
        field: "product",
        headerName: "Product Name",
        minWidth: 220,
        flex: 1.3,
      },
      {
        field: "productionstatus",
        headerName: "Production Status",
        minWidth: 160,
        flex: 1.3,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => {
          const isCompleted = value === "Completed";
          return (
            <Chip
              label={isCompleted ? "Completed" : "Pending Production"}
              color={isCompleted ? "success" : "warning"}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, minWidth: 125, borderRadius: "16px" }}
            />
          );
        },
      },
      {
        field: "dispatchstatus",
        headerName: "Dispatch Status",
        minWidth: 150,
        flex: 1.3,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => {
          const isDispatched = value === "Dispatched";
          return (
            <Chip
              label={isDispatched ? "Dispatched" : "Pending Dispatch"}
              color={isDispatched ? "success" : "warning"}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, minWidth: 120, borderRadius: "16px" }}
            />
          );
        },
      },

      {
        field: "ordertype",
        headerName: "Order Type",
        width: 120,
      },

      {
        field: "division",
        headerName: "Division",
        width: 110,
      },

      {
        field: "qty",
        headerName: "SO Qty",
        width: 100,
        align: "center",
        headerAlign: "center",
      },

      {
        field: "rate",
        headerName: "Std Rate",
        width: 110,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => `₹ ${Number(row.rate || 0).toFixed(2)}`,
      },

      {
        field: "rateadjustment",
        headerName: "Adjustment",
        width: 120,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) =>
          `₹ ${Number(row.rateadjustment || 0).toFixed(2)}`,
      },

      {
        field: "finalrate",
        headerName: "Final Rate",
        width: 120,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <strong>₹ {Number(row.finalrate || 0).toFixed(2)}</strong>
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
        width: 120,
        align: "center",
        headerAlign: "center",
      },

      {
        field: "productionQty",
        headerName: "Production",
        width: 120,
        align: "center",
        headerAlign: "center",
      },

      {
        field: "jobWork",
        headerName: "Job Work",
        width: 110,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <Chip
            size="small"
            label={row.jobWork ? "Yes" : "No"}
            color={row.jobWork ? "success" : "default"}
          />
        ),
      },

      {
        field: "manufacturedQty",
        headerName: "Manufactured",
        width: 130,
        align: "center",
        headerAlign: "center",
      },

      {
        field: "dispatchedQty",
        headerName: "Dispatched",
        width: 120,
        align: "center",
        headerAlign: "center",
      },

      {
        field: "orderReceivedBy",
        headerName: "Created By",
        width: 150,
      },
    ],
    [],
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 180px)",
        borderRadius: 2,
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={(row) => `${row.soNo}-${row.product}`}
        disableRowSelectionOnClick
        density="compact"
        pageSizeOptions={[10, 20, 50, 100]}
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
        }}
      />
    </Box>
  );
};

export default SalesOrderTable;
