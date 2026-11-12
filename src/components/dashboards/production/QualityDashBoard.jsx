
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

import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const QualityDashBoard = () => {
  const responsibilities = [
    {
      title: "Finishing Management",
      subtitle:
        "Monitor finishing operations, production progress and material readiness.",
      icon: <PrecisionManufacturingOutlinedIcon />,
      color: "#2563eb",
      bg: "#eff6ff",
      points: ["Finishing Process", "Production Monitoring", "Stage Coordination"],
    },
    {
      title: "Quality Control",
      subtitle:
        "Maintain product standards through quality inspection and process verification.",
      icon: <FactCheckOutlinedIcon />,
      color: "#059669",
      bg: "#ecfdf5",
      points: ["Quality Inspection", "Defect Monitoring", "Quality Approval"],
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
            "linear-gradient(120deg, #172554 0%, #1e40af 55%, #2563eb 100%)",
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
              label="QUALITY & FINISHING DEPARTMENT"
              sx={{
                mb: 2.5,
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.2)",
                fontWeight: 700,
                letterSpacing: 0.7,
                "& .MuiChip-icon": { color: "#bfdbfe" },
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
              Welcome, Quality Supervisor!
            </Typography>

            <Typography
              sx={{
                color: "#dbeafe",
                maxWidth: 600,
                fontSize: { xs: "0.9rem", md: "1rem" },
                lineHeight: 1.8,
              }}
            >
              Manage finishing operations and quality inspections with
              precision. Ensure every product meets the required standards
              before moving to the next stage.
            </Typography>

            <Stack direction="row" spacing={1} mt={3} flexWrap="wrap" useFlexGap>
              <Chip
                label="Finishing"
                size="small"
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.16)",
                  fontWeight: 600,
                }}
              />
              <Chip
                label="Quality Control"
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
            <VerifiedOutlinedIcon
              sx={{ fontSize: { xs: 42, md: 62 }, color: "#bfdbfe" }}
            />
          </Avatar>
        </Stack>
      </Paper>

      {/* Department Overview */}
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
          <Grid item size={{xs:12,md:6}} key={item.title}>
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
                    <VerifiedOutlinedIcon
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
              bgcolor: "#eff6ff",
              color: "#2563eb",
              width: 46,
              height: 46,
            }}
          >
            <TrendingUpRoundedIcon />
          </Avatar>

          <Box flex={1}>
            <Typography fontWeight={800}>
              Quality is our commitment.
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.4}>
              Your attention to detail ensures better finishing, consistent
              quality and customer satisfaction.
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

export default QualityDashBoard;
