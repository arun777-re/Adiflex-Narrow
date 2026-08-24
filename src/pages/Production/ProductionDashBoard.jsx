import { useEffect } from "react";

import { Paper, Box, Typography } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";


import ProductionTable from "../../components/production/ProductionTable";

import { getAllProductions } from "../../redux/slices/productionSlice";
import toast from "react-hot-toast";

const ProductionDashboard = () => {
  const dispatch = useDispatch();
const { user } = useSelector((state) => state.auth.user);
const currentDivision = user?.division;

  // =========================
  // PRODUCTION STATE
  // =========================

  const {
    allProductionOrders = [],

    allOrdersLoading = false,

    error = null,
  } = useSelector((state) => state.production);

  // =========================
  // FETCH ALL DIVISION ORDERS
  // =========================

  useEffect(() => {
    if (!currentDivision) {
      return;
    }

    dispatch(getAllProductions(currentDivision));
  }, [dispatch, currentDivision]);


  useEffect(()=>{
    if(error){
      toast.error(error);
    }
  },[error])

  return (
    <Box>
      {/* HEADER */}

      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Production Dashboard
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textTransform: "capitalize",
          }}
        >
          Division: {currentDivision || "Loading..."}
        </Typography>
      </Box>


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
          rows={allProductionOrders}
          loading={allOrdersLoading}
        />
      </Paper>

      {/* ERROR */}

     
    </Box>
  );
};

export default ProductionDashboard;
