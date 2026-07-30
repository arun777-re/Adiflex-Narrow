import AdminDashBoard from "../components/dashboards/admin/AdminDashBoard";
import BillingDashBoard from "../components/dashboards/BillingDashBoard";
import DispatchDashBoard from "../components/dashboards/DispatchDashBoard";
import MerchandiserDashBoard from "../components/dashboards/MerchandiserDashBoard";
import ProductionDashBoard from "../components/dashboards/ProductionDashBoard";

export const DASHBOARD_COMPONENTS = {
  admin: AdminDashBoard,
  productionSupervisor: ProductionDashBoard,
  supervisor: MerchandiserDashBoard,
  dispatch: DispatchDashBoard,
  billing: BillingDashBoard,
};