// src/InventarioValor.js
import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function InventarioValor() {
  const [valorTotal, setValorTotal] = useState(0);

  useEffect(() => {
    const calcularInventario = async () => {
      const querySnapshot = await getDocs(collection(db, "productos"));
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const precioCompra = parseFloat(data.precioCompra);
        const stock = parseInt(data.stock);
        if (!isNaN(precioCompra) && !isNaN(stock)) {
          total += precioCompra * stock;
        }
      });
      setValorTotal(total);
    };

    calcularInventario();
  }, []);

  return (
    <div style={{
      backgroundColor: "white",
      color: "black",
      padding: "25px 40px",
      margin: "20px auto",
      borderRadius: "10px",
      border: "4px solid violet",
      maxWidth: "600px",
      textAlign: "center",
      fontSize: "2.2rem",
      fontWeight: "bold"
    }}>
      VALOR INVENTARIO: ${valorTotal.toLocaleString("es-AR")}
    </div>
  );
}

export default InventarioValor;
