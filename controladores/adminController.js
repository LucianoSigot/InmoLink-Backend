import Property from "../models/property.js";
import User from "../models/user.js";
import Reservation from "../models/reservation.js";

// ── PROPERTIES ──

export const adminListProperties = async (req, res) => {
  try {
    const { busqueda, estado, precioMin, precioMax, tamanioMin, tamanioMax, ordenar, pagina = 1, limite = 20 } = req.query;
    const query = {};

    if (busqueda?.trim()) {
      const search = busqueda.toLowerCase();
      query.$or = [
        { titulo: { $regex: search, $options: "i" } },
        { ubicacion: { $regex: search, $options: "i" } }
      ];
    }
    if (estado) query.estado = estado;
    if (precioMin || precioMax) {
      query.precio = {};
      if (precioMin) query.precio.$gte = Number(precioMin);
      if (precioMax) query.precio.$lte = Number(precioMax);
    }
    if (tamanioMin || tamanioMax) {
      query.tamanio = {};
      if (tamanioMin) query.tamanio.$gte = Number(tamanioMin);
      if (tamanioMax) query.tamanio.$lte = Number(tamanioMax);
    }

    let sort = { createdAt: -1 };
    if (ordenar === "precio_asc") sort = { precio: 1 };
    else if (ordenar === "precio_desc") sort = { precio: -1 };
    else if (ordenar === "tamanio_asc") sort = { tamanio: 1 };
    else if (ordenar === "tamanio_desc") sort = { tamanio: -1 };
    else if (ordenar === "titulo_asc") sort = { titulo: 1 };
    else if (ordenar === "titulo_desc") sort = { titulo: -1 };
    else if (ordenar === "estado") sort = { estado: 1 };
    else if (ordenar === "antiguo") sort = { createdAt: 1 };

    const skip = (Number(pagina) - 1) * Number(limite);

    const [items, total] = await Promise.all([
      Property.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limite))
        .populate("propietarioId", "name email rol"),
      Property.countDocuments(query)
    ]);

    res.json({
      propiedades: items,
      total,
      pagina: Number(pagina),
      limite: Number(limite),
      totalPaginas: Math.ceil(total / limite)
    });
  } catch (error) {
    console.error("Error admin listar propiedades:", error);
    res.status(500).json({ msg: "Error al obtener propiedades" });
  }
};

export const adminGetPropertyDetail = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("propietarioId", "name email rol foto");
    if (!property) return res.status(404).json({ msg: "Propiedad no encontrada" });
    res.json(property);
  } catch (error) {
    console.error("Error admin obtener propiedad:", error);
    res.status(500).json({ msg: "Error al obtener la propiedad" });
  }
};

export const adminUpdatePropertyStatus = async (req, res) => {
  try {
    const { estado } = req.body;
    const validStatuses = ["pendiente", "activa", "pausada", "rechazada"];
    if (!validStatuses.includes(estado)) {
      return res.status(400).json({ msg: "Estado inválido. Valores permitidos: " + validStatuses.join(", ") });
    }
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );
    if (!property) return res.status(404).json({ msg: "Propiedad no encontrada" });
    res.json({ msg: `Estado actualizado a "${estado}"`, propiedad: property });
  } catch (error) {
    console.error("Error admin actualizar estado:", error);
    res.status(500).json({ msg: "Error al actualizar el estado" });
  }
};

export const adminEditProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!property) return res.status(404).json({ msg: "Propiedad no encontrada" });
    res.json(property);
  } catch (error) {
    console.error("Error admin editar propiedad:", error);
    res.status(500).json({ msg: "Error al editar la propiedad" });
  }
};

export const adminDeleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ msg: "Propiedad no encontrada" });
    // Also delete related reservations
    await Reservation.deleteMany({ propiedadId: req.params.id });
    res.json({ msg: "Propiedad y sus reservas eliminadas" });
  } catch (error) {
    console.error("Error admin eliminar propiedad:", error);
    res.status(500).json({ msg: "Error al eliminar la propiedad" });
  }
};

// ── USERS ──

export const adminListUsers = async (req, res) => {
  try {
    const { busqueda, rol, ordenar, pagina = 1, limite = 20 } = req.query;
    const query = {};

    if (busqueda?.trim()) {
      const search = busqueda.toLowerCase();
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    if (rol) query.rol = rol;

    let sort = { createdAt: -1 };
    if (ordenar === "name_asc") sort = { name: 1 };
    else if (ordenar === "name_desc") sort = { name: -1 };
    else if (ordenar === "email_asc") sort = { email: 1 };
    else if (ordenar === "rol") sort = { rol: 1 };
    else if (ordenar === "antiguo") sort = { createdAt: 1 };

    const skip = (Number(pagina) - 1) * Number(limite);

    const [items, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort(sort)
        .skip(skip)
        .limit(Number(limite)),
      User.countDocuments(query)
    ]);

    res.json({
      usuarios: items,
      total,
      pagina: Number(pagina),
      limite: Number(limite),
      totalPaginas: Math.ceil(total / limite)
    });
  } catch (error) {
    console.error("Error admin listar usuarios:", error);
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
};

export const adminGetUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    const propiedades = await Property.find({ propietarioId: user._id });
    const reservasComoInquilino = await Reservation.find({ inquilinoId: user._id })
      .populate("propiedadId", "titulo ubicacion precio");
    const reservasComoHost = await Reservation.find({ propietarioId: user._id })
      .populate("propiedadId", "titulo ubicacion precio")
      .populate("inquilinoId", "name email");

    res.json({ user, propiedades, reservasComoInquilino, reservasComoHost });
  } catch (error) {
    console.error("Error admin obtener usuario:", error);
    res.status(500).json({ msg: "Error al obtener el usuario" });
  }
};

export const adminChangeUserRole = async (req, res) => {
  try {
    const { rol } = req.body;
    if (!["usuario", "admin"].includes(rol)) {
      return res.status(400).json({ msg: "Rol inválido. Valores permitidos: usuario, admin" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { rol },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.json({ msg: `Rol actualizado a "${rol}"`, usuario: user });
  } catch (error) {
    console.error("Error admin cambiar rol:", error);
    res.status(500).json({ msg: "Error al cambiar el rol" });
  }
};

export const adminDeleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    // Delete user's properties and their reservations
    const propiedades = await Property.find({ propietarioId: user._id });
    const propiedadIds = propiedades.map((p) => p._id);

    await Reservation.deleteMany({
      $or: [
        { inquilinoId: user._id },
        { propietarioId: user._id },
        { propiedadId: { $in: propiedadIds } }
      ]
    });
    await Property.deleteMany({ propietarioId: user._id });
    await User.findByIdAndDelete(user._id);

    res.json({ msg: "Usuario, propiedades y reservas eliminados" });
  } catch (error) {
    console.error("Error admin eliminar usuario:", error);
    res.status(500).json({ msg: "Error al eliminar el usuario" });
  }
};

export const adminEditUser = async (req, res) => {
  try {
    const { name, email, telefono, direccion, descripcion, rol } = req.body;
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (telefono !== undefined) updateFields.telefono = telefono;
    if (direccion !== undefined) updateFields.direccion = direccion;
    if (descripcion !== undefined) updateFields.descripcion = descripcion;
    if (rol !== undefined) updateFields.rol = rol;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    console.error("Error admin editar usuario:", error);
    res.status(500).json({ msg: "Error al editar el usuario" });
  }
};
