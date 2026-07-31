import { Paper, Typography } from '@mui/material'
import React from 'react'

const Header = () => {
  return (
   <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 5,
          color: "#fff",
          background:
            "linear-gradient(135deg,#1565c0,#42a5f5)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Welcome Back 👋
        </Typography>

        <Typography mt={1}>
          S.R. Technologies Enterprise ERP
        </Typography>

        <Typography
          mt={3}
          variant="body2"
        >
          Monitor Production, Inventory,
          Dispatch and Sales from one place.
        </Typography>
      </Paper>
  )
}

export default Header