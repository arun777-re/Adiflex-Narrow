import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Stack,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";

import {
  CalendarMonth,
  Save,
  ArrowBack,
} from "@mui/icons-material";

import {
  createHoliday,
  clearHolidayError,
  clearHolidaySuccess,
} from "../../redux/slices/holidaySlice";

const CreateHoliday = ({ onSuccess }) => {
  const dispatch = useDispatch();

  const { creating, error } = useSelector(
    (state) => state.holiday
  );

  const [formData, setFormData] = useState({
    holiday_name: "",
    holiday_date: "",
    description: "",
  });

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    dispatch(clearHolidayError());
    dispatch(clearHolidaySuccess());

    return () => {
      dispatch(clearHolidayError());
      dispatch(clearHolidaySuccess());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.holiday_name.trim()) {
      setValidationError("Please enter holiday name.");
      return;
    }

    if (!formData.holiday_date) {
      setValidationError("Please select holiday date.");
      return;
    }

    try {
      await dispatch(
        createHoliday({
          holiday_name: formData.holiday_name.trim(),
          holiday_date: formData.holiday_date,
          description: formData.description.trim(),
        })
      ).unwrap();

      setFormData({
        holiday_name: "",
        holiday_date: "",
        description: "",
      });

      onSuccess?.();
    } catch (err) {
      console.error("Create holiday error:", err);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 850,
        mx: "auto",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2,
              bgcolor: "primary.light",
              color: "primary.dark",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarMonth />
          </Box>

          <Box>
            <Typography variant="h6" fontWeight={700}>
              Create Company Holiday
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Add a new holiday to your company calendar.
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: { xs: 2.5, md: 3 } }}
      >
        <Stack spacing={2.5}>
          {validationError && (
            <Alert severity="warning">
              {validationError}
            </Alert>
          )}

          {error && (
            <Alert severity="error">
              {typeof error === "string"
                ? error
                : "Unable to create holiday."}
            </Alert>
          )}

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Holiday Name"
                name="holiday_name"
                value={formData.holiday_name}
                onChange={handleChange}
                placeholder="e.g. Diwali"
                inputProps={{ maxLength: 150 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Holiday Date"
                name="holiday_date"
                value={formData.holiday_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date().toISOString().slice(0, 10),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter additional holiday details (optional)"
              />
            </Grid>
          </Grid>

          <Divider />

          <Stack
            direction={{ xs: "column-reverse", sm: "row" }}
            justifyContent="flex-end"
            spacing={1.5}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={onSuccess}
              disabled={creating}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Back
            </Button>

            <Button
              type="submit"
              variant="contained"
              startIcon={
                creating ? (
                  <CircularProgress size={17} color="inherit" />
                ) : (
                  <Save />
                )
              }
              disabled={creating}
              sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
            >
              {creating ? "Saving..." : "Save Holiday"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default CreateHoliday;