import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import PrecisionManufacturingRoundedIcon from "@mui/icons-material/PrecisionManufacturingRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

import { ROLES } from "./roles";

export const menuConfig = {

  // ================= ADMIN =================

  [ROLES.ADMIN]: [
    {
      id: 1,
      title: "Dashboard",
      path: "/dashboard",
      icon: <DashboardRoundedIcon />,
    },
    {
      id: 2,
      title: "Sales Orders",
      path: "/sales-order",
      icon: <ShoppingCartRoundedIcon />,
    },
    {
      id: 3,
      title: "Create Sales Order",
      path: "/sales-order/create",
      icon: <AddShoppingCartRoundedIcon />,
    },
    {
      id: 4,
      title: "Production",
      path: "/production",
      icon: <PrecisionManufacturingRoundedIcon />,
    },
    {
      id: 5,
      title: "Activity Log",
      path: "/activity-log",
      icon: <HistoryRoundedIcon />,
    },
  ],

  // ================= WARPING =================

  [ROLES.WARPING]: [
    {
      id: 1,
      title: "Dashboard",
      path: "/production",
      icon: <DashboardRoundedIcon />,
    },
  ],

  // ================= YARN BEAM =================

  [ROLES.YARN_BEAM]: [
    {
      id: 1,
      title: "Dashboard",
      path: "/production",
      icon: <DashboardRoundedIcon />,
    },
  ],

  // ================= MACHINE =================

  [ROLES.MACHINE]: [
    {
      id: 1,
      title: "Dashboard",
      path: "/production",
      icon: <DashboardRoundedIcon />,
    },
  ],

  // ================= QUALITY =================

  [ROLES.QUALITY]: [
    {
      id: 1,
      title: "Dashboard",
      path: "/production",
      icon: <DashboardRoundedIcon />,
    },
  ],

  // ================= FINISHING =================

  [ROLES.FINISHING]: [
    {
      id: 1,
      title: "Dashboard",
      path: "/production",
      icon: <DashboardRoundedIcon />,
    },
  ],

  // ================= ROLLING =================

  [ROLES.ROLLING]: [
    {
      id: 1,
      title: "Dashboard",
      path: "/production",
      icon: <DashboardRoundedIcon />,
    },
  ],

  // ================= PACKING =================

  [ROLES.PACKING]: [
    {
      id: 1,
      title: "Dashboard",
      path: "/production",
      icon: <DashboardRoundedIcon />,
    },
  ],

  // ================= JOB WORK =================

  [ROLES.JOB_WORK]: [
    {
      id: 1,
      title: "Dashboard",
      path: "/production",
      icon: <DashboardRoundedIcon />,
    },
  ],
};