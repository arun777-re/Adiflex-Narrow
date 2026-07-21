import DashboardRoundedIcon
  from "@mui/icons-material/DashboardRounded";

import ShoppingCartRoundedIcon
  from "@mui/icons-material/ShoppingCartRounded";

import AddShoppingCartRoundedIcon
  from "@mui/icons-material/AddShoppingCartRounded";

import PrecisionManufacturingRoundedIcon
  from "@mui/icons-material/PrecisionManufacturingRounded";

import HistoryRoundedIcon
  from "@mui/icons-material/HistoryRounded";

import LocalShippingRoundedIcon
  from "@mui/icons-material/LocalShippingRounded";

import InventoryRoundedIcon
  from "@mui/icons-material/InventoryRounded";

import AssessmentRoundedIcon
  from "@mui/icons-material/AssessmentRounded";

import { ROLES } from "./roles";


export const menuConfig = {

  // ==========================================
  // ADMIN
  // ==========================================

  [ROLES.ADMIN]: [

    {
      id: 1,

      title: "Dashboard",

      path: "/dashboard",

      icon:
        <DashboardRoundedIcon />,
    },


    {
      id: 2,

      title: "Sales Orders",

      path: "/sales-order",

      icon:
        <ShoppingCartRoundedIcon />,
    },


    {
      id: 3,

      title: "Create Sales Order",

      path: "/sales-order/create",

      icon:
        <AddShoppingCartRoundedIcon />,
    },


    {
      id: 4,

      title: "Production",

      path: "/production",

      icon:
        <PrecisionManufacturingRoundedIcon />,
    },


    {
      id: 5,

      title: "Inventory",

      path: "/inventory",

      icon:
        <InventoryRoundedIcon />,
    },


    {
      id: 6,

      title: "Dispatch",

      path: "/dispatch",

      icon:
        <LocalShippingRoundedIcon />,
    },


    {
      id: 7,

      title: "Reports",

      path: "/reports",

      icon:
        <AssessmentRoundedIcon />,
    },


    {
      id: 8,

      title: "Activity Log",

      path: "/activity-log",

      icon:
        <HistoryRoundedIcon />,
    },

  ],


  // ==========================================
  // PRODUCTION SUPERVISOR
  // ==========================================

  [ROLES.PRODUCTION_SUPERVISOR]: [

    {
      id: 1,

      title: "Dashboard",

      path: "/dashboard",

      icon:
        <DashboardRoundedIcon />,
    },


    {
      id: 2,

      title: "Production",

      path: "/production",

      icon:
        <PrecisionManufacturingRoundedIcon />,
    },


    {
      id: 3,

      title: "FG Inventory",

      path: "/inventory",

      icon:
        <InventoryRoundedIcon />,
    },

  ],


  // ==========================================
  // DISPATCH
  // ==========================================

  [ROLES.DISPATCH]: [

    {
      id: 1,

      title: "Dashboard",

      path: "/dashboard",

      icon:
        <DashboardRoundedIcon />,
    },


    {
      id: 2,

      title: "Dispatch",

      path: "/dispatch",

      icon:
        <LocalShippingRoundedIcon />,
    },


    {
      id: 3,

      title: "FG Inventory",

      path: "/inventory",

      icon:
        <InventoryRoundedIcon />,
    },

  ],


  // ==========================================
  // SUPERVISOR
  // ==========================================

  [ROLES.SUPERVISOR]: [

    {
      id: 1,

      title: "Dashboard",

      path: "/dashboard",

      icon:
        <DashboardRoundedIcon />,
    },


    {
      id: 2,

      title: "Monitoring",

      path: "/monitoring",

      icon:
        <AssessmentRoundedIcon />,
    },


    {
      id: 3,

      title: "Reports",

      path: "/reports",

      icon:
        <AssessmentRoundedIcon />,
    },
       {
      id: 4,

      title: "Sales Orders",

      path: "/sales-order",

      icon:
        <ShoppingCartRoundedIcon />,
    },


    {
      id: 5,

      title: "Create Sales Order",

      path: "/sales-order/create",

      icon:
        <AddShoppingCartRoundedIcon />,
    },

  ],

};