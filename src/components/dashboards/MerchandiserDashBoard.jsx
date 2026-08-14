import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Fade,
  Paper,
} from "@mui/material";

const welcomeMessages = [
  "Welcome, Merchandiser! Have a productive day ahead.",
  "Good to see you! Let's make today a great one.",
  "Welcome back! Your work makes the difference.",
  "Stay focused, stay productive, and keep moving forward.",
  "Every great order starts with great coordination. Welcome!",
  "Let's keep things organized and moving smoothly today.",
  "Welcome! Wishing you a successful and productive day.",
  "Great things happen when the team works together.",
  "Your attention to detail drives success. Have a great day!",
  "Let's make today efficient, productive, and successful.",
];

const MerchandiserDashBoard = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomMessage =
      welcomeMessages[
        Math.floor(Math.random() * welcomeMessages.length)
      ];

    setMessage(randomMessage);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 100px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
      }}
    >
      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 850,
            textAlign: "center",
            py: 8,
            px: 4,
            borderRadius: 4,
            background:
              "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              mb: 2,
              color: "text.primary",
            }}
          >
            Welcome, Merchandiser 👋
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 650,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            {message}
          </Typography>

          <Typography
            variant="body2"
            color="text.disabled"
            sx={{ mt: 4 }}
          >
            Wishing you a smooth and successful day.
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default MerchandiserDashBoard;