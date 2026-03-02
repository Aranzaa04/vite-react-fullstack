import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import TablePage from "./pages/TablePage";
import Layout from "./components/AppLayout";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
              <div>Cargando...</div>
            </div>
          ) : isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />

        <Route
          path="/inventario"
          element={<TablePage title="Inventario" path="/api/inventario" />}
        />
        <Route
          path="/compra"
          element={<TablePage title="Compra" path="/api/compra" />}
        />
        <Route
          path="/usuarios"
          element={<TablePage title="Usuarios" path="/api/usuarios" />}
        />
         <Route
          path="/venta"
          element={<TablePage title="Venta" path="/api/venta" />}
        />
        <Route
          path="/proveedores"
          element={<TablePage title="Proveedores" path="/api/proveedores" />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
