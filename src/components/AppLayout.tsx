import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  display: "block",
  padding: "10px 12px",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 700,
  color: isActive ? "#111" : "rgba(0,0,0,0.75)",
  background: isActive ? "rgba(0,0,0,0.08)" : "transparent",
  marginBottom: 6,
});

export default function AppLayout() {
  const navigate = useNavigate();
  const { logout, usuario } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f6f8" }}>
      <header
        style={{
          height: 58,
          background: "#667EEA",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          gap: 12,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 18 }}>StockUp</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(0,0,0,0.7)" }}>
            {usuario?.nombre || usuario?.email || "Sesion activa"}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Cerrar sesion
          </button>
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: 16,
          padding: 16,
        }}
      >
        <aside
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 14,
            padding: 12,
            height: "fit-content",
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.65, fontWeight: 800, margin: "6px 8px" }}>
            MENU
          </div>

          <NavLink to="/home" style={linkStyle}>
            🏠Inicio
          </NavLink>

          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.65, fontWeight: 800, marginLeft: 8 }}>
            STOCK / VENTAS
          </div>

          <NavLink to="/proveedores" style={linkStyle}>
            🚚Proveedores
          </NavLink>

          <NavLink to="/inventario" style={linkStyle}>
            📦Inventario
          </NavLink>

          <NavLink to="/compra" style={linkStyle}>
            🛍️Compra
          </NavLink>

          <NavLink to="/ventas" style={linkStyle}>
            🖥️Ventas
          </NavLink>

          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.65, fontWeight: 800, marginLeft: 8 }}>
            USUARIOS
          </div>

          <NavLink to="/usuarios" style={linkStyle}>
            👥Usuarios
          </NavLink>

          <NavLink to="/usuarios/nuevo" style={linkStyle}>
            👤Crear usuario
          </NavLink>

          {/* ESCUPELUPE COMMENTS: descomenta este bloque para reactivar Roles / Permisos
          <NavLink to="/usuarios/roles" style={linkStyle}>
            Roles / Permisos
          </NavLink>
          */}
        </aside>

        <main
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 14,
            padding: 16,
            minHeight: "calc(100vh - 58px - 32px)",
          }}
        >
          <Outlet />
        </main>
      </div>

      <footer style={{ padding: 14, textAlign: "center", opacity: 0.7, fontWeight: 700 }}>
        (c) 2026 StockUp - Proyecto academico
      </footer>
    </div>
  );
}
