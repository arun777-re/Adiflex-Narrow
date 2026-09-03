import { combineReducers } from "@reduxjs/toolkit";


import authReducer from '../slices/authSlices.jsx';
import salesOrderReducer from '../slices/salesOrderSlice.jsx';
import productionReducer from '../slices/productionSlice.jsx' 
import dispatchReducer from '../slices/dispatchSlice.jsx';
import productReducer from '../slices/productSlice.jsx';
import fgReducer from '../slices/fgSlice.jsx';
import dashboardReducer from '../slices/dashboardSlice.jsx';
import billingReducer from '../slices/billingSlice.jsx';
import analyticsReducer from '../slices/analyticsSlice.jsx';
import activityReducer from '../slices/activitySlice.jsx';

export const rootReducer = combineReducers({
  auth: authReducer,
  salesOrder: salesOrderReducer,
  production:productionReducer,
  dispatch:dispatchReducer,
  product:productReducer,
  fginventory:fgReducer,
  dashboard:dashboardReducer,
  billing:billingReducer,
  analytics:analyticsReducer,
  activity:activityReducer,
});