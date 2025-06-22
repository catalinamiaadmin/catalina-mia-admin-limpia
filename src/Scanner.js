// src/Scanner.js
import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./Scanner.css";

function Scanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    if (isScanning && !scanner) {
      const html5QrCode = new Html5Qrcode("reader");

      html5QrCode
        .start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText, decodedResult) => {
            if (decodedText) {
              const active = document.activeElement;

              if (
                active &&
                active.tagName === "INPUT" &&
                !active.readOnly &&
                !active.disabled
              ) {
                active.value = decodedText;
                const inputEvent = new Event("input", { bubbles: true });
                active.dispatchEvent(inputEvent);
              } else {
                alert(
                  "Por favor hacé clic en un campo donde quieras que se escriba el código"
                );
              }

              html5QrCode.clear().then(() => {
                console.log("Escaneo detenido luego de leer:", decodedText);
                setIsScanning(false);
                setScanner(null);
              });
            }
          },
          (errorMessage) => {
            console.warn("Error en el escaneo", errorMessage);
          }
        )
        .then(() => {
          setScanner(html5QrCode);
        })
        .catch((err) => {
          console.error("Error al iniciar el escáner:", err);
        });
    }

    return () => {
      if (scanner) {
        scanner.stop().then(() => scanner.clear());
      }
    };
  }, [isScanning, scanner]);

  const toggleScanner = () => {
    setIsScanning(!isScanning);
  };

  return (
    <div className="scanner-container">
      <button onClick={toggleScanner} className="scanner-button">
        {isScanning ? "❌ Detener escáner" : "📷 Escanear código de barras"}
      </button>
      {isScanning && <div id="reader" className="scanner-reader" />}
    </div>
  );
}

export default Scanner;
