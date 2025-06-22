// src/ProductForm.js
import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import Scanner from "./Scanner";

function ProductForm() {
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [codigo, setCodigo] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [margenRevendedora, setMargenRevendedora] = useState("");
  const [margenFinal, setMargenFinal] = useState("");
  const [stock, setStock] = useState("");
  const [mostrarScanner, setMostrarScanner] = useState(false); // 👈 Estado para mostrar/ocultar el escáner

  const handleSubmit = async (e) => {
    e.preventDefault();

    const compra = parseFloat(precioCompra);
    const margenRev = parseFloat(margenRevendedora);
    const margenFin = parseFloat(margenFinal);

    const precioRevendedora = compra + (compra * margenRev) / 100;
    const precioFinal = compra + (compra * margenFin) / 100;

    try {
      await addDoc(collection(db, "productos"), {
        nombre,
        marca,
        codigoBarras: codigo,
        precioCompra: compra,
        margenRevendedora: margenRev,
        margenFinal: margenFin,
        precioRevendedora,
        precioFinal,
        stock: parseInt(stock),
        creado: new Date()
      });

      alert("Producto guardado con éxito");
      setNombre("");
      setMarca("");
      setCodigo("");
      setPrecioCompra("");
      setMargenRevendedora("");
      setMargenFinal("");
      setStock("");
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Error al guardar el producto.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cargar nuevo producto</h2>

      <input
        type="text"
        placeholder="Nombre del producto"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Marca"
        value={marca}
        onChange={(e) => setMarca(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Código de barras"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />

      {/* 🔘 Botón para activar o desactivar escáner */}
      <button
        type="button"
        onClick={() => setMostrarScanner(!mostrarScanner)}
        style={{ margin: "10px 0", background: "#111", color: "#fff" }}
      >
        {mostrarScanner ? "Cerrar escáner" : "Escanear código de barras"}
      </button>

      {/* 📷 Escáner solo si mostrarScanner es true */}
      {mostrarScanner && (
        <div style={{ margin: "10px 0" }}>
          <Scanner setCodigo={setCodigo} />
        </div>
      )}

      <input
        type="number"
        placeholder="Precio de compra"
        value={precioCompra}
        onChange={(e) => setPrecioCompra(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="% para revendedora"
        value={margenRevendedora}
        onChange={(e) => setMargenRevendedora(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="% para consumidor final"
        value={margenFinal}
        onChange={(e) => setMargenFinal(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        required
      />

      <button type="submit">Guardar</button>
    </form>
  );
}

export default ProductForm;
