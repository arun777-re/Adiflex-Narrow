import React from "react";
import { ResponsiveContainer } from "recharts";
import { Box } from "@mui/material";




const ChartContainer = ({
  children,
  height = 320,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        height: {
          xs: 260,
          sm: height,
        },
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
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

export default ChartContainer;
