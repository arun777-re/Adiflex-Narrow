import { Card, CardContent, Typography, Box } from "@mui/material";

const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >

          <Box>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              {value}
            </Typography>

          </Box>

          <Box
            sx={{
              width: 55,
              height: 55,
              bgcolor: color,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
            }}
          >
            {icon}
          </Box>

        </Box>

      </CardContent>
    </Card>
  );
};

export default DashboardCard;