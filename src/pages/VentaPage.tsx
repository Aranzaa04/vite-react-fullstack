import { useEffect, useState } from "react";

type Producto = {
  id: number;
  tipo: string;
  precio: number;
  cantidad: number;
};

type ItemCarrito = Producto & {
  qty: number;
};

const API_URL = import.meta.env.VITE_API_URL as string;

export default function VentaPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // cargar inventario
  useEffect(() => {
    fetch(`${API_URL}/api/inventario`)
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(() => setMsg("Error al cargar inventario"));
  }, []);

  function agregarProducto(p: Producto) {
    setCarrito(prev => {
      const existe = prev.find(i => i.id === p.id);
      if (existe) {
        return prev.map(i =>
          i.id === p.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...p, qty: 1 }];
    });
  }

  function quitarProducto(id: number) {
    setCarrito(prev =>
      prev
        .map(i => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter(i => i.qty > 0)
    );
  }

  const total = carrito.reduce(
    (sum, i) => sum + i.precio * i.qty,
    0
  );

  async function pagar() {
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${API_URL}/api/venta/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: carrito.map(i => ({
            producto_id: i.id,
            cantidad: i.qty,
            precio_unitario: i.precio,
          })),
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      setCarrito([]);
      setMsg("✅ Venta realizada correctamente");
    } catch (e: any) {
      setMsg(e.message || "Error al procesar venta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel">
      <h1>Venta</h1>
      <p>Selecciona productos para agregar al carrito</p>

      {/* PRODUCTOS */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {productos.map(p => (
          <button
            key={p.id}
            onClick={() => agregarProducto(p)}
            style={{
              padding: 16,
              minWidth: 140,
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.15)",
              background: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {p.tipo}<br />
            <span style={{ opacity: 0.7 }}>${p.precio}</span>
          </button>
        ))}
      </div>

      {/* CARRITO */}
      <h2 style={{ marginTop: 24 }}>Carrito</h2>

      {carrito.length === 0 && <p>No hay productos</p>}

      {carrito.map(i => (
        <div key={i.id} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
          <div style={{ flex: 1 }}>
            {i.tipo} × {i.qty}
          </div>
          <div>${i.precio * i.qty}</div>
          <button onClick={() => quitarProducto(i.id)}>➖</button>
        </div>
      ))}

      <h3>Total: ${total}</h3>

      <button
        onClick={pagar}
        disabled={loading || carrito.length === 0}
        style={{
          marginTop: 12,
          padding: "12px 18px",
          borderRadius: 12,
          fontWeight: 700,
        }}
      >
        💳 Pagar
      </button>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
