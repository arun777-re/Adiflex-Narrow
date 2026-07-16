import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storageImport from "redux-persist/lib/storage";
import {logger} from "redux-logger";

import { rootReducer } from "./rootReducer";
const storage = storageImport.default ?? storageImport;

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "salesOrder",
  ],
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(logger),
});

export const persistor = persistStore(store);