import { useMemo, useState } from "react";

import { Button, Chip, Box } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import DispatchDialog from "./DispatchDialog";

const DispatchTable = ({
  rows = [],

  loading = false,
}) => {
  const [open, setOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpen = (row) => {
    setSelectedOrder(row);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    setSelectedOrder(null);
  };

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
        field: "productionQty",
        headerName: "Production Qty",
        width: 150,
        type: "number",
      },

      {
        field: "rate",
        headerName: "Rate",
        width: 110,
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
        field: "freight",
        headerName: "Freight",
        width: 140,
        renderCell: (params) => (
          <Chip
            label={params.value ? "Yes" : "No"}
            color={params.value ? "success" : "default"}
            size="small"
          />
        ),
      },

      {
        field: "wastageQty",
        headerName: "Wastage Qty",
        width: 130,
        type: "number",
      },

      {
        field: "nettQtyRTD",
        headerName: "Nett Qty RTD",
        width: 140,
        type: "number",
      },

      {
        field: "dispatchQty",
        headerName: "Dispatch Qty",
        width: 140,
        type: "number",
      },

      {
        field: "availableQty",
        headerName: "Available Qty",
        width: 140,
        type: "number",
      },

      {
        field: "status",
        headerName: "Status",
        width: 180,
        renderCell: (params) => {
          let color = "warning";

          if (params.value === "Partially Dispatched") color = "info";

          if (params.value === "Fully Dispatched") color = "success";

          return <Chip label={params.value} color={color} size="small" />;
        },
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

      {
        field: "action",
        headerName: "Action",
        width: 170,
        sortable: false,
        renderCell: (params) => {
          if (Number(params.row.availableQty) <= 0) {
            return (
              <Chip label="Fully Dispatched" color="success" size="small" />
            );
          }

          return (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleOpen(params.row)}
            >
              Dispatch
            </Button>
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      <Box
        sx={{
          width: "100%",

          height: "calc(100vh - 250px)",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          density="compact"
          pageSizeOptions={[
            10,

            20,

            50,
          ]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
        />
      </Box>

      <DispatchDialog open={open} onClose={handleClose} order={selectedOrder} />
    </>
  );
};

export default DispatchTable;
