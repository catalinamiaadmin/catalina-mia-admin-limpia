// src/Scanner.js
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./Scanner.css";

function Scanner() {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);

  useEffect(() => {
    if (!scanning) return;

    const initScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          const cameraId = devices[0].id;
          html5QrCodeRef.current = new Html5Qrcode("reader");

          await html5QrCodeRef.current.start(
            cameraId,
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.333334
            },
            (decodedText, decodedResult) => {
              console.log("Código escaneado:", decodedText);

              // 👉 Coloca el valor en el input activo
              if (document.activeElement && document.activeElement.tagName === "INPUT") {
                const input = document.activeElement;
                input.value = decodedText;

                const event = new Event("input", { bubbles: true });
                input.dispatchEvent(event);
              }

              // 👉 Hace vibrar el dispositivo (200 ms)
              if (navigator.vibrate) {
                navigator.vibrate(200);
              }

              // 👉 Detiene el escáner después de escanear
              stopScanner();
            }
          );
        }
      } catch (err) {
        console.error("Error al iniciar escáner:", err);
        setCameraPermissionDenied(true);
      }
    };

    initScanner();

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().then(() => {
          html5QrCodeRef.current.clear();
        });
      }
    };
  }, [scanning]);

  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          html5QrCodeRef.current.clear();
          setScanning(false);
        })
        .catch((err) => {
          console.error("No se pudo detener el escáner:", err);
        });
    }
  };

  return (
    <div className="scanner-container">
      <h3>📷 Escaneá el código de barras:</h3>
      {cameraPermissionDenied && (
        <p style={{ color: "red" }}>
          Permiso de cámara denegado. Verificá que el navegador tenga acceso a
          la cámara.
        </p>
      )}
      <div id="reader" ref={scannerRef} style={{ width: "100%" }}></div>
      <button onClick={() => setScanning(!scanning)}>
        {scanning ? "Detener escáner" : "Activar escáner"}
      </button>
    </div>
  );
}

export default Scanner;
