'use client';

import { X } from 'lucide-react';
import { Button } from './Button';

interface ImageViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    imgPublica?: string | null;
    imgSelfie?: string | null;
    nombre?: string;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
    isOpen,
    onClose,
    imgPublica,
    imgSelfie,
    nombre = 'Usuario'
}) => {
    if (!isOpen) return null;

    const hasImages = imgPublica || imgSelfie;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/70 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[var(--gray-400)] rounded-xl border-2 border-[var(--gray-300)] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto transform transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--gray-300)] sticky top-0 bg-[var(--gray-400)] z-10">
                    <h2 className="text-xl font-semibold text-[var(--white)]">
                        Imágenes de {nombre}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--gray-300)] rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-[var(--gray-100)]" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!hasImages ? (
                        <div className="text-center py-12">
                            <p className="text-[var(--gray-100)]">No hay imágenes disponibles</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Imagen Pública */}
                            {imgPublica && (
                                <div className="space-y-3">
                                    <h3 className="text-[var(--white)] font-medium text-sm">
                                        Imagen Pública
                                    </h3>
                                    <div className="relative w-full aspect-square bg-[var(--gray-300)] rounded-lg overflow-hidden">
                                        <img
                                            src={imgPublica}
                                            alt={`Imagen pública de ${nombre}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Imagen Selfie */}
                            {imgSelfie && (
                                <div className="space-y-3">
                                    <h3 className="text-[var(--white)] font-medium text-sm">
                                        Foto de Verificación (Selfie)
                                    </h3>
                                    <div className="relative w-full aspect-square bg-[var(--gray-300)] rounded-lg overflow-hidden">
                                        <img
                                            src={imgSelfie}
                                            alt={`Selfie de verificación de ${nombre}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-[var(--gray-300)] sticky bottom-0 bg-[var(--gray-400)]">
                    <Button onClick={onClose} variant="default">
                        Cerrar
                    </Button>
                </div>
            </div>
        </div>
    );
};

