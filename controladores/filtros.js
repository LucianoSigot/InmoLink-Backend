import Property from "../models/property.js";

export const filtrarProperties = async (req, res) => {
  try {
    const { filtros, pagina = 1, limite = 21 } = req.body;
    const skip = (Number(pagina) - 1) * Number(limite);
    const query = { estado: 'activa' };

    if (filtros?.busqueda?.trim()) {
      const search = filtros.busqueda.toLowerCase();
      query.$or = [
        { titulo: { $regex: search, $options: 'i' } },
        { ubicacion: { $regex: search, $options: 'i' } }
      ];
    }

    if (filtros) {
      if (filtros.precio?.min || filtros.precio?.max) {
        query.precio = {};
        if (filtros.precio.min) query.precio.$gte = Number(filtros.precio.min);
        if (filtros.precio.max) query.precio.$lte = Number(filtros.precio.max);
      }
      
      if (filtros.metrosCuadrados?.min || filtros.metrosCuadrados?.max) {
        query.tamanio = {}; 
        if (filtros.metrosCuadrados.min) query.tamanio.$gte = Number(filtros.metrosCuadrados.min);
        if (filtros.metrosCuadrados.max) query.tamanio.$lte = Number(filtros.metrosCuadrados.max);
      }

      if (filtros.habitaciones) query.habitaciones = Number(filtros.habitaciones);
      if (filtros.ambientes) query.ambientes = Number(filtros.ambientes);
    }

    let sort = { createdAt: -1 };
    if (filtros?.ordenPrecio) {
      sort = { precio: filtros.ordenPrecio === 'desc' ? -1 : 1 };
    }

    const [items, total] = await Promise.all([
      Property.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limite))
        .populate('propietarioId', 'nombre email'),
      Property.countDocuments(query)
    ]);

    res.json({ 
      success: true, 
      cantidad: items.length, 
      total, 
      pagina: Number(pagina), 
      limite: Number(limite), 
      totalPaginas: Math.ceil(total / limite), 
      propiedades: items 
    });

  } catch (error) {
    console.error("Error en búsqueda:", error);
    res.status(500).json({ success: false, msg: "Error al buscar propiedades" });
  }
};

export const obtenerPropiedad = async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, estado: 'activa' }).populate('propietarioId', 'nombre email');
    if (!property) return res.status(404).json({ success: false, msg: "Propiedad no encontrada" });
    res.json(property);
  } catch (error) {
    console.error("Error al obtener propiedad:", error);
    res.status(500).json({ success: false, msg: "Error del servidor" });
  }
};
