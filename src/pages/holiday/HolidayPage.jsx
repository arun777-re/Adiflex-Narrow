import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import {
  CalendarMonth,
  Add,
  EventAvailable,
} from "@mui/icons-material";

import CreateHoliday from "../../components/holiday/CreateHoliday";
import ViewHoliday from "../../components/holiday/ViewHoliday";

const HolidayPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CalendarMonth color="primary" />
              <Typography variant="h5" fontWeight={700}>
                Holiday Management
              </Typography>
            </Stack>

            <Typography color="text.secondary" variant="body2" mt={0.7}>
              Manage company holidays and maintain your working-day calendar.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setActiveTab(1)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 2.5,
            }}
          >
            Add Holiday
          </Button>
        </Stack>

        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          sx={{
            mt: 3,
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 48,
            },
          }}
        >
          <Tab
            icon={<EventAvailable />}
            iconPosition="start"
            label="All Holidays"
          />
          <Tab
            icon={<Add />}
            iconPosition="start"
            label="Create Holiday"
          />
        </Tabs>
      </Paper>

      {activeTab === 0 ? (
        <ViewHoliday />
      ) : (
        <CreateHoliday onSuccess={() => setActiveTab(0)} />
      )}
    </Box>
  );
};

export default HolidayPage;