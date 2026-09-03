
import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useDispatch, useSelector } from "react-redux";

import {
  getAnalyticsSummary,
  getOrdersAnalytics,
  getSalesAnalytics,
} from "../../redux/slices/analyticsSlice";

/* =========================================================
   CONSTANTS
========================================================= */

const DIVISION_TOTAL = "ALL";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const NUMBER_FORMATTER = new Intl.NumberFormat("en-IN");

/* =========================================================
   UTILS
========================================================= */

const formatNumber = (value) => {
  return NUMBER_FORMATTER.format(value || 0);
};

const formatCurrency = (value) => {
  return `₹${CURRENCY_FORMATTER.format(value || 0)}`;
};

const calculateGrowth = (current, previous) => {
  if (!previous) return 0;

  return ((current - previous) / previous) * 100;
};

const formatGrowth = (value) => {
  const rounded = Number(value.toFixed(1));

  if (rounded > 0) {
    return `+${rounded}%`;
  }

  return `${rounded}%`;
};

/* =========================================================
   KPI CARD
========================================================= */

const DashboardKpiCard = ({
  title,
  value,
  previousValue,
  formatter = formatNumber,
}) => {
  const growth = calculateGrowth(
    value,
    previousValue
  );

  const isPositive = growth >= 0;

  return (
    <Card
      elevation={1}
      sx={{
        height: "100%",
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={600}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          fontWeight={800}
          sx={{ mt: 1 }}
        >
          {formatter(value)}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ mt: 1 }}
        >
          <Chip
            size="small"
            label={formatGrowth(growth)}
            color={
              isPositive
                ? "success"
                : "error"
            }
            variant="outlined"
          />

          <Typography
            variant="caption"
            color="text.secondary"
          >
            vs previous period
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

/* =========================================================
   SECTION HEADER
========================================================= */

const DashboardSection = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 2,
        height: "100%",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight={700}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {subtitle}
          </Typography>
        )}

        {children}
      </CardContent>
    </Card>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const AnalysisPage = () => {
  const dispatch = useDispatch();

  /* =======================================================
     FILTERS
  ======================================================= */

  // Temporary testing:
  // ALL will bring August data also.
  // Later we will make month/week/year dynamic.
  const [period, setPeriod] = useState("all");

  const [division, setDivision] =
    useState(DIVISION_TOTAL);

  /* =======================================================
     REDUX STATE
  ======================================================= */

  const {
    summary,
    orders,
    sales,
    loading,
    error,
  } = useSelector(
    (state) => state.analytics
  );

  /* =======================================================
     FETCH ANALYTICS
  ======================================================= */

  useEffect(() => {
    const params = {
      period,
      division,
    };

    console.log(
      "📊 Fetching Analytics:",
      params
    );

    dispatch(
      getAnalyticsSummary(params)
    );

    dispatch(
      getOrdersAnalytics(params)
    );

    dispatch(
      getSalesAnalytics(params)
    );
  }, [dispatch, period, division]);

  /* =======================================================
     NORMALIZE API DATA
  ======================================================= */

  const weeklyOrders = useMemo(() => {
    return orders?.weekly || [];
  }, [orders]);

  const divisionOrders = useMemo(() => {
    return orders?.division || [];
  }, [orders]);

  const weeklySales = useMemo(() => {
    return sales?.weekly || [];
  }, [sales]);

  const divisionSales = useMemo(() => {
    return sales?.division || [];
  }, [sales]);

  /* =======================================================
     COMBINE DIVISION DATA
     
     Orders API:
       division -> orders, completed

     Sales API:
       division -> sales
  ======================================================= */

  const divisionData = useMemo(() => {
    const map = {};

    divisionOrders.forEach((item) => {
      const divisionName =
        item.division || "UNKNOWN";

      if (!map[divisionName]) {
        map[divisionName] = {
          division: divisionName,
          orders: 0,
          completed: 0,
          sales: 0,
        };
      }

      map[divisionName].orders =
        Number(item.orders) || 0;

      map[divisionName].completed =
        Number(item.completed) || 0;
    });

    divisionSales.forEach((item) => {
      const divisionName =
        item.division || "UNKNOWN";

      if (!map[divisionName]) {
        map[divisionName] = {
          division: divisionName,
          orders: 0,
          completed: 0,
          sales: 0,
        };
      }

      map[divisionName].sales =
        Number(item.sales) || 0;
    });

    return Object.values(map);
  }, [
    divisionOrders,
    divisionSales,
  ]);

  /* =======================================================
     FILTERED DIVISION DATA
  ======================================================= */

  const filteredDivisionData =
    useMemo(() => {
      if (division === DIVISION_TOTAL) {
        return divisionData;
      }

      return divisionData.filter(
        (item) =>
          item.division === division
      );
    }, [
      divisionData,
      division,
    ]);

  /* =======================================================
     SUMMARY
  ======================================================= */

  const dashboardSummary = useMemo(() => {
    return {
      orders:
        Number(
          summary?.ordersReceived
        ) || 0,

      completed:
        Number(
          summary?.ordersCompleted
        ) || 0,

      pending:
        Number(
          summary?.pendingOrders
        ) || 0,

      sales:
        Number(summary?.sales) || 0,

      previousOrders:
        Number(
          summary?.previousOrdersReceived
        ) || 0,

      previousCompleted:
        Number(
          summary?.previousOrdersCompleted
        ) || 0,

      previousPending:
        Number(
          summary?.previousPendingOrders
        ) || 0,

      previousSales:
        Number(
          summary?.previousSales
        ) || 0,
    };
  }, [summary]);

  /* =======================================================
     COMPLETION RATE
  ======================================================= */

  const completionRate = useMemo(() => {
    if (!dashboardSummary.orders) {
      return 0;
    }

    return (
      (dashboardSummary.completed /
        dashboardSummary.orders) *
      100
    ).toFixed(1);
  }, [
    dashboardSummary.orders,
    dashboardSummary.completed,
  ]);

  /* =======================================================
     LOADING
  ======================================================= */

  const isLoading =
    loading?.summary ||
    loading?.orders ||
    loading?.sales;

  /* =======================================================
     UI
  ======================================================= */

  return (
    <Box
      sx={{
        width: "100%",
        p: {
          xs: 1.5,
          md: 2,
        },
      }}
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        alignItems={{
          xs: "flex-start",
          md: "center",
        }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
          >
            Management Dashboard
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Orders, production completion
            and sales performance
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
        >
          {/* PERIOD */}

          <FormControl
            size="small"
            sx={{
              minWidth: 150,
            }}
          >
            <InputLabel>
              Period
            </InputLabel>

            <Select
              value={period}
              label="Period"
              onChange={(e) =>
                setPeriod(
                  e.target.value
                )
              }
            >
              <MenuItem value="all">
                All Data
              </MenuItem>

              <MenuItem value="week">
                This Week
              </MenuItem>

              <MenuItem value="month">
                This Month
              </MenuItem>

              <MenuItem value="year">
                This Year
              </MenuItem>
            </Select>
          </FormControl>

          {/* DIVISION */}

          <FormControl
            size="small"
            sx={{
              minWidth: 150,
            }}
          >
            <InputLabel>
              Division
            </InputLabel>

            <Select
              value={division}
              label="Division"
              onChange={(e) =>
                setDivision(
                  e.target.value
                )
              }
            >
              <MenuItem
                value={DIVISION_TOTAL}
              >
                All Divisions
              </MenuItem>

              <MenuItem value="WOVEN">
                Woven
              </MenuItem>

              <MenuItem value="CROCHET">
                Crochet
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {/* ===================================================
          ERROR
      =================================================== */}

      {(error?.summary ||
        error?.orders ||
        error?.sales) && (
        <Card
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Typography
              color="error"
              fontWeight={600}
            >
              Analytics failed to load
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {error.summary ||
                error.orders ||
                error.sales}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* ===================================================
          KPI CARDS
      =================================================== */}

      <Grid
        container
        spacing={2}
      >
        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <DashboardKpiCard
            title="Orders Received"
            value={
              dashboardSummary.orders
            }
            previousValue={
              dashboardSummary.previousOrders
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <DashboardKpiCard
            title="Orders Completed"
            value={
              dashboardSummary.completed
            }
            previousValue={
              dashboardSummary.previousCompleted
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <DashboardKpiCard
            title="Pending Orders"
            value={
              dashboardSummary.pending
            }
            previousValue={
              dashboardSummary.previousPending
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <DashboardKpiCard
            title="Sales"
            value={
              dashboardSummary.sales
            }
            previousValue={
              dashboardSummary.previousSales
            }
            formatter={formatCurrency}
          />
        </Grid>
      </Grid>

      {/* ===================================================
          COMPLETION SUMMARY
      =================================================== */}

      <Grid
        container
        spacing={2}
        sx={{ mt: 0 }}
      >
        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <DashboardSection
            title="Order Completion"
            subtitle="Current period completion rate"
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="h3"
                  fontWeight={800}
                >
                  {completionRate}%
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {formatNumber(
                    dashboardSummary.completed
                  )}{" "}
                  of{" "}
                  {formatNumber(
                    dashboardSummary.orders
                  )}{" "}
                  orders completed
                </Typography>
              </Box>

              <Typography
                variant="h2"
                fontWeight={800}
              >
                ✓
              </Typography>
            </Stack>
          </DashboardSection>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
        >
          <DashboardSection
            title="Quick Summary"
            subtitle="Management overview"
          >
            <Grid
              container
              spacing={2}
            >
              <Grid size={4}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Orders
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {formatNumber(
                    dashboardSummary.orders
                  )}
                </Typography>
              </Grid>

              <Grid size={4}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Completed
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {formatNumber(
                    dashboardSummary.completed
                  )}
                </Typography>
              </Grid>

              <Grid size={4}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Sales
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {formatCurrency(
                    dashboardSummary.sales
                  )}
                </Typography>
              </Grid>
            </Grid>
          </DashboardSection>
        </Grid>
      </Grid>

      {/* ===================================================
          ORDER TREND
      =================================================== */}

      <Grid
        container
        spacing={2}
        sx={{ mt: 0 }}
      >
        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
        >
          <DashboardSection
            title="Weekly Orders"
            subtitle="Orders received vs completed"
          >
            <Box
              sx={{
                width: "100%",
                height: 350,
              }}
            >
              <ResponsiveContainer>
                <BarChart
                  data={weeklyOrders}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="week"
                  />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="orders"
                    name="Orders Received"
                  />

                  <Bar
                    dataKey="completed"
                    name="Completed"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </DashboardSection>
        </Grid>

        {/* =================================================
            DIVISION ORDERS
        ================================================= */}

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <DashboardSection
            title="Orders by Division"
            subtitle="Division-wise order distribution"
          >
            <Box
              sx={{
                width: "100%",
                height: 350,
              }}
            >
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={divisionData}
                    dataKey="orders"
                    nameKey="division"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >
                    {divisionData.map(
                      (entry) => (
                        <Cell
                          key={
                            entry.division
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </DashboardSection>
        </Grid>
      </Grid>

      {/* ===================================================
          SALES TREND
      =================================================== */}

      <Grid
        container
        spacing={2}
        sx={{ mt: 0 }}
      >
        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
        >
          <DashboardSection
            title="Weekly Sales"
            subtitle="Sales value by week"
          >
            <Box
              sx={{
                width: "100%",
                height: 350,
              }}
            >
              <ResponsiveContainer>
                <LineChart
                  data={weeklySales}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="week"
                  />

                  <YAxis
                    tickFormatter={(value) =>
                      `₹${(
                        value / 100000
                      ).toFixed(0)}L`
                    }
                  />

                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(value)
                    }
                  />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="sales"
                    name="Sales"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </DashboardSection>
        </Grid>

        {/* =================================================
            DIVISION PERFORMANCE
        ================================================= */}

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <DashboardSection
            title="Division Performance"
            subtitle="Orders and completion"
          >
            <Stack spacing={2}>
              {filteredDivisionData.map(
                (item) => {
                  const rate =
                    item.orders
                      ? (
                          (item.completed /
                            item.orders) *
                          100
                        ).toFixed(1)
                      : 0;

                  return (
                    <Box
                      key={
                        item.division
                      }
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Typography
                          fontWeight={700}
                        >
                          {item.division}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {rate}% complete
                        </Typography>
                      </Stack>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                        }}
                      >
                        {formatNumber(
                          item.orders
                        )}{" "}
                        orders ·{" "}
                        {formatNumber(
                          item.completed
                        )}{" "}
                        completed
                      </Typography>

                      <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{
                          mt: 0.5,
                        }}
                      >
                        {formatCurrency(
                          item.sales
                        )}
                      </Typography>

                      <Divider
                        sx={{
                          mt: 1.5,
                        }}
                      />
                    </Box>
                  );
                }
              )}

              {!filteredDivisionData.length && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  No division data available.
                </Typography>
              )}
            </Stack>
          </DashboardSection>
        </Grid>
      </Grid>

      {/* ===================================================
          LOADING INDICATOR
      =================================================== */}

      {isLoading && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 2,
            textAlign: "center",
          }}
        >
          Updating analytics...
        </Typography>
      )}
    </Box>
  );
};

export default AnalysisPage;

