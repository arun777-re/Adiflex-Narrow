import { DataGrid } from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";

const DataTable = ({
  rows = [],
  columns = [],
  loading = false,
  pageSize = 10,
  checkboxSelection = false,
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 600,
        }}
      >
        {/* production */}
        {/* <DataTable
   rows={orders}
   columns={salesColumns}
   loading={loading}
/> */}
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize,
              },
            },
          }}
          sx={{
            border: 0,

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#1976d2",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 15,
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f5f7fb",
            },

            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default DataTable;