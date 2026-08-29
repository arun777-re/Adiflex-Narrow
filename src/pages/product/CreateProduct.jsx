import { Paper, Typography } from "@mui/material";

import ProductForm from "../../components/product/ProductForm.jsx";

const CreateProduct = () => {
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
        Create Product
      </Typography>

      <ProductForm />
    </Paper>
  );
};

export default CreateProduct;