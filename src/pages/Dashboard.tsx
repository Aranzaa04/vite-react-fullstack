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
      <h1 style={{ marginTop: 0, marginBottom: 10, fontSize: 52, letterSpacing: 1 }}>
        INICIO
      </h1>

      <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 6, padding: 18, maxWidth: 520 }}>
        {/* tus links/botones aquí */}
      </div>
    </div>
  );
}

