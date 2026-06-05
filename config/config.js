import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        console.log("Intentando conectar a MongoDB...");
        await mongoose.connect(process.env.MONGO_URI); 
        console.log("Conexion exitosa a mongoDB");
    } catch (error) {
        console.error("Error de conexion a MongoDB:", error.message);
        console.log("El servidor continuará ejecutándose sin base de datos activa.");
        // No llamamos a process.exit(1) para que el servidor no se caiga
    }
};