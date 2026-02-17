import { Link } from "react-router-dom";

const linkStyle: React.CSSProperties = {
  display: "block",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(0,0,0,0.10)",
  background: "white",
  color: "#0b1320",
  textDecoration: "none",
  marginBottom: 10,
  fontWeight: 600,
};

export default function Dashboard() {
  return (
    <div style={{ width: "100%" }}>
      <h1 style={{ marginTop: 0, marginBottom: 10, fontSize: 52, letterSpacing: 1 }}>
        INICIO
      </h1>

      <div
        style={{
          background: "white",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 6,
          padding: 18,
          maxWidth: 520,
        }}
      >
        <Link to="/ventas" style={linkStyle}>🧾 Ver Ventas (tabla)</Link>
        <Link to="/producto" style={linkStyle}>📦 Ver Producto (tabla)</Link>
        <Link to="/usuarios" style={linkStyle}>👤 Ver Usuarios (tabla)</Link>
        <Link to="/detalle-venta" style={linkStyle}>🧾📦 Ver Detalle Venta (tabla)</Link>
      </div>
    </div>
  );
}
