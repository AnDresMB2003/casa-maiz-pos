import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";

import Inventory from "./pages/Inventory";

import Sales from "./pages/Sales";

import Reports from "./pages/Reports";

import Customers from "./pages/Customers";

import Settings from "./pages/Settings";

import Login from "./pages/Login";

import Users from "./pages/Users";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {

  return (

    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* DASHBOARD */}
      <Route
        path="/"
        element={
          <ProtectedRoute>

            <Dashboard />

          </ProtectedRoute>
        }
      />

      {/* INVENTORY */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>

            <Inventory />

          </ProtectedRoute>
        }
      />

      {/* SALES */}
      <Route
        path="/sales"
        element={
          <ProtectedRoute>

            <Sales />

          </ProtectedRoute>
        }
      />

      {/* REPORTS */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>

            <Reports />

          </ProtectedRoute>
        }
      />

      {/* CUSTOMERS */}
      <Route
        path="/customers"
        element={
          <ProtectedRoute>

            <Customers />

          </ProtectedRoute>
        }
      />

      {/* SETTINGS */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>

            <Settings />

          </ProtectedRoute>
        }
      />

      {/* USERS */}
      <Route
        path="/users"
        element={
          <ProtectedRoute>

            <Users />

          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;