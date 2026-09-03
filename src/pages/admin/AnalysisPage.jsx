
import { useEffect, useMemo, useState } from "react";

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
  Skeleton,
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

const PERIOD_OPTIONS = [
  { value: "all", label: "All Data" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

const DIVISION_OPTIONS = [
  { value: DIVISION_TOTAL, label: "All Divisions" },
  { value: "WOVEN", label: "Woven" },
  { value: "CROCHET", label: "Crochet" },
];

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const NUMBER_FORMATTER = new Intl.NumberFormat("en-IN");

/* =========================================================
   FORMATTERS
========================================================= */

const formatNumber = (value) => {
  return NUMBER_FORMATTER.format(Number(value) || 0);
};

const formatCurrency = (value) => {
  return `₹${CURRENCY_FORMATTER.format(Number(value) || 0)}`;
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
   REUSABLE CARD
========================================================= */

const DashboardCard = ({
  title,
  subtitle,
  children,
  sx = {},
}) => {
  return (
    <Card
      elevation={1}
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
        ...sx,
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          "&:last-child": {
            pb: 2,
          },
        }}
      >
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
            sx={{ mt: 0.25, mb: 2 }}
          >
            {subtitle}
          </Typography>
        )}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {children}
        </Box>
      </CardContent>
    </Card>
  );
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
    <DashboardCard>
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
        sx={{
          mt: 1,
          lineHeight: 1.2,
        }}
      >
        {formatter(value)}
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          mt: 1.5,
          flexWrap: "wrap",
          rowGap: 0.5,
        }}
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
    </DashboardCard>
  );
};

/* =========================================================
   CHART CONTAINER
========================================================= */

const ChartContainer = ({
  children,
  height = 320,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        height,
        minWidth: 0,
        minHeight: 0,
      }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        {children}
      </ResponsiveContainer>
    </Box>
  );
};

/* =========================================================
   FILTER COMPONENT
========================================================= */

const DashboardFilter = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <FormControl
      size="small"
      sx={{
        minWidth: {
          xs: 140,
          sm: 150,
        },
      }}
    >
      <InputLabel>{label}</InputLabel>

      <Select
        value={value}
        label={label}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

/* =========================================================
   HEADER
========================================================= */

const DashboardHeader = ({
  period,
  division,
  onPeriodChange,
  onDivisionChange,
}) => {
  return (
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
        sx={{
          width: {
            xs: "100%",
            md: "auto",
          },
          flexWrap: "wrap",
          rowGap: 1,
        }}
      >
        <DashboardFilter
          label="Period"
          value={period}
          options={PERIOD_OPTIONS}
          onChange={onPeriodChange}
        />

        <DashboardFilter
          label="Division"
          value={division}
          options={DIVISION_OPTIONS}
          onChange={onDivisionChange}
        />
      </Stack>
    </Stack>
  );
};

/* =========================================================
   KPI SECTION
========================================================= */

const KpiGrid = ({ summary }) => {
  const cards = [
    {
      title: "Orders Received",
      value: summary.orders,
      previousValue: summary.previousOrders,
    },
    {
      title: "Orders Completed",
      value: summary.completed,
      previousValue: summary.previousCompleted,
    },
    {
      title: "Pending Orders",
      value: summary.pending,
      previousValue: summary.previousPending,
    },
    {
      title: "Sales",
      value: summary.sales,
      previousValue: summary.previousSales,
      formatter: formatCurrency,
    },
  ];

  return (
    <Grid
      container
      spacing={2}
    >
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
          sx={{
            display: "flex",
            minWidth: 0,
          }}
        >
          <DashboardKpiCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

/* =========================================================
   COMPLETION CARD
========================================================= */

const CompletionCard = ({ summary }) => {
  const completionRate = summary.orders
    ? (
        (summary.completed /
          summary.orders) *
        100
      ).toFixed(1)
    : 0;

  return (
    <DashboardCard
      title="Order Completion"
      subtitle="Current period completion rate"
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ height: "100%" }}
      >
        <Box>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              lineHeight: 1.1,
            }}
          >
            {completionRate}%
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            {formatNumber(summary.completed)}{" "}
            of{" "}
            {formatNumber(summary.orders)}{" "}
            orders completed
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: {
              xs: 40,
              sm: 48,
            },
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          ✓
        </Typography>
      </Stack>
    </DashboardCard>
  );
};

/* =========================================================
   QUICK SUMMARY
========================================================= */

const QuickSummaryCard = ({ summary }) => {
  const items = [
    {
      label: "Orders",
      value: formatNumber(summary.orders),
    },
    {
      label: "Completed",
      value: formatNumber(summary.completed),
    },
    {
      label: "Sales",
      value: formatCurrency(summary.sales),
    },
  ];

  return (
    <DashboardCard
      title="Quick Summary"
      subtitle="Management overview"
    >
      <Grid
        container
        spacing={2}
        sx={{
          height: "100%",
          alignItems: "center",
        }}
      >
        {items.map((item) => (
          <Grid
            key={item.label}
            size={{
              xs: 4,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              {item.label}
            </Typography>

            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                mt: 0.5,
                wordBreak: "break-word",
              }}
            >
              {item.value}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </DashboardCard>
  );
};

/* =========================================================
   ORDERS CHART
========================================================= */

const OrdersChart = ({ data }) => {
  return (
    <ChartContainer>
      <BarChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0,
        }}
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
          dataKey="received"
          name="Orders Received"
        />

        <Bar
          dataKey="completed"
          name="Completed"
        />
      </BarChart>
    </ChartContainer>
  );
};

/* =========================================================
   DIVISION PIE CHART
========================================================= */

const DivisionPieChart = ({ data }) => {
  return (
    <ChartContainer>
      <PieChart>
        <Pie
          data={data}
          dataKey="orders"
          nameKey="division"
          cx="50%"
          cy="50%"
          outerRadius={95}
          label
        >
          {data.map((entry) => (
            <Cell
              key={entry.division}
            />
          ))}
        </Pie>

        <Tooltip />

        <Legend />
      </PieChart>
    </ChartContainer>
  );
};

/* =========================================================
   SALES CHART
========================================================= */

const SalesChart = ({ data }) => {
  return (
    <ChartContainer>
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0,
        }}
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
    </ChartContainer>
  );
};

/* =========================================================
   DIVISION PERFORMANCE
========================================================= */

const DivisionPerformance = ({
  data,
}) => {
  return (
    <DashboardCard
      title="Division Performance"
      subtitle="Orders and completion"
    >
      <Stack
        spacing={1.5}
        sx={{
          height: "100%",
          overflowY: "auto",
          pr: 0.5,
        }}
      >
        {data.map((item) => {
          const rate = item.orders
            ? (
                (item.completed /
                  item.orders) *
                100
              ).toFixed(1)
            : 0;

          return (
            <Box
              key={item.division}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <Typography
                  fontWeight={700}
                  noWrap
                >
                  {item.division}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {rate}% complete
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                sx={{ mt: 0.5 }}
              >
                {formatNumber(item.orders)}{" "}
                orders ·{" "}
                {formatNumber(item.completed)}{" "}
                completed
              </Typography>

              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ mt: 0.5 }}
              >
                {formatCurrency(item.sales)}
              </Typography>

              <Divider sx={{ mt: 1.25 }} />
            </Box>
          );
        })}

        {!data.length && (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            No division data available.
          </Typography>
        )}
      </Stack>
    </DashboardCard>
  );
};

/* =========================================================
   DATA HELPERS
========================================================= */

const createDivisionData = (
  divisionOrders,
  divisionSales
) => {
  const map = {};

  const ensureDivision = (
    division
  ) => {
    if (!map[division]) {
      map[division] = {
        division,
        orders: 0,
        completed: 0,
        sales: 0,
      };
    }

    return map[division];
  };

  divisionOrders.forEach((item) => {
    const division =
      item.division || "UNKNOWN";

    const target =
      ensureDivision(division);

    target.orders =
      Number(item.orders) || 0;

    target.completed =
      Number(item.completed) || 0;
  });

  divisionSales.forEach((item) => {
    const division =
      item.division || "UNKNOWN";

    const target =
      ensureDivision(division);

    target.sales =
      Number(item.sales) || 0;
  });

  return Object.values(map);
};

const createDashboardSummary = (
  summary
) => ({
  orders:
    Number(summary?.ordersReceived) || 0,

  completed:
    Number(summary?.ordersCompleted) || 0,

  pending:
    Number(summary?.pendingOrders) || 0,

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
    Number(summary?.previousSales) || 0,
});

/* =========================================================
   MAIN COMPONENT
========================================================= */

const AnalysisPage = () => {
  const dispatch = useDispatch();

  const [period, setPeriod] =
    useState("all");

  const [division, setDivision] =
    useState(DIVISION_TOTAL);

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
     FETCH
  ======================================================= */

  useEffect(() => {
    const params = {
      period,
      division,
    };

    dispatch(
      getAnalyticsSummary(params)
    );

    dispatch(
      getOrdersAnalytics(params)
    );

    dispatch(
      getSalesAnalytics(params)
    );
  }, [
    dispatch,
    period,
    division,
  ]);

  /* =======================================================
     DERIVED DATA
  ======================================================= */

  const dashboardSummary =
    useMemo(
      () =>
        createDashboardSummary(
          summary
        ),
      [summary]
    );

  const weeklyOrders =
    orders?.weekly || [];

  const weeklySales =
    sales?.weekly || [];

  const divisionData =
    useMemo(
      () =>
        createDivisionData(
          orders?.division || [],
          sales?.division || []
        ),
      [orders, sales]
    );

  const filteredDivisionData =
    useMemo(() => {
      if (
        division ===
        DIVISION_TOTAL
      ) {
        return divisionData;
      }

      return divisionData.filter(
        (item) =>
          item.division ===
          division
      );
    }, [
      divisionData,
      division,
    ]);

  const isLoading =
    Boolean(loading?.summary) ||
    Boolean(loading?.orders) ||
    Boolean(loading?.sales);

  const hasError =
    error?.summary ||
    error?.orders ||
    error?.sales;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        p: {
          xs: 1.5,
          sm: 2,
          md: 2.5,
        },
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {/* HEADER */}

      <DashboardHeader
        period={period}
        division={division}
        onPeriodChange={setPeriod}
        onDivisionChange={setDivision}
      />

      {/* ERROR */}

      {hasError && (
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
              sx={{ mt: 0.5 }}
            >
              {error.summary ||
                error.orders ||
                error.sales}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* KPI */}

      <KpiGrid
        summary={
          dashboardSummary
        }
      />

      {/* SUMMARY */}

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
          sx={{
            display: "flex",
            minWidth: 0,
          }}
        >
          <CompletionCard
            summary={
              dashboardSummary
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
          sx={{
            display: "flex",
            minWidth: 0,
          }}
        >
          <QuickSummaryCard
            summary={
              dashboardSummary
            }
          />
        </Grid>
      </Grid>

      {/* ORDERS */}

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
          sx={{
            display: "flex",
            minWidth: 0,
          }}
        >
          <DashboardCard
            title="Weekly Orders"
            subtitle="Orders received vs completed"
          >
            {weeklyOrders.length ? (
              <OrdersChart
                data={weeklyOrders}
              />
            ) : (
              <EmptyChart
                message="No weekly order data available"
              />
            )}
          </DashboardCard>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
          sx={{
            display: "flex",
            minWidth: 0,
          }}
        >
          <DashboardCard
            title="Orders by Division"
            subtitle="Division-wise order distribution"
          >
            {divisionData.length ? (
              <DivisionPieChart
                data={divisionData}
              />
            ) : (
              <EmptyChart
                message="No division order data available"
              />
            )}
          </DashboardCard>
        </Grid>
      </Grid>

      {/* SALES */}

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
          sx={{
            display: "flex",
            minWidth: 0,
          }}
        >
          <DashboardCard
            title="Weekly Sales"
            subtitle="Sales value by week"
          >
            {weeklySales.length ? (
              <SalesChart
                data={weeklySales}
              />
            ) : (
              <EmptyChart
                message="No weekly sales data available"
              />
            )}
          </DashboardCard>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
          sx={{
            display: "flex",
            minWidth: 0,
          }}
        >
          <DivisionPerformance
            data={
              filteredDivisionData
            }
          />
        </Grid>
      </Grid>

      {/* LOADING */}

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

/* =========================================================
   EMPTY CHART
========================================================= */

const EmptyChart = ({
  message,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: 320,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
      >
        {message}
      </Typography>
    </Box>
  );
};

export default AnalysisPage;

