// src/ExportButton.js
import React from "react";

function ExportButton({ productos }) {
  const exportarAExcel = () => {
    const encabezado = [
      "Nombre",
      "Marca",
      "Precio de compra",
      "Margen Revendedora (%)",
      "Margen Final (%)",
      "Precio Revendedora",
      "Precio Final",
      "Stock"
    ];

    const filas = productos.map((p) => [
      p.nombre,
      p.marca,
      p.precioCompra,
      p.margenRevendedora,
      p.margenFinal,
      p.precioRevendedora,
      p.precioFinal,
      p.stock
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [encabezado, ...filas].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "productos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <button onClick={exportarAExcel}>📥 Exportar Excel</button>;
}

export default ExportButton;
