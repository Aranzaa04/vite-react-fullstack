// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Páginas
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";

// Nuevas páginas
import ProveedoresPage from "./pages/ProveedoresPage";
import InventarioPage from "./pages/InventarioPage";
import CompraPage from "./pages/CompraPage";
import VentasPage from "./pages/VentasPage";

// Usuarios (NO lo quitamos)
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
        <Route path="/home" element={<Home />} />

        {/* NUEVO */}
        <Route path="/proveedores" element={<ProveedoresPage />} />
        <Route path="/inventario" element={<InventarioPage />} />
        <Route path="/compra" element={<CompraPage />} />
        <Route path="/ventas" element={<VentasPage />} />

        {/* USUARIOS (se conserva, sin endpoint para evitar error) */}
        <Route path="/usuarios" element={<TablePage title="Usuarios" />} />
        <Route path="/usuarios/nuevo" element={<TablePage title="Crear usuario" />} />
        <Route path="/usuarios/roles" element={<TablePage title="Roles / Permisos" />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}