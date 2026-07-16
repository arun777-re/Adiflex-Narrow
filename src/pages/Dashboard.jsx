import {
  Grid,
  Typography,
  Paper,
} from "@mui/material";

import DashboardCard from "../components/DashboardCard";

import dashboardData from "../utils/dashboardData";

const Dashboard = () => {
  return (
    <>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        Dashboard
      </Typography>

      <Grid
        container
        spacing={3}
      >

        {dashboardData.map((item) => (

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={item.title}
          >

            <DashboardCard

              title={item.title}

              value={item.value}

              icon={item.icon}

              color={item.color}

            />

          </Grid>

        ))}

      </Grid>

      <Paper
        elevation={2}
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3,
        }}
      >

        <Typography
          variant="h6"
          mb={2}
        >
          Recent Orders
        </Typography>

        <Typography color="text.secondary">

          Data Grid will come here...

        </Typography>

      </Paper>

    </>
  );
};

export default Dashboard;