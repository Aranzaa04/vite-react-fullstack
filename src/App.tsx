import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import TablePage from "./pages/TablePage";
import InventarioCrudPage from "./pages/InventarioCrudPage";
import VentaPage from "./pages/VentaPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Ruta de Login (pública) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Layout principal (protegido) */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Página de Compra / Venta estilo supermercado */}
        <Route
          path="compra"
          element={<VentaPage />}
        />

        {/* Tablas clásicas */}
        <Route
          path="ventas"
          element={<TablePage title="Ventas" path="/api/venta" />}
        />

        <Route
          path="producto"
          element={<TablePage title="Producto" path="/api/producto" />}
        />

        <Route
          path="usuarios"
          element={<TablePage title="Usuarios" path="/api/usuarios" />}
        />

        <Route
          path="detalle-venta"
          element={<TablePage title="Detalle Venta" path="/api/detalle_venta" />}
        />

        {/* 👉 INVENTARIO (CRUD) */}
        <Route
          path="inventario"
          element={<InventarioCrudPage />}
        />

        {/* 👉 VENTA TIPO SUPERMERCADO */}
        <Route
          path="venta"
          element={<VentaPage />}
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
