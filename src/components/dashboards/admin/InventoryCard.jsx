import { Chip, Typography ,Box,Stack, Grid, Paper, LinearProgress} from '@mui/material'
import React from 'react'

const InventoryCard = () => {
  return (
  <Grid
  container
  spacing={3}
  mt={1}
>

  <Grid
    size={{
      xs:12,
      md:5
    }}
  >

    <Paper
      elevation={0}
      sx={{
        p:3,
        borderRadius:4,
        border:"1px solid #e5e7eb"
      }}
    >

      <Typography
        variant="h6"
        fontWeight={700}
        mb={3}
      >
        Inventory Overview
      </Typography>

      <Stack spacing={3}>

        <Box>

          <Stack
            direction="row"
            justifyContent="space-between"
          >

            <Typography>
              Finished Goods
            </Typography>

            <Typography
              fontWeight={700}
            >
              18,420
            </Typography>

          </Stack>

          <LinearProgress
            value={80}
            variant="determinate"
            sx={{
              mt:1,
              height:8,
              borderRadius:10
            }}
          />

        </Box>

        <Box>

          <Stack
            direction="row"
            justifyContent="space-between"
          >

            <Typography>
              Raw Material
            </Typography>

            <Typography
              fontWeight={700}
            >
              73%
            </Typography>

          </Stack>

          <LinearProgress
            color="warning"
            value={73}
            variant="determinate"
            sx={{
              mt:1,
              height:8,
              borderRadius:10
            }}
          />

        </Box>

        <Box>

          <Stack
            direction="row"
            justifyContent="space-between"
          >

            <Typography>
              Packing Material
            </Typography>

            <Typography
              fontWeight={700}
            >
              54%
            </Typography>

          </Stack>

          <LinearProgress
            color="success"
            value={54}
            variant="determinate"
            sx={{
              mt:1,
              height:8,
              borderRadius:10
            }}
          />

        </Box>

      </Stack>

    </Paper>

  </Grid>

  <Grid
    size={{
      xs:12,
      md:7
    }}
  >

    <Paper
      elevation={0}
      sx={{
        p:3,
        borderRadius:4,
        border:"1px solid #e5e7eb"
      }}
    >

      <Typography
        variant="h6"
        fontWeight={700}
        mb={3}
      >
        Recent Orders
      </Typography>

      {[
        {
          so:"ANF00012",
          product:"20MM Grey Bending",
          qty:5000,
          status:"Running"
        },
        {
          so:"ANF00013",
          product:"Elastic",
          qty:1200,
          status:"Pending"
        },
        {
          so:"ANF00014",
          product:"Tape",
          qty:2500,
          status:"Dispatch"
        },
        {
          so:"ANF00015",
          product:"Cord",
          qty:900,
          status:"Completed"
        }
      ].map((item,index)=>(

        <Stack
          key={item.so}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            py:2,
            borderBottom:
              index!==3
                ? "1px solid #eee"
                : "none"
          }}
        >

          <Box>

            <Typography
              fontWeight={700}
            >
              {item.so}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {item.product}
            </Typography>

          </Box>

          <Box
            textAlign="right"
          >

            <Typography
              fontWeight={700}
            >
              {item.qty}
            </Typography>

            <Chip

              size="small"
              color={
                item.status==="Completed"
                  ? "success"
                  : item.status==="Running"
                  ? "warning"
                  : item.status==="Dispatch"
                  ? "primary"
                  : "error"
              }
              label={item.status}
            />

          </Box>

        </Stack>

      ))}

    </Paper>

  </Grid>

</Grid>
  )
}

export default InventoryCard