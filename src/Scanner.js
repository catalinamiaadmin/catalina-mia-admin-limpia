import React, { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

function Scanner({ onScanSuccess }) {
  useEffect(() => {
    const scanner = new Html5Qrcode("reader");

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 20, // Más fps = más chances de detectar rápido
          // Sacamos qrbox para que escanee en toda la vista
        },
        (decodedText) => {
          onScanSuccess(decodedText);
          scanner.stop().catch(() => {});
        },
        (errorMessage) => {
          // Ignoramos errores comunes de escaneo (no es necesario loguearlos)
        }
      )
      .catch((err) => {
        console.error("No se pudo iniciar el escáner:", err);
      });

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [onScanSuccess]);

  return (
    <div>
      <p>📷 Escaneá el código de barras:</p>
      <div id="reader" style={{ width: "100%", maxHeight: "400px" }} />
    </div>
  );
}

export default Scanner;
