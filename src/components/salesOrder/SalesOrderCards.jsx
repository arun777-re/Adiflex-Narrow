
import { Box, CircularProgress, Grid, Typography } from "@mui/material";

import SalesOrderCard from "./SalesOrderCard";

const SalesOrderCards = ({ rows = [], loading = false }) => {
  if (loading) {
    return (
      <Box
        sx={{
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!rows.length) {
    return (
      <Box
        sx={{
          height: 300,
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
    <Grid container spacing={2}>
      {rows.map((row, index) => (
        <Grid
          item
          key={`${row.soNo}-${row.product}-${index}`}
          xs={12}
          sm={6}
          lg={4}
        >
          <SalesOrderCard row={row} />
        </Grid>
      ))}
    </Grid>
  );
};

export default SalesOrderCards;
