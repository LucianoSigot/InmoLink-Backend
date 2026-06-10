import Property from "../models/property.js";

export const listProperties = async (req, res) => {
  try {
    const query = {};
    query.estado = req.query.estado || 'activa';
    if (req.query.propietario) query.propietarioId = req.query.propietario;

    const items = await Property.find(query);
    res.json(items);
  } catch (error) {
    console.error("Error al listar propiedades:", error);
    res.status(500).json({ msg: "Error al obtener propiedades" });
  }
};

export const listMine = async (req, res) => {
  try {
    const items = await Property.find({ propietarioId: req.user });
    res.json(items);
  } catch (error) {
    console.error("Error al listar mis propiedades:", error);
    res.status(500).json({ msg: "Error al obtener tus propiedades" });
  }
};

export const listByUser = async (req, res) => {
  try {
    const items = await Property.find({ propietarioId: req.params.userId, estado: 'activa' });
    res.json(items);
  } catch (error) {
    console.error("Error al listar por usuario:", error);
    res.status(500).json({ msg: "Error al obtener propiedades del usuario" });
  }
};

export const getProperty = async (req, res) => {
  try {
    const item = await Property.findOne({ _id: req.params.id, estado: 'activa' });
    if (!item) return res.status(404).json({ msg: "Propiedad no encontrada" });
    res.json(item);
  } catch (error) {
    console.error("Error al obtener propiedad:", error);
    res.status(500).json({ msg: "Error al obtener la propiedad" });
  }
};

export const createProperty = async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      propietarioId: req.user,
    });

    const saved = await property.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error al crear propiedad:", error);
    res.status(500).json({ msg: "Error al crear la propiedad" });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ msg: "Propiedad no encontrada" });

    if (property.propietarioId.toString() !== req.user && req.userRole !== "admin") {
      return res.status(403).json({ msg: "No autorizado" });
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Error al actualizar propiedad:", error);
    res.status(500).json({ msg: "Error al actualizar" });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ msg: "Propiedad no encontrada" });

    if (property.propietarioId.toString() !== req.user && req.userRole !== "admin") {
      return res.status(403).json({ msg: "No autorizado" });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ msg: "Propiedad eliminada" });
  } catch (error) {
    console.error("Error al eliminar propiedad:", error);
    res.status(500).json({ msg: "Error al eliminar" });
  }
};
