import { useEffect, useMemo, useState } from "react";

type Producto = {
  id: number;
  tipo: string;
  precio: number;
  cantidad: number;
};

type CompraItem = {
  producto_id: number;
  tipo: string;
  precio: number;
  cantidad: number;
  subtotal: number;
};

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
      const data = await res.json();
      setProductos(data);
    } catch (e: any) {
      setErr(e?.message || "Error al cargar inventario");
    }
  }

  useEffect(() => {
    loadInventario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Agregar producto al carrito
  function agregarProducto(p: Producto) {
    setCompra((prev) => {
      const existe = prev.find((i) => i.producto_id === p.id);
      if (existe) {
        // si ya existe, aumenta cantidad
        return prev.map((i) =>
          i.producto_id === p.id
            ? { ...i, cantidad: i.cantidad + 1, subtotal: (i.cantidad + 1) * i.precio }
            : i
        );
      }
      return [
        ...prev,
        { producto_id: p.id, tipo: p.tipo, precio: p.precio, cantidad: 1, subtotal: p.precio },
      ];
    });
  }

  // Eliminar producto del carrito
  function eliminarProducto(id: number) {
    setCompra((prev) => prev.filter((i) => i.producto_id !== id));
  }

  // Total de la compra
  const total = compra.reduce((acc, i) => acc + i.subtotal, 0);

  return (
    <div className="panel">
      <h1>Compra</h1>
      {err && <div style={{ color: "red" }}>{err}</div>}

      <h2>Productos disponibles</h2>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {productos.map((p) => (
          <button
            key={p.id}
            onClick={() => agregarProducto(p)}
            style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}
          >
            {p.tipo} - ${p.precio.toFixed(2)}
          </button>
        ))}
      </div>

      <h2>Carrito de compra</h2>
      {compra.length === 0 && <p>No hay productos agregados.</p>}
      {compra.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8 }}>Producto</th>
              <th style={{ textAlign: "right", padding: 8 }}>Precio</th>
              <th style={{ textAlign: "center", padding: 8 }}>Cantidad</th>
              <th style={{ textAlign: "right", padding: 8 }}>Subtotal</th>
              <th style={{ padding: 8 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {compra.map((c) => (
              <tr key={c.producto_id}>
                <td style={{ padding: 8 }}>{c.tipo}</td>
                <td style={{ padding: 8, textAlign: "right" }}>${c.precio.toFixed(2)}</td>
                <td style={{ padding: 8, textAlign: "center" }}>{c.cantidad}</td>
                <td style={{ padding: 8, textAlign: "right" }}>${c.subtotal.toFixed(2)}</td>
                <td style={{ padding: 8 }}>
                  <button
                    onClick={() => eliminarProducto(c.producto_id)}
                    style={{ cursor: "pointer" }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {compra.length > 0 && (
        <h3 style={{ marginTop: 12 }}>Total: ${total.toFixed(2)}</h3>
      )}
    </div>
  );
}
