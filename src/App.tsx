// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

// Páginas base
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";

// Nuevas páginas
import ProveedoresPage from "./pages/ProveedoresPage";
import InventarioPage from "./pages/InventarioPage";
import CompraPage from "./pages/CompraPage";
import VentasPage from "./pages/VentasPage";
import CreateUserPage from "./pages/CreateUserPage";

import TablePage from "./pages/TablePage";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Routes>
      {/* ROOT */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />

      {/* LOGIN */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />}
      />

      {/* ÁREA PROTEGIDA */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Home */}
        <Route path="/home" element={<Home />} />

        {/* StockUp */}
        <Route path="/proveedores" element={<ProveedoresPage />} />
        <Route path="/inventario" element={<InventarioPage />} />
        <Route path="/compra" element={<CompraPage />} />
        <Route path="/ventas" element={<VentasPage />} />

        {/* USUARIOS (se conserva) */}
        <Route path="/usuarios" element={<TablePage title="Usuarios" path="/api/usuarios" />} />
        <Route
          path="/usuarios/nuevo"
          element={<CreateUserPage />}
        />
        <Route
          path="/usuarios/roles"
          element={<TablePage title="Roles / Permisos" path="/api/usuarios" />}
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
