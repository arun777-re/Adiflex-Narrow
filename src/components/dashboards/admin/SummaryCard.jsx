import {
  Grid,
  Paper,
  Typography,
  Stack,
  Box,
  Chip,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const SummaryCard = ({ data }) => {
  const todayOrders = data?.todayOrders || 0;

  const todayProduction = data?.todayProduction || 0;

  const todayDispatch = data?.todayDispatch || 0;

  const todayBilling = data?.todayBilling || 0;

  const summary = [
    {
      title: "Today's Orders",
      value: todayOrders,
      color: "#1976d2",
      icon: <ShoppingCartIcon />,
      subtitle: "Sales Orders",
    },
    {
      title: "Today's Production",
      value: todayProduction,
      color: "#2e7d32",
      icon: <PrecisionManufacturingIcon />,
      subtitle: "Produced Qty",
    },
    {
      title: "Today's Dispatch",
      value: todayDispatch,
      color: "#ef6c00",
      icon: <LocalShippingIcon />,
      subtitle: "Dispatched Qty",
    },
    {
      title: "Today's Billing",
      value: todayBilling,
      color: "#8e24aa",
      icon: <CurrencyRupeeIcon />,
      subtitle: "Today's Revenue",
    },
  ];

  return (
    <Grid container spacing={3} mt={1}>
      {summary.map((item) => (
        <Grid
          key={item.title}
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid #e5e7eb",
              transition: ".25s",

              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 25px rgba(0,0,0,.08)",
              },
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {item.title}
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  mt={1}
                >
                  {item.value}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {item.subtitle}
                </Typography>
              </Box>

              <Chip
                icon={item.icon}
                label=""
                sx={{
                  bgcolor: item.color,
                  color: "#fff",
                  width: 52,
                  height: 52,

                  "& .MuiChip-icon": {
                    color: "#fff",
                    fontSize: 26,
                    ml: 0.4,
                  },
                }}
              />
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCard;