import {
  Grid,
  Typography,
  Paper,
  Box,
  Chip,
} from "@mui/material";

import {
  useSelector,
} from "react-redux";

import DashboardCard from "../components/DashboardCard";


const Dashboard = () => {

  const {
    user,
  } =
    useSelector(
      (state) =>
        state.auth
    );


  const role =
    user?.role;


  const division =
    user?.division;


  const getRoleName =
    () => {

      switch (role) {

        case "admin":
          return "Administrator";

        case "productionSupervisor":
          return "Production Supervisor";

        case "dispatch":
          return "Dispatch";

        case "supervisor":
          return "Supervisor";

        default:
          return "User";

      }

    };


  return (

    <>

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <Box

        sx={{

          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          mb: 3,

          flexWrap:
            "wrap",

          gap: 2,

        }}

      >

        <Box>

          <Typography

            variant="h4"

            fontWeight="bold"

          >

            Dashboard

          </Typography>


          <Typography

            color="text.secondary"

            mt={0.5}

          >

            Welcome,{" "}

            <strong>
              {user?.name}
            </strong>

          </Typography>

        </Box>


        <Box

          sx={{

            display:
              "flex",

            gap: 1,

          }}

        >

          <Chip

            label={
              getRoleName()
            }

            color="primary"

            variant="outlined"

          />


          <Chip

            label={
              division === "all"
                ? "All Divisions"
                : division
            }

            color="secondary"

            variant="outlined"

          />

        </Box>

      </Box>


      {/* ================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================= */}

      <Grid

        container

        spacing={3}

      >

        <Grid

          size={{

            xs: 12,

            sm: 6,

            md: 3,

          }}

        >

          <DashboardCard

            title="Total Orders"

            value="0"

          />

        </Grid>


        <Grid

          size={{

            xs: 12,

            sm: 6,

            md: 3,

          }}

        >

          <DashboardCard

            title="Pending Production"

            value="0"

          />

        </Grid>


        <Grid

          size={{

            xs: 12,

            sm: 6,

            md: 3,

          }}

        >

          <DashboardCard

            title="Ready to Dispatch"

            value="0"

          />

        </Grid>


        <Grid

          size={{

            xs: 12,

            sm: 6,

            md: 3,

          }}

        >

          <DashboardCard

            title="Completed"

            value="0"

          />

        </Grid>

      </Grid>


      {/* ================================= */}
      {/* RECENT ORDERS */}
      {/* ================================= */}

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


        <Typography

          color="text.secondary"

        >

          {role === "dispatch"

            ? "Dispatch related orders will appear here."

            : role ===
              "productionSupervisor"

              ? `${division} production orders will appear here.`

              : "All recent orders will appear here."

          }

        </Typography>

      </Paper>

    </>

  );

};


export default Dashboard;