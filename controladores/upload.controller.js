import { supabase } from '../config/superbase.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se proporcionó ninguna imagen' });
        }

        const userId = req.user; // Del middleware authRequired
        const file = req.file;

        // Generar nombre único para el archivo
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${userId}-${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Subir a Supabase Storage (bucket 'profile-pictures')
        const { data, error } = await supabase.storage
            .from('profile-pictures')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) {
            console.error('Error al subir a Supabase:', error);
            return res.status(500).json({ message: 'Error al subir la imagen', error: error.message });
        }

        // Obtener URL pública
        const { data: publicUrlData } = supabase.storage
            .from('profile-pictures')
            .getPublicUrl(filePath);

        return res.status(200).json({
            message: 'Imagen subida exitosamente',
            url: publicUrlData.publicUrl,
            path: filePath
        });

    } catch (error) {
        console.error('Error en uploadProfileImage:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const deleteProfileImage = async (req, res) => {
    try {
        const { filePath } = req.body;

        if (!filePath) {
            return res.status(400).json({ message: 'No se proporcionó la ruta del archivo' });
        }

        const { error } = await supabase.storage
            .from('profile-pictures')
            .remove([filePath]);

        if (error) {
            console.error('Error al eliminar de Supabase:', error);
            return res.status(500).json({ message: 'Error al eliminar la imagen' });
        }

        return res.status(200).json({ message: 'Imagen eliminada exitosamente' });

    } catch (error) {
        console.error('Error en deleteProfileImage:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
