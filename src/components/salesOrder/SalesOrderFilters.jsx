import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "Pending", label: "Pending" },
  { value: "Production", label: "Production" },
  { value: "Printing", label: "Printing" },
  { value: "Packing", label: "Packing" },
  { value: "Dispatch", label: "Dispatch" },
  { value: "Completed", label: "Completed" },
];

const SalesOrderFilters = ({
  filters,
  onChange,
  onReset,
}) => {
  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        bgcolor: "#fff",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Grid container spacing={2}>
        {/* Search */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Search"
            placeholder="SO No / Customer / Product"
            name="search"
            value={filters.search}
            onChange={onChange}
          />
        </Grid>

        {/* Date */}
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            type="date"
            label="Date"
            name="date"
            value={filters.date}
            onChange={onChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        {/* Status */}
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            select
            label="Status"
            name="status"
            value={filters.status}
            onChange={onChange}
          >
            {statusOptions.map((status) => (
              <MenuItem
                key={status.value}
                value={status.value}
              >
                {status.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Reset */}
        <Grid
          size={{ xs: 12, md: 2 }}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            startIcon={<RestartAltRoundedIcon />}
            onClick={onReset}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesOrderFilters;