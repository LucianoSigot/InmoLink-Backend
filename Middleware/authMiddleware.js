import jwt from "jsonwebtoken";

export const authRequired = (req, res, next) => {
    // 1. Intentar obtener de cookie (con cookieParser)
    let token = req.cookies?.token; 
    
    // 2. Si no está en cookie, intentar en cabecera Authorization
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.slice(7);
        }
    }

    if (!token) {
        return res.status(401).json({ msg: "Acceso denegado. Token no encontrado." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id || decoded.userId;
        req.userRole = decoded.rol || null;
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Token inválido o expirado." });
    }
};
