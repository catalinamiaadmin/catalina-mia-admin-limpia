import React, { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

function Scanner({ onScanSuccess }) {
  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    let started = false;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScanSuccess(decodedText);
          scanner.stop().catch((err) => {
            console.error("Error al detener el escáner:", err);
          });
        }
      )
      .then(() => {
        started = true;
      })
      .catch((err) => {
        console.error("Error al iniciar la cámara:", err);
      });

    return () => {
      if (started) {
        scanner.stop().catch(() => {});
      }
    };
  }, [onScanSuccess]);

  return (
    <div>
      <p>📷 Escaneá el código de barras:</p>
      <div id="reader" style={{ width: "100%" }} />
    </div>
  );
}

export default Scanner;
