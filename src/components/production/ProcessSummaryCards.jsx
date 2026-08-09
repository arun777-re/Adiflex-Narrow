import {
  Grid,
  Paper,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";

import PendingActionsIcon
  from "@mui/icons-material/PendingActions";

import CheckCircleIcon
  from "@mui/icons-material/CheckCircle";

import InventoryIcon
  from "@mui/icons-material/Inventory";

import PrecisionManufacturingIcon
  from "@mui/icons-material/PrecisionManufacturing";


const ProcessSummaryCards = ({

  rows = [],

  loading = false,

}) => {


  // =========================
  // TOTAL ORDERS
  // =========================

  const totalOrders =
    rows.length;


  // =========================
  // COMPLETED ORDERS
  // =========================

  const completedOrders =
    rows.filter(

      (row) =>
        row.status === "Completed" 

    ).length;

const completedCycleOrders =rows.filter((row) =>
        row.status === "Completed"  || row.status === "Cycle Completed"

    ).length;
  // =========================
  // TARGET QTY
  // =========================

  const targetQty =
    rows.reduce(

      (sum, row) =>

        sum +

        Number(
          row.productionTargetQty ||
          0
        ),

      0

    );


  // =========================
  // PRODUCTION QTY
  // =========================

  const productionQty =
    rows.reduce(

      (sum, row) =>

        sum +

        Number(
          row.productionQty ||
          0
        ),

      0

    );


  const cards = [

    {

      title:
        "Total Orders",

      value:
        totalOrders
          .toLocaleString(),

      icon:
        <InventoryIcon
          fontSize="large"
        />,

    },

    {

      title:
        "Completed",

      value:
        completedOrders
          .toLocaleString(),

      icon:
        <CheckCircleIcon
          fontSize="large"
        />,

    },

    {

      title:
        "Target Qty",

      value:
        targetQty
          .toLocaleString(),

      icon:
        <InventoryIcon
          fontSize="large"
        />,

    },

    {

      title:
        "Production Qty",

      value:
        productionQty
          .toLocaleString(),

      icon:
        <PrecisionManufacturingIcon
          fontSize="large"
        />,

    },

  ];


  return (

    <Grid
      container
      spacing={{
        xs: 2,
        sm: 2.5,
        md: 3,
      }}
    >

      {cards.map(

        (card) => (

          <Grid

            key={
              card.title
            }

            size={{
              xs: 12,
              sm: 6,
              lg: 3,
            }}

          >

            <Paper

              elevation={3}

              sx={{

                p: {

                  xs: 2,

                  sm: 2.5,

                  md: 3,

                },

                minHeight: {

                  xs: 120,

                  sm: 135,

                },

                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                borderRadius:
                  3,

                transition:
                  "transform 0.2s ease",

                "&:hover": {

                  transform:
                    "translateY(-3px)",

                },

              }}

            >

              <Box>

                <Typography

                  variant="body2"

                  color="text.secondary"

                  fontWeight={600}

                >

                  {
                    card.title
                  }

                </Typography>


                {loading ? (

                  <Skeleton

                    variant="text"

                    width={100}

                    height={48}

                  />

                ) : (

                  <Typography

                    variant="h4"

                    fontWeight={700}

                    mt={1}

                  >

                    {
                      card.value
                    }

                  </Typography>

                )}

              </Box>


              <Box

                sx={{

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  width: 56,

                  height: 56,

                  borderRadius:
                    "50%",

                  bgcolor:
                    "action.hover",

                }}

              >

                {
                  card.icon
                }

              </Box>

            </Paper>

          </Grid>

        )

      )}

    </Grid>

  );

};


export default ProcessSummaryCards;