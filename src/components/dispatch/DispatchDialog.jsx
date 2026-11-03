
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  Divider,
  Grid,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  confirmDispatchSlice,
  getAllDispatch,
} from "../../redux/slices/dispatchSlice";

import DeliveryChallanPreview from "./DeliveryChallanPreview";

const DispatchDialog = ({ open, onClose, selectedOrders = [] }) => {
  const dispatch = useDispatch();

  const [challan, setChallan] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const { dispatching, error } = useSelector(
    (state) => state.dispatch
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: [],
      vehicleNo: "",
      driverName: "",
      gstNo: "",
      gstRate: 0,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (open && !challan) {
      reset({
        items: selectedOrders.map((order) => ({
          reservationId: order.reservation_id,
          dispatchQty: "",
        })),
        vehicleNo: "",
        driverName: "",
        gstNo: selectedOrders[0]?.gst_no || "",
        gstRate: 0,
      });

      setSubmitError("");
    }
  }, [open, selectedOrders, reset, challan]);

  const totalPendingQty = selectedOrders.reduce(
    (total, order) =>
      total + (Number(order.pending_dispatch_qty) || 0),
    0
  );

  const handleClose = () => {
    if (dispatching) return;

    setChallan(null);
    setSubmitError("");
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    setSubmitError("");

    if (!selectedOrders.length) {
      setSubmitError("Please select at least one reservation.");
      return;
    }

    const items = data.items.map((item, index) => ({
      reservationId: Number(item.reservationId),
      dispatchQty: Number(item.dispatchQty),
      maxQty: Number(selectedOrders[index]?.pending_dispatch_qty) || 0,
    }));

    for (let index = 0; index < items.length; index++) {
      const item = items[index];

      if (
        !Number.isFinite(item.dispatchQty) ||
        item.dispatchQty <= 0
      ) {
        setError(`items.${index}.dispatchQty`, {
          message: "Enter a quantity greater than zero.",
        });
        return;
      }

      if (item.dispatchQty > item.maxQty) {
        setError(`items.${index}.dispatchQty`, {
          message: `Maximum dispatch quantity is ${item.maxQty} meters.`,
        });
        return;
      }
    }

    const vehicleNo = data.vehicleNo.trim();
    const driverName = data.driverName.trim();
    const gstNo = data.gstNo.trim();
    const gstRate = Number(data.gstRate);

    if (!vehicleNo || !driverName) {
      setSubmitError("Vehicle number and driver name are required.");
      return;
    }

    if (
      !Number.isFinite(gstRate) ||
      gstRate < 0 ||
      gstRate > 100
    ) {
      setSubmitError("GST rate must be between 0 and 100.");
      return;
    }

    const payload = {
      items: items.map(({ reservationId, dispatchQty }) => ({
        reservationId,
        dispatchQty,
      })),
      vehicleNo,
      driverName,
      gstNo: gstNo || null,
      gstRate,
    };

    try {
      const result = await dispatch(
        confirmDispatchSlice(payload)
      ).unwrap();

      const challanDetails = result?.data ?? result;

      if (!challanDetails?.challanNo) {
        throw new Error(
          "Dispatch succeeded, but challan number was not returned."
        );
      }

      setChallan({
        ...challanDetails,
        customer:
          challanDetails.customer ||
          selectedOrders[0]?.customer,
        billingLocation:
          challanDetails.billingLocation ||
          selectedOrders[0]?.billing_location,
        shippingLocation:
          challanDetails.shippingLocation ||
          selectedOrders[0]?.shipping_location,
        route:
          challanDetails.route ||
          selectedOrders[0]?.route,
        items:
          challanDetails.items ||
          payload.items.map((item) => {
            const order = selectedOrders.find(
              (row) =>
                Number(row.reservation_id) === item.reservationId
            );

            return {
              ...item,
              so_no: order?.so_no,
              sku_code: order?.sku_code,
              product_name: order?.product_name,
            };
          }),
      });

      dispatch(getAllDispatch());
    } catch (err) {
      console.error("Confirm dispatch error:", err);

      setSubmitError(
        typeof err === "string"
          ? err
          : err?.message || "Dispatch failed. Please try again."
      );
    }
  };

  if (!open) return null;

  if (challan) {
    return (
      <DeliveryChallanPreview
        challan={challan}
        onClose={handleClose}
      />
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Confirm Dispatch & Create Delivery Challan
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {(submitError || error) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError || error}
            </Alert>
          )}

          <Box
            sx={{
              mb: 2,
              p: 2,
              bgcolor: "action.hover",
              borderRadius: 2,
            }}
          >
            <Typography>
              <strong>Customer:</strong>{" "}
              {selectedOrders[0]?.customer || "-"}
            </Typography>

            <Typography>
              <strong>Route:</strong>{" "}
              {selectedOrders[0]?.route || "-"}
            </Typography>

            <Typography>
              <strong>Billing Location:</strong>{" "}
              {selectedOrders[0]?.billing_location || "-"}
            </Typography>

            <Typography>
              <strong>Shipping Location:</strong>{" "}
              {selectedOrders[0]?.shipping_location || "-"}
            </Typography>

            <Typography>
              <strong>Selected Reservations:</strong>{" "}
              {selectedOrders.length}
            </Typography>

            <Typography>
              <strong>Total Pending:</strong>{" "}
              {totalPendingQty.toLocaleString()} m
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ mb: 1 }}>
            Dispatch Items
          </Typography>

          {fields.map((field, index) => {
            const order = selectedOrders[index];
            const pendingQty =
              Number(order?.pending_dispatch_qty) || 0;

            return (
              <Box
                key={field.id}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                }}
              >
                <Typography fontWeight="bold">
                  {order?.product_name || "-"}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  SO: {order?.so_no || "-"} | SKU:{" "}
                  {order?.sku_code || "-"}
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  Pending: {pendingQty.toLocaleString()} m
                </Typography>

                <input
                  type="hidden"
                  {...register(`items.${index}.reservationId`)}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Dispatch Quantity (meters)"
                  margin="dense"
                  inputProps={{
                    min: 0.01,
                    max: pendingQty,
                    step: "0.01",
                  }}
                  error={!!errors.items?.[index]?.dispatchQty}
                  helperText={
                    errors.items?.[index]?.dispatchQty?.message
                  }
                  {...register(`items.${index}.dispatchQty`, {
                    required: "Dispatch quantity is required.",
                    valueAsNumber: true,
                    min: {
                      value: 0.01,
                      message: "Quantity must be greater than zero.",
                    },
                    max: {
                      value: pendingQty,
                      message: `Maximum quantity is ${pendingQty} meters.`,
                    },
                  })}
                />
              </Box>
            );
          })}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ mb: 1 }}>
            Vehicle & GST Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vehicle Number"
                {...register("vehicleNo", {
                  required: "Vehicle number is required.",
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "Vehicle number is required.",
                })}
                error={!!errors.vehicleNo}
                helperText={errors.vehicleNo?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Driver Name"
                {...register("driverName", {
                  required: "Driver name is required.",
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "Driver name is required.",
                })}
                error={!!errors.driverName}
                helperText={errors.driverName?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="GST Number (Optional)"
                {...register("gstNo")}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="GST Rate (%)"
                inputProps={{
                  min: 0,
                  max: 100,
                  step: "0.01",
                }}
                {...register("gstRate", {
                  required: "GST rate is required.",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "GST rate cannot be negative.",
                  },
                  max: {
                    value: 100,
                    message: "GST rate cannot exceed 100%.",
                  },
                })}
                error={!!errors.gstRate}
                helperText={errors.gstRate?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClose}
            disabled={dispatching}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={dispatching || !selectedOrders.length}
          >
            {dispatching
              ? "Creating Challan..."
              : `Confirm & Create Challan (${selectedOrders.length} Items)`}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DispatchDialog;
