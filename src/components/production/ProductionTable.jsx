import { useMemo, useState } from "react";
import { Button, Chip, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import UpdateProductionDialog from "./UpdateProductionDialog";

const ProductionTable = ({
  rows = [],
  loading = false,
  process,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleUpdate = (row) => {
    setSelectedOrder(row);
    setOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        field: "soNo",
        headerName: "SO No",
        width: 130,
      },

      {
        field: "product",
        headerName: "Product",
        flex: 1.5,
        minWidth: 220,
      },

      {
        field: "division",
        headerName: "Division",
        width: 120,
      },

      {
        field: "productionTargetQty",
        headerName: "Target Qty",
        type: "number",
        width: 130,
        align: "center",
        headerAlign: "center",
      },

      {
        field: "productionQty",
        headerName: "Production Qty",
        type: "number",
        width: 150,
        align: "center",
        headerAlign: "center",
      },

      {
        field: "status",
        headerName: "Status",
        width: 130,
        renderCell: (params) => (
          <Chip
            label={params.value}
            color={
              params.value === "Completed"
                ? "success"
                : "warning"
            }
            size="small"
          />
        ),
      },

      {
        field: "action",
        headerName: "Action",
        width: 140,
        sortable: false,
        renderCell: (params) => (
          <Button
            variant="contained"
            size="small"
            onClick={() => handleUpdate(params.row)}
          >
            Update
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 280px)",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.soNo}
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
          sx={{
            borderRadius: 2,

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: 700,
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 700,
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f1f8ff",
            },
          }}
        />
      </Box>

      <UpdateProductionDialog
        open={open}
        onClose={() => setOpen(false)}
        order={selectedOrder}
        process={process}
      />
    </>
  );
};

export default ProductionTable;