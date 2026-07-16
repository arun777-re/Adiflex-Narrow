import {
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InventoryIcon from "@mui/icons-material/Inventory";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";

import DummyComponent from "../DummyComponent";

const ProcessSummaryCards = ({
  rows = [],
  loading = false,
}) => {
  const pending = rows.length;

  const completed = rows.filter(
    (row) => row.status === "Completed"
  ).length;

  const targetQty = rows.reduce(
    (sum, row) =>
      sum + Number(row.productionTargetQty || 0),
    0
  );

  const productionQty = rows.reduce(
    (sum, row) =>
      sum + Number(row.productionQty || 0),
    0
  );

  const cards = [
    {
      title: "Pending Orders",
      value: pending,
      icon: (
        <PendingActionsIcon
          fontSize="large"
          color="warning"
        />
      ),
    },
    {
      title: "Completed",
      value: completed,
      icon: (
        <CheckCircleIcon
          fontSize="large"
          color="success"
        />
      ),
    },
    {
      title: "Target Qty",
      value: targetQty.toLocaleString(),
      icon: (
        <InventoryIcon
          fontSize="large"
          color="primary"
        />
      ),
    },
    {
      title: "Production Qty",
      value: productionQty.toLocaleString(),
      icon: (
        <PrecisionManufacturingIcon
          fontSize="large"
          color="secondary"
        />
      ),
    },
  ];

  return (
    <Grid container spacing={3}>

      {loading && Array.isArray(card) && card.length <= 0 ? (
        <DummyComponent />
      ) : (
        cards.map((card) => (
          <Grid
            key={card.title}
            size={{ xs: 12, sm: 6, lg: 3 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: 3,
              }}
            >
              <div>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {card.title}
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  mt={1}
                >
                  {card.value}
                </Typography>
              </div>

              {card.icon}
            </Paper>
          </Grid>
        ))
      )}

    </Grid>
  );
};

export default ProcessSummaryCards;