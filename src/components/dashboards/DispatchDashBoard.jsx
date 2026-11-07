
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
import { useNavigate } from "react-router-dom";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const DispatchDashBoard = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Finished Goods Inventory",
      subtitle:
        "Monitor available finished goods, stock levels and inventory movements.",
      icon: <Inventory2OutlinedIcon />,
      color: "#1976d2",
      bg: "#eaf3ff",
      tag: "INVENTORY MANAGEMENT",
      link:'/inventory'
    },
    {
      title: "Dispatch Operations",
      subtitle:
        "Manage finished goods movement and support accurate order dispatch.",
      icon: <LocalShippingOutlinedIcon />,
      color: "#00897b",
      bg: "#e6f5f2",
      tag: "DISPATCH MANAGEMENT",
      link:'/dispatch'
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100%",
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#f5f7fb",
      }}
    >
      {/* Top Welcome */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="overline"
          sx={{
            color: "primary.main",
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          ADIFLEX ERP / DISPATCH
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#172b4d",
            letterSpacing: "-0.8px",
            mt: 0.5,
            fontSize: { xs: 27, md: 34 },
          }}
        >
          Welcome to Dispatch
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "#64748b", mt: 1 }}
        >
          Your workspace for finished goods inventory and dispatch management.
        </Typography>
      </Box>

      {/* Hero Banner */}
      <Card
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          background:
            "linear-gradient(115deg, #102a56 0%, #1555a5 55%, #2787d9 100%)",
          color: "#fff",
          mb: 4,
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
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
            background: "rgba(255,255,255,0.06)",
            right: 75,
            bottom: -145,
          }}
        />

        <CardContent
          sx={{
            position: "relative",
            zIndex: 1,
            p: { xs: 3, md: 5 },
            "&:last-child": { pb: { xs: 3, md: 5 } },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mb: 2 }}
          >
            <VerifiedOutlinedIcon sx={{ color: "#90caf9" }} />

            <Typography
              variant="caption"
              sx={{
                letterSpacing: 1.5,
                fontWeight: 700,
                color: "#c9e3ff",
              }}
            >
              YOUR DEPARTMENT WORKSPACE
            </Typography>
          </Stack>

          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              fontSize: { xs: 24, md: 32 },
              maxWidth: 600,
              lineHeight: 1.3,
            }}
          >
            Everything you need to manage inventory & dispatch.
          </Typography>

          <Typography
            sx={{
              mt: 2,
              color: "#d8e9ff",
              maxWidth: 570,
              lineHeight: 1.8,
              fontSize: 14,
            }}
          >
            Keep finished goods organized, maintain stock visibility
            and ensure smooth movement of goods through your department.
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
            <DashboardOutlinedIcon sx={{ fontSize: 18 }} />

            <Typography variant="body2" fontWeight={600}>
              Dispatch Department
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Section Heading */}
      <Box sx={{ mb: 2.5 }}>
        <Typography
          variant="h6"
          fontWeight={800}
          color="#172b4d"
        >
          Your Workspace
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Access your department modules
        </Typography>
      </Box>

      {/* Module Cards */}
      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} md={6} key={module.title}>
            <Card
            onClick={()=>navigate(module.link)}
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 3,
                border: "1px solid #e7edf5",
                background: "#fff",
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
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 3,
                    color: module.color,
                    fontWeight: 800,
                    letterSpacing: 1,
                  }}
                >
                  {module.tag}
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{ mt: 0.8, color: "#172b4d" }}
                >
                  {module.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    color: "#64748b",
                    lineHeight: 1.8,
                    maxWidth: 400,
                  }}
                >
                  {module.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Footer */}
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
          variant="caption"
          color="text.secondary"
          fontWeight={600}
        >
          ADIFLEX ERP
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Inventory • Dispatch • Operations
        </Typography>
      </Box>
    </Box>
  );
};

export default DispatchDashBoard;
