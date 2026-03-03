import { useEffect, useMemo, useState } from "react";
import { api } from "../services/apiClient";

type Proveedor = {
  id: number;
  marca: string;
  fecha_entrada: string;
  creado_en: string;
};

type Entrada = {
  id: number;
  proveedor_id: number;
  inventario_id: number | null;
  tipo: string;
  peso: number | null;
  cantidad: number;
  creado_en: string;
  inventario_precio?: number | null;
  inventario_stock?: number | null;
};

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [marca, setMarca] = useState("");
  const [fechaEntrada, setFechaEntrada] = useState("");

  const [selectedId, setSelectedId] = useState<number | "">("");
  const [entradas, setEntradas] = useState<Entrada[]>([]);

  const [tipo, setTipo] = useState("");
  const [peso, setPeso] = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(1);

  const selectedProveedor = useMemo(
    () => proveedores.find((p) => p.id === selectedId) || null,
    [proveedores, selectedId]
  );

  async function loadProveedores() {
    setLoading(true);
    setErr("");
    try {
      const data = await api<Proveedor[]>("/proveedores");
      setProveedores(data);
    } catch (e: any) {
      setErr(e.message || "Error cargando proveedores");
    } finally {
      setLoading(false);
    }
  }

  async function loadProveedorDetalle(id: number) {
    setErr("");
    try {
      const data = await api<{ proveedor: Proveedor; entradas: Entrada[] }>(
        `/proveedores/${id}`
      );
      setEntradas(data.entradas);
    } catch (e: any) {
      setErr(e.message || "Error cargando detalle");
      setEntradas([]);
    }
  }

  useEffect(() => {
    loadProveedores();
  }, []);

  useEffect(() => {
    if (typeof selectedId === "number") {
      loadProveedorDetalle(selectedId);
    } else {
      setEntradas([]);
    }
  }, [selectedId]);

  async function crearProveedor(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    const payload: any = { marca: marca.trim() };
    if (fechaEntrada.trim()) payload.fecha_entrada = fechaEntrada;

    try {
      const nuevo = await api<Proveedor>("/proveedores", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setMarca("");
      setFechaEntrada("");
      await loadProveedores();
      setSelectedId(nuevo.id);
    } catch (e: any) {
      setErr(e.message || "Error creando proveedor");
    }
  }

  async function agregarEntrada(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    if (typeof selectedId !== "number") {
      setErr("Selecciona un proveedor");
      return;
    }
    if (!tipo.trim()) {
      setErr("Escribe el tipo de producto");
      return;
    }
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      setErr("Cantidad inválida");
      return;
    }

    const item: any = {
      tipo: tipo.trim(),
      cantidad,
    };
    if (peso.trim() !== "") item.peso = Number(peso);

    try {
      await api(`/proveedores/${selectedId}/entradas`, {
        method: "POST",
        body: JSON.stringify({ items: [item] }),
      });

      setTipo("");
      setPeso("");
      setCantidad(1);

      await loadProveedorDetalle(selectedId);
    } catch (e: any) {
      setErr(e.message || "Error agregando entrada");
    }
  }

  return (
    <div style={{ width: "100%" }}>
      <h1 style={{ marginTop: 0, marginBottom: 10, fontSize: 40 }}>
        🚚 Proveedores
      </h1>

      {loading && <p>Cargando...</p>}
      {err && (
        <div style={{ color: "#b00020", marginBottom: 10 }}>
          <b>Error:</b> {err}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Crear proveedor */}
        <div
          style={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 8,
            padding: 14,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Crear proveedor</h2>
          <form onSubmit={crearProveedor} style={{ display: "grid", gap: 10 }}>
            <input
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              placeholder="Marca (ej. Nike)"
              style={{ padding: 10, borderRadius: 8, border: "1px solid rgba(0,0,0,0.2)" }}
            />
            <input
              value={fechaEntrada}
              onChange={(e) => setFechaEntrada(e.target.value)}
              placeholder="Fecha entrada (opcional) ej: 2026-03-02"
              style={{ padding: 10, borderRadius: 8, border: "1px solid rgba(0,0,0,0.2)" }}
            />
            <button
              type="submit"
              style={{
                padding: 10,
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.2)",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Crear
            </button>
          </form>
        </div>

        {/* Selección y entrada */}
        <div
          style={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 8,
            padding: 14,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Entrada de productos</h2>

          <div style={{ display: "grid", gap: 10, marginBottom: 10 }}>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : "")}
              style={{ padding: 10, borderRadius: 8, border: "1px solid rgba(0,0,0,0.2)" }}
            >
              <option value="">-- Selecciona proveedor --</option>
              {proveedores.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.id} {p.marca}
                </option>
              ))}
            </select>

            {selectedProveedor && (
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                Seleccionado: <b>{selectedProveedor.marca}</b> —{" "}
                {new Date(selectedProveedor.fecha_entrada).toLocaleString()}
              </div>
            )}
          </div>

          <form onSubmit={agregarEntrada} style={{ display: "grid", gap: 10 }}>
            <input
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              placeholder="Tipo (ej. Camisa)"
              style={{ padding: 10, borderRadius: 8, border: "1px solid rgba(0,0,0,0.2)" }}
            />
            <input
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="Peso (opcional) ej. 0.3"
              style={{ padding: 10, borderRadius: 8, border: "1px solid rgba(0,0,0,0.2)" }}
            />
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              min={1}
              placeholder="Cantidad"
              style={{ padding: 10, borderRadius: 8, border: "1px solid rgba(0,0,0,0.2)" }}
            />

            <button
              type="submit"
              style={{
                padding: 10,
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.2)",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Agregar entrada
            </button>
          </form>
        </div>
      </div>

      {/* Entradas del proveedor */}
      <div style={{ marginTop: 14 }}>
        <h2 style={{ marginBottom: 8 }}>Entradas del proveedor</h2>
        <div
          style={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 8,
            padding: 14,
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr>
                {["id", "tipo", "peso", "cantidad", "inventario_id", "stock", "precio", "creado_en"].map((c) => (
                  <th
                    key={c}
                    style={{ textAlign: "left", padding: 10, borderBottom: "1px solid rgba(0,0,0,0.12)" }}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entradas.map((e) => (
                <tr key={e.id}>
                  <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>{e.id}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>{e.tipo}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>{String(e.peso ?? "")}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>{e.cantidad}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>{String(e.inventario_id ?? "")}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    {String(e.inventario_stock ?? "")}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    {String(e.inventario_precio ?? "")}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    {new Date(e.creado_en).toLocaleString()}
                  </td>
                </tr>
              ))}
              {entradas.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: 12, opacity: 0.75 }}>
                    No hay entradas. Selecciona un proveedor y agrega productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          onClick={loadProveedores}
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.2)",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          🔄 Recargar
        </button>
      </div>
    </div>
  );
}