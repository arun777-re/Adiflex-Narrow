import Chip from "@mui/material/Chip";

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "warning";
    case "Production":
      return "info";
    case "Printing":
      return "secondary";
    case "Packing":
      return "primary";
    case "Dispatch":
      return "success";
    case "Completed":
      return "success";
    default:
      return "default";
  }
};

const salesColumns = [
  {
    field: "soNo",
    headerName: "SO No",
    flex: 1,
  },
  {
    field: "date",
    headerName: "Date",
    flex: 1,
  },
  {
    field: "customer",
    headerName: "Customer",
    flex: 1.5,
  },
  {
    field: "product",
    headerName: "Product",
    flex: 1.5,
  },
  {
    field: "qty",
    headerName: "Qty",
    flex: 0.8,
  },
  {
    field: "receivedBy",
    headerName: "Received By",
    flex: 1.2,
  },
  {
    field: "progress",
    headerName: "Progress",
    flex: 1,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1.2,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={getStatusColor(params.value)}
        size="small"
      />
    ),
  },
];

export default salesColumns;