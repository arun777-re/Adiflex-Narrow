
import React from "react";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  Avatar,
  Divider,
} from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";

const SnrMrchndsrDashboard = () => {
  const responsibilities = [
    {
      icon: <GroupsOutlinedIcon />,
      title: "Customer Relationship",
      description:
        "Maintain strong customer relationships, understand requirements and ensure clear communication throughout the order lifecycle.",
      color: "#2563EB",
      bg: "#EFF6FF",
    },
    {
      icon: <AssignmentTurnedInOutlinedIcon />,
      title: "Sales Order Management",
      description:
        "Oversee order details, specifications, quantities, rates and committed delivery schedules with accuracy.",
      color: "#7C3AED",
      bg: "#F5F3FF",
    },
    {
      icon: <Inventory2OutlinedIcon />,
      title: "Product & Inventory Coordination",
      description:
        "Coordinate product availability, stock requirements and material planning with the concerned departments.",
      color: "#0891B2",
      bg: "#ECFEFF",
    },
    {
      icon: <PrecisionManufacturingOutlinedIcon />,
      title: "Production Coordination",
      description:
        "Coordinate with production teams to monitor order progress and support timely execution of customer commitments.",
      color: "#D97706",
      bg: "#FFFBEB",
    },
    {
      icon: <VerifiedOutlinedIcon />,
      title: "Quality & Specifications",
      description:
        "Ensure customer specifications, product details and quality expectations are communicated and followed.",
      color: "#059669",
      bg: "#ECFDF5",
    },
    {
      icon: <InsightsOutlinedIcon />,
      title: "Business Insights",
      description:
        "Review order progress, identify coordination gaps and support informed business decisions through accurate information.",
      color: "#DB2777",
      bg: "#FDF2F8",
    },
  ];

  const priorities = [
    "Customer requirements and order specifications",
    "Accurate order entry and committed dates",
    "Coordination between sales and production",
    "Timely updates and customer communication",
  ];

  return (
    <Box
      sx={{
        minHeight: "100%",
        pb: 4,
        background: "#F6F8FC",
      }}
    >
      {/* HERO SECTION */}

      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          color: "#fff",
          background:
            "linear-gradient(120deg, #101C3D 0%, #172F60 55%, #2457A7 100%)",
          boxShadow: "0 15px 40px rgba(20, 45, 95, 0.18)",
        }}
      >
        {/* Decorative circles */}

        <Box
          sx={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.10)",
            right: -70,
            top: -130,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 190,
            height: 190,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.10)",
            right: 65,
            bottom: -125,
          }}
        />

        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <WorkspacePremiumRoundedIcon
                sx={{ color: "#FBBF24" }}
              />

              <Typography
                variant="overline"
                sx={{
                  letterSpacing: 2,
                  color: "#C7D8F8",
                  fontWeight: 700,
                }}
              >
                ADIFLEX ERP • MANAGEMENT PORTAL
              </Typography>
            </Stack>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                letterSpacing: -1,
                fontSize: { xs: 29, md: 42 },
                mb: 1.5,
              }}
            >
              Welcome, Senior Merchandiser
            </Typography>

            <Typography
              sx={{
                color: "#D5E2F8",
                fontSize: { xs: 14, md: 16 },
                lineHeight: 1.8,
                maxWidth: 650,
              }}
            >
              Manage customer expectations, drive order coordination
              and keep every commitment aligned with business goals.
              Your attention to detail keeps the entire merchandising
              process moving forward.
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 3 }}
            >
              <Chip
                icon={
                  <TrendingUpRoundedIcon
                    sx={{ color: "#BBF7D0 !important" }}
                  />
                }
                label="Business Coordination"
                sx={{
                  color: "#E2EFFF",
                  bgcolor: "rgba(255,255,255,0.12)",
                  fontWeight: 600,
                  border: "1px solid rgba(255,255,255,0.14)",
                }}
              />

              <Chip
                label="Customer Focus"
                sx={{
                  color: "#E2EFFF",
                  bgcolor: "rgba(255,255,255,0.12)",
                  fontWeight: 600,
                  border: "1px solid rgba(255,255,255,0.14)",
                }}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", md: "center" },
              }}
            >
              <Box
                sx={{
                  width: 165,
                  height: 165,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.20), rgba(255,255,255,0.04))",
                  border: "1px solid rgba(255,255,255,0.25)",
                  boxShadow: "0 15px 45px rgba(0,0,0,0.15)",
                }}
              >
                <Avatar
                  sx={{
                    width: 118,
                    height: 118,
                    bgcolor: "#FBBF24",
                    color: "#172B50",
                  }}
                >
                  <HandshakeOutlinedIcon sx={{ fontSize: 65 }} />
                </Avatar>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* INTRODUCTION */}

      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: "#17233D" }}
        >
          Your Role & Responsibilities
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#718096", mt: 0.7 }}
        >
          Connecting customers, products and internal teams through
          effective merchandising management.
        </Typography>
      </Box>

      {/* RESPONSIBILITY CARDS */}

      <Grid container spacing={2.5}>
        {responsibilities.map((item) => (
          <Grid
            size={{ xs: 12, sm: 6, lg: 4 }}
            key={item.title}
          >
            <Card
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 3,
                border: "1px solid #E8EDF5",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 28px rgba(20,40,80,0.09)",
                  borderColor: item.color,
                },
              }}
            >
              <CardContent sx={{ p: 2.7 }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 49,
                    height: 49,
                    bgcolor: item.bg,
                    color: item.color,
                    borderRadius: 2.5,
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Avatar>

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,
                    color: "#1E293B",
                    mb: 1,
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#718096",
                    lineHeight: 1.8,
                    minHeight: 75,
                  }}
                >
                  {item.description}
                </Typography>

                <Divider sx={{ my: 2, borderColor: "#EDF0F5" }} />

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.7}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: item.color,
                      fontWeight: 700,
                    }}
                  >
                    Key Responsibility
                  </Typography>

                  <ArrowForwardRoundedIcon
                    sx={{ fontSize: 15, color: item.color }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* PRIORITIES SECTION */}

      <Grid container spacing={2.5} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid #E8EDF5",
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 2.5 }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#EFF6FF",
                    color: "#2563EB",
                  }}
                >
                  <CalendarMonthOutlinedIcon />
                </Avatar>

                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "#17233D" }}
                  >
                    Daily Focus Areas
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Keep your merchandising priorities on track
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={2}>
                {priorities.map((item, index) => (
                  <Stack
                    key={item}
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                  >
                    <Avatar
                      sx={{
                        width: 27,
                        height: 27,
                        fontSize: 12,
                        fontWeight: 800,
                        bgcolor: "#EAF1FF",
                        color: "#2457A7",
                      }}
                    >
                      {index + 1}
                    </Avatar>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#475569",
                        pt: 0.5,
                        lineHeight: 1.6,
                      }}
                    >
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              color: "#fff",
              background:
                "linear-gradient(145deg, #172B50, #234D8D)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <CardContent
              sx={{
                p: 3,
                position: "relative",
                zIndex: 1,
              }}
            >
              <DesignServicesOutlinedIcon
                sx={{
                  fontSize: 37,
                  color: "#FBBF24",
                  mb: 2,
                }}
              />

              <Typography
                variant="h5"
                sx={{ fontWeight: 800, mb: 1.5 }}
              >
                Excellence in Every Order
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#D6E3F7",
                  lineHeight: 1.9,
                  mb: 3,
                }}
              >
                Successful merchandising is built on accuracy,
                communication and accountability. Every customer
                commitment deserves careful attention from order
                confirmation to final dispatch.
              </Typography>

              <Divider
                sx={{
                  borderColor: "rgba(255,255,255,0.18)",
                  mb: 2,
                }}
              />

              <Typography
                variant="subtitle2"
                sx={{
                  color: "#FBBF24",
                  fontWeight: 800,
                  letterSpacing: 0.5,
                }}
              >
                ONE TEAM. ONE COMMITMENT.
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: "#D6E3F7" }}
              >
                Delivering trust through every detail.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FOOTER */}

      <Box
        sx={{
          mt: 3,
          py: 2.5,
          px: 2,
          borderRadius: 3,
          bgcolor: "#FFFFFF",
          border: "1px solid #E8EDF5",
          textAlign: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: "#334155",
          }}
        >
          Accuracy in Planning. Excellence in Execution.
        </Typography>

        <Typography
          variant="caption"
          sx={{ color: "#94A3B8" }}
        >
          Adiflex ERP • Senior Merchandising Workspace
        </Typography>
      </Box>
    </Box>
  );
};

export default SnrMrchndsrDashboard;
