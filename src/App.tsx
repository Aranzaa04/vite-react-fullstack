import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import TablePage from "./pages/TablePage";
import InventarioCrudPage from "./pages/InventarioCrudPage";
import VentaPage from "./pages/VentaPage";

export default function App() {
  return (
    <Routes>
      {/* Layout principal */}
      <Route element={<AppLayout />}>
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
