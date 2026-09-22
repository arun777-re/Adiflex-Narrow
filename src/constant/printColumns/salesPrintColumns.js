export const salesOrderColumns = [
  { key: "soNo", label: "SO No" },
  { key: "date", label: "Date" },
  { key: "skucode", label: "SKU Code" },
  { key: "customer", label: "Customer" },
  { key: "product", label: "Product" },
  { key: "shippinglocation", label: "Shipping Location" },
  { key: "billinglocation", label: "Billing Location" },
  { key: "route", label: "Route" },

  {
    key: "productionstatus",
    label: "Production Status",
    render: (value) => value || "Pending Production",
  },

  {
    key: "dispatchstatus",
    label: "Dispatch Status",
    render: (value) => value || "Pending Dispatch",
  },

  { key: "ordertype", label: "Order Type" },
  { key: "division", label: "Division" },
  { key: "qty", label: "SO Qty" },

  {
    key: "rate",
    label: "Std Rate",
    render: (value) => `₹ ${Number(value || 0).toFixed(2)}`,
  },

  {
    key: "rateadjustment",
    label: "Adjustment",
    render: (value) => `₹ ${Number(value || 0).toFixed(2)}`,
  },

  {
    key: "finalrate",
    label: "Final Rate",
    render: (value) => `₹ ${Number(value || 0).toFixed(2)}`,
  },

  { key: "unit", label: "Unit" },
  { key: "openingFgQty", label: "Opening FG" },
  { key: "productionQty", label: "Production" },

  {
    key: "jobWork",
    label: "Job Work",
    render: (value) => (value ? "Yes" : "No"),
  },

  { key: "manufacturedQty", label: "Manufactured" },
  { key: "dispatchedQty", label: "Dispatched" },
  { key: "orderReceivedBy", label: "Created By" },
];