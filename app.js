import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envResult = dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { connectDB } from "./config/config.js";
import { configureGoogleOAuth } from "./controladores/google.js";
import usuarioRoutes from "./rutas/usuario.js";
import authRoutes from "./rutas/authenticacion.js";
import propiedadesRoutes from "./rutas/propiedades.js";
import filtrosrutas from "./rutas/filtros.js";
import reservationRoutes from "./rutas/reservation.routes.js";

const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_KEY || "supersecreto",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());


// Configurar Google OAuth
configureGoogleOAuth();

// Rutas
app.use("/auth", usuarioRoutes);
app.use("/api", authRoutes);
app.use("/properties", propiedadesRoutes);
app.use("/filtros",filtrosrutas);
app.use("/reservation",reservationRoutes);

// Puerto
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

