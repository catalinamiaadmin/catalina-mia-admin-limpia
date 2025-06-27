// src/Dashboard.js
import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function Dashboard() {
  const [resumen, setResumen] = useState({
    totalProductos: 0,
    totalStock: 0,
    productosBajoStock: 0
  });

  useEffect(() => {
    const calcularResumen = async () => {
      const querySnapshot = await getDocs(collection(db, "productos"));
      let totalProductos = 0;
      let totalStock = 0;
      let productosBajoStock = 0;

      querySnapshot.forEach((doc) => {
        totalProductos++;
        const data = doc.data();
        const stock = parseInt(data.stock);
        totalStock += stock;
        if (stock <= 5) productosBajoStock++;
      });

      setResumen({ totalProductos, totalStock, productosBajoStock });
    };

    calcularResumen();
  }, []);

  return (
    <div style={{ marginTop: 20 }}>
      <h2>📊 Resumen</h2>
      <ul>
        <li>Total de productos diferentes: {resumen.totalProductos}</li>
        <li>Stock total en unidades: {resumen.totalStock}</li>
        <li>Productos con bajo stock (≤ 5): {resumen.productosBajoStock}</li>
      </ul>
    </div>
  );
}

export default Dashboard;
