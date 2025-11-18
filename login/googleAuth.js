import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import { servicioAuth, setAuthResponse } from "../servicios/servicioAuth.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
    const { token } = req.body;

    try {
        // Verificar token de Google
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const datos = ticket.getPayload();
        const { email, name, sub: googleId, foto } = datos;

        if (!email) {
            return res.status(400).json({ msg: "No se pudo obtener el email de Google" });
        }

        // Generar password temporal para Google users
        const tempPassword = await bcrypt.hash(googleId + Date.now(), 12);

        //LLamo el servicioAuth
        const { user, isNewUser } = await servicioAuth({
            email,
            googleId,
            name,
            picture,
            password: tempPassword
        });

        // Usar servicio para respuesta 
        return setAuthResponse(res, user, isNewUser);

    } catch (error) {
        console.error("Error en autenticación Google:", error);
        return res.status(401).json({ msg: "Token de Google inválido" });
    }
};