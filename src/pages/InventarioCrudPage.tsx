import { useEffect, useMemo, useState } from "react";

type InventarioRow = {
  id: number;
  tipo: string;
  peso: number;
  precio: number;
  cantidad: number;
};

const API_URL = import.meta.env.VITE_API_URL as string;

function toNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export default function InventarioCrudPage() {
  const [rows, setRows] = useState<InventarioRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // modal/form
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [tipo, setTipo] = useState("");
  const [peso, setPeso] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");

  const endpoint = useMemo(() => `${API_URL}/api/inventario`, []);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      if (!API_URL) throw new Error("Falta VITE_API_URL en el .env del frontend");
      const res = await fetch(`${API_URL}/api/inventario`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.message || "Error al cargar inventario");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setMode("create");
    setEditingId(null);
    setTipo("");
    setPeso("");
    setPrecio("");
    setCantidad("");
    setOpen(true);
  }

  function openEdit(r: InventarioRow) {
    setMode("edit");
    setEditingId(r.id);
    setTipo(r.tipo ?? "");
    setPeso(String(r.peso ?? 0));
    setPrecio(String(r.precio ?? 0));
    setCantidad(String(r.cantidad ?? 0));
    setOpen(true);
  }

  async function onSubmit() {
    setErr("");

    const payload = {
      tipo: tipo.trim(),
      peso: toNumber(peso),
      precio: toNumber(precio),
      cantidad: toNumber(cantidad),
    };

    if (!payload.tipo) {
      setErr("El campo 'tipo' es obligatorio.");
      return;
    }

    try {
      let url = `${API_URL}/api/inventario`;
      let method: "POST" | "PUT" = "POST";

      if (mode === "edit") {
        if (!editingId) throw new Error("Falta id para editar");
        url = `${API_URL}/api/inventario/${editingId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      setOpen(false);
      await load();
    } catch (e: any) {
      setErr(e?.message || "Error al guardar");
    }
  }

  async function onDelete(id: number) {
    const ok = confirm("¿Seguro que quieres borrar este registro?");
    if (!ok) return;

    setErr("");
    try {
      const res = await fetch(`${API_URL}/api/inventario/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      await load();
    } catch (e: any) {
      setErr(e?.message || "Error al borrar");
    }
  }

  return (
    <div className="panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ marginTop: 0, marginBottom: 6 }}>Inventario</h1>
          <p style={{ opacity: 0.75, marginTop: 0 }}>
            Agrega, edita y elimina productos del inventario.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, opacity: 0.7 }}>
            Endpoint: <code>{endpoint}</code>
          </div>
          <button
            onClick={openCreate}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ➕ Agregar
          </button>
        </div>
      </div>

      {loading && <p style={{ marginTop: 12 }}>Cargando...</p>}

      {err && (
        <div style={{ marginTop: 12, color: "#b00020" }}>
          <div><b>Error</b></div>
          <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{err}</div>
        </div>
      )}

      {!loading && (
        <div style={{ overflowX: "auto", marginTop: 14 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr>
                {["id", "tipo", "peso", "precio", "cantidad", "acciones"].map((c) => (
                  <th key={c} style={{ textAlign: "left", padding: 10, borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>{r.id}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>{r.tipo}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>{r.peso}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>{r.precio}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>{r.cantidad}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        onClick={() => openEdit(r)}
                        style={{
                          padding: "8px 10px",
                          borderRadius: 10,
                          border: "1px solid rgba(0,0,0,0.12)",
                          background: "white",
                          cursor: "pointer",
                        }}
                      >
                        ✏️ Editar
                      </button>

                      <button
                        onClick={() => onDelete(r.id)}
                        style={{
                          padding: "8px 10px",
                          borderRadius: 10,
                          border: "1px solid rgba(0,0,0,0.12)",
                          background: "white",
                          cursor: "pointer",
                        }}
                      >
                        🗑️ Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 12, opacity: 0.75 }}>
                    No hay datos. Presiona <b>Agregar</b> para crear el primero.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 520,
              background: "white",
              borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.10)",
              padding: 16,
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              {mode === "create" ? "Agregar inventario" : `Editar inventario (id: ${editingId})`}
            </h2>

            <div style={{ display: "grid", gap: 10 }}>
              <label>
                Tipo
                <input
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  placeholder="Ej: Gorra"
                  style={{ width: "100%", marginTop: 6, padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.15)" }}
                />
              </label>

              <label>
                Peso
                <input
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  placeholder="Ej: 0.2"
                  style={{ width: "100%", marginTop: 6, padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.15)" }}
                />
              </label>

              <label>
                Precio
                <input
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="Ej: 150"
                  style={{ width: "100%", marginTop: 6, padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.15)" }}
                />
              </label>

              <label>
                Cantidad
                <input
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder="Ej: 40"
                  style={{ width: "100%", marginTop: 6, padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.15)" }}
                />
              </label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button
                onClick={() => setOpen(false)}
                style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.12)", background: "white", cursor: "pointer" }}
              >
                Cancelar
              </button>
              <button
                onClick={onSubmit}
                style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.12)", background: "white", cursor: "pointer", fontWeight: 700 }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
