import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";

import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";

import {
  dispatchOrder,
  getAllDispatch,
} from "../../redux/slices/dispatchSlice";

const DispatchDialog = ({
  open,

  onClose,

  order,
}) => {
  const dispatch = useDispatch();

  const { dispatching } = useSelector((state) => state.dispatch);

  const {
    register,

    handleSubmit,

    reset,

    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const freight =
      String(order.freight).trim().toLowerCase() === "true" ||
      order.freight === true;

    const result = await dispatch(
      dispatchOrder({
        soNo: order.soNo,
        cycleID: order.cycleID,
        product: order.product,

        freight,

        freightRs: freight ? Number(data.freightRs) : 0,

        dispatchQty: Number(data.dispatchQty),
      }),
    );

    if (dispatchOrder.fulfilled.match(result)) {
      await dispatch(getAllDispatch());

      reset();
      onClose();
    }
  };

  if (!order) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={dispatching ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Dispatch Order</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box
            sx={{
              mb: 2,

              p: 2,

              bgcolor: "action.hover",

              borderRadius: 2,
            }}
          >
            <Typography>
              <strong>SO No:</strong> {order.soNo}
            </Typography>

            <Typography>
              <strong>Product:</strong> {order.product}
            </Typography>

            <Typography>
              <strong>Available Qty:</strong>{" "}
              {Number(order.availableQty).toLocaleString()}
            </Typography>
            <Typography>
              <strong>Freight:</strong>{" "}
              {String(order.freight).trim().toLowerCase() === "true" ||
              order.freight === true
                ? "Yes"
                : "No"}
            </Typography>
          </Box>

          <TextField
            fullWidth
            type="number"
            label="Dispatch Qty"
            inputProps={{
              min: 1,

              max: order.availableQty,
            }}
            error={!!errors.dispatchQty}
            helperText={errors.dispatchQty?.message}
            {...register(
              "dispatchQty",

              {
                required: "Dispatch Qty is required",

                valueAsNumber: true,

                min: {
                  value: 1,

                  message: "Dispatch Qty must be greater than 0",
                },

                max: {
                  value: Number(order.availableQty),

                  message: "Dispatch Qty cannot exceed Available Qty",
                },
              },
            )}
          />
          {(String(order.freight).trim().toLowerCase() === "true" ||
            order.freight === true) && (
            <TextField
              fullWidth
              type="number"
              label="Freight Rs"
              margin="normal"
              inputProps={{
                min: 1,
                step: "0.01",
              }}
              error={!!errors.freightRs}
              helperText={errors.freightRs?.message}
              {...register("freightRs", {
                required: "Freight Rs is required when Freight is Yes",

                valueAsNumber: true,

                min: {
                  value: 0.01,
                  message: "Freight Rs must be greater than 0",
                },

                validate: (value) => {
                  if (
                    value === undefined ||
                    value === null ||
                    Number.isNaN(Number(value))
                  ) {
                    return "Please enter valid Freight Rs";
                  }

                  return true;
                },
              })}
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={dispatching}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={dispatching}>
            {dispatching ? "Dispatching..." : "Confirm Dispatch"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DispatchDialog;
