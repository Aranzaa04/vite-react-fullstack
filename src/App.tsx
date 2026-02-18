import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import TablePage from "./pages/TablePage";
import InventarioCrudPage from "./pages/InventarioCrudPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />

        <Route
          path="ventas"
          element={<TablePage title="Ventas" path="/api/ventas" />}
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

        {/* 👉 NUEVA RUTA INVENTARIO CRUD */}
        <Route
          path="inventario"
          element={<InventarioCrudPage />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

