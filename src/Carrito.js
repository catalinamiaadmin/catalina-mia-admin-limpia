import React from "react";
import jsPDF from "jspdf";

function Carrito({ carrito, venderProductos, vaciarCarrito }) {
  const calcularTotal = () => {
    return carrito.reduce(
      (acc, item) => acc + item.precioFinal * item.cantidad,
      0
    );
  };

  const generarPresupuestoPDF = () => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString();

    doc.setFontSize(16);
    doc.text("Presupuesto - Catalina Mía", 20, 20);
    doc.setFontSize(10);
    doc.text(`Fecha: ${fecha}`, 20, 30);
    doc.text("Cliente: __________________________", 20, 40);

    let y = 60;
    doc.setFontSize(12);
    carrito.forEach((item, i) => {
      const linea = `- ${item.nombre} x${item.cantidad}: $${item.precioFinal * item.cantidad}`;
      doc.text(linea, 20, y + i * 10);
    });

    doc.setFontSize(14);
    doc.text(`Total: $${calcularTotal()}`, 20, y + carrito.length * 10 + 10);

    doc.save("presupuesto-catalina-mia.pdf");
  };

  return (
    <div>
      <h2>🧺 Carrito</h2>
      {carrito.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <ul>
            {carrito.map((item, i) => (
              <li key={i}>
                {item.nombre} x{item.cantidad} - ${item.precioFinal * item.cantidad}
              </li>
            ))}
          </ul>
          <p><strong>Total:</strong> ${calcularTotal()}</p>
          <button onClick={venderProductos}>🛒 Vender</button>
          <button onClick={generarPresupuestoPDF}>📄 Presupuesto</button>
          <button onClick={vaciarCarrito}>🧹 Vaciar</button>
        </>
      )}
    </div>
  );
}

export default Carrito;
