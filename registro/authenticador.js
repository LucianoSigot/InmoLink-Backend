import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { servicioAuth,setAuthResponse } from "../servicios/servicioAuth.js";

export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existe = await User.findOne({ email });
        if (existe) {
            return res.status(400).json({ msg: "El usuario ya existe" });
        }

        // Encriptar password
        const hashedPassword = await bcrypt.hash(password, 10);

        const {user, isNewUser} = await servicioAuth({
            email,
            password: hashedPassword
        });

        // Crear usuario
        const nuevoUsuario = new User({email,password: hashedPassword });

        await nuevoUsuario.save();
        
        return setAuthResponse(res, user, isNewUser);

    } catch (error) {
        console.error("Error en registro:", error);
        return res.status(500).json({ msg: "Error en el servidor: " + error.message });
    }
};



