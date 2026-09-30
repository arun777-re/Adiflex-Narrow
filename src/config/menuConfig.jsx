import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import PrecisionManufacturingRoundedIcon from "@mui/icons-material/PrecisionManufacturingRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";

// New icons
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";

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
      title: "Production",
      path: "/admin-production",
      icon: <PrecisionManufacturingRoundedIcon />,
    },

    {
      id: 4,
      title: "Inventory",
      path: "/inventory",
      icon: <Inventory2RoundedIcon />,
    },

    {
      id: 5,
      title: "Dispatch",
      path: "/billing-done",
      icon: <LocalShippingRoundedIcon />,
    },

    {
      id: 6,
      title: "Reports",
      path: "/reports",
      icon: <AssessmentRoundedIcon />,
    },

    {
      id: 7,
      title: "Activity Log",
      path: "/activity-log",
      icon: <HistoryRoundedIcon />,
    },
    {
      id: 8 ,
      title: "Tasks",
      path: "/admin/daily-tasks",
      icon: <HistoryRoundedIcon />,
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
      icon: <DashboardRoundedIcon />,
    },

    {
      id: 2,
      title: "Production",
      path: "/production",
      icon: <PrecisionManufacturingRoundedIcon />,
    },

    {
      id: 3,
      title: "FG Inventory",
      path: "/inventory",
      icon: <Inventory2RoundedIcon />,
    },

    {
      id: 4,
      title: "All Products",
      path: "/view-product",
      icon: <AssignmentRoundedIcon />,
    },
    {
      id: 5,
      title: "Job Work Orders",
      path: "/jobwork-orders",
      icon: <AssignmentRoundedIcon />,
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
      icon: <DashboardRoundedIcon />,
    },

    {
      id: 2,
      title: "Dispatch",
      path: "/dispatch",
      icon: <LocalShippingOutlinedIcon />,
    },

    {
      id: 3,
      title: "FG Inventory",
      path: "/inventory",
      icon: <Inventory2RoundedIcon />,
    },

    {
      id: 4,
      title: "Complete Dispatch Orders",
      path: "/complete-dispatch",
      icon: <CheckCircleRoundedIcon />,
    },
     {
      id: 5,
      title: "Sales Orders",
      path: "/sales-order",
      icon: <ShoppingCartRoundedIcon />,
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
      title: "Create Product",
      path: "/create-product",
      icon: <AddBoxRoundedIcon />,
    },

    {
      id: 5,
      title: "All Products",
      path: "/view-product",
      icon: <AssignmentRoundedIcon />,
    },

    {
      id: 6,
      title: "FG Inventory",
      path: "/inventory",
      icon: <Inventory2RoundedIcon />,
    },

    {
      id: 7,
      title: "Billing Done",
      path: "/billing-done",
      icon: <TaskAltRoundedIcon />,
    },
  ],

  // ==========================================
  // BILLING
  // ==========================================

  [ROLES.BILLING]: [
    {
      id: 1,
      title: "Billing",
      path: "/billing",
      icon: <ReceiptLongRoundedIcon />,
    },

    {
      id: 2,
      title: "Billing Done",
      path: "/billing-done",
      icon: <CheckCircleRoundedIcon />,
    },
  ],

  [ROLES.EMPLOYEE]:[
    {
      id:1,
      title:"Daily Tasks",
      path:"/employee/daily-tasks",
      icon:<AssignmentOutlinedIcon/>
    },
    {
      id:2,
      title:"Delegation Tasks",
      path:"/employee/delegation",
      icon:<AssignmentIndOutlinedIcon/>
    }
  ]
};