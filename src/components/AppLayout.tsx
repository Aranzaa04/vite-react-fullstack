import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../layout.css";

export default function AppLayout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <header className="topbar">
        <div style={{ fontWeight: 700, fontSize: 18 }}>ShokUp</div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px", opacity: 0.85 }}>
          <span>👤 {usuario?.nombre || "Usuario"}</span>
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              fontSize: "14px",
              textDecoration: "underline",
              padding: "5px 10px",
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="body">
        <aside className="sidebar">
          <div className="menu-title">MENÚ</div>

          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            🏠 Inicio
          </NavLink>
          
          <NavLink to="/inventario" className={({ isActive }) => (isActive ? "active" : "")}>
            📦 Inventario
          </NavLink>

          <NavLink to="/ventas" className={({ isActive }) => (isActive ? "active" : "")}>
            🛍️ Compra
          </NavLink>

          <NavLink to="/producto" className={({ isActive }) => (isActive ? "active" : "")}>
            📦 Inventario1
          </NavLink>

          <NavLink to="/usuarios" className={({ isActive }) => (isActive ? "active" : "")}>
            🖥️ Proveedores
          </NavLink>

          <NavLink to="/detalle-venta" className={({ isActive }) => (isActive ? "active" : "")}>
            🛒 Venta
          </NavLink>

          <NavLink to="/usuarios" className={({ isActive }) => (isActive ? "active" : "")}>
            OTRO MAS
          </NavLink>
        </aside>

        <main className="content">
          <div className="content-surface">
            <Outlet />
          </div>
        </main>
      </div>

      <footer className="footer">© 2026 ShockUp — Proyecto Académico</footer>
    </div>
  );
}
