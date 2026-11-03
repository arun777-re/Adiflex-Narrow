import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import SalesOrder from "./pages/sales-order/SalesOrder";
import SalesOrderCreate from "./pages/sales-order/SalesOrderCreate";
import ProductionDashboard from "./pages/Production/ProductionDashBoard";
import DispatchPage from "./pages/dispatch/DispatchPage";
import Inventory from "./pages/Inventory";
import ViewAllProducts from "./pages/product/ViewAllProducts";
import CreateProduct from "./pages/product/CreateProduct";
import ActivityLog from "./pages/ActivityLog";
import CompleteDispatch from "./pages/CompleteDispatch";
import BillingPage from "./pages/billing/BillingPage";
import CompleteBilling from "./pages/billing/CompleteBilling";
import AdminProduction from "./pages/admin/AdminProduction";
import JobWorkOrders from "./pages/Production/JobWorkOrders";
import AnalysisPage from "./pages/admin/AnalysisPage";
import DailyTaskAdmin from "./pages/daily-tasks/admin/DailyTaskAdmin";
import DailyTaskEmployee from "./pages/daily-tasks/employee/DailyTaskEmployee";
import DelegationTask from "./pages/daily-tasks/employee/DelegationTask";
import AdminRoleManager from './pages/admin/AdminRoleManager';
import QualitySupervisorTable from "./components/production/QualitySupervisorTable";
import PackingSupervisorTable from "./components/production/PackingSupervisorTable";
import CompletedPendingOrders from "./pages/Production/CompletedPendingOrders";
import HolidayPage from "./pages/holiday/HolidayPage";

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
          path="/quality-production"
          element={<QualitySupervisorTable/>}
        />
          <Route
          path="/packing-production"
          element={<PackingSupervisorTable/>}
        />
          <Route
          path="/pending-completed-orders"
          element={<CompletedPendingOrders/>}
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
          element={<AnalysisPage/>}
        />
          <Route
          path="/complete-dispatch"
          element={<CompleteDispatch/>}
        />
          <Route
          path="/billing"
          element={<BillingPage/>}
        />
          <Route
          path="/billing-done"
          element={<CompleteBilling/>}
        />
          <Route
          path="/admin-production"
          element={<AdminProduction/>}
        />
          <Route
          path="/jobwork-orders"
          element={<JobWorkOrders/>}
        />
          <Route
          path="/admin/daily-tasks"
          element={<DailyTaskAdmin/>}
        />
          <Route
          path="/employee/daily-tasks"
          element={<DailyTaskEmployee/>}
        />
          <Route
          path="/employee/delegation"
          element={<DelegationTask/>}
        />
          <Route
          path="/admin/create-view/users"
          element={<AdminRoleManager/>}
        />
          <Route
          path="/company-holidays"
          element={<HolidayPage/>}
        />

      </Route>

    </Routes>

  );
}

export default App;