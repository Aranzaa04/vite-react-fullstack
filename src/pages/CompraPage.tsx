import { useEffect, useMemo, useState } from "react";
import { api } from "../services/apiClient";
import { useNavigate } from "react-router-dom";

type Item = {
  id: number;
  tipo: string;
  peso: number | null;
  precio: number;
  cantidad: number;
};

export default function CompraPage() {
  const nav = useNavigate();
  const [productos, setProductos] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // carrito: { [id]: cantidad }
  const [cart, setCart] = useState<Record<number, number>>({});
  const [metodoPago, setMetodoPago] = useState<"efectivo" | "tarjeta" | "transferencia">("efectivo");
  const [referencia, setReferencia] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      // solo los que tienen stock > 0 (tu backend por default ya filtra)
      const data = await api<Item[]>("/inventario");
      setProductos(data);
    } catch (e: any) {
      setErr(e.message || "Error cargando inventario");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const total = useMemo(() => {
    return Object.entries(cart).reduce((sum, [idStr, qty]) => {
      const id = Number(idStr);
      const prod = productos.find((p) => p.id === id);
      if (!prod) return sum;
      return sum + prod.precio * qty;
    }, 0);
  }, [cart, productos]);

  function add(id: number) {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }

  function sub(id: number) {
    setCart((prev) => {
      const cur = prev[id] ?? 0;
      const next = cur - 1;
      const copy = { ...prev };
      if (next <= 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  }

  async function checkout() {
    setErr("");

    const items = Object.entries(cart).map(([idStr, qty]) => ({
      producto_id: Number(idStr),
      cantidad: qty,
    }));

    if (items.length === 0) {
      setErr("Tu compra está vacía. Agrega productos.");
      return;
    }

    try {
      await api("/compra/checkout", {
        method: "POST",
        body: JSON.stringify({
          metodo_pago: metodoPago,
          referencia: referencia.trim() ? referencia.trim() : null,
          items,
        }),
      });

      // limpia carrito y manda a ventas
      setCart({});
      setReferencia("");
      await load();
      nav("/ventas");
    } catch (e: any) {
      setErr(e.message || "Error en checkout");
    }
  }

  return (
    <div style={{ width: "100%" }}>
      <h1 style={{ marginTop: 0, marginBottom: 10, fontSize: 40 }}>
        🛒 Compra
      </h1>

      {loading && <p>Cargando...</p>}
      {err && (
        <div style={{ color: "#b00020", marginBottom: 10 }}>
          <b>Error:</b> {err}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
        {/* Productos */}
        <div
          style={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 8,
            padding: 14,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Productos</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {productos.map((p) => {
              const qty = cart[p.id] ?? 0;
              const disabled = p.cantidad <= qty; // no permite pasar del stock

              return (
                <div
                  key={p.id}
                  style={{
                    border: "1px solid rgba(0,0,0,0.10)",
                    borderRadius: 10,
                    padding: 12,
                    background: "rgba(0,0,0,0.02)",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{p.tipo}</div>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>
                    Stock: <b>{p.cantidad}</b> | Precio: <b>${p.precio}</b>
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
                    <button
                      onClick={() => sub(p.id)}
                      disabled={qty <= 0}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid rgba(0,0,0,0.2)",
                        cursor: qty <= 0 ? "not-allowed" : "pointer",
                      }}
                    >
                      -
                    </button>

                    <div style={{ minWidth: 32, textAlign: "center", fontWeight: 800 }}>
                      {qty}
                    </div>

                    <button
                      onClick={() => add(p.id)}
                      disabled={disabled}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid rgba(0,0,0,0.2)",
                        cursor: disabled ? "not-allowed" : "pointer",
                        fontWeight: 700,
                      }}
                    >
                      +
                    </button>
                  </div>

                  {disabled && (
                    <div style={{ marginTop: 8, fontSize: 12, color: "#b00020" }}>
                      No puedes agregar más (stock limitado)
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {productos.length === 0 && (
            <p style={{ opacity: 0.75 }}>
              No hay productos con stock. Agrega entradas desde Proveedores.
            </p>
          )}
        </div>

        {/* Resumen */}
        <div
          style={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 8,
            padding: 14,
            height: "fit-content",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Resumen</h2>

          <div style={{ fontSize: 18, marginBottom: 10 }}>
            Total: <b>${total.toFixed(2)}</b>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <label style={{ fontSize: 13, opacity: 0.8 }}>Método de pago</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value as any)}
              style={{ padding: 10, borderRadius: 8, border: "1px solid rgba(0,0,0,0.2)" }}
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>

            <label style={{ fontSize: 13, opacity: 0.8 }}>Referencia (opcional)</label>
            <input
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              placeholder="Ej: 4321 / folio"
              style={{ padding: 10, borderRadius: 8, border: "1px solid rgba(0,0,0,0.2)" }}
            />

            <button
              onClick={checkout}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.2)",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              ✅ Confirmar compra
            </button>

            <button
              onClick={() => setCart({})}
              style={{
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.2)",
                cursor: "pointer",
              }}
            >
              🧹 Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}