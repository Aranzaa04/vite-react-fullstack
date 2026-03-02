import { NavLink, Outlet } from "react-router-dom";
import "../layout.css";

export default function AppLayout() {
  return (
    <div className="layout">
      <header className="topbar">
        <div style={{ fontWeight: 700, fontSize: 18 }}>StockUp</div>
        <div style={{ opacity: 0.85 }}>ðŸ‘¤ Admin</div>
      </header>

      <div className="body">
        <aside className="sidebar">
          <div className="menu-title">MENÃš</div>

              <NavLink to="/home" end className={({ isActive }) => (isActive ? "active" : "")}>
            ðŸ  Inicio
          </NavLink>

          <NavLink to="/inventario" className={({ isActive }) => (isActive ? "active" : "")}>
            ðŸ“¦ Inventario
          </NavLink>

          <NavLink to="/compra" className={({ isActive }) => (isActive ? "active" : "")}>
            ðŸ›ï¸ Compra
          </NavLink>

          <NavLink to="/usuarios" className={({ isActive }) => (isActive ? "active" : "")}>
            ðŸ–¥ï¸ Usuarios
          </NavLink>

          <NavLink to="/venta" className={({ isActive }) => (isActive ? "active" : "")}>
            ðŸ›’ Venta
          </NavLink>

          <NavLink to="/proveedores" className={({ isActive }) => (isActive ? "active" : "")}>
          ðŸšš Proveedores

          </NavLink>
        </aside>

        <main className="content">
          <div className="content-surface">
            <Outlet />
          </div>
        </main>
      </div>

      <footer className="footer">Â© 2026 StockUp â€” Proyecto AcadÃ©mico</footer>
    </div>
  );
}

