import { ROLES } from "./roles";


export const routeConfig = {

  // ==========================================
  // DASHBOARD
  // ==========================================

  "/dashboard": [

    ROLES.ADMIN,

    ROLES.PRODUCTION_SUPERVISOR,

    ROLES.DISPATCH,

    ROLES.SUPERVISOR,

  ],


  // ==========================================
  // SALES ORDERS
  // ==========================================

  "/sales-order": [

    ROLES.ADMIN,
    ROLES.SUPERVISOR

  ],


  "/sales-order/create": [

    ROLES.ADMIN,
    ROLES.SUPERVISOR

  ],


  // ==========================================
  // PRODUCTION
  // ==========================================

  "/production": [

    ROLES.ADMIN,

    ROLES.PRODUCTION_SUPERVISOR,

  ],


  // ==========================================
  // INVENTORY
  // ==========================================

  "/inventory": [

    ROLES.ADMIN,

    ROLES.PRODUCTION_SUPERVISOR,

    ROLES.DISPATCH,

  ],


  // ==========================================
  // DISPATCH
  // ==========================================

  "/dispatch": [

    ROLES.ADMIN,

    ROLES.DISPATCH,

  ],


  // ==========================================
  // MONITORING
  // ==========================================

  "/monitoring": [

    ROLES.ADMIN,

    ROLES.SUPERVISOR,

  ],


  // ==========================================
  // REPORTS
  // ==========================================

  "/reports": [

    ROLES.ADMIN,

    ROLES.SUPERVISOR,

  ],


  // ==========================================
  // ACTIVITY LOG
  // ==========================================

  "/activity-log": [

    ROLES.ADMIN,

  ],

};