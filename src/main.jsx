import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import theme from "./theme";

import { store, persistor } from "../src/redux/store/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App/>
          </ThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);