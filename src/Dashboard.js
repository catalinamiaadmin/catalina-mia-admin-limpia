// src/Dashboard.js
import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const fetchVentas = async () => {
      const ventasSnapshot = await getDocs(collection(db, "ventas"));
      const ventasData = ventasSnapshot.docs.map((doc) => doc.data());
      setVentas(ventasData);
    };

    fetchVentas();
  }, []);

  const totalVentas = ventas.length;
  const totalRecaudado = ventas.reduce(
    (acc, venta) => acc + (venta.total || 0),
    0
  );

  const productosAgrupados = ventas.reduce((acc, venta) => {
    const nombre = venta.nombre || "Desconocido";
    acc[nombre] = (acc[nombre] || 0) + (venta.total || 0);
    return acc;
  }, {});

  const datosGrafico = Object.entries(productosAgrupados).map(
    ([nombre, total]) => ({
      nombre,
      total,
    })
  );

  const handleResetVentas = () => {
    const clave = prompt("Ingresá la clave para continuar:");
    if (clave === "2667") {
      if (
        window.confirm("¿Estás seguro que querés borrar TODAS las ventas?")
      ) {
        const ventasRef = collection(db, "ventas");
        getDocs(ventasRef).then((snapshot) => {
          snapshot.forEach((docu) => {
            deleteDoc(doc(db, "ventas", docu.id));
          });
          alert("Ventas reseteadas correctamente.");
          setVentas([]); // también limpia el estado local
        });
      }
    } else {
      alert("Clave incorrecta. No se realizó ningún cambio.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#111",
        color: "#fff",
        padding: "20px",
        marginTop: "40px",
        border: "2px solid #ff69b4",
        borderRadius: "12px",
      }}
    >
      <h2 style={{ color: "#ff69b4" }}>📊 Panel de estadísticas</h2>
      <p>
        <strong>Total recaudado:</strong> ${totalRecaudado.toFixed(2)}
      </p>
      <p>
        <strong>Total de ventas:</strong> {totalVentas}
      </p>

      <button
        onClick={handleResetVentas}
        style={{
          marginTop: "20px",
          backgroundColor: "#ff007f",
          color: "white",
          border: "none",
          padding: "10px 20px",
          fontWeight: "bold",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        🧨 Resetear Ventas
      </button>

      <div style={{ height: "300px", marginTop: "40px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datosGrafico}>
            <XAxis dataKey="nombre" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Bar dataKey="total" fill="#ff69b4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
