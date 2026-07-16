import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/SideBar";

const drawerWidth = 260;

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      <Navbar handleDrawerToggle={handleDrawerToggle} />

      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            md: `calc(100% - ${drawerWidth}px)`,
          },
          p: 3,
          overflow: "auto",
          height: "100vh",
        }}
      >
        <Toolbar />

        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
