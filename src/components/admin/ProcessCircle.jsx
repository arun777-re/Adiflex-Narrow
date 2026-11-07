
import { Box, Tooltip, Typography } from "@mui/material";

import {
  IDEAL_PROCESS_TIMES,
} from "../../config/productionProcess.config";

import {
  getProcessStatus,
} from "../../utils/productionStatus.utils";

import {
  formatDuration,
} from "../../utils/productionDate.utils";

const ProcessCircle = ({
  order,
  processConfig,
}) => {
  const status = getProcessStatus(
    order,
    processConfig
  );

  const stage = status.stage;

 
const circleStyles = {
  notStarted: {
    backgroundColor: "transparent",
    border: "2px solid #bdbdbd",
    color: "#9e9e9e",
  },

  notApplicable: {
    backgroundColor: "#f5f5f5",
    border: "2px solid #e0e0e0",
    color: "#bdbdbd",
  },

  running: {
    backgroundColor: "#fff8e1",
    border: "3px solid #f9a825",
    color: "#f57f17",
  },

  partiallyReleased: {
    backgroundColor: "#fff3e0",
    border: "3px solid #ef6c00",
    color: "#e65100",
  },

  late: {
    backgroundColor: "#ffebee",
    border: "3px solid #d32f2f",
    color: "#c62828",
  },

  ontime: {
    backgroundColor: "#e8f5e9",
    border: "3px solid #2e7d32",
    color: "#2e7d32",
  },

  faster: {
    backgroundColor: "#e3f2fd",
    border: "3px solid #1976d2",
    color: "#1976d2",
  },

  completed: {
    backgroundColor: "#e8f5e9",
    border: "3px solid #2e7d32",
    color: "#2e7d32",
  },

  cancelled: {
    backgroundColor: "#eeeeee",
    border: "2px solid #757575",
    color: "#616161",
  },
};


  const idealMinutes =
    IDEAL_PROCESS_TIMES[processConfig.name];

  const tooltipContent = (
    <Box sx={{ p: 0.5, minWidth: 150 }}>
      <Typography
        variant="body2"
        fontWeight={700}
        sx={{ mb: 0.5 }}
      >
        {processConfig.name}
      </Typography>

      <Typography variant="caption" display="block">
        Stage Status: {stage?.status || status.label}
      </Typography>

      <Typography variant="caption" display="block">
        Ideal:{" "}
        {idealMinutes !== undefined
          ? formatDuration(idealMinutes)
          : "-"}
      </Typography>

      <Typography variant="caption" display="block">
        Actual:{" "}
        {status.actualMinutes !== null
          ? formatDuration(status.actualMinutes)
          : "-"}
      </Typography>

      <Typography variant="caption" display="block">
        Input Qty: {Number(stage?.input_qty || 0).toLocaleString("en-IN")}
      </Typography>

      <Typography variant="caption" display="block">
        Accepted Qty: {Number(stage?.accepted_qty || 0).toLocaleString("en-IN")}
      </Typography>

      <Typography variant="caption" display="block">
        Released Qty: {Number(stage?.released_qty || 0).toLocaleString("en-IN")}
      </Typography>

      <Typography
        variant="caption"
        display="block"
        fontWeight={700}
        sx={{ mt: 0.5 }}
      >
        {status.label}
      </Typography>
    </Box>
  );

  return (
    <Tooltip
      title={tooltipContent}
      arrow
      placement="top"
    >
      <Box
        sx={{
          width: 26,
          height: 26,
          borderRadius: "50%",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          flexShrink: 0,
          cursor: "pointer",

          fontSize: 14,
          fontWeight: 800,

          transition: "all 0.2s ease",

          ...circleStyles[status.type],

          "&:hover": {
            transform: "scale(1.12)",
          },
        }}
      >
        {status.type === "running" && (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#f9a825",
            }}
          />
        )}

        {status.type === "late" && "!"}

        {status.type === "ontime" && "✓"}

        {status.type === "faster" && "✓"}

        {status.type === "notStarted" && ""}
      </Box>
    </Tooltip>
  );
};

export default ProcessCircle;
