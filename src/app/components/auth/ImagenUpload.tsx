// src/components/auth/ImageUpload.tsx
import { useState, useRef } from 'react';
import { MdCloudUpload, MdCheckCircle } from 'react-icons/md';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
    label: string;
    onImageSelect: (file: File) => void;
    isUploading?: boolean;
    progress?: number;
    imageUrl?: string;
    error?: string;
}

export const ImageUpload = ({
    label,
    onImageSelect,
    isUploading,
    progress,
    imageUrl,
    error,
}: ImageUploadProps) => {
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona una imagen');
            return;
        }

        // Validar tamaño (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen no puede superar los 5MB');
            return;
        }

        // Crear preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Enviar archivo al padre
        onImageSelect(file);
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--gray-200)]">
                {label}
            </label>

            <div
                onClick={() => inputRef.current?.click()}
                className={`
          relative w-full h-40 rounded-lg border-2 border-dashed 
          ${error ? 'border-[var(--color-danger)]' : 'border-[var(--gray-300)]'}
          ${imageUrl ? 'border-[var(--color-primary)]' : ''}
          bg-[var(--gray-400)] cursor-pointer
          hover:bg-[var(--gray-300)] transition-all
          flex flex-col items-center justify-center gap-2
        `}
            >
                {isUploading ? (
                    <>
                        <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
                        <p className="text-xs text-[var(--gray-200)]">
                            Subiendo... {progress}%
                        </p>
                    </>
                ) : imageUrl ? (
                    <>
                        <MdCheckCircle className="w-8 h-8 text-[var(--color-primary)]" />
                        <p className="text-xs text-[var(--color-primary)]">Imagen subida</p>
                    </>
                ) : preview ? (
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                    />
                ) : (
                    <>
                        <MdCloudUpload className="w-8 h-8 text-[var(--gray-200)]" />
                        <p className="text-xs text-[var(--gray-200)]">
                            Click para subir imagen
                        </p>
                        <p className="text-xs text-[var(--gray-300)]">
                            JPG, PNG (Max 5MB)
                        </p>
                    </>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {error && (
                <span className="text-xs text-[var(--color-danger)] ml-2">{error}</span>
            )}
        </div>
    );
};