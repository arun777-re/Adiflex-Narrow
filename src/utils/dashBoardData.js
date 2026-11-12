import EmployeeDashboard from "../components/daily-tasks/EmployeeDashboard";
import AdminDashBoard from "../components/dashboards/admin/AdminDashBoard";
import BillingDashBoard from "../components/dashboards/BillingDashBoard";
import DispatchDashBoard from "../components/dashboards/DispatchDashBoard";
import MerchandiserDashBoard from "../components/dashboards/MerchandiserDashBoard";
import PackingDashBoard from "../components/dashboards/production/PackingDashBoard";
import ProductionDashBoard from "../components/dashboards/production/ProductionDashBoard";
import QualityDashBoard from "../components/dashboards/production/QualityDashBoard";

export const DASHBOARD_COMPONENTS = {
  admin: AdminDashBoard,
  productionSupervisor: ProductionDashBoard,
  supervisor: MerchandiserDashBoard,
  dispatch: DispatchDashBoard,
  billing: BillingDashBoard,
  employee:EmployeeDashboard,
  qualitysupervisor:QualityDashBoard,
  packingsupervisor:PackingDashBoard
};