import { useMemo, useState } from "react";

import SalesOrderToolbar from "../../components/sales/SalesOrderToolbar";
import SalesOrderFilters from "../../components/sales/SalesOrderFilters";
import SalesOrderTable from "../../components/sales/SalesOrderTable";

import dummySalesData from "../../utils/dummySalesData";

const SalesOrderList = () => {
  const [loading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    date: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFilters({
      search: "",
      date: "",
      status: "",
    });
  };

  const filteredRows = useMemo(() => {
    return dummySalesData.filter((row) => {
      const search = filters.search.toLowerCase();

      const matchSearch =
        row.soNo.toLowerCase().includes(search) ||
        row.customer.toLowerCase().includes(search) ||
        row.product.toLowerCase().includes(search);

      const matchStatus =
        !filters.status || row.status === filters.status;

      const matchDate =
        !filters.date || row.date === filters.date;

      return matchSearch && matchStatus && matchDate;
    });
  }, [filters]);

  return (
    <>
      <SalesOrderToolbar />

      <SalesOrderFilters
        filters={filters}
        onChange={handleChange}
        onReset={handleReset}
      />

      <SalesOrderTable
        rows={filteredRows}
        loading={loading}
      />
    </>
  );
};

export default SalesOrderList;