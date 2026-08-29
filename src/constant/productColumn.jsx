import React from "react";

import { Box, Button, Chip } from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";

export const productColumns = ({
  handleEdit,
  handleStatus,
}) => [
  {
    field: "sku",
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
    field: "unit",
    headerName: "Unit",
    width: 100,
  },

  {
    field: "meterPerKG",
    headerName: "Meter/Kg",
    width: 100,
  },

  {
    field: "meterPerRoll",
    headerName: "Meter/Roll",
    width: 100,
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
    field: "status",
    headerName: "Status",
    width: 120,

    renderCell: (params) => (
      <Chip
        size="small"
        label={params.value}
        color={
          params.value === "Active"
            ? "success"
            : "error"
        }
      />
    ),
  },

  {
    field: "updatedBy",
    headerName: "Updated By",
    width: 150,
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

    renderCell: (params) => (
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
            handleEdit(params.row.sku)
          }
        >
          Edit
        </Button>

        {/* STATUS */}

        <Button
          size="small"
          variant="contained"
          color={
            params.row.status === "Active"
              ? "error"
              : "success"
          }
          startIcon={
            <PowerSettingsNewRoundedIcon />
          }
          onClick={() =>
            handleStatus(
              params.row.sku,
              params.row.status
            )
          }
        >
          {params.row.status === "Active"
            ? "Deactivate"
            : "Activate"}
        </Button>
      </Box>
    ),
  },
];