import User from "../models/user.js"
import bcrypt from "bcryptjs";
import { supabase } from "../config/superbase.js";

export const getPerfil = async (req, res) => {
    const userId = req.user;

    try {
        const userFound = await User.findById(userId);

        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        return res.status(200).json({
            id: userFound._id,
            email: userFound.email,
            name: userFound.name,
            foto: userFound.foto,
            telefono: userFound.telefono,
            direccion: userFound.direccion,
            descripcion: userFound.descripcion,
            esUsuarioGoogle: !!userFound.googleId
        });

    } catch (error) {
        console.error("Error al obtener perfil:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

export const deleteCuenta = async (req, res) => {
    const userId = req.user;
    const { password } = req.body;

    console.log("User ID:", userId);
    console.log("Password recibida:", password ? "***" : "undefined");

    try {
        const userFound = await User.findById(userId);

        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        console.log("Tipo de usuario:", userFound.googleId ? "Google" : "Email/Password");

        // Función auxiliar para eliminar imagen de Supabase
        const deleteProfileImageFromStorage = async (foto) => {
            if (foto && foto.includes('supabase')) {
                try {
                    // Extraer el nombre del archivo de la URL
                    const urlParts = foto.split('/');
                    const fileName = urlParts[urlParts.length - 1];

                    const { error } = await supabase.storage
                        .from('profile-pictures')
                        .remove([fileName]);

                    if (error) {
                        console.error('Error al eliminar imagen de Supabase:', error);
                    } else {
                        console.log('✅ Imagen eliminada de Supabase:', fileName);
                    }
                } catch (err) {
                    console.error('Error al procesar eliminación de imagen:', err);
                }
            }
        };

        //  Usuario de Google (no tiene contraseña)
        if (userFound.googleId) {
            console.log("Eliminando cuenta de Google sin verificación de contraseña");

            // Eliminar imagen de Supabase si existe
            await deleteProfileImageFromStorage(userFound.foto);

            await User.findByIdAndDelete(userId);

            res.cookie("token", "", {
                expires: new Date(0),
                httpOnly: true
            });

            return res.status(200).json({ message: "Cuenta de Google eliminada exitosamente" });
        }

        //  Usuario normal con email/password
        if (!password) {
            return res.status(400).json({ message: "Se requiere la contraseña para eliminar la cuenta." });
        }

        if (!userFound.password) {
            return res.status(500).json({ message: "Error en los datos del usuario." });
        }

        // Verificar contraseña para usuarios normales
        const match = await bcrypt.compare(password, userFound.password);
        console.log("Coincidencia de contraseñas:", match);

        if (!match) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        // Eliminar imagen de Supabase si existe
        await deleteProfileImageFromStorage(userFound.foto);

        // Eliminar usuario
        await User.findByIdAndDelete(userId);

        // Limpiar cookie
        res.cookie("token", "", {
            expires: new Date(0),
            httpOnly: true
        });

        return res.status(200).json({ message: "Usuario eliminado exitosamente" });

    } catch (error) {
        console.error("Error completo al eliminar cuenta:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

export const updatePerfil = async (req, res) => {
    const userId = req.user;
    const { name, email, password, foto, telefono, direccion, descripcion } = req.body;

    try {
        const userFound = await User.findById(userId);

        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Para usuarios de Google no se puede cambiar el email ni la contraseña 
        if (userFound.googleId && (email || password)) {
            return res.status(400).json({ message: "No se puede cambiar el email ni la contraseña para usuarios de Google." });
        }

        // Actualizar campos
        if (name) userFound.name = name;
        if (email && !userFound.googleId) userFound.email = email;
        if (foto) userFound.foto = foto;
        if (telefono) userFound.telefono = telefono;
        if (direccion) userFound.direccion = direccion;
        if (descripcion) userFound.descripcion = descripcion;

        // Si se proporciona una nueva contraseña, encriptarla
        if (password && !userFound.googleId) {
            const hashedPassword = await bcrypt.hash(password, 10);
            userFound.password = hashedPassword;
        }

        await userFound.save();

        return res.status(200).json({
            message: "Perfil actualizado exitosamente",
            user: {
                id: userFound._id,
                email: userFound.email,
                name: userFound.name,
                foto: userFound.foto,
                telefono: userFound.telefono,
                direccion: userFound.direccion,
                descripcion: userFound.descripcion
            }
        });
    } catch (error) {
        console.error("Error completo al actualizar perfil:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}