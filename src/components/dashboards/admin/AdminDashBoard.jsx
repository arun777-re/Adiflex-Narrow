
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Avatar,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import PrecisionManufacturingRoundedIcon from "@mui/icons-material/PrecisionManufacturingRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminDashBoard = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const loggedInUser = user?.user;

  const adminName = loggedInUser?.name || "Administrator";

  const modules = [
    {
      title: "Sales Orders",
      subtitle: "Manage customer orders and sales activities.",
      tag: "SALES MANAGEMENT",
      icon: <ShoppingCartRoundedIcon />,
      color: "#1976d2",
      bg: "#eaf3ff",
      link: "/sales-order",
    },
    {
      title: "Production",
      subtitle: "Monitor manufacturing processes and production progress.",
      tag: "PRODUCTION MANAGEMENT",
      icon: <PrecisionManufacturingRoundedIcon />,
      color: "#00897b",
      bg: "#e6f5f2",
      link: "/admin-production",
    },
    {
      title: "Inventory",
      subtitle: "Manage raw materials and finished goods inventory.",
      tag: "INVENTORY MANAGEMENT",
      icon: <Inventory2RoundedIcon />,
      color: "#7b1fa2",
      bg: "#f4eafa",
      link: "/inventory",
    },
    {
      title: "Dispatch",
      subtitle: "Manage finished goods movement and dispatch operations.",
      tag: "DISPATCH MANAGEMENT",
      icon: <LocalShippingRoundedIcon />,
      color: "#ef6c00",
      bg: "#fff1e5",
      link: "/dispatch",
    },
    {
      title: "User Management",
      subtitle: "Manage employees, accounts and department permissions.",
      tag: "ACCESS MANAGEMENT",
      icon: <GroupsRoundedIcon />,
      color: "#3949ab",
      bg: "#e9ecff",
      link: "/admin/create-view/users",
    },
    {
      title: "Reports & Analytics",
      subtitle: "Explore business reports and operational performance.",
      tag: "BUSINESS ANALYTICS",
      icon: <AssessmentRoundedIcon />,
      color: "#00838f",
      bg: "#e4f6f7",
      link: "/reports",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100%",
        p: { xs: 2, sm: 3, md: 4 },
        background: "#f4f7fc",
      }}
    >
      {/* WELCOME HEADER */}

      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            color: "#1976d2",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: 2,
          }}
        >
          ADIFLEX ERP / ADMINISTRATION
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 26, md: 34 },
            fontWeight: 900,
            color: "#172b4d",
            letterSpacing: "-0.8px",
            mt: 0.5,
          }}
        >
          Welcome back, {adminName}
        </Typography>

        <Typography sx={{ color: "#64748b", mt: 0.8, fontSize: 14 }}>
          Your business. Your operations. All under one roof.
        </Typography>
      </Box>

      {/* PREMIUM HERO */}

      <Card
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          background:
            "linear-gradient(115deg, #101f43 0%, #1555a5 55%, #2787d9 100%)",
          color: "#fff",
          mb: 4,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.13)",
            right: -80,
            top: -150,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 210,
            height: 210,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            right: 120,
            bottom: -150,
          }}
        />

        <CardContent
          sx={{
            position: "relative",
            zIndex: 1,
            p: { xs: 3, md: 5 },
            "&:last-child": {
              pb: { xs: 3, md: 5 },
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <VerifiedRoundedIcon sx={{ color: "#90caf9" }} />

            <Typography
              sx={{
                fontSize: 11,
                letterSpacing: 1.7,
                fontWeight: 800,
                color: "#c9e3ff",
              }}
            >
              ADMINISTRATOR CONTROL CENTER
            </Typography>
          </Stack>

          <Typography
            sx={{
              fontSize: { xs: 25, md: 36 },
              fontWeight: 900,
              maxWidth: 650,
              lineHeight: 1.3,
            }}
          >
            Welcome to your central business management workspace.
          </Typography>

          <Typography
            sx={{
              mt: 2,
              color: "#d8e9ff",
              maxWidth: 620,
              lineHeight: 1.9,
              fontSize: 14,
            }}
          >
            Access every department, manage business operations and keep
            your entire organization connected through one intelligent
            ERP platform.
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              mt: 3,
              display: "inline-flex",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 10,
              px: 2,
              py: 1,
            }}
          >
            <DashboardRoundedIcon sx={{ fontSize: 18 }} />

            <Typography fontSize={13} fontWeight={700}>
              Admin Workspace
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* WORKSPACE */}

      <Box sx={{ mb: 2.5 }}>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 900,
            color: "#172b4d",
          }}
        >
          Explore Your Workspace
        </Typography>

        <Typography sx={{ color: "#8492a6", fontSize: 13, mt: 0.5 }}>
          Choose a department to get started.
        </Typography>
      </Box>

      {/* MODULE CARDS */}

      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} lg={4} key={module.title}>
            <Card
              onClick={() => navigate(module.link)}
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 3,
                border: "1px solid #e7edf5",
                background: "#fff",
                cursor: "pointer",
                transition: "all 0.25s ease",

                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 30px rgba(30,60,100,0.09)",
                  borderColor: module.color,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2.5,
                      backgroundColor: module.bg,
                      color: module.color,
                    }}
                  >
                    {React.cloneElement(module.icon, {
                      sx: { fontSize: 29 },
                    })}
                  </Avatar>

                  <ArrowForwardRoundedIcon
                    sx={{ color: "#a0aec0", mt: 1 }}
                  />
                </Stack>

                <Typography
                  sx={{
                    display: "block",
                    mt: 3,
                    color: module.color,
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: 1,
                  }}
                >
                  {module.tag}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.8,
                    fontSize: 18,
                    fontWeight: 900,
                    color: "#172b4d",
                  }}
                >
                  {module.title}
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    color: "#64748b",
                    lineHeight: 1.8,
                    fontSize: 13,
                    minHeight: 47,
                  }}
                >
                  {module.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* FOOTER */}

      <Box
        sx={{
          mt: 5,
          pt: 2.5,
          borderTop: "1px solid #e5eaf1",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            color: "#8492a6",
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          ADIFLEX ERP
        </Typography>

        <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
          Sales • Production • Inventory • Dispatch
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminDashBoard;
