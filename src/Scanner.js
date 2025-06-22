// src/Scanner.js
import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./Scanner.css";

function Scanner() {
  const [scannerActivo, setScannerActivo] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (scannerActivo) {
      const scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: 250,
      });

      scanner.render(
        (decodedText) => {
          // Escribe el texto en el input que esté enfocado
          if (document.activeElement && document.activeElement.tagName === "INPUT") {
            document.activeElement.value = decodedText;
            document.activeElement.dispatchEvent(
              new Event("input", { bubbles: true })
            );
          }
          // Parar el scanner después de una lectura
          scanner.clear().catch((err) => console.error("Error al detener scanner:", err));
          setScannerActivo(false);
        },
        (error) => {
          // Solo logueamos errores si querés debug
          console.warn("Error de escaneo:", error);
        }
      );

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) => console.error("Error al limpiar scanner:", err));
      }
    };
  }, [scannerActivo]);

  const toggleScanner = () => {
    setScannerActivo((prev) => !prev);
  };

  return (
    <div className="scanner-container">
      <button className="scanner-btn" onClick={toggleScanner}>
        {scannerActivo ? "Desactivar escáner" : "Activar escáner"}
      </button>
      {scannerActivo && <div id="reader" style={{ width: "100%" }}></div>}
    </div>
  );
}

export default Scanner;
