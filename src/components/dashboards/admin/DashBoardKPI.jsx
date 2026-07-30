import { Grid, Paper,Stack,Box,Typography, Avatar, LinearProgress } from '@mui/material'
import React from 'react'

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        height: "100%",
        border: "1px solid #e5e7eb",
        transition: ".25s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 18px 40px rgba(0,0,0,.12)",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
      >
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {title}
          </Typography>

          <Typography
            mt={1}
            variant="h4"
            fontWeight={700}
          >
            {value}
          </Typography>

          <Typography
            mt={1}
            variant="caption"
            color="text.secondary"
          >
            {subtitle}
          </Typography>
        </Box>

        <Avatar
          sx={{
            bgcolor: color,
            width: 58,
            height: 58,
          }}
        >
          {icon}
        </Avatar>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={75}
        sx={{
          mt: 3,
          height: 7,
          borderRadius: 10,
        }}
      />
    </Paper>
  );
};
const DashBoardKPI = ({dashboardCards}) => {
  return (
<>
      <Grid container spacing={3}>
        {dashboardCards.map((card) => (
          <Grid
            key={card.title}
            size={{
              xs: 12,
              sm: 6,
              lg: 3,
            }}
          >
            <DashboardCard {...card} />
          </Grid>
        ))}
      </Grid>
      </>
  )
}

export default DashBoardKPI