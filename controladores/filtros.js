import Property from "../models/property.js";

const filtrarProperties = async (req, res) => {
  try {
    const { filtros, pagina = 1, limite = 21 } = req.body;
    const skip = (pagina - 1) * limite;
    const filtroMongo = {};

    if (filtros && filtros.busqueda && filtros.busqueda.trim() !== '') {
      const busqueda = filtros.busqueda.toLowerCase();
      filtroMongo.$or = [
        { titulo: { $regex: busqueda, $options: 'i' } },
        { ubicacion: { $regex: busqueda, $options: 'i' } }
      ];
    }

    if (filtros && Object.keys(filtros).length > 0) {
      if (filtros.precio && (filtros.precio.min || filtros.precio.max)) {
        filtroMongo.precio = {};
        if (filtros.precio.min) filtroMongo.precio.$gte = Number(filtros.precio.min);
        if (filtros.precio.max) filtroMongo.precio.$lte = Number(filtros.precio.max);
      }
      if (filtros.metrosCuadrados && (filtros.metrosCuadrados.min || filtros.metrosCuadrados.max)) {
        filtroMongo.tamanio = {}; 
        if (filtros.metrosCuadrados.min) filtroMongo.tamanio.$gte = Number(filtros.metrosCuadrados.min);
        if (filtros.metrosCuadrados.max) filtroMongo.tamanio.$lte = Number(filtros.metrosCuadrados.max);
      }
      if (filtros.habitaciones) filtroMongo.habitaciones = Number(filtros.habitaciones);
      if (filtros.ambientes) filtroMongo.hambientes = Number(filtros.ambientes);
    }

    let ordenamiento = { createdAt: -1 };
    if (filtros && filtros.ordenPrecio) {
      ordenamiento = { precio: filtros.ordenPrecio === 'desc' ? -1 : 1 };
    }

    const [properties, total] = await Promise.all([
      Property.find(filtroMongo).sort(ordenamiento).skip(skip).limit(Number(limite)).populate('propietarioId', 'nombre email'),
      Property.countDocuments(filtroMongo)
    ]);

    res.json({ success: true, cantidad: properties.length, total: total, pagina: Number(pagina), limite: Number(limite), totalPaginas: Math.ceil(total / limite), propiedades: properties });

  } catch (error) {
    console.error("Error en búsqueda:", error);
    res.status(500).json({ success: false, msg: "Error al buscar propiedades" });
  }
};

// ESTA ES LA FUNCIÓN QUE NECESITAS PARA EL DETALLE
const obtenerPropiedad = async (req, res) => {
  try {
    const { id } = req.params;
    const propiedad = await Property.findById(id).populate('propietarioId', 'nombre email');
    if (!propiedad) return res.status(404).json({ success: false, msg: "Propiedad no encontrada" });
    res.json(propiedad);
  } catch (error) {
    console.error("Error al obtener propiedad:", error);
    res.status(500).json({ success: false, msg: "Error del servidor" });
  }
};

export { filtrarProperties, obtenerPropiedad };