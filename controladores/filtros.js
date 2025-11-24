import Property from "../models/property.js";

const filtrarProperties = async (req, res) => {
  try {
    const { filtros } = req.body;
    
    // --- MODO DESARROLLO ---
    // Usamos un objeto vacío {} para traer TODO (pendientes y activas).
    const filtroMongo = {}; 
    
    // CUANDO TERMINES, descomenta la siguiente línea y borra la anterior:
    // const filtroMongo = { estado: 'activa' }; 
    // -----------------------

    // SOLO aplicar filtros adicionales si el usuario los envió y no están vacíos
    if (filtros && Object.keys(filtros).length > 0) {
      
      // FILTRO POR PRECIO
      if (filtros.precio && (filtros.precio.min || filtros.precio.max)) {
        filtroMongo.precio = {};
        if (filtros.precio.min) filtroMongo.precio.$gte = Number(filtros.precio.min);
        if (filtros.precio.max) filtroMongo.precio.$lte = Number(filtros.precio.max);
      }

      // FILTRO POR METROS CUADRADOS
      if (filtros.metrosCuadrados && (filtros.metrosCuadrados.min || filtros.metrosCuadrados.max)) {
        filtroMongo.m2 = {};
        if (filtros.metrosCuadrados.min) filtroMongo.m2.$gte = Number(filtros.metrosCuadrados.min);
        if (filtros.metrosCuadrados.max) filtroMongo.m2.$lte = Number(filtros.metrosCuadrados.max);
      }

      // FILTRO POR HABITACIONES
      if (filtros.habitaciones) {
        filtroMongo.habitaciones = Number(filtros.habitaciones);
      }

      // FILTRO POR AMBIENTES
      if (filtros.ambientes) {
        filtroMongo.ambientes = Number(filtros.ambientes);
      }
    }

    // ORDENAMIENTO (si no hay orden específico, usar más recientes primero)
    let ordenamiento = { createdAt: -1 };
    if (filtros && filtros.ordenPrecio) {
      ordenamiento = { precio: filtros.ordenPrecio === 'desc' ? -1 : 1 };
    }
    console.log("Filtro MongoDB (DEV):", filtroMongo);

    // BUSCAR EN MONGODB
    const properties = await Property.find(filtroMongo)
      .sort(ordenamiento)
      .populate('propietarioId', 'nombre email');

    res.json({
      success: true,
      cantidad: properties.length,
      propiedades: properties
    });

  } catch (error) {
    console.error("Error en filtros:", error);
    res.status(500).json({ 
      success: false,
      msg: "Error al filtrar propiedades"
    });
  }
};

export {
  filtrarProperties
};