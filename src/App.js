// src/App.js
import React from "react";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import Dashboard from "./Dashboard";
import Importador from "./Importador";
import Carrito from "./Carrito";
import { CarritoProvider } from "./CarritoContext";
import InventarioValor from "./InventarioValor"; // ✅ Componente para mostrar el valor del inventario
import "./App.css";

function App() {
  return (
    <CarritoProvider>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">CATALINA MÍA – Panel Admin</h1>
        </header>
        <div className="App-body">
          <div className="Form-container">
            <ProductForm />
            <Importador />
            <InventarioValor /> {/* ✅ Panel con el valor total del inventario */}
          </div>
          <div className="List-container">
            <ProductList />
            <Dashboard />
            <Carrito />
          </div>
        </div>
      </div>
    </CarritoProvider>
  );
}

export default App;
