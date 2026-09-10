
import {
  Box,
  Paper,
  Typography,
  Stack,
  Divider,
} from "@mui/material";

import WavingHandIcon from "@mui/icons-material/WavingHand";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";

const EmployeeDashboard = () => {
  return (
    <Box
      sx={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 720,
          p: { xs: 4, sm: 6 },
          borderRadius: 4,
          textAlign: "center",
          border: "1px solid",
          borderColor: "divider",
          background:
            "linear-gradient(135deg, rgba(25,118,210,0.06), rgba(25,118,210,0.01))",
        }}
      >
        {/* BRAND */}
        <Typography
          variant="h4"
          fontWeight={800}
          color="primary"
          sx={{
            fontSize: {
              xs: "1.8rem",
              sm: "2.3rem",
            },
          }}
        >
          AdiFlex Narrow Fabrics
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, letterSpacing: 0.5 }}
        >
          Employee Portal
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* WELCOME */}
        <Stack
          alignItems="center"
          spacing={1.5}
        >
          <WavingHandIcon
            sx={{
              fontSize: 48,
              color: "primary.main",
            }}
          />

          <Typography
            variant="h5"
            fontWeight={700}
          >
            Welcome to AdiFlex! 
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 520,
              lineHeight: 1.7,
            }}
          >
            We’re glad to have you with us. Stay organized,
            complete your assigned tasks, and keep up the great work.
          </Typography>
        </Stack>

        {/* DAILY TASKS INFO */}
        <Box
          sx={{
            mt: 4,
            p: 2,
            borderRadius: 3,
            bgcolor: "action.hover",
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            justifyContent="center"
          >
            <ChecklistOutlinedIcon color="primary" />

            <Typography
              variant="body2"
              fontWeight={600}
            >
              Check your Daily Tasks from the sidebar
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmployeeDashboard;

