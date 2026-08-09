import React from "react";
import { useSelector } from "react-redux";

import DispatchSummaryCards from "../dispatch/DispatchSummaryCards";

const DispatchDashBoard = () => {
  const { dispatchOrders = [] } = useSelector(
    (state) => state.dispatch
  );

  return (
    <div>
      <DispatchSummaryCards rows={dispatchOrders} />
    </div>
  );
};

export default DispatchDashBoard;