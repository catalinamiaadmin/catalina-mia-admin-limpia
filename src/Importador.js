// src/Importador.js
import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

function Importador() {
  const [texto, setTexto] = useState("");

  const procesarTexto = async () => {
    const lineas = texto.split("\n").map((linea) => linea.trim()).filter(Boolean);

    for (const linea of lineas) {
      const partes = linea.split(";");
      if (partes.length < 6) continue;

      const [codigoBarras, nombre, marca, precioCompra, margenRevendedora, margenFinal] = partes;

      const compra = parseFloat(precioCompra);
      const margenRev = parseFloat(margenRevendedora);
      const margenFin = parseFloat(margenFinal);
      const precioRev = compra + (compra * margenRev) / 100;
      const precioFin = compra + (compra * margenFin) / 100;

      try {
        await addDoc(collection(db, "productos"), {
          codigoBarras,
          nombre,
          marca,
          precioCompra: compra,
          margenRevendedora: margenRev,
          margenFinal: margenFin,
          precioRevendedora: precioRev,
          precioFinal: precioFin,
          stock: 0
        });
      } catch (error) {
        console.error("Error al importar:", error);
      }
    }

    alert("Importación completada");
    setTexto("");
  };

  return (
    <div>
      <h3>📋 Importador rápido</h3>
      <textarea
        rows="6"
        cols="60"
        placeholder="Código;Nombre;Marca;Compra;MargenRev;MargenFin"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <br />
      <button onClick={procesarTexto}>Importar</button>
    </div>
  );
}

export default Importador;
