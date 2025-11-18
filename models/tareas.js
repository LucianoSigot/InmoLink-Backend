import mongoose from "mongoose";

const tareasSchema = new mongoose.Schema({
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    completada: { type: Boolean, default: false },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tareaId: {type: String, required: true, unique: true},
}, { timestamps: true });

export default mongoose.model("Tarea", tareasSchema);