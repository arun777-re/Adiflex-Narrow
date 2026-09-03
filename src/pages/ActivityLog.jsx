import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Assessment,
  CheckCircle,
  ErrorOutline,
  NotificationsActive,
  Refresh,
  TrendingUp,
} from "@mui/icons-material";

import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import { getAllActivities } from "../redux/slices/activitySlice";

const ActivityLog = () => {
  const dispatch = useDispatch();

  const { activities = [], loading, error } = useSelector(
    (state) => state.activity
  );

  // =========================================================
  // GET TODAY DATE - DD/MM/YYYY
  // =========================================================

  const getTodayDate = () => {
    const today = new Date();

    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
  };

  // =========================================================
  // STATE
  // =========================================================

  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  // =========================================================
  // FETCH ACTIVITIES
  // =========================================================

  useEffect(() => {
    dispatch(getAllActivities(selectedDate));
  }, [dispatch, selectedDate]);

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = () => {
    dispatch(getAllActivities(selectedDate));
  };

  // =========================================================
  // SUMMARY
  // =========================================================

  const summary = useMemo(() => {
    const total = activities.length;

    const unread = activities.filter(
      (activity) =>
        String(activity.Read).toUpperCase() === "FALSE"
    ).length;

    const read = activities.filter(
      (activity) =>
        String(activity.Read).toUpperCase() === "TRUE"
    ).length;

    const salesOrders = activities.filter(
      (activity) =>
        String(activity.Type).toLowerCase() === "sales-order"
    ).length;

    return {
      total,
      unread,
      read,
      salesOrders,
    };
  }, [activities]);

  // =========================================================
  // FORMAT CREATED AT
  // =========================================================

  const formatActivityDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        p: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },
      }}
    >
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              color: "#1f2937",
            }}
          >
            Activity Log
          </Typography>

          <Typography
            component="div"
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Monitor system activities and notifications
          </Typography>
        </Box>

        {/* DATE + REFRESH */}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <Select
            size="small"
            value={selectedDate}
            onChange={(event) =>
              setSelectedDate(event.target.value)
            }
            sx={{
              minWidth: 155,
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          >
            <MenuItem value={getTodayDate()}>
              Today
            </MenuItem>

            <MenuItem value="02/09/2026">
              02/09/2026
            </MenuItem>

            <MenuItem value="01/09/2026">
              01/09/2026
            </MenuItem>

            <MenuItem value="31/08/2026">
              31/08/2026
            </MenuItem>

            <MenuItem value="30/08/2026">
              30/08/2026
            </MenuItem>

            <MenuItem value="29/08/2026">
              29/08/2026
            </MenuItem>

            <MenuItem value="28/08/2026">
              28/08/2026
            </MenuItem>

            <MenuItem value="27/08/2026">
              27/08/2026
            </MenuItem>
          </Select>

          <IconButton
            onClick={handleRefresh}
            disabled={loading}
            sx={{
              width: 40,
              height: 40,
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",

              "&:hover": {
                backgroundColor: "#f8fafc",
              },
            }}
          >
            <Refresh />
          </IconButton>
        </Stack>
      </Stack>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 3,
        }}
      >
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Total Activities"
            value={summary.total}
            icon={<Assessment />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Unread"
            value={summary.unread}
            icon={<NotificationsActive />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Read"
            value={summary.read}
            icon={<CheckCircle />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Sales Orders"
            value={summary.salesOrders}
            icon={<TrendingUp />}
          />
        </Grid>
      </Grid>

      {/* =====================================================
          ACTIVITY REPORT
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* REPORT HEADER */}

        <Box
          sx={{
            px: {
              xs: 2,
              md: 3,
            },
            py: 2,
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              sm: "center",
            }}
            spacing={1}
          >
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                Activity Report
              </Typography>

              <Typography
                component="div"
                variant="caption"
                color="text.secondary"
              >
                Activities for {selectedDate}
              </Typography>
            </Box>

            <Chip
              label={`${activities.length} Activities`}
              size="small"
              variant="outlined"
            />
          </Stack>
        </Box>

        <Divider />

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <Box
            sx={{
              minHeight: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Stack
              alignItems="center"
              spacing={1.5}
            >
              <CircularProgress size={32} />

              <Typography
                component="div"
                variant="body2"
                color="text.secondary"
              >
                Loading activities...
              </Typography>
            </Stack>
          </Box>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {!loading && error && (
          <Box
            sx={{
              minHeight: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              px: 2,
            }}
          >
            <Stack
              alignItems="center"
              spacing={1}
            >
              <ErrorOutline
                sx={{
                  fontSize: 48,
                  color: "error.main",
                }}
              />

              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="error"
              >
                Failed to load activities
              </Typography>

              <Typography
                component="div"
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                {error}
              </Typography>
            </Stack>
          </Box>
        )}

        {/* ===================================================
            EMPTY STATE
        =================================================== */}

        {!loading &&
          !error &&
          activities.length === 0 && (
            <Box
              sx={{
                minHeight: 300,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                px: 2,
              }}
            >
              <Stack
                alignItems="center"
                spacing={1}
              >
                <Assessment
                  sx={{
                    fontSize: 52,
                    color: "text.disabled",
                  }}
                />

                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="text.secondary"
                >
                  No activities found
                </Typography>

                <Typography
                  component="div"
                  variant="body2"
                  color="text.disabled"
                  textAlign="center"
                >
                  There are no activities recorded for{" "}
                  {selectedDate}.
                </Typography>
              </Stack>
            </Box>
          )}

        {/* ===================================================
            ACTIVITY LIST
        =================================================== */}

        {!loading &&
          !error &&
          activities.length > 0 && (
            <Box>
              {activities.map((activity, index) => {
                const isUnread =
                  String(activity.Read).toUpperCase() ===
                  "FALSE";

                return (
                  <Box
                    key={activity.ID || index}
                    sx={{
                      px: {
                        xs: 2,
                        md: 3,
                      },
                      py: 2.2,

                      borderBottom:
                        index !== activities.length - 1
                          ? "1px solid #f0f0f0"
                          : "none",

                      backgroundColor: isUnread
                        ? "#fafcff"
                        : "#fff",

                      transition: "background-color 0.2s",

                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                    }}
                  >
                    <Stack
                      direction={{
                        xs: "column",
                        md: "row",
                      }}
                      spacing={2}
                      justifyContent="space-between"
                    >
                      {/* LEFT CONTENT */}

                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                        sx={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        {/* ICON */}

                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            minWidth: 42,
                            borderRadius: 2,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            backgroundColor: isUnread
                              ? "#eef4ff"
                              : "#f3f4f6",
                          }}
                        >
                          <NotificationsActive
                            fontSize="small"
                          />
                        </Box>

                        {/* ACTIVITY DETAILS */}

                        <Box
                          sx={{
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          {/* TITLE */}

                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            flexWrap="wrap"
                          >
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              sx={{
                                color: "#1f2937",
                              }}
                            >
                              {activity.Title ||
                                "Activity"}
                            </Typography>

                            {isUnread && (
                              <Chip
                                label="Unread"
                                size="small"
                                color="primary"
                                sx={{
                                  height: 21,
                                  fontSize: 11,
                                }}
                              />
                            )}
                          </Stack>

                          {/* MESSAGE */}

                          <Typography
                            component="div"
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mt: 0.5,
                              wordBreak: "break-word",
                            }}
                          >
                            {activity.Message || "-"}
                          </Typography>

                          {/* META */}

                          <Stack
                            direction="row"
                            spacing={0.8}
                            mt={1}
                            flexWrap="wrap"
                            useFlexGap
                          >
                            {activity.Role && (
                              <Chip
                                label={activity.Role}
                                size="small"
                                variant="outlined"
                                sx={{
                                  height: 24,
                                  fontSize: 11,
                                }}
                              />
                            )}

                            {activity.Division && (
                              <Chip
                                label={activity.Division}
                                size="small"
                                variant="outlined"
                                sx={{
                                  height: 24,
                                  fontSize: 11,
                                }}
                              />
                            )}

                            {activity.Type && (
                              <Chip
                                label={activity.Type}
                                size="small"
                                variant="outlined"
                                sx={{
                                  height: 24,
                                  fontSize: 11,
                                }}
                              />
                            )}

                            {activity.Reference && (
                              <Chip
                                label={`Ref: ${activity.Reference}`}
                                size="small"
                                variant="outlined"
                                sx={{
                                  height: 24,
                                  fontSize: 11,
                                }}
                              />
                            )}
                          </Stack>
                        </Box>
                      </Stack>

                      {/* CREATED AT */}

                      <Box
                        sx={{
                          minWidth: {
                            md: 155,
                          },
                          textAlign: {
                            xs: "left",
                            md: "right",
                          },
                        }}
                      >
                        <Typography
                          component="div"
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatActivityDate(
                            activity["Created At"]
                          )}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          )}
      </Paper>
    </Box>
  );
};

// =============================================================
// SUMMARY CARD
// =============================================================

const SummaryCard = ({ title, value, icon }) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        backgroundColor: "#fff",
      }}
    >
      <CardContent
        sx={{
          p: 2.2,

          "&:last-child": {
            pb: 2.2,
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
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                mt: 0.5,
                color: "#1f2937",
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 45,
              height: 45,
              borderRadius: 2,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              backgroundColor: "#f3f4f6",
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;