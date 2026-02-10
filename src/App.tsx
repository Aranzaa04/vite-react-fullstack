import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import TablePage from "./pages/TablePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Cada ruta carga la tabla AUTOMÁTICAMENTE */}
      <Route
        path="/usuarios"
        element={<TablePage title="Usuarios" path="/api/usuarios" />}
      />
      <Route
        path="/producto"
        element={<TablePage title="Producto" path="/api/producto" />}
      />
      <Route
        path="/ventas"
        element={<TablePage title="Ventas" path="/api/ventas" />}
      />
      <Route
        path="/detalle-venta"
        element={<TablePage title="Detalle Venta" path="/api/detalle_venta" />}
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
