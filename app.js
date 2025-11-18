import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/config.js";
import authRoutes from "./rutas/authenticacion.js";

dotenv.config();
connectDB();

const app = express();
//Middelware para parsear JSON y cookies
app.use(express.json());
app.use(cookieParser());

//cors configurado para que pueda enviar cookies desde el front-end
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],   
    credentials: true                  
}));

//Rutas
app.use("/api", authRoutes);
//inicia el servidor
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});  