// src/pages/TablePage.tsx
import { useEffect, useMemo, useState } from "react";
import { API_URL } from "../config/api";

type Props = {
  title: string;
  path: string; // ej: /api/usuarios
};

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
        const res = await fetch(`${API_URL}${path}`, { signal: controller.signal });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${text}`);
        }

        const data = await res.json();
        const arr = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.data)
          ? (data as any).data
          : [];
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
    <div style={{ width: "100%" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 10,
        }}
      >
        <div>
          <h1 style={{ marginTop: 0, marginBottom: 6, fontSize: 44 }}>{title}</h1>
          <p style={{ opacity: 0.75, marginTop: 0 }}>
            Vista en tabla para entender los datos mejor.
          </p>
        </div>

        <div style={{ fontSize: 13, opacity: 0.7 }}>
          Endpoint: <code>{API_URL}{path}</code>
        </div>
      </div>

      {/* Barra búsqueda */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar..."
          style={{
            flex: 1,
            minWidth: 260,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.15)",
            background: "rgba(0,0,0,0.04)",
            color: "#0b1320",
            outline: "none",
          }}
        />
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.12)",
            background: "rgba(0,0,0,0.04)",
          }}
        >
          Registros: <b>{filteredRows.length}</b>
        </div>
      </div>

      {loading && <p style={{ marginTop: 8 }}>Cargando...</p>}

      {err && (
        <div style={{ marginTop: 8, color: "#b00020" }}>
          <div><b>Error</b></div>
          <div style={{ marginTop: 6 }}>{err}</div>
          <div style={{ marginTop: 10, fontSize: 13, opacity: 0.9 }}>
            Prueba abrir en navegador: <br />
            <code>{API_URL}{path}</code>
          </div>
        </div>
      )}

      {!loading && !err && (
        <div
          style={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 6,
            padding: 14,
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th
                      key={c}
                      style={{
                        textAlign: "left",
                        padding: 10,
                        borderBottom: "1px solid rgba(0,0,0,0.12)",
                        fontWeight: 700,
                      }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r, idx) => (
                  <tr key={idx}>
                    {columns.map((c) => (
                      <td
                        key={c}
                        style={{
                          padding: 10,
                          borderBottom: "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
                        {String((r as any)?.[c] ?? "")}
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
        </div>
      )}
    </div>
  );
}