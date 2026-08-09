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
    const result = await dispatch(
      dispatchOrder({
        soNo: order.soNo,
        cycleID: order.cycleID,
        product: order.product,

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
