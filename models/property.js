import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    propietarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    titulo: { 
        type: String, 
        required: true,
        trim: true 
    },
    descripcion: { 
        type: String,
        required: true 
    },
    ubicacion: { 
        type: String, 
        required: true 
    },
    precio: { 
        type: Number, 
        required: true 
    },
    habitaciones: { 
        type: Number, 
        required: true,
        min: 1
    },
    // Almacenaremos las URLs de las fotos subidas a Supabase
    fotos: [{ 
        type: String 
    }],
    // Estado para la moderación (Administrador)
    estado: {
        type: String,
        enum: ['pendiente', 'activa', 'pausada', 'rechazada'],
        default: 'pendiente'
    },
    valoracionPromedio: {
        type: Number,
        default: 0
    },
    // Estructura de servicios exacta según tu JSON.docx
    servicios: {
        basicos: {
            wifi: { type: Boolean, default: false },
            agua_caliente: { type: Boolean, default: false },
            aire_acondicionado: { type: Boolean, default: false },
            calefaccion: { type: Boolean, default: false },
            articulos_higiene: { type: Boolean, default: false }
        },
        cocina: {
            cocina: { type: Boolean, default: false },
            microondas: { type: Boolean, default: false },
            heladera: { type: Boolean, default: false },
            horno: { type: Boolean, default: false },
            cafetera: { type: Boolean, default: false },
            utensilios_basicos: { type: Boolean, default: false }
        },
        seguridad: {
            botiquin: { type: Boolean, default: false },
            detector_humo: { type: Boolean, default: false },
            detector_monoxido: { type: Boolean, default: false },
            extintor: { type: Boolean, default: false },
            caja_fuerte: { type: Boolean, default: false }
        },
        estacionamiento: {
            estacionamiento_gratis: { type: Boolean, default: false },
            estacionamiento_paga: { type: Boolean, default: false },
            estacionamiento_cubierto: { type: Boolean, default: false }
        },
        entretenimiento: {
            televisor: { type: Boolean, default: false },
            streaming: { type: Boolean, default: false }, // Netflix, etc.
            parlantes: { type: Boolean, default: false },
            juegos_mesa: { type: Boolean, default: false }
        },
        accesibilidad: {
            rampa_acceso: { type: Boolean, default: false },
            ascensor: { type: Boolean, default: false },
            pasillos_anchos: { type: Boolean, default: false },
            banio_adaptado: { type: Boolean, default: false }
        }
    }
}, {
    timestamps: true // Esto agrega automáticamente createdAt y updatedAt
});

export default mongoose.model("Property", propertySchema);