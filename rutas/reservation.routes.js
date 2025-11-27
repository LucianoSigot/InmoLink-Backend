import { Router } from "express";
import { authRequired } from "../Middleware/authMiddleware.js";
import { verificarFechas } from "../Middleware/reservationMiddleware.js";
import {
    createReservation,
    getReservationByProperty,
    getReservationByUser,
    getReservationsByHost,
    updateReservation
} from "../controladores/reservation.controller.js";

const router = Router();

router.post("/", authRequired, verificarFechas, createReservation);
//Para ilquilinos
router.get("/", authRequired, getReservationByUser);
//Para anfitriones (ver todas sus reservas)
router.get("/host", authRequired, getReservationsByHost);
//Solo alfitrion (por propiedad)
router.get("/property/:propertyId", authRequired, getReservationByProperty);
//Tanto alfitrion como ilquilinos
router.put("/:id", authRequired, updateReservation);


export default router;
