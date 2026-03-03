// src/components/AppLayout.tsx
import { NavLink, Outlet } from "react-router-dom";

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
  return (
    <div style={{ minHeight: "100vh", background: "#f5f6f8" }}>
      {/* TOPBAR */}
      <header
        style={{
          height: 58,
          background: "#fff",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 18 }}>StockUp</div>
      </header>

      {/* BODY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: 16,
          padding: 16,
        }}
      >
        {/* SIDEBAR */}
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
            MENÚ
          </div>

          {/* Inicio */}
          <NavLink to="/home" style={linkStyle}>
            🏠 Inicio
          </NavLink>

          {/* ====== STOCK / VENTAS ====== */}
          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.65, fontWeight: 800, marginLeft: 8 }}>
            STOCK / VENTAS
          </div>

          <NavLink to="/proveedores" style={linkStyle}>
            🚚 Proveedores
          </NavLink>

          <NavLink to="/inventario" style={linkStyle}>
            📦 Inventario
          </NavLink>

          <NavLink to="/compra" style={linkStyle}>
            🛒 Compra
          </NavLink>

          <NavLink to="/ventas" style={linkStyle}>
            🧾 Ventas
          </NavLink>

          {/* ====== USUARIOS (NO lo quitamos) ====== */}
          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.65, fontWeight: 800, marginLeft: 8 }}>
            USUARIOS
          </div>

          <NavLink to="/usuarios" style={linkStyle}>
            👥 Usuarios
          </NavLink>

          {/* Si tus rutas de usuarios son distintas, cambia estos links */}
          <NavLink to="/usuarios/nuevo" style={linkStyle}>
            ➕ Crear usuario
          </NavLink>

          <NavLink to="/usuarios/roles" style={linkStyle}>
            🔐 Roles / Permisos
          </NavLink>
        </aside>

        {/* CONTENT */}
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

      {/* FOOTER */}
      <footer style={{ padding: 14, textAlign: "center", opacity: 0.7, fontWeight: 700 }}>
        © 2026 StockUp — Proyecto Académico
      </footer>
    </div>
  );
}