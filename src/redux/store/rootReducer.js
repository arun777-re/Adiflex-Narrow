import { combineReducers } from "@reduxjs/toolkit";


import authReducer from '../slices/authSlices.jsx';
import salesOrderReducer from '../slices/salesOrderSlice.jsx';
import productionReducer from '../slices/productionSlice.jsx'
import dispatchReducer from '../slices/dispatchSlice.jsx'

export const rootReducer = combineReducers({
  auth: authReducer,
  salesOrder: salesOrderReducer,
  production:productionReducer,
  dispatch:dispatchReducer

});