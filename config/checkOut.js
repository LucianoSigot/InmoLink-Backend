import jwt from "jsonwebtoken";
import User from "../models/user.js"; // Asegúrate de importar el modelo User

// Función que se encarga de verificar el token en la cookie
export const checkOut = async (req, res) => {
    const token = req.cookies.token;
    
    // Si no tiene token es porque no se logeo, entonces le envio una respuesta de no autorizado
    if(!token){
        return res.status(401).json({auth: false, message: "No esta autorizado"});
    }
    // Si tiene token, verifico que sea valido
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Buscar el usuario en la base de datos para obtener más información
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({auth: false, message: "Usuario no encontrado"});
        }
        // Si el token es valido, envio una respuesta de autorizado 201 con información del usuario
        return res.status(200).json({
            auth: true, 
            message: "Usuario autorizado",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                esUsuarioGoogle: !!user.googleId 
            }
        });
    } catch (error) {
        // Si el token no es valido, envio una respuesta de no autorizado 401
        return res.status(401).json({auth: false, message: "Token no valido"});
    }
}