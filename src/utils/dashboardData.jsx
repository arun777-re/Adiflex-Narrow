
// dummy data

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FactoryIcon from "@mui/icons-material/Factory";
import PrintIcon from "@mui/icons-material/Print";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const dashboardData = [

  {
    title: "Total Orders",
    value: 120,
    icon: <ShoppingCartIcon />,
    color: "#1976d2",
  },

  {
    title: "Production",
    value: 35,
    icon: <FactoryIcon />,
    color: "#2e7d32",
  },

  {
    title: "Printing",
    value: 20,
    icon: <PrintIcon />,
    color: "#6a1b9a",
  },

  {
    title: "Packing",
    value: 15,
    icon: <Inventory2Icon />,
    color: "#ef6c00",
  },

  {
    title: "Dispatch",
    value: 8,
    icon: <LocalShippingIcon />,
    color: "#00838f",
  },

  {
    title: "Completed",
    value: 42,
    icon: <CheckCircleIcon />,
    color: "#43a047",
  },

];

export default dashboardData;