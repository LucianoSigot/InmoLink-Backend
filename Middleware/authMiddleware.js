// Middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const authRequired = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ msg: "Acceso denegado. Token no encontrado." });
    }
    try {
        // Verifica y decodifica el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Adjunta el ID del usuario a la solicitud
        req.user = decoded.id || decoded.userId; 
        // Pasa al siguiente manejador de ruta  
        next();
    } catch (error) {
        // En caso de fallo de verificación (expirado o inválido)
        return res.status(401).json({ msg: "Token inválido o expirado." });
    }
};