import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import SalesOrder from "./pages/SalesOrder";
import SalesOrderCreate from "./pages/SalesOrderCreate";
import Production from "./pages/Production";
import ProductionDashboard from "./pages/Production/ProductionDashBoard";

function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
          <Route
          path="/sales-order/create"
          element={<SalesOrderCreate />}
        />
          <Route
          path="/sales-order"
          element={<SalesOrder />}
        />
          <Route
          path="/production"
          element={<ProductionDashboard/>}
        />

      </Route>

    </Routes>

  );
}

export default App;