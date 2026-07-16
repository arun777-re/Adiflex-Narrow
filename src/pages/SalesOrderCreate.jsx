import { useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import SalesOrderForm from "../components/salesOrder/SalesOrderForm";
import { useDispatch, useSelector } from "react-redux";


const SalesOrderCreate = () => {

  const dispatch = useDispatch();

  const { salesOrders, loading } = useSelector(
    (state) => console.log("State in SalesOrderCreate component:", state) || state.salesOrder
  );

  return (
    
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              minHeight: "calc(100vh - 200px)",
              height:"auto",
            }}
          >
            <SalesOrderForm />
          </Paper>
  )
}

export default SalesOrderCreate