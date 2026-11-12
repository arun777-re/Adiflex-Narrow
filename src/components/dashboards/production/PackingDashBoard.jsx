
import React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Grid,
  Chip,
  Avatar,
} from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const PackingDashBoard = () => {
  const responsibilities = [
    {
      title: "Rolling Management",
      subtitle:
        "Supervise rolling operations and ensure finished material is properly measured, organized and prepared for packing.",
      icon: <PrecisionManufacturingOutlinedIcon />,
      color: "#2563eb",
      bg: "#eff6ff",
      points: [
        "Rolling Process Monitoring",
        "Roll Quantity Management",
        "Production Coordination",
      ],
    },
    {
      title: "Packing Management",
      subtitle:
        "Manage packing activities, verify packed quantities and ensure finished goods are ready for dispatch.",
      icon: <Inventory2OutlinedIcon />,
      color: "#059669",
      bg: "#ecfdf5",
      points: [
        "Packing Operations",
        "Packed Quantity Verification",
        "Finished Goods Readiness",
      ],
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: "100%" }}>
      {/* Welcome Banner */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          color: "#fff",
          background:
            "linear-gradient(120deg, #312e81 0%, #4338ca 55%, #6366f1 100%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.06)",
            right: -70,
            top: -130,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.05)",
            right: 110,
            bottom: -150,
          }}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={3}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Box>
            <Chip
              icon={<WorkspacePremiumOutlinedIcon />}
              label="ROLLING & PACKING DEPARTMENT"
              sx={{
                mb: 2.5,
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.2)",
                fontWeight: 700,
                letterSpacing: 0.7,
                "& .MuiChip-icon": { color: "#c7d2fe" },
              }}
            />

            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                mb: 1,
              }}
            >
              Welcome, Packing Supervisor!
            </Typography>

            <Typography
              sx={{
                color: "#e0e7ff",
                maxWidth: 600,
                fontSize: { xs: "0.9rem", md: "1rem" },
                lineHeight: 1.8,
              }}
            >
              Oversee rolling and packing operations with accuracy.
              Ensure every finished roll is properly processed,
              verified and prepared for dispatch.
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              mt={3}
              flexWrap="wrap"
              useFlexGap
            >
              <Chip
                label="Rolling Operations"
                size="small"
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.16)",
                  fontWeight: 600,
                }}
              />

              <Chip
                label="Packing Operations"
                size="small"
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.16)",
                  fontWeight: 600,
                }}
              />
            </Stack>
          </Box>

          <Avatar
            sx={{
              width: { xs: 76, md: 110 },
              height: { xs: 76, md: 110 },
              bgcolor: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <LocalShippingOutlinedIcon
              sx={{ fontSize: { xs: 42, md: 62 }, color: "#c7d2fe" }}
            />
          </Avatar>
        </Stack>
      </Paper>

      {/* Responsibilities */}
      <Box sx={{ mt: 4, mb: 2.5 }}>
        <Typography variant="h6" fontWeight={800} color="text.primary">
          Your Responsibilities
        </Typography>

        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Key operational areas under your supervision
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {responsibilities.map((item) => (
          <Grid size={{ xs: 12, md: 6 }} key={item.title}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                height: "100%",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
                  borderColor: item.color,
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 54,
                    height: 54,
                    bgcolor: item.bg,
                    color: item.color,
                    borderRadius: 2.5,
                  }}
                >
                  {item.icon}
                </Avatar>

                <Box>
                  <Typography fontWeight={800} variant="subtitle1">
                    {item.title}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Department Operations
                  </Typography>
                </Box>
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2.5, lineHeight: 1.8 }}
              >
                {item.subtitle}
              </Typography>

              <Stack spacing={1.3} sx={{ mt: 2.5 }}>
                {item.points.map((point) => (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    key={point}
                  >
                    <TaskAltOutlinedIcon
                      sx={{ fontSize: 17, color: item.color }}
                    />

                    <Typography variant="body2" fontWeight={600}>
                      {point}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Bottom Message */}
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Avatar
            sx={{
              bgcolor: "#eef2ff",
              color: "#4338ca",
              width: 46,
              height: 46,
            }}
          >
            <VerifiedOutlinedIcon />
          </Avatar>

          <Box flex={1}>
            <Typography fontWeight={800}>
              Every Roll Counts. Every Detail Matters.
            </Typography>

            <Typography variant="body2" color="text.secondary" mt={0.4}>
              Your supervision ensures accurate rolling, reliable packing
              and smooth finished-goods handover.
            </Typography>
          </Box>

          <Chip
            icon={<ArrowForwardRoundedIcon />}
            label="Let's Get Started"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
        </Stack>
      </Paper>
    </Box>
  );
};

export default PackingDashBoard;
