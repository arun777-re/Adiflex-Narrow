import { Box} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const SalesOrderTable = ({ rows = [], loading = false }) => {
 

const columns = [
  {
    field: "so_no",
    headerName: "SO No",
    minWidth: 120,
    flex: 0.8,
  },

  {
    field: "order_date",
    headerName: "Date",
    minWidth: 120,
    flex: 0.8,
    valueFormatter: (value) => {
      if (!value) return "";

      const date = new Date(value);

      if (Number.isNaN(date.getTime())) return "";

      return date.toLocaleDateString("en-IN");
    },
  },

  {
    field: "skucode",
    headerName: "SKU Code",
    minWidth: 110,
    flex: 0.8,
  },

  {
    field: "customer",
    headerName: "Customer",
    minWidth: 180,
    flex: 1.3,
  },

  {
    field: "product_name",
    headerName: "Product",
    minWidth: 180,
    flex: 1.3,
  },

  {
    field: "shipping_location",
    headerName: "Shipping Location",
    minWidth: 180,
    flex: 1.2,
  },

  {
    field: "billing_location",
    headerName: "Billing Location",
    minWidth: 180,
    flex: 1.2,
  },

  {
    field: "route",
    headerName: "Route",
    minWidth: 120,
    flex: 0.8,
  },

  {
    field: "committed_date",
    headerName: "Committed Date",
    minWidth: 130,
    flex: 0.9,
    valueFormatter: (value) => {
      if (!value) return "";

      const date = new Date(value);

      if (Number.isNaN(date.getTime())) return "";

      return date.toLocaleDateString("en-IN");
    },
  },

  {
    field: "status",
    headerName: "Production Status",
    minWidth: 160,
    flex: 1,
    renderCell: (params) => {
      const value = params?.value || "-";

      return value;
    },
  },

  {
    field: "dispatch_status",
    headerName: "Dispatch Status",
    minWidth: 140,
    flex: 0.9,
    valueGetter: (value, row) => {
      const dispatched = Number(row?.dispatched_qty || 0);
      const ordered = Number(row?.so_qty_in_meter || 0);

      if (ordered <= 0) return "Pending";

      if (dispatched >= ordered) {
        return "Dispatched";
      }

      if (dispatched > 0) {
        return "Partially Dispatched";
      }

      return "Pending";
    },
    renderCell: (params) => {
      return params?.value || "Pending";
    },
  },

  {
    field: "order_type",
    headerName: "Order Type",
    minWidth: 120,
    flex: 0.8,
  },

  {
    field: "division",
    headerName: "Division",
    minWidth: 100,
    flex: 0.7,
  },

  {
    field: "so_qty",
    headerName: "SO Qty",
    minWidth: 100,
    flex: 0.7,
    type: "number",
    valueFormatter: (value) => {
      if (value === null || value === undefined || value === "") {
        return "0";
      }

      return Number(value).toLocaleString("en-IN");
    },
  },

  {
    field: "so_qty_in_meter",
    headerName: "SO Qty (Meter)",
    minWidth: 140,
    flex: 0.9,
    type: "number",
    valueFormatter: (value) => {
      if (value === null || value === undefined || value === "") {
        return "0";
      }

      return Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },

  {
    field: "unit",
    headerName: "Unit",
    minWidth: 90,
    flex: 0.6,
  },

  {
    field: "standard_rate",
    headerName: "Standard Rate",
    minWidth: 120,
    flex: 0.8,
    type: "number",
    valueFormatter: (value) => {
      if (value === null || value === undefined || value === "") {
        return "0.00";
      }

      return Number(value).toFixed(2);
    },
  },

  {
    field: "rate_adjustment",
    headerName: "Rate Adjustment",
    minWidth: 130,
    flex: 0.9,
    type: "number",
    valueFormatter: (value) => {
      if (value === null || value === undefined || value === "") {
        return "0.00";
      }

      return Number(value).toFixed(2);
    },
  },

  {
    field: "final_rate",
    headerName: "Final Rate",
    minWidth: 110,
    flex: 0.8,
    type: "number",
    valueFormatter: (value) => {
      if (value === null || value === undefined || value === "") {
        return "0.00";
      }

      return Number(value).toFixed(2);
    },
  },

  {
    field: "opening_fg_qty",
    headerName: "Opening FG",
    minWidth: 120,
    flex: 0.8,
    type: "number",
    valueFormatter: (value) => {
      if (value === null || value === undefined || value === "") {
        return "0.00";
      }

      return Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },

  {
    field: "production_qty",
    headerName: "Production Qty",
    minWidth: 130,
    flex: 0.9,
    type: "number",
    valueFormatter: (value) => {
      if (value === null || value === undefined || value === "") {
        return "0.00";
      }

      return Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },

  {
    field: "job_work",
    headerName: "Job Work",
    minWidth: 100,
    flex: 0.7,
    valueFormatter: (value) => {
      if (value === null || value === undefined || value === "") {
        return "-";
      }

      return value;
    },
  },

  {
    field: "manufactured_qty",
    headerName: "Manufactured Qty",
    minWidth: 140,
    flex: 0.9,
    type: "number",
    valueFormatter: (value) => {
      if (value === null || value === undefined || value === "") {
        return "0.00";
      }

      return Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },

  {
    field: "dispatched_qty",
    headerName: "Dispatched Qty",
    minWidth: 130,
    flex: 0.9,
    type: "number",
    valueFormatter: (value) => {
      if (value === null || value === undefined || value === "") {
        return "0.00";
      }

      return Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },
  {
    field: "total_wastage_qty",
    headerName: "Wastage Qty",
    minWidth: 130,
    flex: 0.9,
    type: "number",
    valueFormatter: (value) => {
      if (value === null || value === undefined || value === "") {
        return "0.00";
      }

      return Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },

  {
    field: "order_received_by",
    headerName: "Order Received By",
    minWidth: 140,
    flex: 1,
  },

  {
    field: "order_amount",
    headerName: "Order Amount",
    minWidth: 130,
    flex: 0.9,
    type: "number",
    valueFormatter: (value) => {
      if (value === null || value === undefined || value === "") {
        return "₹ 0.00";
      }

      return `₹ ${Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
];






console.table(
  rows.map((row, index) => ({
    index,
    id: row.id,
    so_no: row.so_no,
    product_name: row.product_name,
    keys: `${row.so_no}-${row.product_name}-${row.sales_items_id}`,
  }))
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
        getRowId={(row) => String(row.sales_items_id)}
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
