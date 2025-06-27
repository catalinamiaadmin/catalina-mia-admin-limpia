import React, { useContext } from "react";
import { CarritoContext } from "./contexts/CarritoContext";
import jsPDF from "jspdf";

function Carrito() {
  const { carrito, vaciarCarrito } = useContext(CarritoContext);

  const total = carrito?.reduce((acc, item) => acc + item.precioFinal * item.cantidad, 0) || 0;

  const generarPresupuesto = () => {
    if (!carrito || carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Presupuesto", 20, 20);

    let y = 30;
    carrito.forEach((item, i) => {
      doc.setFontSize(12);
      doc.text(`${i + 1}. ${item.nombre} (${item.codigoBarras}) - Cant: ${item.cantidad}`, 20, y);
      doc.text(`$${item.precioFinal.toFixed(2)} c/u`, 150, y, { align: "right" });
      y += 10;
    });

    doc.setFontSize(14);
    doc.text(`Total: $${total.toFixed(2)}`, 20, y + 10);

    doc.save("presupuesto.pdf");
  };

  return (
    <div className="carrito">
      <h2>Carrito</h2>
      {carrito && carrito.length > 0 ? (
        <>
          <ul>
            {carrito.map((item, index) => (
              <li key={index}>
                {item.nombre} x {item.cantidad} = ${item.precioFinal * item.cantidad}
              </li>
            ))}
          </ul>
          <p><strong>Total:</strong> ${total}</p>
          <button onClick={vaciarCarrito}>Vaciar carrito</button>
          <button onClick={generarPresupuesto}>Generar presupuesto PDF</button>
        </>
      ) : (
        <p>El carrito está vacío.</p>
      )}
    </div>
  );
}

export default Carrito;
