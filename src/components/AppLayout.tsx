import { NavLink, Outlet } from "react-router-dom";
import "../layout.css";

export default function AppLayout() {
  return (
    <div className="layout">
      <header className="topbar">
        <div style={{ fontWeight: 700, fontSize: 18 }}>ShokUp</div>
        <div style={{ opacity: 0.85 }}>👤 Admin</div>
      </header>

      <div className="body">
        <aside className="sidebar">
          <div className="menu-title">MENÚ</div>

          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            🏠 Inicio
          </NavLink>

          <NavLink to="/ventas" className={({ isActive }) => (isActive ? "active" : "")}>
            🛍️ Compra
          </NavLink>

          <NavLink to="/producto" className={({ isActive }) => (isActive ? "active" : "")}>
            📦 Inventario
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

      <footer className="footer">© 2026 Inventory System — Proyecto Académico</footer>
    </div>
  );
}
