// src/Pagination.js
import React from "react";

function Pagination({ total, porPagina, paginaActual, setPaginaActual }) {
  const totalPaginas = Math.ceil(total / porPagina);

  const cambiarPagina = (nueva) => {
    if (nueva >= 1 && nueva <= totalPaginas) {
      setPaginaActual(nueva);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>
        ⬅️ Anterior
      </button>
      <span style={{ margin: "0 10px" }}>
        Página {paginaActual} de {totalPaginas}
      </span>
      <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>
        Siguiente ➡️
      </button>
    </div>
  );
}

export default Pagination;
