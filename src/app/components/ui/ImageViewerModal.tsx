'use client';

import { EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { BaseModal } from '@/app/components/modals/ModalAdmin';
import { useState } from 'react';
import { jugadoresLegajosService } from '@/app/services/legajos/jugadores.service';
import { ImagenPublica } from '../common/ImagenPublica';
import { useImagenPrivada } from '@/app/hooks/useImagenPrivada';

interface ImageViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    imgPublica?: string | null;
    imgSelfie?: string | null;
    nombre?: string;
    id_jugador?: number; // ID del jugador para obtener selfie privada
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
    isOpen,
    onClose,
    imgPublica,
    imgSelfie,
    nombre = 'Usuario',
    id_jugador
}) => {
    const [isSelfieRevealed, setIsSelfieRevealed] = useState(false);

    // Cargar selfie privada usando el hook con cache optimizado (solo cuando se revele y tengamos id_jugador)
    const { blobUrl: selfiePrivadaUrl, isLoading: isLoadingSelfie } = useImagenPrivada({
        urlOrLoader: id_jugador 
            ? () => jugadoresLegajosService.obtenerSelfiePrivada(id_jugador)
            : null,
        enabled: isSelfieRevealed && !!id_jugador,
        deps: [id_jugador],
        useQueryCache: true, // ✅ Activar cache de React Query
        queryKey: id_jugador ? ['selfie-privada', id_jugador] : undefined, // ✅ Key específica
    });

    // Reset selfie visibility when modal closes
    const handleClose = () => {
        setIsSelfieRevealed(false);
        onClose();
    };

    // Toggle selfie visibility
    const handleRevealSelfie = () => {
        setIsSelfieRevealed(!isSelfieRevealed);
    };

    const hasImages = imgPublica || imgSelfie || selfiePrivadaUrl;
    const selfieToShow = selfiePrivadaUrl || imgSelfie;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title={`Imágenes de ${nombre}`}
            type="info"
            maxWidth="max-w-3xl"
        >
            {!hasImages ? (
                <div className="text-center py-12">
                    <p className="text-[var(--gray-100)]">No hay imágenes disponibles</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Imagen Pública */}
                    {imgPublica && (
                        <ImagenPublica src={imgPublica} alt={`Imagen pública de ${nombre}`} />
                    )}

                    {/* Imagen Selfie */}
                    {(selfieToShow || id_jugador) && (
                        <div className="space-y-3">
                            <h3 className="text-[var(--white)] font-medium text-sm flex items-center gap-2">
                                Foto de verificación
                                {!isSelfieRevealed && (
                                    <span className="text-xs text-[var(--gray-100)]">(privada - click para ver)</span>
                                )}
                            </h3>
                            <div
                                className="relative w-full mx-auto aspect-square bg-[var(--gray-300)] rounded-lg overflow-hidden cursor-pointer transition-all"
                                onClick={handleRevealSelfie}
                            >
                                {isLoadingSelfie ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <div className="flex flex-col items-center gap-2 text-[var(--white)]">
                                            <Loader2 className="w-8 h-8 animate-spin" />
                                            <span className="text-sm font-medium">Cargando...</span>
                                        </div>
                                    </div>
                                ) : selfieToShow ? (
                                    <>
                                        <Image
                                            src={selfieToShow}
                                            alt={`Selfie de verificación de ${nombre}`}
                                            fill
                                            className={`object-cover transition-all ${isSelfieRevealed
                                                    ? 'blur-0 opacity-100'
                                                    : 'blur-md opacity-50'
                                                }`}
                                            unoptimized={!!selfiePrivadaUrl}
                                        />
                                        {!isSelfieRevealed && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <div className="flex flex-col items-center gap-2 text-[var(--white)]">
                                                    <EyeOff className="w-8 h-8" />
                                                    <span className="text-sm font-medium">Click para ver</span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <div className="flex flex-col items-center gap-2 text-[var(--white)]">
                                            <EyeOff className="w-8 h-8" />
                                            <span className="text-sm font-medium">Click para cargar</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </BaseModal>
    );
};

