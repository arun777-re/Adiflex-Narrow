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
} from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { NavLink } from "react-router-dom";
import { menuConfig } from "../../config/menuConfig";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlices";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(
    (state) => console.log("State in Sidebar component:", state) || state.auth,
  );
  const menus = menuConfig[user?.user?.role] || [];
  console.log("User:", user?.user);
  console.log("Role:", user?.user?.role);
  console.log("Menus:", menuConfig[user?.user?.role]);
  const navigate = useNavigate();

  // function for logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const drawer = (
    <>
      <Toolbar
        sx={{
          justifyContent: "center",
          alignItems: "center",
          minHeight: 70,
        }}
      >
        <Typography variant="h6" fontWeight={700} color="primary">
          ERP SYSTEM
        </Typography>
      </Toolbar>

      <Divider />

      <List sx={{ px: 1, mt: 1 }}>
        {menus.map((item) => (
          <ListItemButton
            key={item.id}
            component={NavLink}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              borderRadius: 2,
              mb: 0.5,

              "&.active": {
                bgcolor: "primary.main",
                color: "#fff",

                "& .MuiListItemIcon-root": {
                  color: "#fff",
                },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>

            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>
      <Box
        sx={{
          mt: "auto",
          p: 2,
        }}
      >
        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle2" fontWeight={600}>
          {user?.user?.name || "User"}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textTransform: "capitalize", mb: 2 }}
        >
          {user?.user?.role}
        </Typography>

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "error.main",

            "&:hover": {
              bgcolor: "error.lighter",
            },
          }}
        >
          <ListItemIcon sx={{ color: "error.main" }}>
            <LogoutRoundedIcon />
          </ListItemIcon>

          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
      }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
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
