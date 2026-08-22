import React from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const BillingDashBoard = () => {
  const { user } = useSelector(
    (state) => state.auth.user
  );

  const userName = user?.name || "User";

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 80px)",
        p: { xs: 2, md: 3 },
        backgroundColor: "#f5f7fa",
      }}
    >
      {/* =====================================================
          WELCOME CARD
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          background:
            "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "#fff",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Avatar
            sx={{
              width: 60,
              height: 60,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          >
            <ReceiptLongIcon fontSize="large" />
          </Avatar>

          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "1.7rem",
                  md: "2.2rem",
                },
              }}
            >
              Welcome, {userName}! 👋
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mt: 0.5,
                opacity: 0.9,
              }}
            >
              Welcome to the Adiflex Billing Dashboard
            </Typography>
          </Box>
        </Box>

        {/* Decorative Icon */}

        <ReceiptLongIcon
          sx={{
            position: "absolute",
            right: 30,
            bottom: -25,
            fontSize: 150,
            opacity: 0.08,
          }}
        />
      </Paper>

      {/* =====================================================
          BILLING MESSAGE
      ===================================================== */}

      <Box
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2,
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar>
              <ReceiptLongIcon />
            </Avatar>

            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
              >
                Billing Operations
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Manage dispatched orders and
                complete billing efficiently.
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar>
              <AccessTimeIcon />
            </Avatar>

            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
              >
                Stay Updated
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                New billing orders will appear
                automatically through notifications.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* =====================================================
          FOOTER MESSAGE
      ===================================================== */}

      <Box
        sx={{
          mt: 4,
          textAlign: "center",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Have a productive day! 🚀
        </Typography>
      </Box>
    </Box>
  );
};

export default BillingDashBoard;