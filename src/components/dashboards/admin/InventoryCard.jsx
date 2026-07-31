import {
  Box,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const InventoryCard = ({
  inventoryData,
  recentOrdersData,
}) => {
  const totalFG = inventoryData?.totalFG || 0;

  const lowStock = inventoryData?.lowStock || 0;

  const outOfStock =
    inventoryData?.outOfStock || 0;

  const inventory =
    inventoryData?.inventory || [];

  const recentOrders =
    recentOrdersData || [];

  const totalProducts =
    totalFG + lowStock + outOfStock;

  const fgPercentage =
    totalProducts > 0
      ? (totalFG / totalProducts) * 100
      : 0;

  const lowPercentage =
    totalProducts > 0
      ? (lowStock / totalProducts) * 100
      : 0;

  const outPercentage =
    totalProducts > 0
      ? (outOfStock / totalProducts) * 100
      : 0;

  return (
    <Grid container spacing={3} mt={1}>
      {/* ================================ */}
      {/* INVENTORY */}
      {/* ================================ */}

      <Grid
        size={{
          xs: 12,
          md: 5,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #e5e7eb",
            height: "100%",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={3}
          >
            Inventory Overview
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography>
                  Available FG
                </Typography>

                <Typography fontWeight={700}>
                  {totalFG}
                </Typography>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={fgPercentage}
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 10,
                }}
              />
            </Box>

            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography>
                  Low Stock
                </Typography>

                <Typography fontWeight={700}>
                  {lowStock}
                </Typography>
              </Stack>

              <LinearProgress
                color="warning"
                variant="determinate"
                value={lowPercentage}
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 10,
                }}
              />
            </Box>

            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography>
                  Out Of Stock
                </Typography>

                <Typography fontWeight={700}>
                  {outOfStock}
                </Typography>
              </Stack>

              <LinearProgress
                color="error"
                variant="determinate"
                value={outPercentage}
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 10,
                }}
              />
            </Box>

            <Box mt={2}>
              <Typography
                variant="subtitle2"
                mb={2}
              >
                Top Inventory
              </Typography>

              {inventory.length === 0 ? (
                <Typography
                  color="text.secondary"
                >
                  No Inventory Found
                </Typography>
              ) : (
                inventory.map((item) => (
                  <Stack
                    key={item.product}
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      py: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                    >
                      {item.product}
                    </Typography>

                    <Typography
                      fontWeight={700}
                    >
                      {item.qty}
                    </Typography>
                  </Stack>
                ))
              )}
            </Box>
          </Stack>
        </Paper>
      </Grid>

      {/* ================================ */}
      {/* RECENT ORDERS */}
      {/* ================================ */}

      <Grid
        size={{
          xs: 12,
          md: 7,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #e5e7eb",
            height: "100%",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={3}
          >
            Recent Orders
          </Typography>

          {recentOrders.length === 0 ? (
            <Typography
              color="text.secondary"
              align="center"
              py={5}
            >
              No Orders Found
            </Typography>
          ) : (
            recentOrders.map(
              (item, index) => (
                <Stack
                  key={item.soNo}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    py: 2,
                    borderBottom:
                      index !==
                      recentOrders.length - 1
                        ? "1px solid #eee"
                        : "none",
                  }}
                >
                  <Box>
                    <Typography
                      fontWeight={700}
                    >
                      {item.soNo}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {item.product}
                    </Typography>

                    <Typography
                      variant="caption"
                    >
                      {item.customer}
                    </Typography>
                  </Box>

                  <Box textAlign="right">
                    <Typography
                      fontWeight={700}
                    >
                      {item.qty}
                    </Typography>

                    <Chip
                      size="small"
                      label={item.status}
                      color={
                        item.status ===
                        "Completed"
                          ? "success"
                          : item.status ===
                            "Running"
                          ? "warning"
                          : item.status ===
                            "Dispatch"
                          ? "primary"
                          : "default"
                      }
                    />
                  </Box>
                </Stack>
              )
            )
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default InventoryCard;