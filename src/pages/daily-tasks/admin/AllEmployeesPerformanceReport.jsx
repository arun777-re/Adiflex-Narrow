
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  Grid,
  Divider,
  TextField,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { getAllEmployeesPerformance } from "../../../redux/slices/dailyTask.slice";

// =========================================================
// HELPERS
// =========================================================

const formatNumber = (value) => {
  return Number(value || 0).toLocaleString("en-IN");
};

const formatPercentage = (value, negative = false) => {
  const number = Number(value || 0);
  const formatted = Math.abs(number).toFixed(2);

  return `${negative ? "-" : ""}${formatted}%`;
};

// =========================================================
// COMPONENT
// =========================================================

const AllEmployeesPerformanceReport = ({ onBack }) => {
  const dispatch = useDispatch();

  // =======================================================
  // REDUX
  // =======================================================

  const {
    allEmployeesPerformance = [],
    performanceSummary = null,
    performanceLoading = false,
    error = null,
  } = useSelector((state) => state.dailyTask);

  // =======================================================
  // LOCAL STATE
  // =======================================================

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [validationError, setValidationError] = useState("");

  // =======================================================
  // SEARCH ALL EMPLOYEES
  // =======================================================

  const handleSearch = async () => {
    setValidationError("");

    if (!startDate || !endDate) {
      setValidationError("Please select both start date and end date.");
      return;
    }

    if (startDate > endDate) {
      setValidationError("Start date cannot be greater than end date.");
      return;
    }

    try {
      setHasSearched(true);

      await dispatch(
        getAllEmployeesPerformance({
          startDate,
          endDate,
        })
      ).unwrap();
    } catch (err) {
      console.error("All employees performance error:", err);
    }
  };

  // =======================================================
  // EMPLOYEE ROWS
  // =======================================================

  const employees = useMemo(() => {
    return (allEmployeesPerformance || []).map((employee, index) => ({
      ...employee,
      id: employee.userID || `employee-${index}`,
    }));
  }, [allEmployeesPerformance]);

  // =======================================================
  // SUMMARY
  // =======================================================

  const summary = useMemo(() => {
    return {
      totalEmployees: Number(performanceSummary?.totalEmployees || 0),
      assigned: Number(performanceSummary?.assigned || 0),
      completed: Number(performanceSummary?.completed || 0),
      notDone: Number(performanceSummary?.notDone || 0),
      notDonePercentage: Number(
        performanceSummary?.notDonePercentage || 0
      ),
      completionPercentage: Number(
        performanceSummary?.completionPercentage || 0
      ),
    };
  }, [performanceSummary]);

  // =======================================================
  // PRINT
  // =======================================================

  const handlePrint = () => {
    window.print();
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <Box>
      {/* =================================================
          SCREEN HEADER
      ================================================= */}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{
          mb: 3,
          "@media print": {
            display: "none",
          },
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            All Employees Performance
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Complete employee task performance report
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          {onBack && (
            <Button variant="outlined" onClick={onBack}>
              Back
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            disabled={!hasSearched || performanceLoading || employees.length === 0}
          >
            Print Report
          </Button>
        </Stack>
      </Stack>

      {/* =================================================
          DATE FILTER
      ================================================= */}

      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          "@media print": {
            display: "none",
          },
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <TextField
            size="small"
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            size="small"
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <Button
            variant="contained"
            startIcon={
              performanceLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SearchIcon />
              )
            }
            onClick={handleSearch}
            disabled={performanceLoading || !startDate || !endDate}
          >
            {performanceLoading ? "Loading..." : "Generate Report"}
          </Button>
        </Stack>

        {(validationError || error) && (
          <Typography color="error" variant="body2" sx={{ mt: 1.5 }}>
            {validationError || error}
          </Typography>
        )}
      </Paper>

      {/* =================================================
          PRINTABLE REPORT
      ================================================= */}

      <Box
        id="employee-performance-print"
        sx={{
          width: "100%",
          "@media print": {
            width: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            p: 1,
          },
        }}
      >
        {/* REPORT TITLE */}

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h5"
            fontWeight={800}
            textAlign="center"
            sx={{ mb: 0.5 }}
          >
            EMPLOYEE PERFORMANCE REPORT
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
          >
            Adiflex ERP
          </Typography>

          <Typography
            variant="body2"
            fontWeight={600}
            textAlign="center"
            sx={{ mt: 1 }}
          >
            Reporting Period: {startDate || "--"} to {endDate || "--"}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* SUMMARY CARDS */}

        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 1.5, height: "100%" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AssessmentIcon color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Employees
                  </Typography>
                  <Typography variant="h6" fontWeight={800}>
                    {formatNumber(summary.totalEmployees)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 1.5, height: "100%" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AssignmentTurnedInIcon color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Assigned
                  </Typography>
                  <Typography variant="h6" fontWeight={800}>
                    {formatNumber(summary.assigned)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 1.5, height: "100%" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircleIcon color="success" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Completed
                  </Typography>
                  <Typography variant="h6" fontWeight={800}>
                    {formatNumber(summary.completed)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 1.5, height: "100%" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <WarningAmberIcon color="error" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Not Done
                  </Typography>
                  <Typography variant="h6" fontWeight={800} color="error.main">
                    {formatNumber(summary.notDone)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* OVERALL PERFORMANCE */}

        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            mb: 2,
            borderRadius: 2,
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Overall Not Done Percentage
              </Typography>

              <Typography
                variant="h5"
                fontWeight={800}
                color="error.main"
              >
                {formatPercentage(summary.notDonePercentage, true)}
              </Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Overall Completion Percentage
              </Typography>

              <Typography
                variant="h5"
                fontWeight={800}
                color="success.main"
              >
                {Number(summary.completionPercentage || 0).toFixed(2)}%
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* EMPLOYEE TABLE */}

        <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
          Employee Wise Performance
        </Typography>

        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            borderRadius: 1,
            overflow: "visible",
          }}
        >
          <Table
            size="small"
            sx={{
              minWidth: 650,
              "& th": {
                fontWeight: 800,
                fontSize: "0.72rem",
                backgroundColor: "#eeeeee",
                color: "#111",
                whiteSpace: "nowrap",
              },
              "& td": {
                fontSize: "0.75rem",
                py: 1,
              },
              "& th, & td": {
                border: "1px solid #bdbdbd",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell align="center">S. NO.</TableCell>
                <TableCell>EMPLOYEE NAME</TableCell>
                <TableCell>USER ID</TableCell>
                <TableCell>DEPARTMENT</TableCell>
                <TableCell align="center">ASSIGNED</TableCell>
                <TableCell align="center">DONE</TableCell>
                <TableCell align="center">NOT DONE</TableCell>
                <TableCell align="center">NOT DONE %</TableCell>
                <TableCell align="center">COMPLETION %</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    {performanceLoading
                      ? "Loading employee report..."
                      : hasSearched
                        ? "No employee records found"
                        : "Select date range and generate report"}
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee, index) => (
                  <TableRow key={employee.id}>
                    <TableCell align="center">{index + 1}</TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        {employee.employeeName || "--"}
                      </Typography>
                    </TableCell>

                    <TableCell>{employee.userID || "--"}</TableCell>

                    <TableCell>{employee.department || "--"}</TableCell>

                    <TableCell align="center">
                      {formatNumber(employee.assigned)}
                    </TableCell>

                    <TableCell align="center">
                      <Typography color="success.main" fontWeight={700}>
                        {formatNumber(employee.completed)}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography color="error.main" fontWeight={700}>
                        {formatNumber(employee.notDone)}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography color="error.main" fontWeight={800}>
                        {formatPercentage(employee.notDonePercentage, true)}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography color="success.main" fontWeight={700}>
                        {Number(employee.completionPercentage || 0).toFixed(2)}%
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* REPORT FOOTER */}

        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ mt: 3, pt: 1, borderTop: "1px solid #bdbdbd" }}
        >
          <Typography variant="caption">
            Total Employees: {employees.length}
          </Typography>

          <Typography variant="caption">
            Generated from Adiflex ERP
          </Typography>
        </Stack>
      </Box>

      {/* =================================================
          PRINT CSS
      ================================================= */}

      <style>
        {`
          @media print {
            @page {
              size: A4 landscape;
              margin: 10mm;
            }

            body * {
              visibility: hidden !important;
            }

            #employee-performance-print,
            #employee-performance-print * {
              visibility: visible !important;
            }

            #employee-performance-print {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
            }

            #employee-performance-print .MuiPaper-root {
              box-shadow: none !important;
            }

            #employee-performance-print table {
              width: 100% !important;
              border-collapse: collapse !important;
            }

            #employee-performance-print th,
            #employee-performance-print td {
              padding: 5px 6px !important;
              font-size: 9px !important;
              color: #111 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            #employee-performance-print tr {
              break-inside: avoid !important;
            }

            #employee-performance-print .MuiTypography-root {
              color: #111;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default AllEmployeesPerformanceReport;
