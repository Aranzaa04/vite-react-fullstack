import { Link } from "react-router-dom";
import { API_URL } from "../config/api";

const cardStyle: React.CSSProperties = {
  maxWidth: 920,
  margin: "24px auto",
  background: "#ffffff",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 18,
  padding: 22,
  color: "#0b1320",
};

const pageStyle: React.CSSProperties = {
  minHeight: "100%",
  background: "#ffffff",
  padding: 0,
};

const linkStyle: React.CSSProperties = {
  display: "block",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.08)",
  background: "#f8fafc",
  color: "#0b1320",
  textDecoration: "none",
  marginBottom: 10,
};

export default function Home() {
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Panel de datos</h2>
        <p style={{ color: "rgba(11,19,32,0.7)", marginTop: 6 }}>
          Vistas en tabla para que se entiendan mejor tus datos.
        </p>

        <Link to="/inventario" style={linkStyle}>Ver Inventario (tabla)</Link>
        <Link to="/compra" style={linkStyle}>Ver Compra (tabla)</Link>
        <Link to="/usuarios" style={linkStyle}>Ver Usuarios (tabla)</Link>
        <Link to="/venta" style={linkStyle}>Ver Venta (tabla)</Link>
        <Link to="/proveedores" style={linkStyle}>Ver Proveedores (tabla)</Link>

        <div style={{ marginTop: 14, fontSize: 13, color: "rgba(11,19,32,0.65)" }}>
          API base: <code>{API_URL || "(no definido)"}</code>
        </div>
      </div>
    </div>
  );
}
