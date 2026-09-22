import { getCurrentProcess } from "../productionProcess";

export const productionPrintColumns = [
  {
    key: "soNo",
    label: "SO No",
  },
  {
    key: "cycleID",
    label: "Cycle ID",
  },
  {
    key: "customer",
    label: "Customer",
  },
  {
    key: "product",
    label: "Product",
  },
  {
    key: "commitedDate",
    label: "Committed Date",
  },
  {
    key: "productionTargetQty",
    label: "Target Qty",
  },
  {
    key: "productionQty",
    label: "Production Qty",
  },
  {
    key: "division",
    label: "Division",
  },
  {
    key: "currentProcess",
    label: "Current Process",
    render: (_, row) => {
      const process = getCurrentProcess(row);
      return process.label;
    },
  },
  {
    key: "currentStatus",
    label: "Status",
    render: (_, row) => {
      const process = getCurrentProcess(row);
      return process.status;
    },
  },
];