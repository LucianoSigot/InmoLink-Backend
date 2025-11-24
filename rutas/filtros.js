import express from 'express';
import { filtrarProperties } from "../controladores/filtros.js";

const router = express.Router();

// POST para filtrar propiedades
router.post('/properties/filtrar', filtrarProperties);

export default router;