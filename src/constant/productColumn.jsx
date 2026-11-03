import { Box, Button, Chip } from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";

export const productColumns = ({
  handleEdit,
  handleStatus,
}) => [
  {
    field: "skucode",
    headerName: "SKU Code",
    width: 120,
  },

  {
    field: "productName",
    headerName: "Product Name",
    flex: 1,
    minWidth: 220,
  },

  {
    field: "division",
    headerName: "Division",
    width: 120,
  },

  {
    field: "basicUnit",
    headerName: "Unit",
    width: 100,
  },

  {
    field: "meterPerKg",
    headerName: "Meter/Kg",
    width: 100,
  },

  {
    field: "meterPerRoll",
    headerName: "Meter/Roll",
    width: 110,
  },

  {
    field: "color",
    headerName: "Color",
    width: 120,
  },

  {
    field: "size",
    headerName: "Size",
    width: 100,
  },

  {
    field: "rate",
    headerName: "Rate",
    width: 100,

    valueFormatter: (value) =>
      value !== null &&
      value !== undefined &&
      value !== ""
        ? Number(value).toFixed(2)
        : "",
  },

  {
    field: "status",
    headerName: "Status",
    width: 120,

    renderCell: (params) => {
      const status = String(params.value || "").toUpperCase();

      return (
        <Chip
          size="small"
          label={status}
          color={
            status === "ACTIVE"
              ? "success"
              : "error"
          }
        />
      );
    },
  },

  {
    field: "updatedAt",
    headerName: "Updated At",
    width: 180,

    valueFormatter: (value) =>
      value
        ? new Date(value).toLocaleString("en-IN")
        : "",
  },

  // ==========================================
  // ACTIONS
  // ==========================================

  {
    field: "actions",
    headerName: "Actions",
    width: 230,
    sortable: false,
    filterable: false,

    renderCell: (params) => {
      const status = String(
        params.row.status || ""
      ).toUpperCase();

      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* EDIT */}

          <Button
            size="small"
            variant="outlined"
            startIcon={<EditRoundedIcon />}
            onClick={() =>
              handleEdit(params.row.skucode)
            }
          >
            Edit
          </Button>

          {/* STATUS */}

          <Button
            size="small"
            variant="contained"
            color={
              status === "ACTIVE"
                ? "error"
                : "success"
            }
            startIcon={
              <PowerSettingsNewRoundedIcon />
            }
            onClick={() =>
              handleStatus(
                params.row.skucode,
                status
              )
            }
          >
            {status === "ACTIVE"
              ? "Deactivate"
              : "Activate"}
          </Button>
        </Box>
      );
    },
  },
];

