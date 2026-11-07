
import React from "react";

import {
  Box,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import { NavLink, useNavigate } from "react-router-dom";

import { menuConfig } from "../../config/menuConfig";

import { useSelector, useDispatch } from "react-redux";

import { logout } from "../../redux/slices/authSlices";
import useNotification from "../../hooks/useNotification";

const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
  useNotification({
    event: "new-notification",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const loggedInUser = user?.user;
  const role = loggedInUser?.role;
  const division = loggedInUser?.division;

  const menus = menuConfig[role] || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const formatLabel = (value) => {
    if (!value) return "Unknown";

    return value
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ffffff",
      }}
    >
      {/* BRAND HEADER */}

      <Toolbar
        sx={{
          minHeight: "82px !important",
          px: 2.5,
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            variant="rounded"
            sx={{
              width: 43,
              height: 43,
              borderRadius: 2.5,
              background: "linear-gradient(135deg, #1565c0, #42a5f5)",
              boxShadow: "0 5px 14px rgba(25,118,210,0.25)",
            }}
          >
            <DashboardRoundedIcon sx={{ color: "#fff", fontSize: 25 }} />
          </Avatar>

          <Box>
            <Typography
              sx={{
                fontSize: 19,
                fontWeight: 900,
                color: "#172b4d",
                letterSpacing: 0.5,
                lineHeight: 1.2,
              }}
            >
              ADIFLEX
            </Typography>

            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: "#94a3b8",
                letterSpacing: 2,
                mt: 0.3,
              }}
            >
              ERP MANAGEMENT
            </Typography>
          </Box>
        </Stack>
      </Toolbar>

      <Divider sx={{ borderColor: "#edf1f7" }} />

      {/* NAVIGATION HEADING */}

      <Box sx={{ px: 2.5, pt: 3, pb: 1.5 }}>
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 1.5,
            color: "#94a3b8",
          }}
        >
          WORKSPACE MENU
        </Typography>
      </Box>

      {/* MENUS */}

      <List
        sx={{
          px: 1.5,
          py: 0,
        }}
      >
        {menus.map((item) => (
          <ListItemButton
            key={item.id}
            component={NavLink}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              position: "relative",
              minHeight: 48,
              px: 1.8,
              mb: 0.8,
              borderRadius: 2.5,
              color: "#64748b",
              transition: "all 0.2s ease",

              "& .MuiListItemIcon-root": {
                minWidth: 39,
                color: "#94a3b8",
                transition: "all 0.2s ease",
              },

              "& .MuiListItemText-primary": {
                fontSize: 13.5,
                fontWeight: 600,
              },

              "&:hover": {
                bgcolor: "#f1f6fd",
                color: "#1565c0",

                "& .MuiListItemIcon-root": {
                  color: "#1565c0",
                },
              },

              "&.active": {
                background:
                  "linear-gradient(100deg, #1565c0 0%, #287ed1 100%)",
                color: "#ffffff",
                boxShadow: "0 5px 14px rgba(21,101,192,0.22)",

                "& .MuiListItemIcon-root": {
                  color: "#ffffff",
                },

                "& .MuiListItemText-primary": {
                  fontWeight: 700,
                },

                "&:hover": {
                  background:
                    "linear-gradient(100deg, #1258aa 0%, #216fc0 100%)",
                },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>

            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>

      {/* SPACER */}

      <Box sx={{ flexGrow: 1 }} />

      {/* USER PROFILE */}

      <Box sx={{ px: 1.8, pb: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: "#f5f8fc",
            border: "1px solid #e9eff7",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.3}>
            <Avatar
              sx={{
                width: 42,
                height: 42,
                fontSize: 15,
                fontWeight: 800,
                color: "#1565c0",
                bgcolor: "#dcecff",
                border: "2px solid #ffffff",
              }}
            >
              {getInitials(loggedInUser?.name)}
            </Avatar>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#172b4d",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {loggedInUser?.name || "User"}
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  color: "#8492a6",
                  mt: 0.3,
                }}
              >
                Logged in user
              </Typography>
            </Box>

            <Chip
              label="ACTIVE"
              size="small"
              sx={{
                height: 21,
                fontSize: 9,
                fontWeight: 800,
                color: "#16865c",
                bgcolor: "#e1f6ed",
                "& .MuiChip-label": {
                  px: 0.8,
                },
              }}
            />
          </Stack>

          <Divider sx={{ my: 1.8, borderColor: "#e5ebf3" }} />

          <Stack spacing={1}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                ROLE
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#475569",
                }}
              >
                {formatLabel(role)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                DIVISION
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#475569",
                }}
              >
                {formatLabel(division)}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* LOGOUT */}

        <ListItemButton
          onClick={handleLogout}
          sx={{
            mt: 1.5,
            minHeight: 45,
            borderRadius: 2.5,
            px: 1.8,
            color: "#dc4545",
            transition: "all 0.2s ease",

            "& .MuiListItemIcon-root": {
              minWidth: 39,
              color: "#dc4545",
            },

            "& .MuiListItemText-primary": {
              fontSize: 13,
              fontWeight: 700,
            },

            "&:hover": {
              bgcolor: "#fff0f0",
              transform: "translateX(3px)",
            },
          }}
        >
          <ListItemIcon>
            <LogoutRoundedIcon />
          </ListItemIcon>

          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>

      {/* FOOTER */}

      <Box sx={{ px: 2, pb: 1.5, textAlign: "center" }}>
        <Typography
          sx={{
            fontSize: 9,
            color: "#b0bac8",
            letterSpacing: 1.2,
            fontWeight: 700,
          }}
        >
          ADIFLEX ERP • MANAGEMENT SYSTEM
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
      }}
    >
      {/* MOBILE DRAWER */}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
            boxShadow: "8px 0 30px rgba(15,40,75,0.12)",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* DESKTOP DRAWER */}

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
            borderRight: "1px solid #edf1f7",
            boxShadow: "4px 0 20px rgba(15,40,75,0.035)",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
