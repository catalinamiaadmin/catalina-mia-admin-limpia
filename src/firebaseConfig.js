// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Esto es para usar la base de datos

// Configuración de tu proyecto (esto viene de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyA3_yPICpJyy92Io1sqorpaIO5flzSI28Q",
  authDomain: "catalinamiaapp.firebaseapp.com",
  projectId: "catalinamiaapp",
  storageBucket: "catalinamiaapp.firebasestorage.app",
  messagingSenderId: "357368603442",
  appId: "1:357368603442:web:d4c3ae312c1cc46370ad2b"
};

// Conectamos la app de React a Firebase
const app = initializeApp(firebaseConfig);

// Obtenemos acceso a la base de datos Firestore
const db = getFirestore(app);

// Exportamos db para usarla desde cualquier parte de tu app
export { db };

