import { useEffect } from "react";

import {
  Box,
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";

import {
  addProduct,
  editProduct,
  clearProduct,
} from "../../redux/slices/productSlice";

const ProductForm = () => {
  const dispatch = useDispatch();

  const { product, loading } =
    useSelector((state) => state.product);

  const { user } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: "",
      division: "",
      rate:"",
      unit: "Meter",
      color: "",
      size: "",
    },
  });

  // ==========================================
  // EDIT MODE
  // ==========================================

  useEffect(() => {
    if (product) {
      reset({
        productName: product.productName,
        division: product.division,
        unit: product.unit,
        rate:product.rate,
        color: product.color,
        size: product.size,
      });
    }
  }, [product, reset]);

  // SUBMIT
  const onSubmit = async (data) => {
    let res;

    if (product) {
      res = await dispatch(
        editProduct({
          sku: product.sku,
          ...data,
          updatedBy: user?.user?.name,
        })
      );
    } else {
      res = await dispatch(
        addProduct({
          ...data,
          createdBy: user?.user?.name,
        })
      );
    }

    if (res.payload?.success) {
      dispatch(clearProduct());

      reset({
        productName: "",
        division: "",
        unit: "Meter",
        color: "",
        size: "",
      });

      // Refresh Product List

      // dispatch(fetchProducts());
    }
  };

  // RESET FORM

  const handleReset = () => {
    dispatch(clearProduct());

    reset({
      productName: "",
      division: "",
      unit: "Meter",
      color: "",
      size: "",
    });
  };
    return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      mb={4}
    >
      <Grid container spacing={2}>

        {/* PRODUCT NAME */}

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Product Name"
            {...register("productName", {
              required: "Product Name is required",
            })}
            error={!!errors.productName}
            helperText={errors.productName?.message}
          />
        </Grid>

        {/* DIVISION */}

        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            select
            fullWidth
            label="Division"
            defaultValue=""
            {...register("division", {
              required: "Division is required",
            })}
            error={!!errors.division}
            helperText={errors.division?.message}
          >
            <MenuItem value="">
              Select Division
            </MenuItem>

            <MenuItem value="Woven">
              Woven
            </MenuItem>

            <MenuItem value="Crochet">
              Crochet
            </MenuItem>
          </TextField>
        </Grid>

        {/* UNIT */}

        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            select
            fullWidth
            label="Unit"
            defaultValue="Meter"
            {...register("unit", {
              required: "Unit is required",
            })}
          >
            <MenuItem value="Meter">
              Meter
            </MenuItem>

            <MenuItem value="Roll">
              Roll
            </MenuItem>

            <MenuItem value="Piece">
              Piece
            </MenuItem>

            <MenuItem value="Kg">
              Kg
            </MenuItem>
          </TextField>
        </Grid>

        {/* COLOR */}

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Color"
            {...register("color")}
          />
        </Grid>

        {/* SIZE */}

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Size"
            {...register("size")}
          />
        </Grid>
        {/* rate */}
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Rate"
            {...register("rate")}
          />
        </Grid>

      </Grid>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        mt={4}
      >
        <Button
          variant="outlined"
          onClick={handleReset}
        >
          Reset
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : product
            ? "Update Product"
            : "Create Product"}
        </Button>
      </Stack>
    </Box>
  );
};

export default ProductForm;  