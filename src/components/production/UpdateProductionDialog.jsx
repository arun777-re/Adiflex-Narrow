import { useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  Box,
} from "@mui/material";

import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";

import {
  startProduction,
  completeProduction,
  completeQuality,
  getAllProductions,
} from "../../redux/slices/productionSlice";

const UpdateProductionDialog = ({ open, onClose, order, process, action }) => {
  const dispatch = useDispatch();

  // production state store in redux

  const {
    starting = false,
    completing = false,
    completingQuality = false,
  } = useSelector((state) => state.production);

  // logged in user information
  const { user } = useSelector((state) => state.auth);

  // current division
  const currentDivision = user?.user?.division || user?.division || "";

  // form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      soNo: "",
      product: "",
      productionQty: "",
      cycleID: "",
      wastageQty: "",
    },
  });

  // loading

  const loading = starting || completing || completingQuality;

  // process type
  const isFirstProcess = process === "jobWork" || process === "warping";

  const isQualityProcess = process === "quality";

  // load order data

  useEffect(() => {
    if (!order) {
      return;
    }

    reset({
      soNo: order.soNo || "",

      product: order.product || "",

      productionQty: isFirstProcess ? order.productionQty || "" : "",
      cycleID: order.cycleID || "",

      wastageQty: "",
    });
  }, [order, reset, isFirstProcess]);

  // refresh production data for a division
  const refreshProductionData = async () => {
    await dispatch(getAllProductions(currentDivision));
  };

  // onsubmit function
  const onSubmit = async (data) => {
   

    const updatedBy = user?.name || user?.user?.name || "";
    // ========================================
    // START PROCESS
    // ========================================

    if (action === "start") {
      const result = await dispatch(
        startProduction({
          soNo: data.soNo,
          cycleID:data.cycleID,

          product: data.product,

          process,

          division: currentDivision,

          updatedBy,
        }),
      );

      if (startProduction.fulfilled.match(result)) {
        await refreshProductionData();

        onClose();
      }

      return;
    }

    // ========================================
    // ONLY COMPLETE ACTION
    // ========================================

    if (action !== "complete") {
      return;
    }

    // ========================================
    // QUALITY PROCESS
    // COMPLETE + WASTAGE
    // ========================================

    if (isQualityProcess) {
      const result = await dispatch(
        completeQuality({
          soNo: data.soNo,

          product: data.product,
          cycleID:data.cycleID,
          process,

          division: currentDivision,

          wastageQty: Number(data.wastageQty),

          updatedBy,
        }),
      );

      if (completeQuality.fulfilled.match(result)) {
        await refreshProductionData();

        onClose();
      }

      return;
    }

    // ========================================
    // NORMAL PROCESS
    // ========================================

    const payload = {
      soNo: data.soNo,
      cycleID: data.cycleID,
      product: data.product,

      process,

      division: currentDivision,

      updatedBy,
    };

    // ========================================
    // FIRST PROCESS QTY
    // ========================================

    if (isFirstProcess) {
      payload.productionQty = Number(data.productionQty);
    }

    const result = await dispatch(completeProduction(payload));

    if (completeProduction.fulfilled.match(result)) {
      await refreshProductionData();

      onClose();
    }
  };

  // dialogue title bhai
  let title = "Complete Process";

  if (action === "start") {
    title = "Start Process";
  }

  if (action === "complete") {
    title = "Complete Process";
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{title}</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            {/* SO NO */}

            <Grid size={12}>
              <TextField
                fullWidth
                label="SO No"
                InputProps={{
                  readOnly: true,
                }}
                {...register("soNo")}
              />
            </Grid>

            {/* PRODUCT */}

            <Grid size={12}>
              <TextField
                fullWidth
                label="Product"
                InputProps={{
                  readOnly: true,
                }}
                {...register("product")}
              />
            </Grid>

            {/* START PROCESS */}

            {action === "start" && (
              <Grid size={12}>
                <Box
                  sx={{
                    p: 2,

                    bgcolor: "info.lighter",

                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2">
                    Click below to start the <strong>{process}</strong> process.
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    The process start time will be recorded automatically.
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* PRODUCTION QTY */}

            {action === "complete" && isFirstProcess && (
              <Grid size={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Production Qty"
                  inputProps={{
                    min: 1,
                  }}
                  error={!!errors.productionQty}
                  helperText={errors.productionQty?.message}
                  {...register(
                    "productionQty",

                    {
                      required: "Production Qty is required",

                      min: {
                        value: 1,

                        message: "Quantity must be greater than 0",
                      },
                    },
                  )}
                />

                <Typography variant="caption" color="text.secondary">
                  Production quantity is entered only in the first process.
                </Typography>
              </Grid>
            )}

            {/* OTHER PROCESSES */}

            {action === "complete" && !isFirstProcess && !isQualityProcess && (
              <Grid size={12}>
                <Box
                  sx={{
                    p: 2,

                    bgcolor: "action.hover",

                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Production Qty:{" "}
                    <strong>
                      {Number(order?.productionQty || 0).toLocaleString()}
                    </strong>
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    This process does not require a production quantity.
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* QUALITY INFO */}

            {action === "complete" && isQualityProcess && (
              <Grid size={12}>
                <Box
                  sx={{
                    p: 2,

                    bgcolor: "warning.lighter",

                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2">
                    Production Qty:{" "}
                    <strong>
                      {Number(order?.productionQty || 0).toLocaleString()}
                    </strong>
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Quality complete hone ke saath wastage save hoga aur Nett
                    Qty RTD automatically calculate hogi.
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* WASTAGE QTY */}

            {action === "complete" && isQualityProcess && (
              <Grid size={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Wastage Qty"
                  inputProps={{
                    min: 0,

                    step: "any",
                  }}
                  error={!!errors.wastageQty}
                  helperText={errors.wastageQty?.message}
                  {...register(
                    "wastageQty",

                    {
                      required: "Wastage Qty is required",

                      min: {
                        value: 0,

                        message: "Wastage cannot be negative",
                      },

                      validate: (value) => {
                        const wastage = Number(value);

                        const productionQty = Number(order?.productionQty || 0);

                        return (
                          wastage <= productionQty ||
                          "Wastage cannot be greater than Production Qty"
                        );
                      },
                    },
                  )}
                />

                <Typography variant="caption" color="text.secondary">
                  Nett Qty RTD = Production Qty - Wastage Qty
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Processing..." : "Submit"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateProductionDialog;
