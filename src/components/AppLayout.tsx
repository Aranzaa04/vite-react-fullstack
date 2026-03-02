import { NavLink, Outlet } from "react-router-dom";
import "../layout.css";

export default function AppLayout() {
  return (
    <div className="layout">
      <header className="topbar">
        <div style={{ fontWeight: 700, fontSize: 18 }}>StockUp</div>
        <div style={{ opacity: 0.85 }}>👤 Admin</div>
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

          <NavLink to="/compra" className={({ isActive }) => (isActive ? "active" : "")}>
            🛍️ Compra
          </NavLink>

          <NavLink to="/usuarios" className={({ isActive }) => (isActive ? "active" : "")}>
            🖥️ Usuarios
          </NavLink>

          <NavLink to="/venta" className={({ isActive }) => (isActive ? "active" : "")}>
            🛒 Venta
          </NavLink>

          <NavLink to="/proveedores" className={({ isActive }) => (isActive ? "active" : "")}>
          🚚 Proveedores

          </NavLink>
        </aside>

        <main className="content">
          <div className="content-surface">
            <Outlet />
          </div>
        </main>
      </div>

      <footer className="footer">© 2026 StockUp — Proyecto Académico</footer>
    </div>
  );
}
