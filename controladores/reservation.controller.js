import Reservation from "../models/reservation.js";
import Property from "../models/property.js";

export const createReservation = async (req, res) => {
    const { propiedadId, fechaInicio, fechaFin, precioTotal } = req.body;
    try {
        const property = await Property.findById(propiedadId);
        if (!property) return res.status(404).json({ message: "Propiedad no encontrada" });

        const newReservation = new Reservation({
            propiedadId,
            inquilinoId: req.user,
            propietarioId: property.propietarioId,
            fechaInicio,
            fechaFin,
            precioTotal
        });
        const savedReservation = await newReservation.save()
        res.status(201).json(savedReservation)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const getReservationByUser = async (req, res) => {
    try {
        const reservas = await Reservation.find({ inquilinoId: req.user })
            .populate('propiedadId') 
            .sort({ fechaInicio: 1 }); 

        res.status(200).json(reservas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getReservationsByHost = async (req, res) => {
    try {
        const reservas = await Reservation.find({ propietarioId: req.user })
            .populate('propiedadId')
            .populate('inquilinoId', 'username email')
            .sort({ createdAt: -1 }); 

        res.status(200).json(reservas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getReservationByProperty = async (req, res) => {
    const { propertyId } = req.params;
    try {
        const reservas = await Reservation.find({ propiedadId: propertyId });
        res.status(200).json(reservas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const updateReservation = async (req, res) => {
    const { id } = req.params;
    try {
        const reservaActualizada = await Reservation.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!reservaActualizada) return res.status(404).json({ message: "Reserva no encontrada" });

        res.status(200).json(reservaActualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};