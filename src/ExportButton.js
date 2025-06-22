// src/ExportButton.js
import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function ExportButton({ productos }) {
  const exportarExcel = () => {
    const data = productos.map((p) => ({
      Nombre: p.nombre,
      Marca: p.marca,
      Código: p.codigoBarras,
      "Precio Revendedora": p.precioRevendedora,
      "Precio Final": p.precioFinal,
      Stock: p.stock
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Productos");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array"
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream"
    });

    saveAs(fileData, "Productos_CatalinaMia.xlsx");
  };

  return <button onClick={exportarExcel}>📤 Exportar a Excel</button>;
}

export default ExportButton;
