import { useEffect } from "react";
import { Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import ProcessSummaryCards from "../../components/production/ProcessSummaryCards";
import ProductionTable from "../../components/production/ProductionTable";

import { fetchProductionByProcess } from "../../redux/slices/productionSlice";

const ProductionDashboard = () => {

  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth
  );

  const {
    productionOrders,
    loading,
  } = useSelector(
    (state) => state.production
  );


  useEffect(() => {
 alert(user?.user.role)
    if(user?.user?.role){

      dispatch(
        fetchProductionByProcess(user?.user?.role)
      );

    }

  }, [dispatch, user]);

console.log("production orders ",productionOrders);

  return (

    <>

      <ProcessSummaryCards
        rows={productionOrders}
      />

      <Paper
        elevation={3}
        sx={{
          mt:3,
          p:2,
          borderRadius:3,
        }}
      >

        <ProductionTable

          rows={productionOrders}

          loading={loading}

          process={user?.role}

        />

      </Paper>

    </>

  );

};

export default ProductionDashboard;