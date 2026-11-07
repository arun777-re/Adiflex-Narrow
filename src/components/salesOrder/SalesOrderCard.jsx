
import React from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

const InfoItem = ({ label, value }) => (
  <Box>
    <Typography
      variant="caption"
      sx={{
        color: "text.secondary",
        fontWeight: 600,
        display: "block",
        mb: 0.3,
      }}
    >
      {label}
    </Typography>

    <Typography
      variant="body2"
      sx={{
        fontWeight: 600,
        wordBreak: "break-word",
      }}
    >
      {value !== null && value !== undefined && value !== ""
        ? value
        : "-"}
    </Typography>
  </Box>
);

const formatQty = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const SalesOrderCard = ({ row, onEdit }) => {
  const productionQty = Number(row?.production_qty || 0);
  const manufacturedQty = Number(row?.manufactured_qty || 0);

  const soQtyInMeter = Number(row?.so_qty_in_meter || 0);
  const dispatchedQty = Number(row?.dispatched_qty || 0);

  // Production Status
  const productionRemaining = Math.max(
    0,
    productionQty - manufacturedQty
  );

  const productionStatus =
    productionRemaining <= 0
      ? "Completed"
      : manufacturedQty <= 0
        ? "Pending"
        : "Partial";

  const productionColor =
    productionStatus === "Completed"
      ? "success"
      : productionStatus === "Partial"
        ? "info"
        : "warning";

  // Dispatch Status
  const dispatchRemaining = Math.max(
    0,
    soQtyInMeter - dispatchedQty
  );

  const dispatchStatus =
    soQtyInMeter > 0 && dispatchRemaining <= 0
      ? "Dispatched"
      : dispatchedQty <= 0
        ? "Pending Dispatch"
        : "Partial Dispatch";

  const dispatchColor =
    dispatchStatus === "Dispatched"
      ? "success"
      : dispatchStatus === "Partial Dispatch"
        ? "info"
        : "warning";

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={1}
          mb={2}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700}>
              {row?.so_no || "-"}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={600}
            >
              {row?.customer || "-"}
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={0.5}
            flexWrap="wrap"
            justifyContent="flex-end"
          >
            <Chip
              label={row?.order_type || "-"}
              size="small"
              color={
                row?.order_type === "CUSTOMER"
                  ? "primary"
                  : "secondary"
              }
            />

            <Chip
              label={row?.division || "-"}
              size="small"
              variant="outlined"
            />
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Product Details */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <InfoItem
              label="Product"
              value={row?.product_name}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="SKU Code"
              value={row?.skucode}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Order Date"
              value={formatDate(row?.order_date)}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Committed Date"
              value={formatDate(row?.committed_date)}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Party PO"
              value={row?.party_po}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Received By"
              value={row?.order_received_by}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Order Details */}
        <Typography
          variant="subtitle2"
          fontWeight={700}
          mb={1.5}
        >
          Order Details
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <InfoItem
              label="SO Quantity"
              value={`${formatQty(row?.so_qty)} ${row?.unit || ""}`}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Rate"
              value={`₹${formatQty(row?.final_rate)}`}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Order Amount"
              value={`₹${formatQty(row?.order_amount)}`}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Rate Adjustment"
              value={`₹${formatQty(row?.rate_adjustment)}`}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Stock & Production */}
        <Typography
          variant="subtitle2"
          fontWeight={700}
          mb={1.5}
        >
          Stock & Production (MTR)
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <InfoItem
              label="Opening FG"
              value={formatQty(row?.opening_fg_qty)}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Production Target"
              value={formatQty(row?.production_qty)}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Manufactured"
              value={formatQty(row?.manufactured_qty)}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Production Remaining"
              value={formatQty(productionRemaining)}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Dispatched"
              value={formatQty(row?.dispatched_qty)}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Dispatch Remaining"
              value={formatQty(dispatchRemaining)}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Total SO Quantity"
              value={formatQty(row?.so_qty_in_meter)}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Total Wastage"
              value={formatQty(row?.total_wastage_qty)}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Status */}
        <Typography
          variant="subtitle2"
          fontWeight={700}
          mb={1}
        >
          Status
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
        >
          <Chip
            label={`Production: ${productionStatus}`}
            color={productionColor}
            size="small"
          />

          <Chip
            label={`Dispatch: ${dispatchStatus}`}
            color={dispatchColor}
            size="small"
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Other Details */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <InfoItem
              label="Job Work"
              value={
                row?.job_work === true ||
                String(row?.job_work).toLowerCase() === "true"
                  ? "Yes"
                  : "No"
              }
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Route"
              value={row?.route}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Shipping Location"
              value={row?.shipping_location}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Billing Location"
              value={row?.billing_location}
            />
          </Grid>
        </Grid>
      </CardContent>

      {/* Actions */}
      <CardActions
        sx={{
          justifyContent: "flex-end",
          px: 2,
          pb: 2,
        }}
      >
        <Tooltip title="Edit Sales Order">
          <IconButton
            color="primary"
            onClick={() => onEdit?.(row)}
            aria-label={`Edit ${row?.so_no || "sales order"}`}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default SalesOrderCard;
