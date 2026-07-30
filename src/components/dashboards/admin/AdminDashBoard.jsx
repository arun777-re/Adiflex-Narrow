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


const dashboardCards = [
  {
    title: "Total Orders",
    value: 124,
    subtitle: "+12 this week",
    color: "#1976d2",
    icon: <Inventory2Icon />,
  },
  {
    title: "Production",
    value: 48,
    subtitle: "Running Orders",
    color: "#2e7d32",
    icon: <PrecisionManufacturingIcon />,
  },
  {
    title: "Dispatch",
    value: 18,
    subtitle: "Ready Today",
    color: "#ef6c00",
    icon: <LocalShippingIcon />,
  },
  {
    title: "FG Stock",
    value: "18,450",
    subtitle: "Available Qty",
    color: "#7b1fa2",
    icon: <WarehouseIcon />,
  },
  {
    title: "Revenue",
    value: "₹12.8L",
    subtitle: "This Month",
    color: "#00897b",
    icon: <CurrencyRupeeIcon />,
  },
  {
    title: "Pending",
    value: 9,
    subtitle: "Need Attention",
    color: "#d32f2f",
    icon: <PendingActionsIcon />,
  },
  {
    title: "Users",
    value: 17,
    subtitle: "Logged In",
    color: "#3949ab",
    icon: <GroupsIcon />,
  },
  {
    title: "Growth",
    value: "18%",
    subtitle: "vs Last Month",
    color: "#00acc1",
    icon: <TrendingUpIcon />,
  },
];
const AdminDashBoard = () => {
  return (
    <Box p={3}>
      {/* Header */}

      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 5,
          color: "#fff",
          background:
            "linear-gradient(135deg,#1565c0,#42a5f5)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Welcome Back 👋
        </Typography>

        <Typography mt={1}>
          S.R. Technologies Enterprise ERP
        </Typography>

        <Typography
          mt={3}
          variant="body2"
        >
          Monitor Production, Inventory,
          Dispatch and Sales from one place.
        </Typography>
      </Paper>

   <DashBoardKPI dashboardCards={dashboardCards}/>
{/* PRODUCTION + DIVISION */}

<ProductionAnalytics/>

{/* SUMMARY */}

<SummaryCard/>
{/* RECENT ACTIVITIES + QUICK ACTIONS */}

<Grid container spacing={3} mt={1}>

  <Grid
    size={{
      xs:12,
      md:7
    }}
  >
    <Paper
      elevation={0}
      sx={{
        p:3,
        borderRadius:4,
        border:"1px solid #e5e7eb",
        height:"100%"
      }}
    >

      <Typography
        variant="h6"
        fontWeight={700}
        mb={3}
      >
        Recent Activities
      </Typography>

      {[
        {
          user:"Admin",
          action:"Created Sales Order",
          time:"2 mins ago",
          color:"#1976d2"
        },
        {
          user:"Crochet Manager",
          action:"Completed Packing",
          time:"12 mins ago",
          color:"#2e7d32"
        },
        {
          user:"Dispatch",
          action:"Created Dispatch",
          time:"20 mins ago",
          color:"#ef6c00"
        },
        {
          user:"Billing",
          action:"Generated Invoice",
          time:"30 mins ago",
          color:"#8e24aa"
        },
        {
          user:"Production",
          action:"Started Warping",
          time:"45 mins ago",
          color:"#d32f2f"
        }
      ].map((item,index)=>(

        <Stack
          key={index}
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            py:2,
            borderBottom:
              index!==4
                ? "1px solid #eee"
                : "none"
          }}
        >

          <Avatar
            sx={{
              bgcolor:item.color
            }}
          >
            {item.user[0]}
          </Avatar>

          <Box flex={1}>
            <Typography
              fontWeight={600}
            >
              {item.user}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {item.action}
            </Typography>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            {item.time}
          </Typography>

        </Stack>

      ))}

    </Paper>
  </Grid>

  <Grid
    size={{
      xs:12,
      md:5
    }}
  >

    <Paper
      elevation={0}
      sx={{
        p:3,
        borderRadius:4,
        border:"1px solid #e5e7eb"
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

        {[
          "Create Sales Order",
          "Create Product",
          "Production",
          "Dispatch",
          "Billing",
          "Inventory",
          "Users",
          "Reports"
        ].map((item)=>(

          <Grid
            key={item}
            size={{
              xs:6
            }}
          >

            <Paper
              sx={{
                p:2,
                textAlign:"center",
                cursor:"pointer",
                transition:".25s",
                borderRadius:3,

                "&:hover":{
                  bgcolor:"#1976d2",
                  color:"#fff",
                  transform:"translateY(-4px)"
                }
              }}
            >

              <Typography
                fontWeight={600}
              >
                {item}
              </Typography>

            </Paper>

          </Grid>

        ))}

      </Grid>

    </Paper>

  </Grid>

</Grid>

{/* ================================================= */}
{/* INVENTORY + RECENT ORDERS */}
{/* ================================================= */}
<InventoryCard/>

    </Box>
  );
};

export default AdminDashBoard;