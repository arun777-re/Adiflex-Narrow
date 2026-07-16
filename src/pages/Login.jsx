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
  Typography,
} from "@mui/material";
import {useDispatch,useSelector} from 'react-redux';
import { login } from "../redux/slices/authSlices";

// constant data 
const loginData = [
{
  id:1,
  value:"admin",
  name:"Admin"
},
{
  id:2,
  value:"yarnBeam",
  name:"YarnBeam"
},
{
  id:3,
  value:"machine",
  name:"Machine"
},
{
  id:4,
  value:"quality",
  name:"Quality"
},
{
  id:5,
  value:"finishing",
  name:"Finishing"
},
{
  id:6,
  value:"rolling",
  name:"Rolling"
},
{
  id:7,
  value:"packing",
  name:"Packing"
},
{
  id:8,
  value:"jobWork",
  name:"JobWork"
},
{
  id:9,
  value:"warping",
  name:"Warping"
},
]
const Login = () => {
const navigate = useNavigate();
const dispatch = useDispatch();
const { user,loading,error } = useSelector(state=> state.auth);

  const [formData, setFormData] = useState({
    role: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const data = await dispatch(login(formData)).unwrap();
    console.log("data comes from login action:", data);
    if (!data.success) {
      alert(data.message);
      return;
    }

  
    navigate("/dashboard");

  } catch (err) {

    console.error(err);

    alert("Server Error");

  }
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ width: 400 }}>
        <CardContent>

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>

              <Select
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleChange}
              >
                {loginData.map((i)=>{
                  return   <MenuItem id={i.id} value={i.value}>{i.name}</MenuItem>
                })}
                
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 3 }}
            >
              Login
            </Button>

          </Box>

        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;