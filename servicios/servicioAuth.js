import User from "../models/user.js";
import jwt from "jsonwebtoken";

// Servicio que permite reutilizar la autenticación 
export const servicioAuth = async (datosUsuario) => {
    const { email, name, googleId, foto, password } = datosUsuario; 
    
    let user = await User.findOne({   
        $or: [
            { email },
            { googleId }
        ]
    });
    
    const isNewUser = !user;
    
    // No se encuentra el usuario
    if (!user) {
        user = new User({
            email,
            name: name || email.split('@')[0],
            googleId,
            foto,
            password: password 
        });
        await user.save();
    }
    // Vinculo cuenta de google ya existente
    else if (googleId && !user.googleId) {
        user.googleId = googleId;
        user.name = name || user.name;
        user.foto = foto || user.foto;
        await user.save();
    }
    
    return { user, isNewUser };
}

export const generateToken = (user) => {
    // Mismo token para todos tipos vinculación (google, email, etc)
    return jwt.sign(
        { id: user._id, email: user.email },  // 
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
}

export const setAuthCookie = (res, token) => {
    // Misma cookie para email Y Google
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
            id: user._id,  // 
            email: user.email,
            foto: user.foto,
            name: user.name
        }
    });
};