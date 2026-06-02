import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./styles/global.css";

import {
  BrowserRouter,
} from "react-router-dom";

import {
  AuthProvider,
} from "./context/AuthProvider";

import {
  ThemeProvider,
} from "./context/ThemeContext";

import {
  Toaster,
} from "react-hot-toast";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <BrowserRouter>

      <ThemeProvider>

        <AuthProvider>

          <Toaster
            position="top-right"
            toastOptions={{

            style: {

              background: "#111827",
              color: "#fff",
              borderRadius: "14px",
              padding: "14px 18px",
              fontSize: "14px",
              fontWeight: "600",

            },

            success: {

              iconTheme: {

                primary: "#22c55e",
                secondary: "#fff",

              },

            },

            error: {

              iconTheme: {

                primary: "#ef4444",
                secondary: "#fff",

              },

            },

          }}
        />

        <App />

      </AuthProvider>

      </ThemeProvider>

    </BrowserRouter>

  </React.StrictMode>
);