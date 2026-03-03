// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Páginas base
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";

// Nuevas páginas
import ProveedoresPage from "./pages/ProveedoresPage";
import InventarioPage from "./pages/InventarioPage";
import CompraPage from "./pages/CompraPage";
import VentasPage from "./pages/VentasPage";

// Usuarios (se conserva)
import TablePage from "./pages/TablePage";

function isLoggedIn() {
  return Boolean(localStorage.getItem("token"));
}

export default function App() {
  const authed = isLoggedIn();

  return (
    <Routes>
      {/* ROOT */}
      <Route path="/" element={<Navigate to={authed ? "/home" : "/login"} replace />} />

      {/* LOGIN */}
      <Route
        path="/login"
        element={authed ? <Navigate to="/home" replace /> : <LoginPage />}
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
          element={<TablePage title="Crear usuario" path="/api/usuarios" />}
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