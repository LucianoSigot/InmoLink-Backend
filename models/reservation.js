import mongoose from "mongoose";

const reservationSchema = new  mongoose.Schema({
    propietarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    inquilinoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    propiedadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    precioTotal: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'activa', 'pausada', 'rechazada'],
        default: 'pendiente'
    }
},{
    timestamps: true
})

export default mongoose.model("Reservation", reservationSchema);