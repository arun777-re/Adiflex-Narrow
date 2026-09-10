import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginPic from "../assets/SR.Tech.png";
import toast from "react-hot-toast";

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import { login } from "../redux/slices/authSlices";

import { companyData } from "../utils/companyInfo";
import { notificationAudio } from "../utils/audio";
import { subscribeToPush } from "../service-worker/webpushworker";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    userID: "",
    password: "",
  });

  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await dispatch(login(formData)).unwrap();

      console.log("Login response:", data);

      if (!data?.success) {
        toast.error("Invalid User ID or Password");
        return;
      }

      // ==========================================
      // LOGGED-IN USER
      // ==========================================

      const loggedInUser = data?.user;

      console.log("Logged-in user:", loggedInUser);

      // ==========================================
      // WEB PUSH
      // ==========================================

      try {
        await subscribeToPush({
          userId: loggedInUser?.userID,
        });

        console.log(
          "🔔 Push notification subscription completed"
        );
      } catch (error) {
        // Push fail hone par login fail nahi hoga
        console.error(
          "❌ Push subscription failed:",
          error
        );
      }

      // ==========================================
      // LOGIN AUDIO
      // ==========================================

      try {
        await notificationAudio.play();

        notificationAudio.pause();
        notificationAudio.currentTime = 0;
      } catch (error) {
        console.error(
          "❌ Notification audio failed:",
          error
        );
      }

      // ==========================================
      // DASHBOARD
      // ==========================================

      navigate("/dashboard");

    } catch (error) {
      console.error("❌ Login error:", error);

      toast.error(
        error || "Invalid User ID or Password"
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <Box
      sx={{
        minHeight: "100vh",

        display: "flex",

        justifyContent: {
          xs: "center",
          md: "flex-end",
        },

        alignItems: "center",

        px: {
          xs: 2,
          sm: 4,
          md: 10,
        },

        py: {
          xs: 3,
          md: 0,
        },

        backgroundImage: `
          linear-gradient(
            rgba(0,0,0,.45),
            rgba(0,0,0,.45)
          ),
          url(${loginPic})
        `,

        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: 420,

          maxWidth: "100%",

          background: "rgba(255,255,255,.95)",

          borderRadius: 4,

          boxShadow:
            "0 30px 70px rgba(0,0,0,.45)",

          overflow: "hidden",
        }}
      >
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <Box
          sx={{
            background: "#1976d2",
            color: "#fff",
            p: 3,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
          >
            {companyData.companyName}
          </Typography>

          <Typography>
            {companyData.work}
          </Typography>
        </Box>

        <CardContent>
          {/* ================================= */}
          {/* TITLE */}
          {/* ================================= */}

          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={4}
          >
            Login to S.R. Technologies ERP
          </Typography>

          {/* ================================= */}
          {/* FORM */}
          {/* ================================= */}

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            {/* ================================= */}
            {/* USER ID */}
            {/* ================================= */}

            <TextField
              fullWidth
              margin="normal"
              required
              label="User ID"
              name="userID"
              value={formData.userID}
              onChange={handleChange}
              autoComplete="username"
              autoFocus
            />

            {/* ================================= */}
            {/* PASSWORD */}
            {/* ================================= */}

            <TextField
              fullWidth
              margin="normal"
              required
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />

            {/* ================================= */}
            {/* LOGIN BUTTON */}
            {/* ================================= */}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.6,
                borderRadius: 3,
                fontSize: 17,
                fontWeight: 700,
                textTransform: "none",
                boxShadow:
                  "0 10px 25px rgba(25,118,210,.35)",
              }}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </Button>

            {/* ================================= */}
            {/* FOOTER */}
            {/* ================================= */}

            <Typography
              variant="caption"
              display="block"
              textAlign="center"
              mt={3}
              color="text.secondary"
            >
              © 2026 S.R. Technologies ERP
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;