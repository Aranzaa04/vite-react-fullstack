import { useEffect, useState } from "react";
import { api } from "../services/apiClient";

type Compra = {
  id: number;
  total: number;
  metodo_pago: string;
  referencia: string | null;
  fecha: string;
  creado_en: string;
};

type Item = {
  id: number;
  venta_id: number;
  producto_id: number;
  tipo: string;
  peso: number | null;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  creado_en: string;
};

export default function VentasPage() {
  const [rows, setRows] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [openId, setOpenId] = useState<number | null>(null);
  const [detail, setDetail] = useState<{ compra: Compra; items: Item[] } | null>(null);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await api<Compra[]>("/compra");
      setRows(data);
    } catch (e: any) {
      setErr(e.message || "Error cargando ventas");
    } finally {
      setLoading(false);
    }
  }

  async function loadDetail(id: number) {
    setErr("");
    try {
      const data = await api<{ compra: Compra; items: Item[] }>(`/compra/${id}`);
      setDetail(data);
    } catch (e: any) {
      setErr(e.message || "Error cargando detalle");
      setDetail(null);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <h1 style={{ marginTop: 0, marginBottom: 10, fontSize: 40 }}>
        🧾 Ventas
      </h1>

      {loading && <p>Cargando...</p>}
      {err && (
        <div style={{ color: "#b00020", marginBottom: 10 }}>
          <b>Error:</b> {err}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Lista */}
        <div
          style={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 8,
            padding: 14,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Ventas realizadas</h2>

          <div style={{ display: "grid", gap: 10 }}>
            {rows.map((c) => (
              <div
                key={c.id}
                style={{
                  border: "1px solid rgba(0,0,0,0.10)",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 900 }}># {c.id}</div>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>
                      {new Date(c.fecha).toLocaleString()}
                    </div>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>
                      Pago: <b>{c.metodo_pago}</b>
                      {c.referencia ? <> — Ref: <b>{c.referencia}</b></> : null}
                    </div>
                  </div>
                  <div style={{ fontSize: 18 }}>
                    <b>${Number(c.total).toFixed(2)}</b>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    if (openId === c.id) {
                      setOpenId(null);
                      setDetail(null);
                    } else {
                      setOpenId(c.id);
                      await loadDetail(c.id);
                    }
                  }}
                  style={{
                    marginTop: 10,
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid rgba(0,0,0,0.2)",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  {openId === c.id ? "Cerrar detalle" : "Ver detalle"}
                </button>
              </div>
            ))}

            {rows.length === 0 && (
              <div style={{ opacity: 0.75 }}>
                No hay ventas todavía. Ve a Compra y haz un checkout.
              </div>
            )}
          </div>

          <div style={{ marginTop: 12 }}>
            <button
              onClick={load}
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

        {/* Detalle */}
        <div
          style={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 8,
            padding: 14,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Detalle</h2>

          {!detail && <div style={{ opacity: 0.75 }}>Selecciona una venta para ver el detalle.</div>}

          {detail && (
            <>
              <div style={{ marginBottom: 10 }}>
                <div>
                  Venta: <b>#{detail.compra.id}</b> — Total:{" "}
                  <b>${Number(detail.compra.total).toFixed(2)}</b>
                </div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>
                  Pago: <b>{detail.compra.metodo_pago}</b>
                  {detail.compra.referencia ? <> — Ref: <b>{detail.compra.referencia}</b></> : null}
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                  <thead>
                    <tr>
                      {["tipo", "cantidad", "precio_unitario", "subtotal"].map((c) => (
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
                    {detail.items.map((it) => (
                      <tr key={it.id}>
                        <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>{it.tipo}</td>
                        <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>{it.cantidad}</td>
                        <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                          ${Number(it.precio_unitario).toFixed(2)}
                        </td>
                        <td style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                          ${Number(it.subtotal).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    {detail.items.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ padding: 12, opacity: 0.75 }}>
                          Sin items.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}