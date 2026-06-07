import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const adminRequired = async (req, res, next) => {
    let token = req.cookies.token;
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.slice(7, authHeader.length);
        }
    }
    if (!token) {
        return res.status(403).json({ msg: "Acceso denegado. Token no encontrado." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check rol from JWT first (fast path)
        if (decoded.rol === "admin") {
            req.user = decoded.id || decoded.userId;
            return next();
        }
        // Fallback: look up user in DB (for old tokens without rol)
        const user = await User.findById(decoded.id || decoded.userId);
        if (!user) {
            return res.status(403).json({ msg: "Usuario no encontrado." });
        }
        if (user.rol !== "admin") {
            return res.status(403).json({ msg: "Acceso denegado. Se requiere rol de administrador." });
        }
        req.user = user._id;
        next();
    } catch (error) {
        return res.status(403).json({ msg: "Token inválido o expirado." });
    }
};
