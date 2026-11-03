import React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createUserData } from "../../redux/slices/authSlices";
import { useDispatch } from "react-redux";
import { ROLES } from "../../config/roles";

const initialForm = {
  userID: "",
  name: "",
  password: "",
  role: "supervisor",
  division: "all",
  department: "",
};

const CreateUser = () => {
  const [form, setForm] = React.useState(initialForm);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState({
    type: "",
    text: "",
  });

  const dispatch = useDispatch();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });
  
    if (!form.userID.trim() || !form.name.trim() || !form.password || !form.role) {
      setMessage({
        type: "error",
        text: "User ID, name,role aur password bharna zaroori hai.",
      });
      return;
    }
    if (form.password.length < 8) {
      setMessage({
        type: "error",
        text: "Password kam se kam 8 characters ka hona chahiye.",
      });
      return;
    }

   try {
  setLoading(true);

  const payload = {
    ...form,
    userID: form.userID.trim(),
    name: form.name.trim(),
    role: form.role,
    division: form.division,
    department: form.department.trim(),
  };

  console.log("CREATE USER PAYLOAD:", payload);

  const result = await dispatch(createUserData(payload)).unwrap();

  setMessage({
    type: "success",
    text: result.message || "User successfully create ho gaya.",
  });

  setForm(initialForm);
  setShowPassword(false);

} catch (error) {
  console.error("CREATE USER ERROR:", error);

  setMessage({
    type: "error",
    text:
      error?.message ||
      error?.response?.data?.message ||
      "User create karte waqt error aaya.",
  });
} finally {
  setLoading(false);
}
  };

  return (
    <Card elevation={2}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Create New User
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Fill details of User and Create Account.
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="User ID"
                name="userID"
                value={form.userID}
                onChange={handleChange}
                placeholder="USER0006"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                inputProps={{ minLength: 8 }}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        aria-label="Toggle password visibility"
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                label="Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={loading}
              >
                <MenuItem value={ROLES.ADMIN}>ADMIN</MenuItem>
                <MenuItem value={ROLES.PRODUCTION_SUPERVISOR}>
                  Production Supervisor
                </MenuItem>
                <MenuItem value={ROLES.QUALITYSUPERVISOR}>
                  Quality Supervisor
                </MenuItem>
                <MenuItem value={ROLES.PACKINGSUPERVISOR}>
                  Packing Supervisor
                </MenuItem>
                <MenuItem value={ROLES.DISPATCH}>Dispatch</MenuItem>
                <MenuItem value={ROLES.SUPERVISOR}>Supervisor</MenuItem>
                <MenuItem value={ROLES.EMPLOYEE}>Employee</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                label="Division"
                name="division"
                value={form.division}
                onChange={handleChange}
                disabled={loading}
              >
                <MenuItem value="all">All Divisions</MenuItem>
                <MenuItem value="woven">Woven</MenuItem>
                <MenuItem value="crochet">Crochet</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="e.g. Production"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : null
                }
              >
                {loading ? "Creating User..." : "Create User"}
              </Button>

              <Button
                sx={{ ml: 2 }}
                variant="outlined"
                disabled={loading}
                onClick={() => {
                  setForm(initialForm);
                  setMessage({ type: "", text: "" });
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreateUser;
