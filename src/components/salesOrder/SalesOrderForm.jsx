import React, { useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useForm, useFieldArray } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";

import { addSalesOrder } from "../../redux/slices/salesOrderSlice";

import { fetchProducts } from "../../redux/slices/productSlice";

const SalesOrderForm = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const { user, loading } = useSelector((state) => state.auth);

  const { allproducts } = useSelector((state) => state.product);



  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      customer: "",
      ordertype: "",
      shippinglocation: "",
      billinglocation: "",
      freight: false,
      jobWork: false,
      products: [
        {
          product: "",

          skucode: "",
          division: "",

          qty: "",

          rate: "",
          rateadjustment: 0,
          finalrate: 0,

          unit: "Meter",

          openingFgQty: 0,

          productionQty: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,

    name: "products",
  });

  const products = watch("products");



  // PRODUCTION QTY CALCULATION

  useEffect(() => {
    products?.forEach((item, index) => {
      const productionQty =
        (Number(item.qty) || 0) - (Number(item.openingFgQty) || 0);

      setValue(
        `products.${index}.productionQty`,

        productionQty > 0 ? productionQty : 0,
      );
    });
  }, [products, setValue]);



  const onSubmit = async (data) => {
    const payload = {
      ...data,

      orderReceivedBy: user?.user?.name,

      products: data.products.map((item) => ({
        ...item,

        qty: Number(item.qty),

        rate: Number(item.rate),
        rateadjustment: Number(item.rateadjustment),
        finalrate: (Number(item.rate) || 0) + (Number(item.rateadjustment) || 0),

        openingFgQty: Number(item.openingFgQty) || 0,

        productionQty: Number(item.productionQty),
      })),
    };

    const res = await dispatch(addSalesOrder(payload));

    if (res?.payload?.success) {
      alert("Sales Order Created");

      reset({
        date: new Date().toISOString().slice(0, 10),

        customer: "",

        ordertype: "",

        shippinglocation: "",
        billinglocation: "",
        jobWork: false,
        freight: false,

        products: [
          {
            product: "",

            skucode: "",
            division: "",

            qty: "",

            rate: "",
            rateadjustment: 0,
            finalrate: 0,

            unit: "Meter",

            openingFgQty: 0,

            productionQty: 0,
          },
        ],
      });
    }
  };
  return (
    <Paper elevation={0}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Create Sales Order
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* DATE */}

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.date}
              helperText={errors.date ? "Date is required" : ""}
              {...register("date", {
                required: true,
              })}
            />
          </Grid>

          {/* CUSTOMER */}

          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              label="Customer"
              error={!!errors.customer}
              helperText={errors.customer ? "Customer is required" : ""}
              {...register("customer", {
                required: true,
              })}
            />
          </Grid>

          {/* ORDER TYPE */}

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              label="Order Type"
              defaultValue=""
              {...register("ordertype", {
                required: true,
              })}
            >
              <MenuItem value="">Select Order Type</MenuItem>

              <MenuItem value="Customer">Customer</MenuItem>

              <MenuItem value="Internal">Internal</MenuItem>
            </TextField>
          </Grid>

          {/*Billing LOCATION */}

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Billing Location"
              error={!!errors.billinglocation}
              helperText={errors.billinglocation ? "Billing Location is required" : ""}
              {...register("billinglocation", {
                required: true,
              })}
            />
          </Grid>
          {/*Shipping LOCATION */}

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Shipping Location"
              error={!!errors.shippinglocation}
              helperText={
                errors.shippinglocation ? "Shipping Location is required" : ""
              }
              {...register("shippinglocation", {
                required: true,
              })}
            />
          </Grid>

          {/* JOB WORK */}

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={<Checkbox {...register("jobWork")} />}
              label="Job Work Required"
            />
          </Grid>
          {/* IS FREIGHT */}

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={<Checkbox {...register("freight")} />}
              label="Freight(Optional)"
            />
          </Grid>

          <Grid size={12}>
            <Typography variant="h6" fontWeight={600} mt={2} mb={1}>
              Products
            </Typography>
          </Grid>

          {fields.map((field, index) => {
             const rate = watch(`products.${index}.rate`)
  const adjustment = watch(`products.${index}.rateadjustment`);
  return (

            <Grid
              container
              spacing={2}
              key={field.id}
              sx={{
                mb: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 2,
              }}
            >
              {/* PRODUCT */}

              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Product"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                  {...register(`products.${index}.product`, {
                    required: true,
                  })}
                />
              </Grid>

              {/* DIVISION */}
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  fullWidth
                  label="Division"
                  value={watch(`products.${index}.division`) || ""}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* SKU */}

              <Grid size={{ xs: 12, md: 3 }}>
                <Autocomplete
                  options={allproducts || []}
                  getOptionLabel={(option) => option?.sku || ""}
                  onChange={(event, newValue) => {
                    console.log("Selected:hellooooooooooooooooooooooooooooooooooooooooooooo............", newValue);
                    if (newValue) {
                      setValue(`products.${index}.skucode`, newValue.sku);
                      setValue(
                        `products.${index}.product`,
                        newValue.productName,
                      );
                      setValue(`products.${index}.rate`, newValue.rate);
                      setValue(`products.${index}.division`, newValue.division);
                      setValue(`products.${index}.unit`, newValue.unit);
                     
                    } else {
                      setValue(`products.${index}.skucode`, "");
                      setValue(`products.${index}.product`, "");
                      setValue(`products.${index}.rate`, "");
                      setValue(`products.${index}.rateadjustment`, 0);
                      setValue(`products.${index}.finalrate`, 0);
                      setValue(`products.${index}.division`, "");
                      setValue(`products.${index}.unit`, "Meter");
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="SKU Code"
                      error={!!errors.products?.[index]?.skucode}
                      helperText={
                        errors.products?.[index]?.skucode ? "SKU Required" : ""
                      }
                    />
                  )}
                />
              </Grid>

              {/* QTY */}

              <Grid size={{ xs: 12, md: 1.5 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="SO Qty"
                  error={!!errors.products?.[index]?.qty}
                  {...register(`products.${index}.qty`, {
                    required: true,
                    min: 1,
                  })}
                />
              </Grid>

              {/* RATE */}

              <Grid size={{ xs: 12, md: 1.5 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Rate"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                  {...register(`products.${index}.rate`, {
                    required: true,
                  })}
                />
              </Grid>
              {/* RATE Adjustment */}

              <Grid size={{ xs: 12, md: 1.5 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Adjustment(+/-)"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register(`products.${index}.rateadjustment`, {
                    valueAsNumber: true,
                  })}
                />
              </Grid>

              {/* final rate */}
              <Grid size={{ xs: 12, md: 1.5 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Final Rate"
                  value={(Number(rate) || 0) + (Number(adjustment) || 0)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                 
                />
              </Grid>

              {/* OPENING FG */}

              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Opening FG Qty"
                  disabled={watch("ordertype") === 'Internal'}
                  {...register(`products.${index}.openingFgQty`)}
                />
              </Grid>

              {/* PRODUCTION */}

              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  fullWidth
                  label="Production Qty"
                  value={Math.max(
                    (Number(watch(`products.${index}.qty`)) || 0) -
                      (Number(watch(`products.${index}.openingFgQty`)) || 0),

                    0,
                  )}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* UNIT */}

              <Grid size={{ xs: 12, md: 1.5 }}>
                <TextField
                  select
                  fullWidth
                  label="Unit"
                  {...register(`products.${index}.unit`)}
                >
                  <MenuItem value="Meter">Meter</MenuItem>

                  <MenuItem value="Roll">Roll</MenuItem>
                </TextField>
              </Grid>

              {/* DELETE */}

              <Grid
                size={{ xs: 12, md: 1 }}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  color="error"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
  );

})}


          <Grid size={12}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() =>
                append({
                  product: "",

                  skucode: "",
                  division: "",

                  qty: "",

                  rate: "",
                  rateadjustment:0,
                  finalrate: 0,

                  unit: "Meter",

                  openingFgQty: 0,

                  productionQty: 0,
                })
              }
            >
              Add Product
            </Button>
          </Grid>

          {/* RECEIVED BY */}

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Order Received By"
              value={user?.user?.name || ""}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>

        <Stack
          direction={{
            xs: "column",

            sm: "row",
          }}
          spacing={2}
          justifyContent="flex-end"
          mt={4}
        >
          <Button variant="outlined" onClick={() => reset()}>
            Reset
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              minWidth: 200,

              fontWeight: 600,
            }}
          >
            {loading ? "Saving..." : "Save Sales Order"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default SalesOrderForm;
