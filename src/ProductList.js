// src/ProductList.js
import Scanner from "./Scanner"; // Agrega esto al inicio del archivo
import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import ExportButton from "./ExportButton";
import Pagination from "./Pagination";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { useCarrito } from "./CarritoContext";

function ProductList() {
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formEdit, setFormEdit] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const [marcaFiltro, setMarcaFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [ventaActiva, setVentaActiva] = useState({});
  const [formVenta, setFormVenta] = useState({});
  const { setCarrito } = useCarrito();
  const porPagina = 10;

  const obtenerProductos = async () => {
    const querySnapshot = await getDocs(collection(db, "productos"));
    const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    docs.sort((a, b) => a.nombre.localeCompare(b.nombre));
    setProductos(docs);
  };

  useEffect(() => { obtenerProductos(); }, []);

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    await deleteDoc(doc(db, "productos", id));
    alert("Producto eliminado");
    obtenerProductos();
  };

  const empezarEdicion = (producto) => {
    setEditandoId(producto.id);
    setFormEdit({ ...producto });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormEdit({});
  };

  const guardarEdicion = async () => {
    try {
      const compra = parseFloat(formEdit.precioCompra);
      const margenRev = parseFloat(formEdit.margenRevendedora);
      const margenFin = parseFloat(formEdit.margenFinal);
      const precioRev = compra + (compra * margenRev) / 100;
      const precioFin = compra + (compra * margenFin) / 100;

      await updateDoc(doc(db, "productos", editandoId), {
        ...formEdit,
        precioCompra: compra,
        margenRevendedora: margenRev,
        margenFinal: margenFin,
        precioRevendedora: precioRev,
        precioFinal: precioFin,
        stock: parseInt(formEdit.stock)
      });

      alert("Producto actualizado");
      cancelarEdicion();
      obtenerProductos();
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar producto.");
    }
  };

  const stockColor = (cantidad) => cantidad <= 5 ? "red" : cantidad <= 10 ? "orange" : "green";

  const agregarAlCarrito = (producto) => {
    const cantidad = parseInt(formVenta[producto.id]?.cantidad || 0);
    const tipoCliente = formVenta[producto.id]?.tipoCliente;
    if (!cantidad || !tipoCliente) return alert("Completá todos los campos de venta.");

    const precioRaw = tipoCliente === "revendedora" ? producto.precioRevendedora : producto.precioFinal;
    const precioUnitario = parseFloat(precioRaw) || 0;
    if (precioUnitario === 0) {
      return alert("⚠️ Error: el precio del producto es 0 o no se pudo leer.");
    }

    const total = precioUnitario * cantidad;

    setCarrito((prev) => [
      ...prev,
      {
        productoId: producto.id,
        nombre: producto.nombre,
        tipoCliente,
        cantidad,
        precioUnitario,
        total
      }
    ]);

    alert("✅ Producto agregado al carrito");
    setFormVenta((prev) => ({ ...prev, [producto.id]: { cantidad: "", tipoCliente: "" } }));
  };

  const productosFiltrados = productos.filter((p) => {
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.codigoBarras?.includes(busqueda);
    const matchMarca = marcaFiltro ? p.marca === marcaFiltro : true;
    return matchBusqueda && matchMarca;
  });

  const inicio = (paginaActual - 1) * porPagina;
  const productosPagina = productosFiltrados.slice(inicio, inicio + porPagina);
  const marcasDisponibles = [...new Set(productos.map((p) => p.marca))];

  return (
    <div>
      <h2>📦 Productos cargados</h2>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="Buscar por nombre o código..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <select value={marcaFiltro} onChange={(e) => setMarcaFiltro(e.target.value)}>
          <option value="">Todas las marcas</option>
          {marcasDisponibles.map((m) => (<option key={m} value={m}>{m}</option>))}
        </select>
        <ExportButton productos={productosFiltrados} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <Scanner onScanSuccess={(codigo) => setBusqueda(codigo)} />
      </div>

      <table border="1" cellPadding="6" cellSpacing="0">
        <thead>
          <tr>
            <th>Nombre</th><th>Marca</th><th>Compra</th><th>Margen Rev.</th><th>Margen Final</th><th>Revendedora</th><th>Final</th><th>Stock</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosPagina.map((prod) => (
            <React.Fragment key={prod.id}>
              <tr>
                {editandoId === prod.id ? (
                  <>
                    <td><input value={formEdit.nombre} onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })} /></td>
                    <td><input value={formEdit.marca} onChange={(e) => setFormEdit({ ...formEdit, marca: e.target.value })} /></td>
                    <td><input type="number" value={formEdit.precioCompra} onChange={(e) => setFormEdit({ ...formEdit, precioCompra: e.target.value })} /></td>
                    <td><input type="number" value={formEdit.margenRevendedora} onChange={(e) => setFormEdit({ ...formEdit, margenRevendedora: e.target.value })} /></td>
                    <td><input type="number" value={formEdit.margenFinal} onChange={(e) => setFormEdit({ ...formEdit, margenFinal: e.target.value })} /></td>
                    <td colSpan="2">Auto</td>
                    <td><input type="number" value={formEdit.stock} onChange={(e) => setFormEdit({ ...formEdit, stock: e.target.value })} /></td>
                    <td>
                      <button onClick={guardarEdicion}>Guardar</button>
                      <button onClick={cancelarEdicion}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{prod.nombre}</td>
                    <td>{prod.marca}</td>
                    <td>${prod.precioCompra}</td>
                    <td>{prod.margenRevendedora}%</td>
                    <td>{prod.margenFinal}%</td>
                    <td>${prod.precioRevendedora}</td>
                    <td>${prod.precioFinal}</td>
                    <td style={{ color: stockColor(prod.stock), fontWeight: "bold" }}>{prod.stock}</td>
                    <td>
                      <button onClick={() => empezarEdicion(prod)}>Editar</button>
                      <button onClick={() => eliminarProducto(prod.id)}>Eliminar</button>
                      <button onClick={() => setVentaActiva((prev) => ({ ...prev, [prod.id]: !prev[prod.id] }))}>Vender</button>
                    </td>
                  </>
                )}
              </tr>
              {ventaActiva[prod.id] && (
                <tr>
                  <td colSpan="9">
                    <strong>Venta de:</strong> {prod.nombre} | Precio unitario: ${formVenta[prod.id]?.tipoCliente === "revendedora" ? prod.precioRevendedora : prod.precioFinal}
                    <br />
                    <label>Cantidad: <input type="number" value={formVenta[prod.id]?.cantidad || ""} onChange={(e) => setFormVenta((prev) => ({ ...prev, [prod.id]: { ...prev[prod.id], cantidad: e.target.value } }))} min="1" /></label>
                    <label> Tipo de cliente: <select value={formVenta[prod.id]?.tipoCliente || ""} onChange={(e) => setFormVenta((prev) => ({ ...prev, [prod.id]: { ...prev[prod.id], tipoCliente: e.target.value } }))}>
                      <option value="">Seleccionar</option>
                      <option value="revendedora">Revendedora</option>
                      <option value="final">Consumidor final</option>
                    </select></label>
                    <button onClick={() => agregarAlCarrito(prod)}>Agregar al carrito</button>
                    <button onClick={() => setVentaActiva((prev) => ({ ...prev, [prod.id]: false }))}>Cancelar</button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <Pagination total={productosFiltrados.length} porPagina={porPagina} paginaActual={paginaActual} setPaginaActual={setPaginaActual} />
    </div>
  );
}

export default ProductList;
