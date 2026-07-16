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

  const { user, loading } = useSelector((state) => state.auth);

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
    console.log(products);

    products?.forEach((item, index) => {
      const productionQty =
        (Number(item.qty) || 0) - (Number(item.openingFgQty) || 0);

      console.log(index, productionQty);

      setValue(
        `products.${index}.productionQty`,
        productionQty > 0 ? productionQty : 0,
      );
    });
  }, [products]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      orderReceivedBy: user?.user?.name,

      products: data.products.map((item) => ({
        ...item,
        qty: Number(item.qty),
        rate: Number(item.rate),
        openingFgQty: Number(item.openingFgQty),
        productionQty: Number(item.productionQty),
      })),
    };
console.log("Payload in SalesOrderForm component:", payload);
    const res = await dispatch(addSalesOrder(payload));

    if (res?.payload?.success) {
      alert("Sales Order Created");

      reset({
        date: new Date().toISOString().slice(0, 10),
        customer: "",
        division: "",
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
      <Typography variant="h5" fontWeight={700} mb={3}>
        Create Sales Order
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Date */}

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              InputLabelProps={{
                shrink: true,
              }}
              {...register("date", {
                required: true,
              })}
            />
          </Grid>

          {/* Customer */}

          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              label="Customer"
              {...register("customer", {
                required: true,
              })}
            />
          </Grid>

          {/* Division */}

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              defaultValue=""
              label="Division"
              {...register("division", {
                required: true,
              })}
            >
              <MenuItem value="Woven">Woven</MenuItem>

              <MenuItem value="Crochet">Crochet</MenuItem>
            </TextField>
          </Grid>

          <Grid size={12}>
            <Typography variant="h6" fontWeight={600} mt={2} mb={1}>
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
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Product"
                  {...register(`products.${index}.product`, {
                    required: true,
                  })}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 1.5 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="SO Qty"
                  {...register(`products.${index}.qty`)}
                  sx={{
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                    "& input[type=number]::-webkit-outer-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                    "& input[type=number]::-webkit-inner-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 1.5 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Rate"
                  inputProps={{ step: "0.01" }}
                  {...register(`products.${index}.rate`)}
                  sx={{
                     "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                    "& input[type=number]::-webkit-outer-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                    "& input[type=number]::-webkit-inner-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Opening FG Qty"
                  {...register(`products.${index}.openingFgQty`)}
                  sx={{
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                    "& input[type=number]::-webkit-outer-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                    "& input[type=number]::-webkit-inner-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  }}
                />
              </Grid>

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
                  sx={{
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                    "& input[type=number]::-webkit-outer-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                    "& input[type=number]::-webkit-inner-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 1.5 }}>
                <TextField
                  select
                  fullWidth
                  defaultValue="Meter"
                  {...register(`products.${index}.unit`)}
                >
                  <MenuItem value="Meter">Meter</MenuItem>

                  <MenuItem value="Roll">Roll</MenuItem>
                </TextField>
              </Grid>

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
          ))}
          {/* Add Product Button */}

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

          {/* Job Work */}

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={<Checkbox {...register("jobWork")} />}
              label="Job Work Required"
            />
          </Grid>

          {/* Order Received By */}

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

        {/* Buttons */}

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
          <Button
            variant="outlined"
            onClick={() =>
              reset({
                date: new Date().toISOString().slice(0, 10),

                customer: "",
                division: "",
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
            {loading ? "Saving..." : "Save Sales Order"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default SalesOrderForm;
