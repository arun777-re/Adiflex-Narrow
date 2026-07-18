import { useEffect } from "react";
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

const SalesOrderForm = () => {
  const dispatch = useDispatch();

  const { user, loading } = useSelector(
    (state) => state.auth
  );

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
      division: "",
      location: "",
      jobWork: false,

      products: [
        {
          product: "",
          qty: "",
          rate: "",
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

  useEffect(() => {
    products?.forEach((item, index) => {
      const productionQty =
        (Number(item.qty) || 0) -
        (Number(item.openingFgQty) || 0);

      setValue(
        `products.${index}.productionQty`,
        productionQty > 0 ? productionQty : 0
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
        openingFgQty: Number(item.openingFgQty) || 0,
        productionQty: Number(item.productionQty),
      })),
    };

    console.log(
      "Payload in SalesOrderForm component:",
      payload
    );

    const res = await dispatch(
      addSalesOrder(payload)
    );

    if (res?.payload?.success) {
      alert("Sales Order Created");

      reset({
        date: new Date()
          .toISOString()
          .slice(0, 10),

        customer: "",
        division: "",
        location: "",
        jobWork: false,

        products: [
          {
            product: "",
            qty: "",
            rate: "",
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
      <Typography
        variant="h5"
        fontWeight={700}
        mb={3}
      >
        Create Sales Order
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
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
              helperText={
                errors.date
                  ? "Date is required"
                  : ""
              }
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
              helperText={
                errors.customer
                  ? "Customer is required"
                  : ""
              }
              {...register("customer", {
                required: true,
              })}
            />
          </Grid>

          {/* DIVISION */}

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              label="Division"
              defaultValue=""
              error={!!errors.division}
              helperText={
                errors.division
                  ? "Division is required"
                  : ""
              }
              {...register("division", {
                required: true,
              })}
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

          {/* LOCATION */}

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Location"
              placeholder="Enter location"
              error={!!errors.location}
              helperText={
                errors.location
                  ? "Location is required"
                  : ""
              }
              {...register("location", {
                required: true,
              })}
            />
          </Grid>

          {/* JOB WORK */}

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Checkbox
                  {...register("jobWork")}
                />
              }
              label="Job Work Required"
            />
          </Grid>

          {/* PRODUCTS */}

          <Grid size={12}>
            <Typography
              variant="h6"
              fontWeight={600}
              mt={2}
              mb={1}
            >
              Products
            </Typography>
          </Grid>

          {fields.map((field, index) => (
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

              <Grid
                size={{ xs: 12, md: 3 }}
              >
                <TextField
                  fullWidth
                  label="Product"
                  error={
                    !!errors.products?.[index]
                      ?.product
                  }
                  helperText={
                    errors.products?.[index]
                      ?.product
                      ? "Product is required"
                      : ""
                  }
                  {...register(
                    `products.${index}.product`,
                    {
                      required: true,
                    }
                  )}
                />
              </Grid>

              {/* SO QTY */}

              <Grid
                size={{ xs: 12, md: 1.5 }}
              >
                <TextField
                  fullWidth
                  type="number"
                  label="SO Qty"
                  error={
                    !!errors.products?.[index]
                      ?.qty
                  }
                  helperText={
                    errors.products?.[index]
                      ?.qty
                      ? "Required"
                      : ""
                  }
                  {...register(
                    `products.${index}.qty`,
                    {
                      required: true,
                      min: 1,
                    }
                  )}
                />
              </Grid>

              {/* RATE */}

              <Grid
                size={{ xs: 12, md: 1.5 }}
              >
                <TextField
                  fullWidth
                  type="number"
                  label="Rate"
                  inputProps={{
                    step: "0.01",
                  }}
                  error={
                    !!errors.products?.[index]
                      ?.rate
                  }
                  helperText={
                    errors.products?.[index]
                      ?.rate
                      ? "Required"
                      : ""
                  }
                  {...register(
                    `products.${index}.rate`,
                    {
                      required: true,
                      min: 0,
                    }
                  )}
                />
              </Grid>

              {/* OPENING FG QTY - OPTIONAL */}

              <Grid
                size={{ xs: 12, md: 2 }}
              >
                <TextField
                  fullWidth
                  type="number"
                  label="Opening FG Qty"
                  {...register(
                    `products.${index}.openingFgQty`
                  )}
                />
              </Grid>

              {/* PRODUCTION QTY */}

              <Grid
                size={{ xs: 12, md: 2 }}
              >
                <TextField
                  fullWidth
                  label="Production Qty"
                  value={Math.max(
                    (Number(
                      watch(
                        `products.${index}.qty`
                      )
                    ) || 0) -
                      (Number(
                        watch(
                          `products.${index}.openingFgQty`
                        )
                      ) || 0),
                    0
                  )}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* UNIT */}

              <Grid
                size={{ xs: 12, md: 1.5 }}
              >
                <TextField
                  select
                  fullWidth
                  label="Unit"
                  defaultValue="Meter"
                  {...register(
                    `products.${index}.unit`,
                    {
                      required: true,
                    }
                  )}
                >
                  <MenuItem value="Meter">
                    Meter
                  </MenuItem>

                  <MenuItem value="Roll">
                    Roll
                  </MenuItem>
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
                  disabled={
                    fields.length === 1
                  }
                  onClick={() =>
                    remove(index)
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          {/* ADD PRODUCT */}

          <Grid size={12}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() =>
                append({
                  product: "",
                  qty: "",
                  rate: "",
                  unit: "Meter",
                  openingFgQty: 0,
                  productionQty: 0,
                })
              }
            >
              Add Product
            </Button>
          </Grid>

          {/* ORDER RECEIVED BY */}

          <Grid
            size={{ xs: 12, md: 6 }}
          >
            <TextField
              fullWidth
              label="Order Received By"
              value={
                user?.user?.name || ""
              }
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>

        {/* BUTTONS */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          justifyContent="flex-end"
          mt={4}
        >
          <Button
            variant="outlined"
            onClick={() =>
              reset({
                date: new Date()
                  .toISOString()
                  .slice(0, 10),

                customer: "",
                division: "",
                location: "",
                jobWork: false,

                products: [
                  {
                    product: "",
                    qty: "",
                    rate: "",
                    unit: "Meter",
                    openingFgQty: 0,
                    productionQty: 0,
                  },
                ],
              })
            }
          >
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
            {loading
              ? "Saving..."
              : "Save Sales Order"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default SalesOrderForm;