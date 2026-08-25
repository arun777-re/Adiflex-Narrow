import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const AdminProduction = () => {
  const [division, setDivision] = useState("");

  const handleDivisionChange = (event) => {
    setDivision(event.target.value);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: { xs: 2, md: 4 },
      }}
    >
      <Card
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 700,
          borderRadius: 3,
        }}
      >
        <CardContent
          sx={{
            p: { xs: 3, md: 5 },
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
          >
            Welcome to Production Management
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Please select a production division to continue.
          </Typography>

          <FormControl fullWidth>
            <InputLabel id="production-division-label">
              Select Division of Production
            </InputLabel>

            <Select
              labelId="production-division-label"
              value={division}
              label="Select Division of Production"
              onChange={handleDivisionChange}
            >
              <MenuItem value="CROCHET">
                Crochet
              </MenuItem>

              <MenuItem value="WEAVING">
                Weaving
              </MenuItem>
            </Select>
          </FormControl>

          {division && (
            <Typography
              sx={{
                mt: 3,
                fontWeight: 600,
              }}
            >
              Selected Division: {division}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminProduction;