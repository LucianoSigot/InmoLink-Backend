import User from "../models/user.js"
import bcrypt from "bcryptjs";
import { supabase } from "../config/supabase.js";

export const getPerfil = async (req, res) => {
    try {
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        return res.status(200).json({
            id: user._id,
            email: user.email,
            name: user.name,
            rol: user.rol,
            foto: user.foto,
            telefono: user.telefono,
            direccion: user.direccion,
            descripcion: user.descripcion,
            esUsuarioGoogle: !!user.googleId
        });
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

const deleteImageFromStorage = async (foto) => {
    if (foto && foto.includes('supabase')) {
        try {
            const urlParts = foto.split('/');
            const fileName = urlParts[urlParts.length - 1];

            await supabase.storage
                .from('profile-pictures')
                .remove([fileName]);
        } catch (err) {
            console.error('Error al eliminar imagen:', err);
        }
    }
};

export const deleteCuenta = async (req, res) => {
    const { password } = req.body;
    const userId = req.user;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        if (user.googleId) {
            await deleteImageFromStorage(user.foto);
            await User.findByIdAndDelete(userId);

            res.cookie("token", "", { expires: new Date(0), httpOnly: true });
            return res.status(200).json({ message: "Cuenta de Google eliminada" });
        }

        if (!password) {
            return res.status(400).json({ message: "Se requiere la contraseña." });
        }

        const isMatch = await bcrypt.compare(password, user.password || "");
        if (!isMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        await deleteImageFromStorage(user.foto);
        await User.findByIdAndDelete(userId);

        res.cookie("token", "", { expires: new Date(0), httpOnly: true });
        return res.status(200).json({ message: "Usuario eliminado exitosamente" });

    } catch (error) {
        console.error("Error al eliminar cuenta:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

export const updatePerfil = async (req, res) => {
    const userId = req.user;
    const { name, email, password, foto, telefono, direccion, descripcion } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        if (user.googleId && (email || password)) {
            return res.status(400).json({ message: "No se puede modificar email o contraseña en cuentas de Google." });
        }

        if (name) user.name = name;
        if (email && !user.googleId) user.email = email;
        if (foto) user.foto = foto;
        if (telefono) user.telefono = telefono;
        if (direccion) user.direccion = direccion;
        if (descripcion) user.descripcion = descripcion;

        if (password && !user.googleId) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        return res.status(200).json({
            message: "Perfil actualizado exitosamente",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                foto: user.foto,
                telefono: user.telefono,
                direccion: user.direccion,
                descripcion: user.descripcion
            }
        });
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
