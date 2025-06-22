// src/Importador.js
import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import * as XLSX from "xlsx";

function Importador() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const handleArchivo = (e) => {
    const archivo = e.target.files[0];
    const lector = new FileReader();

    lector.onload = (e) => {
      const datos = new Uint8Array(e.target.result);
      const libro = XLSX.read(datos, { type: "array" });
      const hoja = libro.Sheets[libro.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(hoja);

      const convertidos = json.map((p) => {
        const compra = parseFloat(p.precioCompra);
        const margenRev = parseFloat(p.margenRevendedora);
        const margenFin = parseFloat(p.margenFinal);
        return {
          nombre: p.nombre,
          marca: p.marca,
          codigoBarras: p.codigoBarras,
          precioCompra: compra,
          margenRevendedora: margenRev,
          margenFinal: margenFin,
          precioRevendedora: compra + (compra * margenRev) / 100,
          precioFinal: compra + (compra * margenFin) / 100,
          stock: parseInt(p.stock)
        };
      });

      setProductos(convertidos);
    };

    lector.readAsArrayBuffer(archivo);
  };

  const importar = async () => {
    setCargando(true);
    try {
      for (let p of productos) {
        await addDoc(collection(db, "productos"), p);
      }
      alert("✅ Importación completa");
      setProductos([]);
    } catch (e) {
      console.error("Error al importar:", e);
      alert("❌ Error al importar");
    }
    setCargando(false);
  };

  return (
    <div>
      <h3>📥 Importar productos desde archivo</h3>
      <input type="file" accept=".xlsx, .xls, .csv" onChange={handleArchivo} />
      {productos.length > 0 && (
        <>
          <p>Productos listos para importar: {productos.length}</p>
          <button onClick={importar} disabled={cargando}>
            {cargando ? "Importando..." : "Confirmar Importación"}
          </button>
        </>
      )}
    </div>
  );
}

export default Importador;
