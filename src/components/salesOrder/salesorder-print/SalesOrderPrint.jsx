
import React from "react";

const SalesOrderPrint = ({ rows = [] }) => {
  return (
    <div className="sales-order-print">
      {/* ================= HEADER ================= */}
      <div className="print-header">
        <h1>SALES ORDER REPORT</h1>

        <div className="print-meta">
          <span>
            <strong>Generated:</strong>{" "}
            {new Date().toLocaleDateString("en-IN")}
          </span>

          <span>
            <strong>Total Orders:</strong> {rows.length}
          </span>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <table>
        <thead>
          <tr>
            <th>SO No</th>
            <th>Date</th>
            <th>SKU Code</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Shipping Location</th>
            <th>Billing Location</th>
            <th>Route</th>
            <th>Production Status</th>
            <th>Dispatch Status</th>
            <th>Order Type</th>
            <th>Division</th>
            <th>SO Qty</th>
            <th>Std Rate</th>
            <th>Adjustment</th>
            <th>Final Rate</th>
            <th>Unit</th>
            <th>Opening FG</th>
            <th>Production</th>
            <th>Job Work</th>
            <th>Manufactured</th>
            <th>Dispatched</th>
            <th>Created By</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.soNo}-${row.product}-${index}`}>
              <td>{row.soNo || "-"}</td>
              <td>{row.date || "-"}</td>
              <td>{row.skucode || "-"}</td>
              <td>{row.customer || "-"}</td>
              <td>{row.product || "-"}</td>
              <td>{row.shippinglocation || "-"}</td>
              <td>{row.billinglocation || "-"}</td>
              <td>{row.route || "-"}</td>

              <td>
                {row.productionstatus || "Pending Production"}
              </td>

              <td>
                {row.dispatchstatus || "Pending Dispatch"}
              </td>

              <td>{row.ordertype || "-"}</td>
              <td>{row.division || "-"}</td>

              <td>{row.qty ?? 0}</td>

              <td>
                ₹ {Number(row.rate || 0).toFixed(2)}
              </td>

              <td>
                ₹ {Number(row.rateadjustment || 0).toFixed(2)}
              </td>

              <td>
                ₹ {Number(row.finalrate || 0).toFixed(2)}
              </td>

              <td>{row.unit || "-"}</td>

              <td>{row.openingFgQty ?? 0}</td>

              <td>{row.productionQty ?? 0}</td>

              <td>
                {row.jobWork ? "Yes" : "No"}
              </td>

              <td>{row.manufacturedQty ?? 0}</td>

              <td>{row.dispatchedQty ?? 0}</td>

              <td>{row.orderReceivedBy || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= FOOTER ================= */}
      <div className="print-footer">
        <span>
          Total Orders: <strong>{rows.length}</strong>
        </span>

        <span>
          Printed on:{" "}
          {new Date().toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
};

export default SalesOrderPrint;
