import { useEffect } from "react";

import { Box, Button, Grid, MenuItem, Stack, TextField } from "@mui/material";

import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";

import {
  addProduct,
  editProduct,
  clearProduct,
} from "../../redux/slices/productSlice";

const ProductForm = () => {
  const dispatch = useDispatch();

  const { product, loading } = useSelector((state) => state.product);

  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: "",
      division: "",
      rate: "",
      unit: "Meter",
      color: "",
      size: "",
      meterPerRoll: "",
      meterPerKg: "",
      availableQty:"",
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
        rate: product.rate,
        color: product.color,
        size: product.size,
        meterPerKg: product.meterPerKg,
        meterPerRoll: product.meterPerRoll,
        availableQty: product.availableQty,
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
        }),
      );
    } else {
      res = await dispatch(
        addProduct({
          ...data,
          createdBy: user?.user?.name,
        }),
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
        rate: "",
        meterPerKg: "",
        meterPerRoll: "",
        availableQty: "",
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
      meterPerKg: "",
      meterPerRoll: "",
      availableQty: "",
    });
  };
  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} mb={4}>
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
            {...register("division", {
              required: "Division is required",
            })}
            error={!!errors.division}
            helperText={errors.division?.message}
          >
            <MenuItem value="">Select Division</MenuItem>

            <MenuItem value="Woven">Woven</MenuItem>

            <MenuItem value="Crochet">Crochet</MenuItem>
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
            <MenuItem value="Meter">Meter</MenuItem>
          </TextField>
        </Grid>

        {/* COLOR */}

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField fullWidth label="Color" {...register("color")} />
        </Grid>
        {/* Available Qty */}

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Available Quantity"
            type="number"
            inputProps={{
              min: 0,
              step: "0.01",
            }}
            {...register("availableQty", {
              required: "Available Quantity is required",
              valueAsNumber: true,
              validate: (value) => {
                if (!Number.isFinite(value)) {
                  return "Please enter a valid quantity";
                }

                if (value < 0) {
                  return "Quantity must be a positive number";
                }

                return true;
              },
            })}
            error={!!errors.availableQty}
            helperText={errors.availableQty?.message}
          />
        </Grid>

        {/* SIZE */}

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Size in mm"
            type="number"
            inputProps={{
              min: 0,
              step: "0.01",
            }}
            {...register("size", {
              required: "Size is required",
              valueAsNumber: true,
              validate: (value) => {
                if (!Number.isFinite(value)) {
                  return "Please enter a valid size";
                }

                if (value <= 0) {
                  return "Size must be greater than 0";
                }

                return true;
              },
            })}
            error={!!errors.size}
            helperText={errors.size?.message}
          />
        </Grid>
        {/* meter in one roll */}
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
          type="number"
            inputProps={{
              min: 0,
              step: "0.01",
            }}
            fullWidth
            label="Meter in one Roll"
            {...register("meterPerRoll")}
          />
        </Grid>
        {/* meter in 1 kg */}
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            type="number"
              inputProps={{
              min: 0,
              step: "0.01",
            }}
            label="Meter in One Kg"
            {...register("meterPerKg")}
          />
        </Grid>
        {/* rate */}
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            type="number"
            label="Rate"
            inputProps={{
              min: 0,
              step: "0.01",
            }}
            {...register("rate", {
              required: "Rate is required",
              validate: (value) => {
                const rate = Number(value);

                if (value === "") {
                  return "Rate is required";
                }

                if (!Number.isFinite(rate)) {
                  return "Please enter a valid rate";
                }

                if (rate <= 0) {
                  return "Rate must be greater than 0";
                }

                return true;
              },
            })}
            error={!!errors.rate}
            helperText={errors.rate?.message}
          />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>

        <Button type="submit" variant="contained" disabled={loading}>
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
