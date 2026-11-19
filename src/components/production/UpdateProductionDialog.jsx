
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

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
import toast from "react-hot-toast";

import {
  startProduction,
  completeProduction,
  getAllProductions,
  getAllQualityProductions,
  getAllPackingProductions,
} from "../../redux/slices/productionSlice";

const PROCESS_LABELS = {
  JOB_WORK: "Job Work",
  WARPING: "Warping",
  FILLING: "Filling",
  MACHINE: "Machine",
  FINISHING: "Finishing",
  QUALITY: "Quality",
  ROLLING: "Rolling",
  PACKING: "Packing",
};

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const formatQty = (value) =>
  toNumber(value).toLocaleString("en-IN");

const UpdateProductionDialog = ({
  open,
  onClose,
  order,
  process,
  action,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    starting = false,
    completing = false,
    completingQuality = false,
  } = useSelector((state) => state.production || {});

  const authUser = useSelector((state) => state.auth?.user);
  const user = authUser?.user || authUser || {};

  const currentDivision = order?.division || user?.division || "";
  const updatedBy = user?.userName || user?.name || "";

  const stages = useMemo(
    () => (Array.isArray(order?.stages) ? order.stages : []),
    [order?.stages],
  );

  const hasJobWorkStage = stages.some(
    (stage) => normalize(stage.stage_code) === "JOB_WORK",
  );

  const firstStageCode = hasJobWorkStage ? "JOB_WORK" : "WARPING";

  const normalizedProcess = normalize(
    typeof process === "string"
      ? process
      : process?.key ||
          process?.stage?.stage_code ||
          process?.stage_code ||
          process?.process ||
          process?.process_code,
  );

  const normalizedAction = normalize(action);

  const effectiveAction =
    normalizedAction === "START"
      ? "start"
      : ["COMPLETE", "COMPLETED", "UPDATE"].includes(normalizedAction)
        ? "complete"
        : normalizedAction.toLowerCase();

  const currentStage =
    process && typeof process === "object" && process.stage
      ? process.stage
      : stages.find(
          (stage) => normalize(stage.stage_code) === normalizedProcess,
        );

  const isFirstProcess = normalizedProcess === firstStageCode;
  const isQualityProcess = normalizedProcess === "QUALITY";
  const isMachineProcess = normalizedProcess === "MACHINE";
  const isPackingProcess = normalizedProcess === "PACKING";

  const needsReleaseQty = isMachineProcess || isQualityProcess;
  const loading = starting || completing || completingQuality;

  // =====================================================
  // PRODUCTION QUANTITY DETAILS
  // =====================================================

  const soTargetQty = toNumber(order?.production_target_qty);

  const allocatedCycleQty = toNumber(
    order?.actual_cycle_production_qty,
  );

  const firstTimeQty = toNumber(order?.first_time_production_qty);

  const cycleRemainingQty = toNumber(
    order?.cycle_remaining_production_qty,
  );

  const packedQty = toNumber(order?.total_production_qty);

  // Cycle already allocated?
  const cycleAlreadyAllocated = allocatedCycleQty > 0;

  // Fresh order means:
  // 1. No quantity allocated to this cycle.
  // 2. No production packed yet.
  //
  // Only for a fresh order, fallback to SO production target
  // when first_time_production_qty is missing or zero.
  const isFreshUnallocatedCycle =
    allocatedCycleQty <= 0 && packedQty <= 0;

  const availableQty = Math.max(
    0,
    firstTimeQty > 0
      ? firstTimeQty
      : isFreshUnallocatedCycle
        ? soTargetQty
        : 0,
  );

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
      releaseQty: "",
      actualQtyAtPacking: "",
    },
  });

  useEffect(() => {
    if (!order || !open) return;

    reset({
      soNo: order.so_no || "",
      product: order.product_name || "",
      cycleID: order.cycle_id || "",
      productionQty: "",
      wastageQty: "",
      releaseQty: "",
      actualQtyAtPacking: "",
    });
  }, [order, reset, open]);

  const refreshProductionData = async () => {
    try {
      if (currentDivision) {
        await dispatch(getAllProductions(currentDivision)).unwrap();
      }

      if (location.pathname === "/quality-production") {
        await dispatch(
          getAllQualityProductions(
            String(currentDivision || "all").toLowerCase(),
          ),
        ).unwrap();
      }

      if (location.pathname === "/packing-production") {
        await dispatch(
          getAllPackingProductions(
            String(currentDivision || "all").toLowerCase(),
          ),
        ).unwrap();
      }
    } catch (error) {
      console.error("Production refresh failed:", error);
    }
  };

  const onInvalid = (formErrors) => {
    console.error("FORM VALIDATION ERRORS:", formErrors);

    const firstError = Object.values(formErrors)[0];

    toast.error(
      firstError?.message || "Please check the required fields.",
    );
  };

  const onSubmit = async (data) => {
    if (!order) {
      toast.error("Production order is missing.");
      return;
    }

    const cycleID = order.cycle_id || data.cycleID;
    const soNo = order.so_no || data.soNo;
    const product = order.product_name || data.product;
    const productionId = order.production_id ?? order.id;

    if (!productionId || !cycleID || !soNo || !normalizedProcess) {
      toast.error("Missing production cycle or process details.");
      return;
    }

    try {
      // =====================================================
      // START PROCESS
      // =====================================================

      if (effectiveAction === "start") {
        const payload = {
          soNo,
          cycleID,
          product,
          process: normalizedProcess,
          division: currentDivision,
          updatedBy,
          productionId,
        };

        if (isFirstProcess) {
          const selectedQty = Number(data.productionQty);

          if (!Number.isFinite(selectedQty) || selectedQty <= 0) {
            toast.error("Input quantity must be greater than zero.");
            return;
          }

          if (cycleAlreadyAllocated) {
            toast.error(
              `This cycle is already allocated ${formatQty(allocatedCycleQty)}m. Its quantity is locked.`,
            );
            return;
          }

          if (availableQty <= 0) {
            toast.error(
              "No remaining quantity is available for a new production cycle.",
            );
            return;
          }

          if (selectedQty > availableQty) {
            toast.error(
              `Selected quantity cannot exceed the available quantity of ${formatQty(availableQty)}m.`,
            );
            return;
          }

          payload.productionQty = selectedQty;
        }

        await dispatch(startProduction(payload)).unwrap();

        toast.success(
          `${PROCESS_LABELS[normalizedProcess] || normalizedProcess} started successfully.`,
        );

        await refreshProductionData();
        onClose();
        return;
      }

      if (effectiveAction !== "complete") {
        toast.error(`Invalid production action: ${action}`);
        return;
      }

      // =====================================================
      // STAGE QUANTITY
      // =====================================================

      const stageInputQty = toNumber(currentStage?.input_qty);
      const alreadyReleased = toNumber(currentStage?.released_qty);

      let releaseQty;

      if (needsReleaseQty) {
        releaseQty = Number(data.releaseQty);

        if (!Number.isFinite(releaseQty) || releaseQty <= 0) {
          toast.error("Release quantity must be greater than zero.");
          return;
        }

        if (
          stageInputQty <= 0 ||
          alreadyReleased + releaseQty > stageInputQty + 0.001
        ) {
          toast.error(
            "Total released quantity cannot exceed the stage input quantity.",
          );
          return;
        }
      }

      // =====================================================
      // QUALITY VALIDATION
      // =====================================================

      if (isQualityProcess) {
        const wastageQty = Number(data.wastageQty);

        if (!Number.isFinite(wastageQty) || wastageQty < 0) {
          toast.error("Wastage quantity cannot be negative.");
          return;
        }

        const remainingQty = Math.max(
          0,
          stageInputQty - alreadyReleased,
        );

        if (wastageQty > remainingQty + 0.001) {
          toast.error(
            `Wastage quantity cannot exceed remaining quantity (${formatQty(remainingQty)} m).`,
          );
          return;
        }

        if (
          !Number.isFinite(releaseQty) ||
          releaseQty <= 0 ||
          releaseQty > stageInputQty + 0.001
        ) {
          toast.error(
            "Release quantity cannot exceed the Quality input quantity.",
          );
          return;
        }
      }

      // =====================================================
      // COMPLETION PAYLOAD
      // =====================================================

      const payload = {
        soNo,
        cycleID,
        product,
        process: normalizedProcess,
        division: currentDivision,
        updatedBy,
      };

      if (needsReleaseQty) {
        payload.releaseQty = releaseQty;
      }

      if (isQualityProcess) {
        payload.wastageQty = Number(data.wastageQty);
      }

      if (isPackingProcess) {
        const actualQtyAtPacking = Number(data.actualQtyAtPacking);

        if (
          !Number.isFinite(actualQtyAtPacking) ||
          actualQtyAtPacking < 0
        ) {
          toast.error("Enter a valid actual packed quantity.");
          return;
        }

        if (
          cycleRemainingQty > 0 &&
          actualQtyAtPacking > cycleRemainingQty + 0.001
        ) {
          toast.error(
            `Actual packed quantity cannot exceed the remaining cycle quantity of ${formatQty(cycleRemainingQty)}m.`,
          );
          return;
        }

        payload.actualQtyAtPacking = actualQtyAtPacking;
      }

      await dispatch(completeProduction(payload)).unwrap();

      toast.success(
        `${PROCESS_LABELS[normalizedProcess] || normalizedProcess} updated successfully.`,
      );

      await refreshProductionData();
      onClose();
    } catch (error) {
      console.error("Production API/dispatch failed:", error);

      const message =
        typeof error === "string"
          ? error
          : error?.message ||
            error?.data?.message ||
            "Production update failed.";

      toast.error(message);
    }
  };

  const processLabel =
    PROCESS_LABELS[normalizedProcess] || normalizedProcess || "Process";

  const title =
    effectiveAction === "start"
      ? `Start ${processLabel}`
      : `Complete ${processLabel}`;

  const inputQty = toNumber(currentStage?.input_qty);
  const releasedQty = toNumber(currentStage?.released_qty);

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{title}</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="SO No"
                InputProps={{ readOnly: true }}
                {...register("soNo")}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Cycle ID"
                InputProps={{ readOnly: true }}
                {...register("cycleID")}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Product"
                InputProps={{ readOnly: true }}
                {...register("product")}
              />
            </Grid>

            {/* PRODUCTION SUMMARY */}

            <Grid size={12}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2">
                  Sales Order Target:{" "}
                  <strong>{formatQty(soTargetQty)} m</strong>
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  Cycle Allocated:{" "}
                  <strong>{formatQty(allocatedCycleQty)} m</strong>
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  Actual Packed:{" "}
                  <strong>{formatQty(packedQty)} m</strong>
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  Cycle Remaining:{" "}
                  <strong>{formatQty(cycleRemainingQty)} m</strong>
                </Typography>

                {currentStage && (
                  <>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Stage: <strong>{processLabel}</strong>
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Stage Status:{" "}
                      <strong>{currentStage.status || "PENDING"}</strong>
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Stage Input:{" "}
                      <strong>{formatQty(inputQty)} m</strong>
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Previously Released:{" "}
                      <strong>{formatQty(releasedQty)} m</strong>
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>

            {/* AVAILABLE QUANTITY FOR NEW CYCLE */}

            {effectiveAction === "start" && isFirstProcess && (
              <Grid size={12}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    textAlign: "center",
                    bgcolor:
                      availableQty > 0
                        ? "success.light"
                        : "error.light",
                    border: "2px solid",
                    borderColor:
                      availableQty > 0
                        ? "success.main"
                        : "error.main",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={900}
                    color={
                      availableQty > 0
                        ? "success.dark"
                        : "error.dark"
                    }
                  >
                    YOU CAN START PRODUCTION FOR
                  </Typography>

                  <Typography
                    variant="h3"
                    fontWeight={900}
                    color={
                      availableQty > 0
                        ? "success.dark"
                        : "error.dark"
                    }
                    sx={{ my: 1 }}
                  >
                    {formatQty(availableQty)} METER
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={800}
                    color={
                      availableQty > 0
                        ? "success.dark"
                        : "error.dark"
                    }
                  >
                    AVAILABLE QUANTITY FOR NEW CYCLE
                  </Typography>

                  {availableQty <= 0 && (
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color="error.dark"
                      sx={{ mt: 1 }}
                    >
                      No remaining quantity available for a new cycle.
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}

            {/* FIRST PROCESS ALLOCATION INPUT */}

            {effectiveAction === "start" && isFirstProcess && (
              <Grid size={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Cycle Allocation Quantity (Meter)"
                  disabled={
                    cycleAlreadyAllocated || availableQty <= 0
                  }
                  inputProps={{
                    min: 0.01,
                    max: availableQty,
                    step: "any",
                  }}
                  error={!!errors.productionQty}
                  helperText={
                    errors.productionQty?.message ||
                    (cycleAlreadyAllocated
                      ? `This cycle is already allocated ${formatQty(allocatedCycleQty)}m. Quantity is locked.`
                      : `Minimum: Greater than 0 | Maximum: ${formatQty(availableQty)} m`)
                  }
                  {...register("productionQty", {
                    required: "Cycle allocation quantity is required",
                    valueAsNumber: true,
                    validate: (value) => {
                      if (!Number.isFinite(value) || value <= 0) {
                        return "Quantity must be greater than zero.";
                      }

                      if (value > availableQty) {
                        return `Maximum available quantity is ${formatQty(availableQty)}m.`;
                      }

                      return true;
                    },
                  })}
                />
              </Grid>
            )}

            {/* OTHER PROCESS START */}

            {effectiveAction === "start" && !isFirstProcess && (
              <Grid size={12}>
                <Typography variant="body2" color="text.secondary">
                  This stage uses the quantity already allocated to this
                  cycle. No new cycle quantity will be allocated here.
                </Typography>
              </Grid>
            )}

            {/* RELEASE QUANTITY */}

            {effectiveAction === "complete" && needsReleaseQty && (
              <Grid size={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Release Quantity (Meter)"
                  inputProps={{
                    min: 0.01,
                    step: "any",
                  }}
                  error={!!errors.releaseQty}
                  helperText={
                    errors.releaseQty?.message ||
                    "Enter the quantity to release to the next stage."
                  }
                  {...register("releaseQty", {
                    required: "Release quantity is required",
                    valueAsNumber: true,
                    validate: (value) =>
                      Number.isFinite(value) && value > 0
                        ? true
                        : "Release quantity must be greater than zero.",
                  })}
                />
              </Grid>
            )}

            {/* QUALITY WASTAGE */}

            {effectiveAction === "complete" && isQualityProcess && (
              <Grid size={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="New Wastage Quantity (Meter)"
                  inputProps={{
                    min: 0,
                    step: "any",
                  }}
                  error={!!errors.wastageQty}
                  helperText={
                    errors.wastageQty?.message ||
                    "Enter only the additional wastage for this update."
                  }
                  {...register("wastageQty", {
                    required: "Wastage quantity is required",
                    valueAsNumber: true,
                    validate: (value) =>
                      Number.isFinite(value) && value >= 0
                        ? true
                        : "Wastage cannot be negative.",
                  })}
                />
              </Grid>
            )}

            {/* PACKING QUANTITY */}

            {effectiveAction === "complete" && isPackingProcess && (
              <Grid size={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Actual Packed Quantity (Meter)"
                  inputProps={{
                    min: 0,
                    step: "any",
                  }}
                  error={!!errors.actualQtyAtPacking}
                  helperText={
                    errors.actualQtyAtPacking?.message ||
                    "Enter the actual quantity packed for this cycle."
                  }
                  {...register("actualQtyAtPacking", {
                    required: "Actual packed quantity is required",
                    valueAsNumber: true,
                    validate: (value) => {
                      if (!Number.isFinite(value) || value < 0) {
                        return "Actual packed quantity cannot be negative.";
                      }

                      if (
                        cycleRemainingQty > 0 &&
                        value > cycleRemainingQty + 0.001
                      ) {
                        return `Maximum remaining cycle quantity is ${formatQty(cycleRemainingQty)}m.`;
                      }

                      return true;
                    },
                  })}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={
              loading ||
              (effectiveAction === "start" &&
                isFirstProcess &&
                (cycleAlreadyAllocated || availableQty <= 0))
            }
          >
            {loading
              ? "Processing..."
              : effectiveAction === "start"
                ? `Start ${processLabel}`
                : `Complete ${processLabel}`}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateProductionDialog;
