import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginPic from "../assets/SR.Tech.png";

import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import { login } from "../redux/slices/authSlices";

import { loginData } from "../utils/loginRoleData";

const Login = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    role: "",

    division: "",

    password: "",
  });

  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ========================================
    // ROLE CHANGE
    // ========================================

    if (name === "role") {
      const selectedRole = loginData.find((item) => item.value === value);

      const roleDivisions = selectedRole?.divisions || [];

      const isOnlyAllDivision =
        roleDivisions.length === 1 && roleDivisions[0] === "all";

      setFormData((prev) => ({
        ...prev,

        role: value,

        division: isOnlyAllDivision ? "all" : "",
      }));

      return;
    }

    // ========================================
    // OTHER FIELDS
    // ========================================

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

      if (!data.success) {
        alert(data.message);

        return;
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      alert(error?.message || "Server Error");
    }
  };

  // ==========================================
  // SELECTED ROLE
  // ==========================================

  const selectedRole = loginData.find((item) => item.value === formData.role);

  const allowedDivisions = selectedRole?.divisions || [];

  const isAllDivisionOnly =
    allowedDivisions.length === 1 && allowedDivisions[0] === "all";

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
width:420,

background:"rgba(255,255,255,.95)",

borderRadius:4,

boxShadow:"0 30px 70px rgba(0,0,0,.45)",

overflow:"hidden"
}}
      >
        <Box
sx={{
background:"#1976d2",
color:"#fff",
p:3
}}
>

<Typography
variant="h5"
fontWeight={700}
>
S.R. TECHNOLOGIES
</Typography>

<Typography>
Enterprise ERP System
</Typography>

</Box>
        <CardContent>
     
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
          <Box component="form" onSubmit={handleSubmit}>
            {/* ================================= */}
            {/* ROLE */}
            {/* ================================= */}

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Role</InputLabel>

              <Select
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleChange}
              >
                {loginData.map((item) => (
                  <MenuItem key={item.id} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* ================================= */}
            {/* DIVISION */}
            {/* ================================= */}

            <FormControl
              fullWidth
              margin="normal"
              required
              disabled={isAllDivisionOnly}
            >
              <InputLabel>Division</InputLabel>

              <Select
                name="division"
                value={formData.division}
                label="Division"
                onChange={handleChange}
              >
                {allowedDivisions.map((division) => (
                  <MenuItem key={division} value={division}>
                    {division === "all"
                      ? "All"
                      : division === "woven"
                        ? "Woven"
                        : "Crochet"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
    boxShadow: "0 10px 25px rgba(25,118,210,.35)",
  }}
>
  {loading ? "Logging in..." : "Login"}
</Button>
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
