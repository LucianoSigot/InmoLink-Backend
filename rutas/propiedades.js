import { Router } from "express";
import { authRequired } from "../Middleware/authMiddleware.js";
import * as propiedadController from "../controladores/propiedadController.js";

const router = Router();

// GET /properties (listar con filtros opcionales)
// Ejemplo: /properties?estado=activa&propietario=123

router.get("/", propiedadController.listProperties);



// GET /properties/mine (privado)
// Propiedades del usuario autenticado

router.get("/mine", authRequired, propiedadController.listMine);



// GET /users/:userId/properties (público)
// Propiedades pertenecientes a otro usuario

router.get("/users/:userId/properties", propiedadController.listByUser);



// GET /properties/:id (obtener una propiedad)

router.get("/:id", propiedadController.getProperty);



// POST /properties (crear)
// PRIVADO: requiere usuario autenticado

router.post("/", authRequired, propiedadController.createProperty);



// PUT /properties/:id (editar)
// PRIVADO: solo el dueño puede editar

router.put("/:id", authRequired, propiedadController.updateProperty);


// DELETE /properties/:id (eliminar)
// PRIVADO: solo el dueño puede eliminar

router.delete("/:id", authRequired, propiedadController.deleteProperty);

export default router;
