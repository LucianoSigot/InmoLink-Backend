import Reservation from "../models/reservation.js";
import Property from "../models/property.js";

export const createReservation = async (req, res) => {
    const { propiedadId, fechaInicio, fechaFin, precioTotal } = req.body;
    try {
        const property = await Property.findById(propiedadId);
        if (!property) return res.status(404).json({ message: "Propiedad no encontrada" });

        const reservation = new Reservation({
            propiedadId,
            inquilinoId: req.user,
            propietarioId: property.propietarioId,
            fechaInicio,
            fechaFin,
            precioTotal
        });
        
        const saved = await reservation.save();
        res.status(201).json(saved);
    } catch (error) {
        console.error("Error al crear reserva:", error);
        res.status(500).json({ message: error.message });
    }
}

export const getReservationByUser = async (req, res) => {
    try {
        const items = await Reservation.find({ inquilinoId: req.user })
            .populate('propiedadId') 
            .sort({ fechaInicio: 1 }); 

        res.status(200).json(items);
    } catch (error) {
        console.error("Error al obtener reservas del usuario:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getReservationsByHost = async (req, res) => {
    try {
        const items = await Reservation.find({ propietarioId: req.user })
            .populate('propiedadId')
            .populate('inquilinoId', 'name email')
            .sort({ createdAt: -1 }); 

        res.status(200).json(items);
    } catch (error) {
        console.error("Error al obtener reservas del host:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getReservationByProperty = async (req, res) => {
    try {
        const items = await Reservation.find({ propiedadId: req.params.propertyId });
        res.status(200).json(items);
    } catch (error) {
        console.error("Error al obtener reservas por propiedad:", error);
        res.status(500).json({ message: error.message });
    }
};

export const updateReservation = async (req, res) => {
    try {
        const updated = await Reservation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Reserva no encontrada" });

        res.status(200).json(updated);
    } catch (error) {
        console.error("Error al actualizar reserva:", error);
        res.status(500).json({ message: error.message });
    }
};
