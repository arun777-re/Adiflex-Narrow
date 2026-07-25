import { useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useDispatch } from "react-redux";

import { fetchProducts } from "../../redux/slices/productSlice";

import ProductForm from "../../components/product/ProductForm";
import ProductTable from "../../components/product/ProductTable";

const ProductMaster = () => {
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
        Product Master
      </Typography>

      {/* Product Form */}

      <Box mb={4}>
        <ProductForm />
      </Box>

      {/* Product Table */}

      <ProductTable />
    </Paper>
  );
};

export default ProductMaster;