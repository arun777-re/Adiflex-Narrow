import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";

import {
  CalendarMonth,
  EventAvailable,
  History,
  DeleteOutline,
  Refresh,
  WarningAmber,
} from "@mui/icons-material";

import {
  getAllHolidays,
  deleteHoliday,
} from "../../redux/slices/holidaySlice";

const ViewHoliday = () => {
  const dispatch = useDispatch();

  const {
    holidays = [],
    loading,
    deleting,
    error,
  } = useSelector((state) => state.holiday);

  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    dispatch(getAllHolidays());
  }, [dispatch]);

  const todayString = new Date().toLocaleDateString("en-CA");

  const sortedHolidays = useMemo(() => {
    return [...holidays].sort((a, b) =>
      String(a.holiday_date).localeCompare(String(b.holiday_date))
    );
  }, [holidays]);

  const upcomingCount = sortedHolidays.filter(
    (holiday) => String(holiday.holiday_date).slice(0, 10) >= todayString
  ).length;

  const pastCount = sortedHolidays.length - upcomingCount;

  const formatDate = (date) => {
    if (!date) return "-";

    const dateString = String(date).slice(0, 10);
    const [year, month, day] = dateString.split("-");

    return `${day}-${month}-${year}`;
  };

  const handleDelete = async () => {
    if (!selectedHoliday) return;

    setDeletingId(selectedHoliday.id);
    setDeleteError("");

    try {
      await dispatch(deleteHoliday(selectedHoliday.id)).unwrap();
      setSelectedHoliday(null);
    } catch (err) {
      setDeleteError(
        typeof err === "string" ? err : "Failed to delete holiday."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const summaryCards = [
    {
      title: "Total Holidays",
      count: holidays.length,
      icon: <CalendarMonth />,
      color: "#1976d2",
      background: "#e3f2fd",
    },
    {
      title: "Upcoming Holidays",
      count: upcomingCount,
      icon: <EventAvailable />,
      color: "#2e7d32",
      background: "#e8f5e9",
    },
    {
      title: "Past Holidays",
      count: pastCount,
      icon: <History />,
      color: "#ed6c02",
      background: "#fff3e0",
    },
  ];

  return (
    <Box>
      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {summaryCards.map((item) => (
          <Card
            key={item.title}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    {item.title}
                  </Typography>

                  <Typography variant="h4" fontWeight={700} mt={1}>
                    {item.count}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: item.background,
                    color: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Holiday Table */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Company Holiday Calendar
            </Typography>

            <Typography variant="body2" color="text.secondary">
              View and manage all registered company holidays.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => dispatch(getAllHolidays())}
            disabled={loading}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Refresh
          </Button>
        </Box>

        <Divider />

        {error && (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">
              {typeof error === "string"
                ? error
                : "Unable to fetch holidays."}
            </Alert>
          </Box>
        )}

        {deleteError && (
          <Box sx={{ px: 2, pt: 2 }}>
            <Alert severity="error" onClose={() => setDeleteError("")}>
              {deleteError}
            </Alert>
          </Box>
        )}

        {loading ? (
          <Box
            sx={{
              minHeight: 250,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <CircularProgress size={25} />
            <Typography color="text.secondary">
              Loading holidays...
            </Typography>
          </Box>
        ) : holidays.length === 0 ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <CalendarMonth
              sx={{ fontSize: 55, color: "text.disabled", mb: 1 }}
            />

            <Typography variant="h6" fontWeight={600}>
              No holidays found
            </Typography>

            <Typography color="text.secondary" variant="body2">
              Add your first company holiday to get started.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Holiday Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Holiday Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {sortedHolidays.map((holiday, index) => {
                  const isPast =
                    String(holiday.holiday_date).slice(0, 10) < todayString;

                  return (
                    <TableRow
                      key={holiday.id}
                      hover
                    >
                      <TableCell>{index + 1}</TableCell>

                      <TableCell>
                        <Typography fontWeight={600}>
                          {holiday.holiday_name}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {formatDate(holiday.holiday_date)}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ maxWidth: 260 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={holiday.description || ""}
                        >
                          {holiday.description || "-"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={isPast ? "Past" : "Upcoming"}
                          color={isPast ? "default" : "success"}
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Tooltip title="Delete Holiday">
                          <span>
                            <IconButton
                              color="error"
                              size="small"
                              disabled={deleting && deletingId === holiday.id}
                              onClick={() => setSelectedHoliday(holiday)}
                            >
                              {deleting && deletingId === holiday.id ? (
                                <CircularProgress size={19} />
                              ) : (
                                <DeleteOutline />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && holidays.length > 0 && (
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Showing {holidays.length} holidays
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(selectedHoliday)}
        onClose={() => !deleting && setSelectedHoliday(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <WarningAmber color="error" />
            <Typography fontWeight={700}>
              Delete Holiday?
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to delete{" "}
            <strong>{selectedHoliday?.holiday_name}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setSelectedHoliday(null)}
            disabled={deleting}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleting}
            startIcon={
              deleting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteOutline />
              )
            }
            sx={{ textTransform: "none" }}
          >
            {deleting ? "Deleting..." : "Delete Holiday"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewHoliday;