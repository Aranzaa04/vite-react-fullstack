import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import TablePage from "./pages/TablePage";
import Layout from "./components/AppLayout";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />

      <Route
        path="/"
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Home />} />

        <Route
          path="inventario"
          element={<TablePage title="Inventario" path="/api/inventario" />}
        />
        <Route path="compra" element={<TablePage title="Compra" path="/api/compra" />} />
        <Route path="usuarios" element={<TablePage title="Usuarios" path="/api/usuarios" />} />
        <Route path="venta" element={<TablePage title="Venta" path="/api/venta" />} />
        <Route path="proveedores" element={<TablePage title="Proveedores" path="/api/proveedores" />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
    </Routes>
  );
}
