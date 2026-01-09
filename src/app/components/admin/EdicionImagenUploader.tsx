'use client';

import Image from 'next/image';
import { AlertTriangle, X } from 'lucide-react';
import { useEdicionImagen } from '@/app/hooks/useEdicionImagen';

interface EdicionImagenUploaderProps {
    imagenActual: string | null;
    imagenPreview: string | null;
    imagenFile: File | null;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    onRemoveImage: () => void;
    disabled?: boolean;
    MAX_FILE_SIZE_MB: number;
}

export const EdicionImagenUploader = ({
    imagenActual,
    imagenPreview,
    imagenFile,
    fileInputRef,
    onImageChange,
    onRemoveImage,
    disabled = false,
    MAX_FILE_SIZE_MB,
}: EdicionImagenUploaderProps) => {
    return (
        <div className="md:col-span-2 flex flex-col gap-4">
            <label className="text-sm font-medium text-[var(--white)] mb-1">
                IMAGEN DE LA EDICIÓN
            </label>

            {/* Información sobre formato de imagen */}
            <div className="p-4 bg-[var(--blue)]/10 border border-[var(--blue)]/30 rounded-lg">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[var(--blue)] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="text-sm font-medium text-[var(--blue)] mb-1">
                            Requisitos de la imagen
                        </h4>
                        <ul className="text-xs text-[var(--gray-100)] space-y-1">
                            <li>• Formato: <strong>PNG</strong> únicamente</li>
                            <li>• Tamaño máximo: <strong>{MAX_FILE_SIZE_MB}MB</strong></li>
                            <li>• Dimensiones recomendadas: 1920x1080px</li>
                            <li>• <strong>Debe ser sin fondo (transparente)</strong></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Preview de la imagen */}
            <div className="flex items-start gap-4">
                <div className="relative w-32 h-32 rounded-lg">
                    {(imagenPreview || imagenActual) ? (
                        <Image
                            src={imagenPreview || imagenActual || '/logo-edicion.png'}
                            alt="Preview de edición"
                            fill
                            className="object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.srcset = "/logo-edicion.png";
                                target.src = "/logo-edicion.png";
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[var(--gray-300)]">
                            <span className="text-[var(--gray-100)] text-xs text-center px-2">Sin imagen</span>
                        </div>
                    )}
                    {imagenPreview && (
                        <button
                            type="button"
                            onClick={onRemoveImage}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--red)] rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                            disabled={disabled}
                        >
                            <X className="w-3 h-3 text-white" />
                        </button>
                    )}
                </div>

                {/* Input de archivo */}
                <div className="flex flex-col gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png"
                        onChange={onImageChange}
                        className="hidden"
                        id="imagen-upload"
                        disabled={disabled}
                    />
                    <label
                        htmlFor="imagen-upload"
                        className={`cursor-pointer bg-[var(--gray-200)] hover:bg-[var(--gray-100)] text-[var(--black)] px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {imagenFile ? 'Cambiar imagen' : 'Seleccionar imagen PNG'}
                    </label>
                    {imagenFile && (
                        <p className="text-xs text-[var(--gray-100)]">
                            Archivo: {imagenFile.name} ({(imagenFile.size / 1024 / 1024).toFixed(2)}MB)
                        </p>
                    )}
                    <p className="text-xs text-[var(--gray-100)]">PNG únicamente, máx. {MAX_FILE_SIZE_MB}MB</p>
                </div>
            </div>
        </div>
    );
};

