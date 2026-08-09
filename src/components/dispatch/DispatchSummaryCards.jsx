import React, { useMemo } from "react";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

const DispatchSummaryCards = ({ rows = [] }) => {
  const summary = useMemo(() => {
    const totalOrders = rows.length;

    const readyToDispatch = rows.filter(
      (row) => row.status === "Ready To Dispatch"
    ).length;

    const partiallyDispatched = rows.filter(
      (row) => row.status === "Partially Dispatched"
    ).length;

    const fullyDispatched = rows.filter(
      (row) => row.status === "Fully Dispatched"
    ).length;

    const totalProductionQty = rows.reduce(
      (total, row) =>
        total + Number(row.productionQty || 0),
      0
    );

    const totalDispatchQty = rows.reduce(
      (total, row) =>
        total + Number(row.dispatchQty || 0),
      0
    );

    const totalAvailableQty = rows.reduce(
      (total, row) =>
        total + Number(row.availableQty || 0),
      0
    );

    return {
      totalOrders,
      readyToDispatch,
      partiallyDispatched,
      fullyDispatched,
      totalProductionQty,
      totalDispatchQty,
      totalAvailableQty,
    };
  }, [rows]);

  const cards = [
    {
      title: "Total Orders",
      value: summary.totalOrders,
    },
    {
      title: "Ready To Dispatch",
      value: summary.readyToDispatch,
    },
    {
      title: "Partially Dispatched",
      value: summary.partiallyDispatched,
    },
    {
      title: "Fully Dispatched",
      value: summary.fullyDispatched,
    },
    {
      title: "Production Qty",
      value: summary.totalProductionQty.toLocaleString(),
    },
    {
      title: "Dispatched Qty",
      value: summary.totalDispatchQty.toLocaleString(),
    },
    {
      title: "Available Qty",
      value: summary.totalAvailableQty.toLocaleString(),
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {card.title}
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ mt: 1 }}
              >
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DispatchSummaryCards;