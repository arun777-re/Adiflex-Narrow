import { useEffect } from "react";

import {
  Paper,
  Box,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import ProcessSummaryCards
  from "../../components/production/ProcessSummaryCards";

import ProductionTable
  from "../../components/production/ProductionTable";

import {
  fetchProductionByProcess,
} from "../../redux/slices/productionSlice";


const ProductionDashboard = () => {

  const dispatch =
    useDispatch();

    // authentication user
  const { user } =
    useSelector(
      (state) => state.auth
    );

// production state
  const {

    productionOrders = [],

    loading = false,

    error = null,

  } =
    useSelector(
      (state) => state.production
    );


// current process by role login
  const currentProcess =
    user?.user?.role;


// fetch orders on page load
  useEffect(() => {

    if (!currentProcess) {

      return;

    }


    dispatch(

      fetchProductionByProcess(

        currentProcess

      )

    );

  }, [

    dispatch,

    currentProcess,

  ]);


  console.log(

    "Current Process:",

    currentProcess

  );


  console.log(

    "Production Orders:",

    productionOrders

  );

  return (

    <Box>
{/* current process title */}
      <Typography

        variant="h5"

        fontWeight={700}

        mb={3}

        sx={{

          textTransform: "capitalize",

        }}

      >

        {currentProcess || "Production"} Dashboard

      </Typography>

{/* summary cards */}
      <ProcessSummaryCards

        rows={productionOrders}

        loading={loading}

      />
{/* table of production */}
      <Paper

        elevation={3}

        sx={{

          mt: 3,

          p: {

            xs: 1,

            sm: 2,

          },

          borderRadius: 3,

        }}

      >

        <ProductionTable

          rows={productionOrders}

          loading={loading}

          process={currentProcess}

        />

      </Paper>
{/* error handling */}
      {error && (

        <Typography

          color="error"

          mt={2}

        >

          {error}

        </Typography>

      )}

    </Box>

  );

};


export default ProductionDashboard;