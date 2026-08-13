import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import SalesOrder from "./pages/SalesOrder";
import SalesOrderCreate from "./pages/SalesOrderCreate";
import ProductionDashboard from "./pages/Production/ProductionDashBoard";
import DispatchPage from "./pages/DispatchPage";
import Inventory from "./pages/Inventory";
import ViewAllProducts from "./pages/ViewAllProducts";
import CreateProduct from "./pages/CreateProduct";
import ActivityLog from "./pages/ActivityLog";
import Reports from "./pages/Reports";
import CompleteDispatch from "./pages/CompleteDispatch";

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
          <Route
          path="/dispatch"
          element={<DispatchPage/>}
        />
          <Route
          path="/inventory"
          element={<Inventory/>}
        />
          <Route
          path="/view-product"
          element={<ViewAllProducts/>}
        />
          <Route
          path="/create-product"
          element={<CreateProduct/>}
        />
          <Route
          path="/activity-log"
          element={<ActivityLog/>}
        />
          <Route
          path="/reports"
          element={<Reports/>}
        />
          <Route
          path="/complete-dispatch"
          element={<CompleteDispatch/>}
        />

      </Route>

    </Routes>

  );
}

export default App;