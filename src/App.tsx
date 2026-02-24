import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import TablePage from "./pages/TablePage";
import Layout from "./components/AppLayout";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

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
          path="/proveedores"
          element={<TablePage title="Proveedores" path="/api/proovedores" />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
