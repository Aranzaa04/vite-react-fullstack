import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL as string;

const linkStyle: React.CSSProperties = {
  display: "block",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.10)",
  background: "white",
  color: "#0b1320",
  textDecoration: "none",
  marginBottom: 10,
  fontWeight: 600,
};

export default function Dashboard() {
  return (
    <div>
      <h2 style={{ marginTop: 0, marginBottom: 6 }}>Panel de datos</h2>
      <p style={{ opacity: 0.75, marginTop: 0 }}>
        Vistas en tabla para que se entiendan mejor tus datos.
      </p>

      <div style={{ maxWidth: 520, marginTop: 18 }}>
        <Link to="/ventas" style={linkStyle}>🧾 Ver Ventas (tabla)</Link>
        <Link to="/producto" style={linkStyle}>📦 Ver Producto (tabla)</Link>
        <Link to="/usuarios" style={linkStyle}>👤 Ver Usuarios (tabla)</Link>
        <Link to="/detalle-venta" style={linkStyle}>🧾📦 Ver Detalle Venta (tabla)</Link>
      </div>

      <div style={{ marginTop: 14, fontSize: 13, opacity: 0.75 }}>
        API base: <code>{API_URL || "(no definido)"}</code>
      </div>
    </div>
  );
}
