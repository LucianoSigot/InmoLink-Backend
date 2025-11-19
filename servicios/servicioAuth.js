import User from "../models/user.js";
import jwt from "jsonwebtoken";

// Servicio que crea o valida un usuario con email/password
export const servicioAuth = async ({ email, password }) => {
    let user = await User.findOne({ email });
    
    const isNewUser = !user;
    
    // Si el usuario no existe, crear uno nuevo
    if (!user) {
        user = new User({
            email,
            password,
            name: email.split('@')[0]
        });
        await user.save();
    }
    
    return { user, isNewUser };
}

export const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
}

export const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600000
    });
};

export const setAuthResponse = (res, user, isNewUser = false) => {
    const token = generateToken(user);
    setAuthCookie(res, token);

    return res.json({
        msg: isNewUser ? 'Usuario registrado correctamente' : 'Login exitoso',
        token,
        user: {
            id: user._id,
            email: user.email,
            name: user.name
        }
    });
};