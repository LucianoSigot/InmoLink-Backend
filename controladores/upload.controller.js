import { supabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se proporcionó imagen' });
        }

        const file = req.file;
        const ext = file.originalname.split('.').pop();
        const fileName = `${req.user}-${uuidv4()}.${ext}`;

        const { error } = await supabase.storage
            .from('profile-pictures')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) throw error;

        const { data } = supabase.storage
            .from('profile-pictures')
            .getPublicUrl(fileName);

        return res.status(200).json({
            message: 'Imagen subida',
            url: data.publicUrl,
            path: fileName
        });
    } catch (error) {
        console.error('Error uploadProfileImage:', error);
        return res.status(500).json({ message: 'Error al subir imagen' });
    }
};

export const uploadPropertyImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se proporcionó imagen' });
        }

        const file = req.file;
        const ext = file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${uuidv4()}.${ext}`;

        const { error } = await supabase.storage
            .from('propiedades')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) throw error;

        const { data } = supabase.storage
            .from('propiedades')
            .getPublicUrl(fileName);

        return res.status(200).json({
            message: 'Imagen de propiedad subida',
            url: data.publicUrl,
            path: fileName
        });
    } catch (error) {
        console.error('Error uploadPropertyImage:', error);
        return res.status(500).json({ message: 'Error al subir imagen' });
    }
};

export const deleteProfileImage = async (req, res) => {
    try {
        const { filePath } = req.body;
        if (!filePath) return res.status(400).json({ message: 'Ruta no proporcionada' });

        const { error } = await supabase.storage
            .from('profile-pictures')
            .remove([filePath]);

        if (error) throw error;

        return res.status(200).json({ message: 'Imagen eliminada' });
    } catch (error) {
        console.error('Error deleteProfileImage:', error);
        return res.status(500).json({ message: 'Error al eliminar imagen' });
    }
};
