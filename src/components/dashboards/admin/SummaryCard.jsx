import { Box, Grid, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import React from 'react'

const SummaryCard = () => {
  return (
    <Grid
      container
      spacing={3}
      mt={1}
    >
      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={3}
          >
            Production Summary
          </Typography>
    
          <Stack spacing={3}>
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography>
                  Pending Orders
                </Typography>
    
                <Typography
                  fontWeight={700}
                >
                  12
                </Typography>
              </Stack>
    
              <LinearProgress
                color="error"
                value={30}
                variant="determinate"
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 10,
                }}
              />
            </Box>
    
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography>
                  Running Orders
                </Typography>
    
                <Typography
                  fontWeight={700}
                >
                  18
                </Typography>
              </Stack>
    
              <LinearProgress
                color="warning"
                value={58}
                variant="determinate"
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 10,
                }}
              />
            </Box>
    
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography>
                  Completed
                </Typography>
    
                <Typography
                  fontWeight={700}
                >
                  78
                </Typography>
              </Stack>
    
              <LinearProgress
                color="success"
                value={92}
                variant="determinate"
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 10,
                }}
              />
            </Box>
          </Stack>
        </Paper>
      </Grid>
    
      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={3}
          >
            Dispatch Summary
          </Typography>
    
          <Stack spacing={3}>
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography>
                  Ready To Dispatch
                </Typography>
    
                <Typography
                  fontWeight={700}
                >
                  22
                </Typography>
              </Stack>
    
              <LinearProgress
                color="primary"
                value={75}
                variant="determinate"
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 10,
                }}
              />
            </Box>
    
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography>
                  Pending Dispatch
                </Typography>
    
                <Typography
                  fontWeight={700}
                >
                  8
                </Typography>
              </Stack>
    
              <LinearProgress
                color="warning"
                value={40}
                variant="determinate"
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 10,
                }}
              />
            </Box>
    
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography>
                  Today's Dispatch
                </Typography>
    
                <Typography
                  fontWeight={700}
                >
                  15
                </Typography>
              </Stack>
    
              <LinearProgress
                color="success"
                value={90}
                variant="determinate"
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 10,
                }}
              />
            </Box>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default SummaryCard