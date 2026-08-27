
import { TableContainer,Paper,Table,TableHead,TableRow,TableCell,TableBody,Chip } from '@mui/material';

const RecentOrderTable = ({recentOrders}) => {
  return (
   <TableContainer component={Paper}>
  <Table size="small">

    <TableHead>
      <TableRow>
        <TableCell>SO No</TableCell>
        <TableCell>Customer</TableCell>
        <TableCell>Product</TableCell>
        <TableCell>Division</TableCell>
        <TableCell>Status</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>

      {recentOrders.map((row)=>(

        <TableRow key={row.soNo + row.skuCode}>

          <TableCell>{row.soNo}</TableCell>

          <TableCell>{row.customer}</TableCell>

          <TableCell>{row.product}</TableCell>

          <TableCell>{row.division}</TableCell>

          <TableCell>

            <Chip
              label={row.status}
              color={
                row.status==="Completed"
                ? "success"
                : row.status==="Pending"
                ? "warning"
                : "primary"
              }
              size="small"
            />

          </TableCell>

        </TableRow>

      ))}

    </TableBody>

  </Table>
</TableContainer>
  )
}

export default RecentOrderTable