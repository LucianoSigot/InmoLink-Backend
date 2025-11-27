import express from 'express';
// Importamos AMBAS funciones
import { filtrarProperties, obtenerPropiedad } from "../controladores/filtros.js";

const router = express.Router();

// POST para filtrar propiedades
router.post('/properties/filtrar', filtrarProperties);

// GET para obtener UNA propiedad (Esto faltaba)
router.get('/properties/:id', obtenerPropiedad);

export default router;