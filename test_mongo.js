import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Usamos la URI directamente del .env para estar seguros
const uri = process.env.MONGO_URI;

console.log("Probando conexión a la URI configurada en el .env...");

mongoose.connect(uri)
  .then(() => {
    console.log("¡Conexión exitosa desde el script de prueba!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Error detallado:", err.message);
    process.exit(1);
  });
