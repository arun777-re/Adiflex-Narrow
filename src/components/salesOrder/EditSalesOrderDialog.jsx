import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

import { editSalesOrder } from "../../redux/slices/salesOrderSlice";

// =========================================================
// ALLOWED UNITS
// =========================================================

const ALLOWED_UNITS = ["Meter", "Roll", "Kg"];

const normalizeUnit = (unit) => {
  if (!unit) return "";

  const value = String(unit).trim().toUpperCase();

  const unitMap = {
    METER: "Meter",
    METERS: "Meter",
    ROLL: "Roll",
    ROLLS: "Roll",
    KG: "Kg",
    KGS: "Kg",
  };

  return unitMap[value] || "";
};

// =========================================================
// COMPONENT
// =========================================================

const EditSalesOrderDialog = ({ open, row, onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    soQty: "",
    rate: "",
    rateadjustment: "",
    finalrate: "",
    unit: "",
    jobWork: false,
    shippinglocation: "",
    billinglocation: "",
    route: "",
    skucode: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD ROW DATA
  // =========================================================

  useEffect(() => {
    if (!row || !open) return;

    console.log("[EDIT SO] Current API Row:", row);

    setFormData({
      soQty: row.so_qty ?? "",

      rate: row.standard_rate ?? "",

      rateadjustment: row.rate_adjustment ?? "",

      finalrate: row.final_rate ?? "",

      unit: normalizeUnit(row.unit),

      jobWork:
        row.job_work === true || String(row.job_work).toLowerCase() === "true",

      shippinglocation: row.shipping_location ?? "",

      billinglocation: row.billing_location ?? "",

      route: row.route ?? "",

      skucode: row.skucode ?? "",
    });

    setError("");
  }, [row, open]);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE JOB WORK
  // =========================================================

  const handleJobWorkChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      jobWork: event.target.value === "true",
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async () => {
    // -------------------------------------------------------
    // Basic validation
    // -------------------------------------------------------

    if (!row?.so_no) {
      setError("Sales Order Number is missing.");
      return;
    }

    if (formData.soQty === "" || Number(formData.soQty) < 0) {
      setError("Valid SO Quantity is required.");
      return;
    }

    if (!ALLOWED_UNITS.includes(formData.unit)) {
      setError("Please select a valid Unit: Meter, Roll, Kg .");
      return;
    }

    if (!formData.skucode?.trim()) {
      setError("SKU Code is required.");
      return;
    }

    // -------------------------------------------------------
    // Build payload
    // -------------------------------------------------------

    const payload = {
      soQty: Number(formData.soQty),

      rate: formData.rate === "" ? 0 : Number(formData.rate),

      rateadjustment:
        formData.rateadjustment === "" ? 0 : Number(formData.rateadjustment),

      finalrate: formData.finalrate === "" ? 0 : Number(formData.finalrate),

      unit: formData.unit.toUpperCase(),

      jobWork: Boolean(formData.jobWork),

      shippinglocation: formData.shippinglocation?.trim() || "",

      billinglocation: formData.billinglocation?.trim() || "",

      route: formData.route?.trim() || "",

      skucode: formData.skucode?.trim() || "",
    };

    try {
      setSaving(true);
      setError("");

      console.log("========================================");
      console.log("[EDIT SO] Dispatching editSalesOrder");
      console.log("[EDIT SO] SO No:", row.soNo);
      console.log("[EDIT SO] Payload:", payload);
      console.log("========================================");

      // -----------------------------------------------------
      // DISPATCH THUNK
      // -----------------------------------------------------

      const result = await dispatch(
        editSalesOrder({
          soNo: row.so_no,
          payload,
        }),
      ).unwrap();

      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------

      console.log("========================================");
      console.log("[EDIT SO] Update successful");
      console.log("[EDIT SO] Result:", result);
      console.log("========================================");

      onSuccess?.(result);

      onClose?.();
    } catch (error) {
      console.error("[EDIT SO] Update failed:", error);

      setError(
        typeof error === "string"
          ? error
          : error?.message || "Failed to update Sales Order",
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // CLOSE
  // =========================================================

  const handleClose = () => {
    if (saving) return;

    setError("");

    onClose?.();
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <DialogTitle
        sx={{
          pb: 1,
          fontWeight: 800,
        }}
      >
        Edit Sales Order
        {row?.so_no && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Sales Order: {row.so_no}
          </Typography>
        )}
      </DialogTitle>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <DialogContent dividers>
        <Stack spacing={2.5}>
          {/* ERROR */}

          {error && (
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* =================================================
              READ ONLY INFORMATION
          ================================================= */}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer"
                value={row?.customer || ""}
                disabled
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product"
                value={row?.product_name || ""}
                disabled
                size="small"
              />
            </Grid>
          </Grid>

          {/* =================================================
              EDITABLE FIELDS
          ================================================= */}

          <Grid container spacing={2}>
            {/* SO QUANTITY */}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SO Quantity"
                name="soQty"
                type="number"
                value={formData.soQty}
                onChange={handleChange}
                size="small"
                required
                inputProps={{
                  min: 0,
                  step: "any",
                }}
              />
            </Grid>

            {/* UNIT */}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                size="small"
                required
              >
                <MenuItem value="Meter">Meter</MenuItem>
                <MenuItem value="Roll">Roll</MenuItem>
                <MenuItem value="Kg">Kg</MenuItem>
              </TextField>
            </Grid>

            {/* RATE */}

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Rate"
                name="rate"
                type="number"
                value={formData.rate}
                onChange={handleChange}
                size="small"
                inputProps={{
                  min: 0,
                  step: "any",
                }}
              />
            </Grid>

            {/* RATE ADJUSTMENT */}

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Rate Adjustment"
                name="rateadjustment"
                type="number"
                value={formData.rateadjustment}
                onChange={handleChange}
                size="small"
                inputProps={{
                  step: "any",
                }}
              />
            </Grid>

            {/* FINAL RATE */}

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Final Rate"
                name="finalrate"
                type="number"
                value={formData.finalrate}
                onChange={handleChange}
                size="small"
                inputProps={{
                  min: 0,
                  step: "any",
                }}
              />
            </Grid>

            {/* JOB WORK */}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Job Work"
                name="jobWork"
                value={String(formData.jobWork)}
                onChange={handleJobWorkChange}
                size="small"
              >
                <MenuItem value="false">No</MenuItem>

                <MenuItem value="true">Yes</MenuItem>
              </TextField>
            </Grid>

            {/* SKU */}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU Code"
                name="skucode"
                value={formData.skucode}
                onChange={handleChange}
                size="small"
                required
              />
            </Grid>

            {/* SHIPPING LOCATION */}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Shipping Location"
                name="shippinglocation"
                value={formData.shippinglocation}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            {/* BILLING LOCATION */}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Billing Location"
                name="billinglocation"
                value={formData.billinglocation}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            {/* ROUTE */}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Route"
                name="route"
                value={formData.route}
                onChange={handleChange}
                size="small"
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>

      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          gap: 1,
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<CloseIcon />}
          onClick={handleClose}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          startIcon={
            saving ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Updating..." : "Update Sales Order"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSalesOrderDialog;
