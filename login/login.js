import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { setAuthResponse } from "../servicios/servicioAuth.js"; ;
export const login = async (req, res) => {
    const { email, password} = req.body;

    try {
        const usuario = await User.findOne({ email });

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
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
