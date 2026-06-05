import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { setAuthResponse } from "../servicios/servicioAuth.js";

export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ msg: "El usuario ya existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            name: email.split('@')[0]
        });
        
        const user = await newUser.save();
        return setAuthResponse(res, user, true);
    } catch (error) {
        console.error("Error en registro:", error);
        return res.status(500).json({ msg: "Error en el servidor: " + error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        if (user.googleId || !user.password) {
            return res.status(401).json({
                msg: "Esta cuenta debe iniciar sesión con Google o no tiene contraseña local.",
                provider: user.googleId ? 'google' : 'unknown'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Contraseña incorrecta" });
        }

        return setAuthResponse(res, user, false);
    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ msg: "Error en el servidor: " + error.message });
    }
};

export const logout = (req, res) => {
    res.cookie('token', "", {
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    return res.sendStatus(200);
};
