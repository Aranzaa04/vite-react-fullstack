import { useEffect, useMemo, useState } from "react";

type Producto = { id: number; tipo: string; precio: number; cantidad: number };
type CompraItem = { producto_id: number; tipo: string; precio: number; cantidad: number; subtotal: number };

const API_URL = import.meta.env.VITE_API_URL as string;

export default function VentaPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [compra, setCompra] = useState<CompraItem[]>([]);
  const [err, setErr] = useState("");

  const endpointInventario = useMemo(() => `${API_URL}/api/inventario`, []);

  // Cargar inventario
  async function loadInventario() {
    try {
      const res = await fetch(endpointInventario);
      if (!res.ok) throw new Error(await res.text());
      setProductos(await res.json());
    } catch (e: any) {
      setErr(e?.message || "Error al cargar inventario");
    }
  }

  useEffect(() => { loadInventario(); }, []);

  // Agregar producto al carrito
  function agregarProducto(p: Producto) {
    setCompra(prev => {
      const existe = prev.find(i => i.producto_id === p.id);
      if (existe) return prev.map(i => i.producto_id === p.id ? { ...i, cantidad: i.cantidad + 1, subtotal: (i.cantidad + 1) * i.precio } : i);
      return [...prev, { producto_id: p.id, tipo: p.tipo, precio: p.precio, cantidad: 1, subtotal: p.precio }];
    });
  }

  // Eliminar producto del carrito
  function eliminarProducto(id: number) { setCompra(prev => prev.filter(i => i.producto_id !== id)); }

  // Total
  const total = compra.reduce((acc, i) => acc + i.subtotal, 0);

  // Pagar
  async function pagar() {
    if (!compra.length) return;
    const payload = { items: compra.map(c => ({ producto_id: c.producto_id, cantidad: c.cantidad })) };
    const res = await fetch(`${API_URL}/api/compra`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) { alert(await res.text()); return; }
    alert("Compra realizada!");
    setCompra([]);
    loadInventario();
  }

  return (
    <div className="panel">
      <h1>Compra</h1>
      {err && <div style={{ color: "red" }}>{err}</div>}

      <h2>Productos disponibles</h2>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {productos.map(p => (
          <button key={p.id} onClick={() => agregarProducto(p)} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}>
            {p.tipo} - ${p.precio.toFixed(2)}
          </button>
        ))}
      </div>

      <h2>Carrito</h2>
      {compra.length === 0 && <p>No hay productos agregados.</p>}
      {compra.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {compra.map(c => (
              <tr key={c.producto_id}>
                <td>{c.tipo}</td>
                <td>${c.precio.toFixed(2)}</td>
                <td>{c.cantidad}</td>
                <td>${c.subtotal.toFixed(2)}</td>
                <td><button onClick={() => eliminarProducto(c.producto_id)}>🗑️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {compra.length > 0 && (
        <>
          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={pagar} style={{ marginTop: 10, padding: "8px 12px" }}>💳 Pagar</button>
        </>
      )}
    </div>
  );
}