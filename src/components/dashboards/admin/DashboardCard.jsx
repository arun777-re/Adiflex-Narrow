import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
const DashboardCard = ({
  title,
  subtitle,
  children,
  sx = {},
}) => {
  return (
    <Card
      elevation={1}
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        height: "100%",
        minHeight: 0,
        borderRadius: 2,
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      <CardContent
        sx={{
          width: "100%",
          minWidth: 0,
          minHeight: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          overflow: "hidden",

          "&:last-child": {
            pb: 2,
          },
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            flexShrink: 0,
            wordBreak: "break-word",
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.25,
              mb: 2,
              flexShrink: 0,
              wordBreak: "break-word",
            }}
          >
            {subtitle}
          </Typography>
        )}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            width: "100%",
            overflow: "hidden",
          }}
        >
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;

