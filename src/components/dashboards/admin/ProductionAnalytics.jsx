import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material'
import React from 'react'

const ProductionAnalytics = () => {
  return (
   <Grid container spacing={3} mt={1}>
     <Grid
       size={{
         xs: 12,
         lg: 8,
       }}
     >
       <Paper
         elevation={0}
         sx={{
           p: 3,
           borderRadius: 4,
           border: "1px solid #e5e7eb",
           height: 380,
         }}
       >
         <Typography
           variant="h6"
           fontWeight={700}
         >
           Production Trend
         </Typography>
   
         <Typography
           color="text.secondary"
           mb={3}
         >
           Daily Production Analysis
         </Typography>
   
         <Box
           sx={{
             height: 270,
             display: "flex",
             justifyContent: "center",
             alignItems: "center",
             bgcolor: "#f8fafc",
             borderRadius: 3,
           }}
         >
           <Typography
             color="text.secondary"
           >
             📈 Production Chart
             (Recharts Later)
           </Typography>
         </Box>
       </Paper>
     </Grid>
   
     <Grid
       size={{
         xs: 12,
         lg: 4,
       }}
     >
       <Paper
         elevation={0}
         sx={{
           p: 3,
           borderRadius: 4,
           border: "1px solid #e5e7eb",
           height: 380,
         }}
       >
         <Typography
           variant="h6"
           fontWeight={700}
         >
           Division Summary
         </Typography>
   
         <Typography
           color="text.secondary"
           mb={3}
         >
           Live Status
         </Typography>
   
         <Box mb={3}>
           <Typography fontWeight={600}>
             Crochet
           </Typography>
   
           <LinearProgress
             value={82}
             variant="determinate"
             sx={{
               mt: 1,
               height: 10,
               borderRadius: 10,
             }}
           />
   
           <Typography
             mt={1}
             variant="body2"
             color="text.secondary"
           >
             82% Completed
           </Typography>
         </Box>
   
         <Box mb={3}>
           <Typography fontWeight={600}>
             Woven
           </Typography>
   
           <LinearProgress
             color="success"
             value={65}
             variant="determinate"
             sx={{
               mt: 1,
               height: 10,
               borderRadius: 10,
             }}
           />
   
           <Typography
             mt={1}
             variant="body2"
             color="text.secondary"
           >
             65% Completed
           </Typography>
         </Box>
   
         <Box
           sx={{
             mt: 5,
             display: "flex",
             justifyContent: "center",
             alignItems: "center",
             height: 90,
             bgcolor: "#f8fafc",
             borderRadius: 3,
           }}
         >
           <Typography
             color="text.secondary"
           >
             🥧 Pie Chart
           </Typography>
         </Box>
       </Paper>
     </Grid>
   </Grid>
  )
}

export default ProductionAnalytics