import { useEffect } from "react";

import {
  Paper,
  Typography,
} from "@mui/material";

import { useDispatch } from "react-redux";

import { fetchProducts } from "../redux/slices/productSlice.jsx";

import ProductTable from "../components/product/ProductTable.jsx";

const ViewAllProducts = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
      }}
    >
      <Typography
        variant="h5"
        fontWeight={700}
        mb={3}
      >
        View Products
      </Typography>

      <ProductTable />
    </Paper>
  );
};

export default ViewAllProducts;