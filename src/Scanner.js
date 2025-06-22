// Scanner.js
import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./Scanner.css";

const Scanner = ({ setCodigo }) => {
  useEffect(() => {
    // 1. Crear una nueva instancia del escáner
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10, // 10 cuadros por segundo
      qrbox: { width: 250, height: 250 },
    });

    // 2. Lógica cuando detecta un código
    const onScanSuccess = (decodedText, decodedResult) => {
      console.log(`Código escaneado: ${decodedText}`);
      setCodigo(decodedText); // 3. Actualiza el campo en tu app
      scanner.clear(); // 4. Detiene el escáner luego de un código leído
    };

    // 5. Mostrar errores si ocurren
    const onScanFailure = (error) => {
      console.warn(`Error al escanear: ${error}`);
    };

    // 6. Iniciar el escaneo
    scanner.render(onScanSuccess, onScanFailure);

    // 7. Limpiar recursos cuando se desmonta el componente
    return () => {
      scanner.clear().catch((error) => {
        console.error("No se pudo limpiar el escáner", error);
      });
    };
  }, [setCodigo]);

  return (
    <div id="reader" style={{ width: "100%", maxWidth: "300px", margin: "auto" }}></div>
  );
};

export default Scanner;
