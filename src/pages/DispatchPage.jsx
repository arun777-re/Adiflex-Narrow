import { useEffect } from "react";

import { Box, Typography } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import { getAllDispatch } from "../redux/slices/dispatchSlice.jsx";

import DispatchTable from "../components/dispatch/DispatchTable.jsx";
import useNotification from "../hooks/useNotification.jsx";

const DispatchPage = () => {
  const dispatch = useDispatch();

  const {
    dispatchOrders,

    loading,
  } = useSelector((state) => state.dispatch);

  useEffect(() => {
    dispatch(getAllDispatch());
  }, [dispatch]);

  
  useNotification({
    event: "new-notification",
    refetch:getAllDispatch,
  });

  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      <Typography variant="h5" fontWeight={700} mb={3}>
        Dispatch Management
      </Typography>

      <DispatchTable rows={dispatchOrders} loading={loading} />
    </Box>
  );
};

export default DispatchPage;
