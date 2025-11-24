import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { setAuthResponse } from "../servicios/servicioAuth.js"; 

export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existe = await User.findOne({ email });
        if (existe) {
            return res.status(400).json({ msg: "El usuario ya existe" });
        }

        //  Encriptar password
        const hashedPassword = await bcrypt.hash(password, 10);

        //  Crear y guardar el usuario 
        const newUser = new User({
            email,
            password: hashedPassword, 
            name: email.split('@')[0]
        });
        const user = await newUser.save();

        //  Establecer cookie y respuesta
        return setAuthResponse(res, user, true); // true indica que es un nuevo usuario

    } catch (error) {
        console.error("Error en registro:", error);
        return res.status(500).json({ msg: "Error en el servidor: " + error.message });
    }
};