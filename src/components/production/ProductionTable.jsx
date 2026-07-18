import { useMemo, useState } from "react";

import {
  Button,
  Chip,
  Box,
  Stack,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import UpdateProductionDialog
  from "./UpdateProductionDialog";


const ProductionTable = ({
  rows = [],
  loading = false,
  process,
}) => {

  const [open, setOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [selectedAction, setSelectedAction] =
    useState(null);


// open process dialogue
  const handleProcessAction = (
    row,
    action
  ) => {

    setSelectedOrder(row);

    setSelectedAction(action);

    setOpen(true);

  };


// close dialogue function
  const handleClose = () => {

    setOpen(false);

    setSelectedOrder(null);

    setSelectedAction(null);

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


    // start time 
      {
        field: "processStartTime",

        headerName: "Start Time",

        width: 180,

        valueGetter: (value) => {

          return value || "-";

        },

      },

// end time 
      {
        field: "processEndTime",

        headerName: "End Time",

        width: 180,

        valueGetter: (value) => {

          return value || "-";

        },

      },

// current process status
      {
        field: "processStatus",

        headerName: "Status",

        width: 140,

        renderCell: (params) => {

          const status =
            params.value || "Pending";


          let color = "warning";


          if (
            status === "In Progress"
          ) {

            color = "info";

          }


          if (
            status === "Completed"
          ) {

            color = "success";

          }


          return (

            <Chip

              label={status}

              color={color}

              size="small"

            />

          );

        },

      },

// action

      {
        field: "action",

        headerName: "Action",

        width: 200,

        sortable: false,

        renderCell: (params) => {

          const status =
            params.row.processStatus ||
            "Pending";

// pending

          if (
            status === "Pending"
          ) {

            return (

              <Button

                variant="contained"

                color="primary"

                size="small"

                onClick={() =>
                  handleProcessAction(
                    params.row,
                    "start"
                  )
                }

              >

                Start Process

              </Button>

            );

          }

// in progress

          if (
            status === "In Progress"
          ) {

            return (

              <Button

                variant="contained"

                color="success"

                size="small"

                onClick={() =>
                  handleProcessAction(
                    params.row,
                    "complete"
                  )
                }

              >

                Complete Process

              </Button>

            );

          }

// completed

          return (

            <Chip

              label="Completed"

              color="success"

              size="small"

            />

          );

        },

      },

    ],

    [process]

  );


  return (

    <>

      <Box

        sx={{

          width: "100%",

          height:
            "calc(100vh - 280px)",

        }}

      >

        <DataGrid

          rows={rows}

          columns={columns}

          loading={loading}

          getRowId={(row) =>

            `${row.soNo}-${row.product}`

          }

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

{/* process dialogue */}

      <UpdateProductionDialog

        open={open}

        onClose={handleClose}

        order={selectedOrder}

        process={process}

        action={selectedAction}

      />

    </>

  );

};


export default ProductionTable;