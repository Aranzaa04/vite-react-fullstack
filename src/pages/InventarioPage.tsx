import { useEffect, useMemo, useState } from "react";
import { api } from "../services/apiClient";

type InventarioItem = {
  id: number;
  tipo: string;
  peso: number | null;
  precio: number;
  cantidad: number;
};

function toNumber(v: any, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export default function InventarioPage() {
  const [rows, setRows] = useState<InventarioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");

  // Para edición rápida (precio / peso)
  const [edit, setEdit] = useState<Record<number, { precio?: string; peso?: string }>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      return (
        String(r.id).includes(q) ||
        (r.tipo || "").toLowerCase().includes(q)
      );
    });
  }, [rows, query]);

  async function load() {
    try {
      setLoading(true);
      setErr("");
      // all=1 para traer también los de cantidad 0 si quieres ver todo
      const data = await api<InventarioItem[]>("/inventario?all=1");
      setRows(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.message || "Error al cargar inventario");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveRow(id: number) {
    try {
      const current = rows.find((r) => r.id === id);
      if (!current) return;

      const precioStr = edit[id]?.precio;
      const pesoStr = edit[id]?.peso;

      // Si no editaste nada, no hace nada
      const precio = precioStr !== undefined ? toNumber(precioStr, current.precio) : current.precio;
      const peso =
        pesoStr !== undefined
          ? (pesoStr.trim() === "" ? null : toNumber(pesoStr, current.peso ?? 0))
          : current.peso;

      await api(`/inventario/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          tipo: current.tipo,
          precio,
          peso,
          // no tocamos cantidad aquí (se mueve por entradas y ventas)
          cantidad: current.cantidad,
        }),
      });

      // refrescar
      await load();

      // limpiar edición
      setEdit((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (e: any) {
      alert(e?.message || "Error al guardar");
    }
  }

  return (
    <div style={{ width: "100%" }}>
      {/* HEADER */}
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
          <h1 style={{ marginTop: 0, marginBottom: 6, fontSize: 44 }}>📦 Inventario</h1>
          <p style={{ opacity: 0.75, marginTop: 0 }}>
            Aquí se ven <b>todos los productos</b> en stock (sin importar proveedor).
          </p>
        </div>

        <button
          onClick={load}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.12)",
            background: "rgba(0,0,0,0.04)",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          🔄 Recargar
        </button>
      </div>

      {/* BUSCADOR */}
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
          placeholder="Buscar por id o tipo..."
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
          Registros: <b>{filtered.length}</b>
        </div>
      </div>

      {/* ESTADOS */}
      {loading && <p style={{ marginTop: 8 }}>Cargando...</p>}

      {err && (
        <div style={{ marginTop: 8, color: "#b00020" }}>
          <div>
            <b>Error</b>
          </div>
          <div style={{ marginTop: 6 }}>{err}</div>
        </div>
      )}

      {/* TABLA */}
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
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
              <thead>
                <tr>
                  {["id", "tipo", "peso", "precio", "cantidad", "acciones"].map((c) => (
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
                {filtered.map((r) => {
                  const precioVal = edit[r.id]?.precio ?? String(r.precio ?? 0);
                  const pesoVal = edit[r.id]?.peso ?? (r.peso === null || r.peso === undefined ? "" : String(r.peso));

                  return (
                    <tr key={r.id}>
                      <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                        {r.id}
                      </td>

                      <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)", fontWeight: 700 }}>
                        {r.tipo}
                      </td>

                      <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                        <input
                          value={pesoVal}
                          onChange={(e) =>
                            setEdit((prev) => ({
                              ...prev,
                              [r.id]: { ...(prev[r.id] || {}), peso: e.target.value },
                            }))
                          }
                          placeholder="(opcional)"
                          style={{
                            width: 120,
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid rgba(0,0,0,0.15)",
                            background: "rgba(0,0,0,0.04)",
                            outline: "none",
                          }}
                        />
                      </td>

                      <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                        <input
                          value={precioVal}
                          onChange={(e) =>
                            setEdit((prev) => ({
                              ...prev,
                              [r.id]: { ...(prev[r.id] || {}), precio: e.target.value },
                            }))
                          }
                          style={{
                            width: 120,
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid rgba(0,0,0,0.15)",
                            background: "rgba(0,0,0,0.04)",
                            outline: "none",
                          }}
                        />
                      </td>

                      <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                        <b>{r.cantidad}</b>
                      </td>

                      <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                        <button
                          onClick={() => saveRow(r.id)}
                          style={{
                            padding: "8px 12px",
                            borderRadius: 10,
                            border: "1px solid rgba(0,0,0,0.15)",
                            background: "rgba(0,0,0,0.04)",
                            cursor: "pointer",
                            fontWeight: 800,
                          }}
                        >
                          Guardar
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: 12, opacity: 0.75 }}>
                      No hay productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 10, fontSize: 13, opacity: 0.7 }}>
            Nota: La <b>cantidad</b> se mueve por <b>entradas</b> (proveedores) y por <b>ventas</b> (compra).
          </div>
        </div>
      )}
    </div>
  );
}