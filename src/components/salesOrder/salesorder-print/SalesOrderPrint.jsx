
const SalesOrderPrint = ({
  rows = [],
  title = "REPORT",
  columns = [],
  meta = [],
  footer = true,
}) => {
  console.log("rows coming for print..........",rows);
  const formatValue = (value, column, row) => {
    if (column.render) {
      return column.render(value, row);
    }
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    return value;
  };
  return (
    <div className="sales-order-print">
      {/* ================= HEADER ================= */}
      <div className="print-header">
        <h1>{title}</h1>

        <div className="print-meta">
          <span>
            <strong>Generated:</strong> {new Date().toLocaleDateString("en-IN")}
          </span>

          <span>
            <strong>Total Orders:</strong> {rows.length}
          </span>
          {meta.map((item, index) => (
            <span key={index}>
              <strong>{item.label}:</strong>
              {item.value ?? "-"}
            </span>
          ))}
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <table>
        <thead>
          <tr>
            {columns.map((column,index) => (
              <th key={`header-${column.key}-${index}`}>{column.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <tr key={`print-row-${row.id ?? row.cycleID ?? rowIndex}-${rowIndex}`}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {formatValue(row[column.key], column, row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ================= FOOTER ================= */}
      {footer && (
        <div className="print-footer">
          <span>
            Total Records: <strong>{rows.length}</strong>
          </span>

          <span>
            Printed on: {new Date().toLocaleString("en-IN")}
          </span>
        </div>
      )}
    </div>
  );
};

export default SalesOrderPrint;
