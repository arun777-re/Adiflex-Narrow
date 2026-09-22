import { useMemo, useState } from "react";

import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  Pagination,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import SalesOrderCard from "./SalesOrderCard";

const SalesOrderCards = ({
  rows = [],
  loading = false,
  onEdit,
}) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // -----------------------------------------
  // PAGINATION
  // -----------------------------------------

  const totalPages = Math.ceil(
    rows.length / rowsPerPage
  );

  const paginatedRows = useMemo(() => {
    const startIndex =
      (page - 1) * rowsPerPage;

    const endIndex =
      startIndex + rowsPerPage;

    return rows.slice(startIndex, endIndex);
  }, [rows, page, rowsPerPage]);

  // -----------------------------------------
  // PAGE CHANGE
  // -----------------------------------------

  const handlePageChange = (_, value) => {
    setPage(value);

    // Scroll to top of cards
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // -----------------------------------------
  // ROWS PER PAGE
  // -----------------------------------------

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = Number(event.target.value);

    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  // -----------------------------------------
  // EMPTY
  // -----------------------------------------

  if (!rows.length) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="text.secondary">
          No Sales Orders Found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* ---------------------------------------
          TOP PAGINATION CONTROLS
      --------------------------------------- */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        spacing={2}
        mb={2}
      >
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Showing{" "}
          <strong>
            {(page - 1) * rowsPerPage + 1}
          </strong>{" "}
          -{" "}
          <strong>
            {Math.min(
              page * rowsPerPage,
              rows.length
            )}
          </strong>{" "}
          of <strong>{rows.length}</strong> orders
        </Typography>

        <FormControl
          size="small"
          sx={{
            minWidth: 130,
          }}
        >
          <InputLabel>
            Per Page
          </InputLabel>

          <Select
            value={rowsPerPage}
            label="Per Page"
            onChange={handleRowsPerPageChange}
          >
            <MenuItem value={10}>
              10
            </MenuItem>

            <MenuItem value={20}>
              20
            </MenuItem>

            <MenuItem value={30}>
              30
            </MenuItem>

            <MenuItem value={50}>
              50
            </MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* ---------------------------------------
          CARDS
      --------------------------------------- */}

      <Grid
        container
        spacing={2}
      >
        {paginatedRows.map((row, index) => (
          <Grid
            item
            key={`${row.soNo}-${row.product}-${index}`}
            xs={12}
            sm={6}
            lg={4}
          >
            <SalesOrderCard
              row={row}
              onEdit={onEdit}
            />
          </Grid>
        ))}
      </Grid>

      {/* ---------------------------------------
          BOTTOM PAGINATION
      --------------------------------------- */}

      {totalPages > 1 && (
        <Stack
          alignItems="center"
          mt={3}
          mb={2}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Stack>
      )}
    </Box>
  );
};

export default SalesOrderCards;