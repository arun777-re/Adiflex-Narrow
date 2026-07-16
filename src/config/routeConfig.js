import { ROLES } from "./roles";

export const routeConfig = {
  "/dashboard": [
    ROLES.ADMIN,
    ROLES.SALES,
    ROLES.PRODUCTION,
    ROLES.PRINTING,
    ROLES.PACKING,
    ROLES.DISPATCH,
  ],

  "/sales-order": [
    ROLES.ADMIN,
    ROLES.SALES,
  ],

  "/sales-order/create": [
    ROLES.ADMIN,
    ROLES.SALES,
  ],

  "/production": [
    ROLES.ADMIN,
    ROLES.PRODUCTION,
  ],

  "/printing": [
    ROLES.ADMIN,
    ROLES.PRINTING,
  ],

  "/packing": [
    ROLES.ADMIN,
    ROLES.PACKING,
  ],

  "/dispatch": [
    ROLES.ADMIN,
    ROLES.DISPATCH,
  ],

  "/activity-log": [
    ROLES.ADMIN,
  ],
};