import Property from "../models/property.js";

// Controller para `properties` (propiedades)

const listProperties = async (req, res) => {
  try {
    const filtro = {};

    if (req.query.estado) filtro.estado = req.query.estado;
    if (req.query.propietario) filtro.propietarioId = req.query.propietario;

    const properties = await Property.find(filtro);
    res.json(properties);

  } catch (error) {
    console.error("Error GET /properties:", error);
    res.status(500).json({ msg: "Error al obtener propiedades" });
  }
};

const listMine = async (req, res) => {
  try {
    const properties = await Property.find({ propietarioId: req.userId });
    res.json(properties);

  } catch (error) {
    console.error("Error GET /properties/mine:", error);
    res.status(500).json({ msg: "Error al obtener tus propiedades" });
  }
};

const listByUser = async (req, res) => {
  try {
    const properties = await Property.find({ propietarioId: req.params.userId });
    res.json(properties);

  } catch (error) {
    console.error("Error GET /users/:userId/properties:", error);
    res.status(500).json({ msg: "Error al obtener propiedades del usuario" });
  }
};

const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property)
      return res.status(404).json({ msg: "Propiedad no encontrada" });

    res.json(property);

  } catch (error) {
    console.error("Error GET /properties/:id:", error);
    res.status(500).json({ msg: "Error al obtener la propiedad" });
  }
};

const createProperty = async (req, res) => {
  try {
    const nuevaPropiedad = new Property({
      ...req.body,
      propietarioId: req.userId,
    });

    const guardada = await nuevaPropiedad.save();
    res.status(201).json(guardada);

  } catch (error) {
    console.error("Error POST /properties:", error);
    res.status(500).json({ msg: "Error al crear la propiedad" });
  }
};

const updateProperty = async (req, res) => {
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
};

const deleteProperty = async (req, res) => {
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
};

export {
  listProperties,
  listMine,
  listByUser,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
};
