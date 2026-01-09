import { useState, useRef, useCallback } from 'react';
import { convertirABase64 } from '../services/upload.service';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface UseEdicionImagenReturn {
    imagenFile: File | null;
    imagenPreview: string | null;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleRemoveImage: () => void;
    clearImage: () => void;
    MAX_FILE_SIZE_MB: number;
}

export const useEdicionImagen = (
    onImageChange?: (hasImage: boolean) => void
): UseEdicionImagenReturn => {
    const [imagenFile, setImagenFile] = useState<File | null>(null);
    const [imagenPreview, setImagenPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Validar tipo de archivo (solo PNG)
            if (file.type !== 'image/png') {
                toast.error('Solo se permiten archivos PNG');
                setImagenFile(null);
                setImagenPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }

            // Validar tamaño (máximo 5MB antes de comprimir)
            if (file.size > MAX_FILE_SIZE_BYTES) {
                toast.error(`El archivo es demasiado grande. Máximo ${MAX_FILE_SIZE_MB}MB`);
                setImagenFile(null);
                setImagenPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }

            setImagenFile(file);

            try {
                // Convertir a Base64 para preview y envío
                const base64 = await convertirABase64(file);
                setImagenPreview(base64);
                onImageChange?.(true);
            } catch (error) {
                console.error('Error al procesar imagen:', error);
                toast.error('Error al procesar la imagen');
                setImagenFile(null);
                setImagenPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        },
        [onImageChange]
    );

    const handleRemoveImage = useCallback(() => {
        setImagenFile(null);
        setImagenPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onImageChange?.(false);
    }, [onImageChange]);

    const clearImage = useCallback(() => {
        setImagenFile(null);
        setImagenPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    return {
        imagenFile,
        imagenPreview,
        fileInputRef,
        handleImageChange,
        handleRemoveImage,
        clearImage,
        MAX_FILE_SIZE_MB,
    };
};

