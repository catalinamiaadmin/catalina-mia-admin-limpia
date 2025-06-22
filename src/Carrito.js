// src/Carrito.js
import React from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc, Timestamp, updateDoc, doc, getDoc } from "firebase/firestore";
import "./Carrito.css";
import { useCarrito } from "./CarritoContext";

function Carrito() {
  const { carrito, setCarrito } = useCarrito();

  const confirmarVentaTotal = async () => {
    try {
      for (const item of carrito) {
        // Guardar la venta
        await addDoc(collection(db, "ventas"), {
          productoId: item.productoId,
          nombre: item.nombre,
          tipoCliente: item.tipoCliente,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          total: item.total,
          fecha: Timestamp.now()
        });

        // Descontar stock actual consultando Firestore
        const productoRef = doc(db, "productos", item.productoId);
        const productoSnap = await getDoc(productoRef);
        if (productoSnap.exists()) {
          const stockActual = productoSnap.data().stock || 0;
          const nuevoStock = Math.max(stockActual - item.cantidad, 0);
          await updateDoc(productoRef, { stock: nuevoStock });
        }
      }

      alert("✅ Ventas confirmadas y stock actualizado");
      setCarrito([]);
    } catch (error) {
      console.error("Error al registrar ventas:", error);
      alert("❌ Ocurrió un error al registrar las ventas.");
    }
  };

  const eliminarItem = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
  };

  const totalVenta = carrito.reduce((acc, item) => acc + (item.total || 0), 0);

  return (
    <div className="carrito-container">
      <h2>🧾 Carrito de compras</h2>
      {carrito.length === 0 ? (
        <p>Carrito vacío</p>
      ) : (
        <>
          {carrito.map((item, i) => (
            <div key={i} className="carrito-item">
              <p>
                {item.nombre} – {item.cantidad} x ${item.precioUnitario} = ${item.total}
              </p>
              <button className="btn-eliminar" onClick={() => eliminarItem(i)}>
                Eliminar
              </button>
            </div>
          ))}
          <h3>Total: ${totalVenta}</h3>
          <button className="btn-confirmar" onClick={confirmarVentaTotal}>
            ✅ Confirmar venta total
          </button>
        </>
      )}
    </div>
  );
}

export default Carrito;
