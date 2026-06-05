import reservation from "../models/reservation.js";

//Middleware para verificar que no haya alguien que lo reservo
export const verificarFechas = async (req, res, next) => {
    //Obtener las fechas de incio, fin de reserva y el id de la propiedad
    const { propiedadId, fechaInicio, fechaFin } = req.body;

    try {
        //logica de validacion de fechas
        const existingReservation = await reservation.findOne({
            propiedadId,
            estado: { $in: ['pendiente', 'activa'] }, // Solo verificar reservas activas o pendientes
            $or: [
                { fechaInicio: { $lt: fechaFin }, fechaFin: { $gt: fechaInicio } } 
            ]
        });
        //Si ya alguien mas reservo entonces envio un mensaje al fron diciendo que ya hay una reserva
        if (existingReservation) {
            return res.status(400).json({ message: "La propiedad ya esta reservada para estas fechas."    });
        }
        //Si no hay problemas con las fechas entonces pasamos a la siguiente funcion
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
