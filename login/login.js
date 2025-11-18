import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

        const token = jwt.sign(
            { id: usuario._id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // setear cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,        // poné false si estás en localhost
            sameSite: "lax",
            maxAge: 3600000
        });
        

        // enviar respuesta JSON al frontend
        return res.json({ msg: "Login exitoso", token });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ msg: "Error en el servidor: " + error.message });
    }
};
