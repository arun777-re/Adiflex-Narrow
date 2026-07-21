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
  getAllProductions,
} from "../../redux/slices/productionSlice";


const ProductionDashboard = () => {

  const dispatch = useDispatch();


  // =========================
  // AUTH USER
  // =========================

  const {
    user,
  } = useSelector(
    (state) => state.auth
  );


  // =========================
  // CURRENT DIVISION
  // =========================

  const currentDivision =
    user?.user?.division;


  // =========================
  // PRODUCTION STATE
  // =========================

  const {

    allProductionOrders = [],

    allOrdersLoading = false,

    error = null,

  } = useSelector(
    (state) => state.production
  );


  // =========================
  // FETCH ALL DIVISION ORDERS
  // =========================

  useEffect(() => {

    if (!currentDivision) {
      return;
    }


    dispatch(
      getAllProductions(
        currentDivision
      )
    );


  }, [

    dispatch,

    currentDivision,

  ]);


  return (

    <Box>

      {/* HEADER */}

      <Box
        sx={{
          mb: 3,
        }}
      >

        <Typography
          variant="h5"
          fontWeight={700}
        >
          Production Dashboard
        </Typography>


        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textTransform: "capitalize",
          }}
        >

          Division:{" "}

          {currentDivision || "Loading..."}

        </Typography>

      </Box>


      {/* SUMMARY CARDS */}

      <ProcessSummaryCards

        rows={
          allProductionOrders
        }

        loading={
          allOrdersLoading
        }

        division={
          currentDivision
        }

      />


      {/* PRODUCTION TABLE */}

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

          rows={
            allProductionOrders
          }

          loading={
            allOrdersLoading
          }

        />

      </Paper>


      {/* ERROR */}

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