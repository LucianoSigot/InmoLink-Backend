import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { setAuthResponse } from "../servicios/servicioAuth.js";

export const login = async (req, res) => {
    const { email, password} = req.body;

    try {
        // de que Mongoose incluya el campo password, incluso si está excluido en el esquema.
        const usuario = await User.findOne({ email }).select('+password');

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        // Si tiene googleId O si el campo password está ausente/nulo/undefined.
        if (usuario.googleId || !usuario.password) {
             // Si el usuario existe pero no tiene contraseña local, debe usar el proveedor externo.
            return res.status(401).json({ 
                msg: "Esta cuenta debe iniciar sesión con Google o no tiene contraseña local.",
                provider: usuario.googleId ? 'google' : 'unknown'
            });
        }
        
        const contraseñaValida = await bcrypt.compare(password, usuario.password);
        if (!contraseñaValida) {
            return res.status(401).json({ msg: "Contraseña incorrecta" });
        }

        return setAuthResponse(res, usuario, false);
        
    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ msg: "Error en el servidor: " + error.message });
    }
};