import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  path: string; // ej: /api/usuarios
};

const API_URL = import.meta.env.VITE_API_URL as string;

function toColumns(rows: any[]) {
  if (!rows || rows.length === 0) return [];
  const keys = new Set<string>();
  rows.forEach((r) => Object.keys(r || {}).forEach((k) => keys.add(k)));
  return Array.from(keys);
}

export default function TablePage({ title, path }: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");
  const [query, setQuery] = useState("");

  const columns = useMemo(() => toColumns(rows), [rows]);

  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      Object.values(r || {}).some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [rows, query]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setErr("");
      setRows([]);

      try {
        if (!API_URL) throw new Error("Falta VITE_API_URL en el .env del frontend");
        const res = await fetch(`${API_URL}${path}`, { signal: controller.signal });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${text}`);
        }

        const data = await res.json();
        const arr = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        setRows(arr);
      } catch (e: any) {
        if (e.name !== "AbortError") setErr(e.message || "Error al cargar");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [path]);

  return (
    <div style={{ minHeight: "100vh", background: "#0b1320", color: "white", padding: 20 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ marginBottom: 6 }}>{title} (tabla)</h1>
            <p style={{ opacity: 0.8, marginTop: 0 }}>
              Vista en tabla para entender los datos mejor.
            </p>
          </div>

          <div style={{ fontSize: 13, opacity: 0.8 }}>
            Endpoint: <code>{API_URL}{path}</code>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <Link to="/" style={{ color: "#9ecbff", textDecoration: "none" }}>
            ← Volver al inicio
          </Link>
        </div>

        <div style={{ marginTop: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: 16 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              style={{
                flex: 1,
                minWidth: 240,
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(0,0,0,0.25)",
                color: "white",
                outline: "none",
              }}
            />
            <div style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)" }}>
              Registros: <b>{filteredRows.length}</b>
            </div>
          </div>

          {loading && <p style={{ marginTop: 12 }}>Cargando...</p>}
          {err && (
            <div style={{ marginTop: 12, color: "#ff6b6b" }}>
              <div><b>Failed to fetch</b></div>
              <div style={{ marginTop: 6 }}>{err}</div>
              <div style={{ marginTop: 10, fontSize: 13, color: "#ff9d9d" }}>
                Prueba abrir en navegador: <br />
                <code>{API_URL}{path}</code>
              </div>
            </div>
          )}

          {!loading && !err && (
            <div style={{ overflowX: "auto", marginTop: 14 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                <thead>
                  <tr>
                    {columns.map((c) => (
                      <th key={c} style={{ textAlign: "left", padding: 10, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((r, idx) => (
                    <tr key={idx}>
                      {columns.map((c) => (
                        <td key={c} style={{ padding: 10, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                          {String(r?.[c] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={columns.length || 1} style={{ padding: 12, opacity: 0.75 }}>
                        No hay datos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
