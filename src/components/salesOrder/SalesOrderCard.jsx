
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

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
      {value || "-"}
    </Typography>
  </Box>
);

const SalesOrderCard = ({ row }) => {
  const isProductionCompleted = row.productionstatus === "Completed";
  const isDispatched = row.dispatchstatus === "Dispatched";

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid #e0e0e0",
        borderRadius: 3,
        transition: "all 0.2s ease",
        overflow: "hidden",

        "&:hover": {
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* ================= HEADER ================= */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={1}
          mb={1}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              {row.soNo}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                fontWeight: 600,
              }}
            >
              {row.customer || "-"}
            </Typography>
          </Box>

          <Chip
            label={isProductionCompleted ? "Completed" : "Pending Production"}
            color={isProductionCompleted ? "success" : "warning"}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 700,
              flexShrink: 0,
            }}
          />
        </Stack>

        {/* ================= PRODUCT ================= */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            lineHeight: 1.35,
          }}
        >
          {row.product || "-"}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mb={2}>
          <Chip
            label={`SKU: ${row.skucode || "-"}`}
            size="small"
            variant="outlined"
          />

          <Chip
            label={row.division || "-"}
            size="small"
            variant="outlined"
          />

          <Chip
            label={row.ordertype || "-"}
            size="small"
            variant="outlined"
          />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* ================= MAIN INFO ================= */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <InfoItem label="Date" value={row.date} />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="SO Qty"
              value={`${row.qty || 0} ${row.unit || ""}`}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Final Rate"
              value={`₹ ${Number(row.finalrate || 0).toFixed(2)}`}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Opening FG"
              value={`${row.openingFgQty || 0} ${row.unit || ""}`}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Production"
              value={`${row.productionQty || 0} ${row.unit || ""}`}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Manufactured"
              value={`${row.manufacturedQty || 0} ${row.unit || ""}`}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Dispatched"
              value={`${row.dispatchedQty || 0} ${row.unit || ""}`}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoItem
              label="Job Work"
              value={row.jobWork ? "Yes" : "No"}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* ================= STATUS ================= */}
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" fontWeight={600}>
              Production
            </Typography>

            <Chip
              label={
                isProductionCompleted
                  ? "Completed"
                  : "Pending Production"
              }
              color={isProductionCompleted ? "success" : "warning"}
              size="small"
            />
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" fontWeight={600}>
              Dispatch
            </Typography>

            <Chip
              label={isDispatched ? "Dispatched" : "Pending Dispatch"}
              color={isDispatched ? "success" : "warning"}
              size="small"
            />
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* ================= LOCATIONS ================= */}
        <Stack spacing={1.5}>
          <InfoItem
            label="Shipping Location"
            value={row.shippinglocation}
          />

          <InfoItem
            label="Billing Location"
            value={row.billinglocation}
          />

          <InfoItem
            label="Created By"
            value={row.orderReceivedBy}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SalesOrderCard;

