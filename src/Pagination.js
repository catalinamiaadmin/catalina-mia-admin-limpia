// src/Pagination.js
import React from "react";

function Pagination({ total, porPagina, paginaActual, setPaginaActual }) {
  const totalPaginas = Math.ceil(total / porPagina);
  if (totalPaginas === 1) return null;

  const paginas = [];
  for (let i = 1; i <= totalPaginas; i++) {
    paginas.push(i);
  }

  return (
    <div style={{ marginTop: 20, textAlign: "center" }}>
      <button
        disabled={paginaActual === 1}
        onClick={() => setPaginaActual(paginaActual - 1)}
      >
        «
      </button>
      {paginas.map((n) => (
        <button
          key={n}
          onClick={() => setPaginaActual(n)}
          style={{
            margin: "0 4px",
            fontWeight: paginaActual === n ? "bold" : "normal"
          }}
        >
          {n}
        </button>
      ))}
      <button
        disabled={paginaActual === totalPaginas}
        onClick={() => setPaginaActual(paginaActual + 1)}
      >
        »
      </button>
    </div>
  );
}

export default Pagination;
