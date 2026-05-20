import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.tsx";

import { ThemeProvider } from "@/components/theme-provider.tsx";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { Provider } from "react-redux";

import {
  PersistGate,
} from "redux-persist/integration/react";

import {store,persistor} from "./store/store.ts";

createRoot(
  document.getElementById(
    "root"
  )!
).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={
          persistor
        }
      >
        <ThemeProvider>
          <App />

          <ToastContainer
            position="top-right"
            autoClose={3000}
          />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);