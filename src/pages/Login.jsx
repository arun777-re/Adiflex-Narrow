import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

        justifyContent: "center",

        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: 400,
        }}
      >
        <CardContent>
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
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                mt: 3,
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
