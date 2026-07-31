import {
  Box,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  Chip,
} from "@mui/material";

const ProductionAnalytics = ({ data }) => {
  const woven = data?.woven || 0;
  const crochet = data?.crochet || 0;

  const totalProduction = data?.totalProduction || 0;

  const completedOrders = data?.completedOrders || 0;

  const runningOrders = data?.runningOrders || 0;

  const pendingOrders = data?.pendingOrders || 0;

  const totalDivisionOrders = woven + crochet;

  const wovenPercentage =
    totalDivisionOrders > 0
      ? (woven / totalDivisionOrders) * 100
      : 0;

  const crochetPercentage =
    totalDivisionOrders > 0
      ? (crochet / totalDivisionOrders) * 100
      : 0;

  return (
    <Grid container spacing={3} mt={1}>
      {/* ====================================== */}
      {/* PRODUCTION TREND */}
      {/* ====================================== */}

      <Grid
        size={{
          xs: 12,
          lg: 8,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Production Analytics
          </Typography>

          <Typography
            color="text.secondary"
            mb={4}
          >
            Live Production Overview
          </Typography>

          <Grid container spacing={3}>
            <Grid size={6}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  textAlign: "center",
                }}
              >
                <Typography
                  color="text.secondary"
                >
                  Total Production
                </Typography>

                <Typography
                  mt={1}
                  variant="h3"
                  fontWeight={700}
                  color="primary"
                >
                  {totalProduction}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={6}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  textAlign: "center",
                }}
              >
                <Typography
                  color="text.secondary"
                >
                  Total Divisions
                </Typography>

                <Typography
                  mt={1}
                  variant="h3"
                  fontWeight={700}
                  color="success.main"
                >
                  {totalDivisionOrders}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={12}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 3,
                }}
              >
                <Typography
                  fontWeight={700}
                  mb={2}
                >
                  Order Status
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={4}>
                    <Chip
                      color="success"
                      label={`Completed : ${completedOrders}`}
                      sx={{
                        width: "100%",
                        fontWeight: 700,
                      }}
                    />
                  </Grid>

                  <Grid size={4}>
                    <Chip
                      color="warning"
                      label={`Running : ${runningOrders}`}
                      sx={{
                        width: "100%",
                        fontWeight: 700,
                      }}
                    />
                  </Grid>

                  <Grid size={4}>
                    <Chip
                      color="error"
                      label={`Pending : ${pendingOrders}`}
                      sx={{
                        width: "100%",
                        fontWeight: 700,
                      }}
                    />
                  </Grid>
                </Grid>

                <Box mt={4}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={1}
                  >
                    Overall Completion
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={
                      completedOrders + pendingOrders > 0
                        ? (completedOrders /
                            (completedOrders + pendingOrders)) *
                          100
                        : 0
                    }
                    sx={{
                      height: 12,
                      borderRadius: 10,
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* ====================================== */}
      {/* DIVISION SUMMARY */}
      {/* ====================================== */}

      <Grid
        size={{
          xs: 12,
          lg: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={3}
          >
            Division Summary
          </Typography>

          <Typography
            color="text.secondary"
            mb={4}
          >
            Live Production Status
          </Typography>

          {/* Crochet */}

          <Box mb={4}>
            <Typography
              fontWeight={700}
              gutterBottom
            >
              Crochet ({crochet})
            </Typography>

            <LinearProgress
              variant="determinate"
              value={crochetPercentage}
              sx={{
                height: 12,
                borderRadius: 10,
              }}
            />

            <Typography
              mt={1}
              variant="body2"
              color="text.secondary"
            >
              {crochetPercentage.toFixed(1)}% of Orders
            </Typography>
          </Box>

          {/* Woven */}

          <Box mb={4}>
            <Typography
              fontWeight={700}
              gutterBottom
            >
              Woven ({woven})
            </Typography>

            <LinearProgress
              color="success"
              variant="determinate"
              value={wovenPercentage}
              sx={{
                height: 12,
                borderRadius: 10,
              }}
            />

            <Typography
              mt={1}
              variant="body2"
              color="text.secondary"
            >
              {wovenPercentage.toFixed(1)}% of Orders
            </Typography>
          </Box>

          <Paper
            variant="outlined"
            sx={{
              mt: 5,
              p: 2,
              borderRadius: 3,
              bgcolor: "#fafafa",
            }}
          >
            <Typography
              fontWeight={700}
              mb={2}
            >
              Quick Stats
            </Typography>

            <Typography mb={1}>
              📦 Production : <b>{totalProduction}</b>
            </Typography>

            <Typography mb={1}>
              ✅ Completed : <b>{completedOrders}</b>
            </Typography>

            <Typography mb={1}>
              🟡 Running : <b>{runningOrders}</b>
            </Typography>

            <Typography>
              🔴 Pending : <b>{pendingOrders}</b>
            </Typography>
          </Paper>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ProductionAnalytics;