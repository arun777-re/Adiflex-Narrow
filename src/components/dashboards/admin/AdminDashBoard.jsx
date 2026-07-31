import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Stack,
  LinearProgress,
  Chip
} from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import GroupsIcon from "@mui/icons-material/Groups";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import DashBoardKPI from "./DashBoardKPI";
import ProductionAnalytics from "./ProductionAnalytics";
import SummaryCard from "./SummaryCard";
import InventoryCard from "./InventoryCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { adminDashboardData } from "../../../redux/slices/dashboardSlice";
import RecentActivities from "./RecentActivities";
import Header from "./Header";



const AdminDashBoard = () => {

const dispatch = useDispatch();

useEffect(()=>{
  dispatch(adminDashboardData()).unwrap();
},[dispatch]);

const {dashboardData} = useSelector((state)=> state.dashboard);

const activityData = dashboardData?.dashboard?.activities;
const inventoryData = dashboardData?.dashboard?.inventory;
const kpiData = dashboardData?.dashboard?.kpi;
const productionData = dashboardData?.dashboard?.productionAnalytics;
const recentOrderData = dashboardData?.dashboard?.recentOrders;
const summaryData = dashboardData?.dashboard?.summary;


const dashboardCards = [
  {
    title: "Total Orders",
    value: kpiData?.totalOrders || 0,
    subtitle: "Sales Orders",
    color: "#1976d2",
    icon: <Inventory2Icon />,
  },
  {
    title: "Production",
    value: kpiData?.runningProduction || 0,
    subtitle: "Running Orders",
    color: "#2e7d32",
    icon: <PrecisionManufacturingIcon />,
  },
  {
    title: "Dispatch",
    value: kpiData?.dispatchReady || 0,
    subtitle: "Ready Today",
    color: "#ef6c00",
    icon: <LocalShippingIcon />,
  },
  {
    title: "FG Stock",
    value: kpiData?.fgStock || 0,
    subtitle: "Available Qty",
    color: "#7b1fa2",
    icon: <WarehouseIcon />,
  },
  {
    title: "Revenue",
    value: `₹${kpiData?.revenue || 0}`,
    subtitle: "This Month",
    color: "#00897b",
    icon: <CurrencyRupeeIcon />,
  },
  {
    title: "Pending",
    value: kpiData?.pendingOrders || 0,
    subtitle: "Need Attention",
    color: "#d32f2f",
    icon: <PendingActionsIcon />,
  },
  {
    title: "Users",
    value: kpiData?.users || 0,
    subtitle: "Total Users",
    color: "#3949ab",
    icon: <GroupsIcon />,
  },
  {
    title: "Growth",
    value: `${kpiData?.growth || 0}%`,
    subtitle: "vs Last Month",
    color: "#00acc1",
    icon: <TrendingUpIcon />,
  },
];

  return (
  <Box
  p={3}
  sx={{
    display: "flex",
    flexDirection: "column",
    gap: 3,
  }}
>

<Header />

<DashBoardKPI dashboardCards={dashboardCards} />

<ProductionAnalytics data={productionData} />

<SummaryCard data={summaryData} />

<RecentActivities data={activityData} />

<InventoryCard
    inventoryData={inventoryData}
    recentOrdersData={recentOrderData}
/>

</Box>
  );
};

export default AdminDashBoard;