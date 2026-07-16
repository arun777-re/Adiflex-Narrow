import { Box, Button, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useNavigate } from "react-router-dom";

const SalesOrderToolbar = () => {
  const navigate = useNavigate();

  const handleCreateOrder = () => {
    navigate("/sales-order/create");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
      }}
    >
      {/* Page Title */}
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Sales Orders
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Manage and track all customer sales orders.
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          size="large"
          onClick={handleCreateOrder}
        >
          Create Sales Order
        </Button>
      </Box>
    </Box>
  );
};

export default SalesOrderToolbar;