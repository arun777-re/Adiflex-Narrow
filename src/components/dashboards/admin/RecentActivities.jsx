import {
  Avatar,
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const quickActions = [
  {
    title: "Create Sales Order",
    path: "/sales-order",
  },
  {
    title: "Create Product",
    path: "/products",
  },
  {
    title: "Production",
    path: "/production",
  },
  {
    title: "Dispatch",
    path: "/dispatch",
  },
  {
    title: "Billing",
    path: "/billing",
  },
  {
    title: "Inventory",
    path: "/inventory",
  },
  {
    title: "Users",
    path: "/users",
  },
  {
    title: "Reports",
    path: "/reports",
  },
];

const getStatusColor = (status = "") => {
  const value = status.toLowerCase();

  if (value.includes("completed")) return "#2e7d32";

  if (value.includes("pending")) return "#ef6c00";

  if (value.includes("running")) return "#1976d2";

  return "#616161";
};

const RecentActivities = ({ data = [] }) => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={3} mt={1}>
      {/* ================================ */}
      {/* RECENT ACTIVITIES */}
      {/* ================================ */}

      <Grid
        size={{
          xs: 12,
          md: 7,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #e5e7eb",
            height: "100%",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={3}
          >
            Recent Activities
          </Typography>

          {data.length === 0 ? (
            <Typography
              color="text.secondary"
              align="center"
              py={5}
            >
              No Recent Activity
            </Typography>
          ) : (
            data.map((item, index) => (
              <Stack
                key={`${item.soNo}-${index}`}
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  py: 2,
                  borderBottom:
                    index !== data.length - 1
                      ? "1px solid #eee"
                      : "none",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: getStatusColor(item.status),
                  }}
                >
                  <PersonIcon />
                </Avatar>

                <Box flex={1}>
                  <Typography fontWeight={700}>
                    {item.updatedBy || "System"}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {item.soNo} • {item.product}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: getStatusColor(item.status),
                      fontWeight: 600,
                    }}
                  >
                    {item.status || "Updated"}
                  </Typography>
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  textAlign="right"
                >
                  {item.updatedTime || "--"}
                </Typography>
              </Stack>
            ))
          )}
        </Paper>
      </Grid>

      {/* ================================ */}
      {/* QUICK ACTIONS */}
      {/* ================================ */}

      <Grid
        size={{
          xs: 12,
          md: 5,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #e5e7eb",
            height: "100%",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={3}
          >
            Quick Actions
          </Typography>

          <Grid container spacing={2}>
            {quickActions.map((item) => (
              <Grid
                key={item.title}
                size={{
                  xs: 6,
                }}
              >
                <Paper
                  elevation={0}
                  onClick={() => navigate(item.path)}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    textAlign: "center",
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    transition: ".25s",

                    "&:hover": {
                      bgcolor: "#1976d2",
                      color: "#fff",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Typography fontWeight={600}>
                    {item.title}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RecentActivities;