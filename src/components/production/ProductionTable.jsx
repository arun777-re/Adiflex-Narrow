import { useMemo, useState } from "react";

import {
  Button,
  Chip,
  Box,
  Stack,
  Typography,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import UpdateProductionDialog
  from "./UpdateProductionDialog";


// =====================================================
// PROCESS ORDER
// =====================================================

const PROCESS_ORDER = [
  {
    key: "warping",
    label: "Warping",
    startField: "warpingStartAt",
    endField: "warpingEndsAt",
  },

  {
    key: "filling",
    label: "Filling",
    startField: "fillingStartAt",
    endField: "fillingEndsAt",
  },

  {
    key: "machine",
    label: "Machine",
    startField: "machineStartsAt",
    endField: "machineEndsAt",
  },



  {
    key: "finishing",
    label: "Finishing",
    startField: "finishingStartsAt",
    endField: "finishingEndsAt",
  },
    {
    key: "quality",
    label: "Quality",
    startField: "qualityStartsAt",
    endField: "qualityEndsAt",
  },

  {
    key: "rolling",
    label: "Rolling",
    startField: "rollingStartsAt",
    endField: "rollingEndsAt",
  },

  {
    key: "packing",
    label: "Packing",
    startField: "packingStartsAt",
    endField: "packingEndsAt",
  },
];

// get current process of order
const getCurrentProcess = (row) => {
   // OLD PRODUCTION CYCLE
  if (
    row.overAllStatus === "Cycle Completed" ||
    row.overAllStatus === "Completed"
  ) {
    return {
      key: null,
      label: "Completed",
      status: "Completed",
    }
  }
  const processOrder = [];

  // ==========================================
  // JOB WORK
  // ==========================================

  if (row.isJobWork === true) {
    processOrder.push({
      key: "jobWork",
      label: "Job Work",
      startField: "jobWorkStartTime",
      endField: "jobWorkEndTime",
    });
  }

  // ==========================================
  // NORMAL PRODUCTION PROCESSES
  // ==========================================

  processOrder.push(...PROCESS_ORDER);

  // ==========================================
  // FIND CURRENT PROCESS
  // ==========================================

  for (const process of processOrder) {
    const startTime = row[process.startField];
    const endTime = row[process.endField];

    // ----------------------------------------
    // COMPLETED
    // ----------------------------------------

    if (endTime) {
      continue;
    }

    // ----------------------------------------
    // IN PROGRESS
    // ----------------------------------------

    if (startTime) {
      return {
        key: process.key,
        label: process.label,
        status: "In Progress",
      };
    }

    // ----------------------------------------
    // PENDING
    // ----------------------------------------

    return {
      key: process.key,
      label: process.label,
      status: "Pending",
    };
  }

  // ==========================================
  // ALL COMPLETED
  // ==========================================

  return {
    key: null,
    label: "Completed",
    status: "Completed",
  };
};
// component 

const ProductionTable = ({

  rows = [],

  loading = false,

}) => {


  const [

    open,

    setOpen,

  ] = useState(false);


  const [

    selectedOrder,

    setSelectedOrder,

  ] = useState(null);


  const [

    selectedAction,

    setSelectedAction,

  ] = useState(null);


  // =====================================================
  // OPEN DIALOG
  // =====================================================

  const handleProcessAction = (

    row,

    action,

    process,

  ) => {

    setSelectedOrder({

      ...row,

      currentProcess:
        process,

    });


    setSelectedAction(
      action
    );


    setOpen(true);

  };


  // =====================================================
  // CLOSE DIALOG
  // =====================================================

  const handleClose = () => {

    setOpen(false);

    setSelectedOrder(null);

    setSelectedAction(null);

  };


  // =====================================================
  // COLUMNS
  // =====================================================

  const columns = useMemo(

    () => [

      // -----------------------------------------------
      // SO NO
      // -----------------------------------------------

      {

        field:
          "soNo",

        headerName:
          "SO No",

        width:
          130,

      },


      // -----------------------------------------------
      // PRODUCT
      // -----------------------------------------------

      {

        field:
          "product",

        headerName:
          "Product",

        flex:
          1.5,

        minWidth:
          220,

      },


      // -----------------------------------------------
      // DIVISION
      // -----------------------------------------------

      {

        field:
          "division",

        headerName:
          "Division",

        width:
          120,

      },


      // -----------------------------------------------
      // TARGET
      // -----------------------------------------------

      {

        field:
          "productionTargetQty",

        headerName:
          "Target Qty",

        type:
          "number",

        width:
          130,

        align:
          "center",

        headerAlign:
          "center",

      },


      // -----------------------------------------------
      // PRODUCTION QTY
      // -----------------------------------------------

      {

        field:
          "productionQty",

        headerName:
          "Production Qty",

        type:
          "number",

        width:
          150,

        align:
          "center",

        headerAlign:
          "center",

      },


      // -----------------------------------------------
      // CURRENT PROCESS
      // -----------------------------------------------

      {

        field:
          "currentProcess",

        headerName:
          "Current Process",

        width:
          170,

        renderCell:
          (params) => {

            const process =
              getCurrentProcess(
                params.row
              );


            return (

              <Chip

                label={
                  process.label
                }

                color={
                  process.status ===
                  "Completed"

                    ? "success"

                    : "primary"
                }

                size="small"

              />

            );

          },

      },


      // -----------------------------------------------
      // STATUS
      // -----------------------------------------------

      {

        field:
          "currentStatus",

        headerName:
          "Status",

        width:
          140,

        renderCell:
          (params) => {

            const process =
              getCurrentProcess(
                params.row
              );


            let color =
              "warning";


            if (

              process.status ===
              "In Progress"

            ) {

              color =
                "info";

            }


            if (

              process.status ===
              "Completed"

            ) {

              color =
                "success";

            }


            return (

              <Chip

                label={
                  process.status
                }

                color={
                  color
                }

                size="small"

              />

            );

          },

      },


      // -----------------------------------------------
      // ACTION
      // -----------------------------------------------

      {

        field:
          "action",

        headerName:
          "Action",

        width:
          220,

        sortable:
          false,

        renderCell:
          (params) => {


            const process =
              getCurrentProcess(
                params.row
              );


            // ALL COMPLETED

            if (

              process.status ===
              "Completed"

            ) {

              return (

                <Chip

                  label="Production Completed"

                  color="success"

                  size="small"

                />

              );

            }


            // PENDING

            if (

              process.status ===
              "Pending"

            ) {

              return (

                <Button

                  variant="contained"

                  color="primary"

                  size="small"

                  onClick={() =>

                    handleProcessAction(

                      params.row,

                      "start",

                      process.key,

                    )

                  }

                >

                  Start{" "}

                  {
                    process.label
                  }

                </Button>

              );

            }


            // IN PROGRESS

            if (

              process.status ===
              "In Progress"

            ) {

              return (

                <Button

                  variant="contained"

                  color="success"

                  size="small"

                  onClick={() =>

                    handleProcessAction(

                      params.row,

                      "complete",

                      process.key,

                    )

                  }

                >

                  Complete{" "}

                  {
                    process.label
                  }

                </Button>

              );

            }


            return null;

          },

      },

    ],

    []

  );


  return (

    <>

      <Box

        sx={{

          width:
            "100%",

          height:
            "calc(100vh - 280px)",

        }}

      >

        <DataGrid

          rows={
            rows
          }

          columns={
            columns
          }

          loading={
            loading
          }

          getRowId={

            (row) =>

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

                pageSize:
                  10,

              },

            },

          }}

          sx={{

            borderRadius:
              2,

            "& .MuiDataGrid-columnHeaders": {

              backgroundColor:
                "#f5f5f5",

              fontWeight:
                700,

            },

            "& .MuiDataGrid-columnHeaderTitle": {

              fontWeight:
                700,

            },

            "& .MuiDataGrid-row:hover": {

              backgroundColor:
                "#f1f8ff",

            },

          }}

        />

      </Box>


      {/* PROCESS DIALOG */}

      <UpdateProductionDialog

        open={
          open
        }

        onClose={
          handleClose
        }

        order={
          selectedOrder
        }

        process={
          selectedOrder?.currentProcess
        }

        action={
          selectedAction
        }

      />

    </>

  );

};


export default ProductionTable;