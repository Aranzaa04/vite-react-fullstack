import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL as string;

const cardStyle: React.CSSProperties = {
  maxWidth: 920,
  margin: "60px auto",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 18,
  padding: 22,
  color: "white",
};

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0b1320",
  padding: 20,
};

const linkStyle: React.CSSProperties = {
  display: "block",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  textDecoration: "none",
  marginBottom: 10,
};

export default function Home() {
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Panel de datos</h2>
        <p style={{ opacity: 0.85, marginTop: 6 }}>
          Vistas en tabla para que se entiendan mejor tus datos.
        </p>
        
        <Link to="/inventario" style={linkStyle}>📦 Ver Inventario (tabla)</Link>
        <Link to="/compra" style={linkStyle}>📦 Ver Compra (tabla)</Link>
        <Link to="/usuarios" style={linkStyle}>👤 Ver Usuarios (tabla)</Link>
        <Link to="/ventas" style={linkStyle}>🧾 Ver Ventas (tabla)</Link>
        <Link to="/proveedores" style={linkStyle}>🚚 Proveedores (tabla)</Link>

        <div style={{ marginTop: 14, fontSize: 13, opacity: 0.75 }}>
          API base: <code>{API_URL || "(no definido)"}</code>
        </div>
      </div>
    </div>
  );
}
