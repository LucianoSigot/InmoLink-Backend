import { Router } from "express";
import Property from "../models/property.js";
import { authRequired } from "../Middleware/authMiddleware.js";

const router = Router();

/*
  Endpoints REST (versión final para tu modelo Property):

  GET    /properties                     -> Lista todas las propiedades (con filtros opcionales)
  GET    /properties/mine                -> Lista propiedades del usuario logueado (privado)
  GET    /users/:userId/properties       -> Propiedades de un usuario específico (público)
  GET    /properties/:id                 -> Obtener una propiedad específica (público)

  POST   /properties                     -> Crear propiedad (privado)
  PUT    /properties/:id                 -> Editar propiedad (privado - solo dueño)
  DELETE /properties/:id                 -> Eliminar propiedad (privado - solo dueño)

  IMPORTANTE:
  - Tu modelo usa "propietarioId" (NO ownerId)
  - Tu modelo usa "estado" (NO state)
*/



// GET /properties (listar con filtros opcionales)
// Ejemplo: /properties?estado=activa&propietario=123

router.get("/", async (req, res) => {
  try {
    const filtro = {};

    // Filtro por estado (pendiente, activa, pausada, rechazada)
    if (req.query.estado) filtro.estado = req.query.estado;

    // Filtrar por propietario
    if (req.query.propietario) filtro.propietarioId = req.query.propietario;

    const properties = await Property.find(filtro);
    res.json(properties);

  } catch (error) {
    console.error("Error GET /properties:", error);
    res.status(500).json({ msg: "Error al obtener propiedades" });
  }
});



// GET /properties/mine (privado)
// Propiedades del usuario autenticado

router.get("/mine", authRequired, async (req, res) => {
  try {
    const properties = await Property.find({ propietarioId: req.userId });
    res.json(properties);

  } catch (error) {
    console.error("Error GET /properties/mine:", error);
    res.status(500).json({ msg: "Error al obtener tus propiedades" });
  }
});



// GET /users/:userId/properties (público)
// Propiedades pertenecientes a otro usuario

router.get("/users/:userId/properties", async (req, res) => {
  try {
    const properties = await Property.find({ propietarioId: req.params.userId });
    res.json(properties);

  } catch (error) {
    console.error("Error GET /users/:userId/properties:", error);
    res.status(500).json({ msg: "Error al obtener propiedades del usuario" });
  }
});



// GET /properties/:id (obtener una propiedad)

router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property)
      return res.status(404).json({ msg: "Propiedad no encontrada" });

    res.json(property);

  } catch (error) {
    console.error("Error GET /properties/:id:", error);
    res.status(500).json({ msg: "Error al obtener la propiedad" });
  }
});



// POST /properties (crear)
// PRIVADO: requiere usuario autenticado

router.post("/", authRequired, async (req, res) => {
  try {
    const nuevaPropiedad = new Property({
      ...req.body,
      propietarioId: req.userId,  // tomado del token JWT
    });

    const guardada = await nuevaPropiedad.save();
    res.status(201).json(guardada);

  } catch (error) {
    console.error("Error POST /properties:", error);
    res.status(500).json({ msg: "Error al crear la propiedad" });
  }
});



// PUT /properties/:id (editar)
// PRIVADO: solo el dueño puede editar

router.put("/:id", authRequired, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property)
      return res.status(404).json({ msg: "Propiedad no encontrada" });

    if (property.propietarioId.toString() !== req.userId)
      return res.status(403).json({ msg: "No tienes permiso para editar esta propiedad" });

    const actualizada = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(actualizada);

  } catch (error) {
    console.error("Error PUT /properties/:id:", error);
    res.status(500).json({ msg: "Error al actualizar la propiedad" });
  }
});


// DELETE /properties/:id (eliminar)
// PRIVADO: solo el dueño puede eliminar

router.delete("/:id", authRequired, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property)
      return res.status(404).json({ msg: "Propiedad no encontrada" });

    if (property.propietarioId.toString() !== req.userId)
      return res.status(403).json({ msg: "No tienes permiso para eliminar esta propiedad" });

    await Property.findByIdAndDelete(req.params.id);

    res.json({ msg: "Propiedad eliminada correctamente" });

  } catch (error) {
    console.error("Error DELETE /properties/:id:", error);
    res.status(500).json({ msg: "Error al eliminar la propiedad" });
  }
});

export default router;
