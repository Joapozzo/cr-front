'use client';

import { ArrowLeft, Users, Calendar, Trophy, Eye } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { ImageViewerModal } from '@/app/components/ui/ImageViewerModal';
import Image from 'next/image';
import { JugadorInformacionBasica } from '@/app/types/legajos';
import { useState } from 'react';

interface JugadorHeaderProps {
    jugadorInfo: JugadorInformacionBasica;
    onBack: () => void;
}

export const JugadorHeader = ({ jugadorInfo, onBack }: JugadorHeaderProps) => {
    const nombreCompleto = `${jugadorInfo.usuario.nombre} ${jugadorInfo.usuario.apellido}`;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const hasImages = jugadorInfo.usuario.img || jugadorInfo.usuario.foto_selfie_url;

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onBack}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </Button>
                </div>

                <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                    <div className="flex items-start gap-6">
                        <div className="flex items-start gap-3">
                            {jugadorInfo.usuario.foto_selfie_url ? (
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-[var(--gray-300)] flex-shrink-0 border-2 border-[var(--green)]">
                                    <Image
                                        src={jugadorInfo.usuario.foto_selfie_url}
                                        alt={`${nombreCompleto} - Selfie`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : jugadorInfo.usuario.img ? (
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-[var(--gray-300)] flex-shrink-0">
                                    <Image
                                        src={jugadorInfo.usuario.img}
                                        alt={nombreCompleto}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-lg bg-[var(--gray-300)] flex items-center justify-center flex-shrink-0">
                                    <Users className="w-12 h-12 text-[var(--gray-100)]" />
                                </div>
                            )}
                            {hasImages && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsModalOpen(true)}
                                    className="p-2 mt-2"
                                    title="Ver ambas imágenes"
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-[var(--white)] mb-2">{nombreCompleto}</h1>
                            {jugadorInfo.posicion && (
                                <p className="text-[var(--gray-100)] mb-2">
                                    {jugadorInfo.posicion.nombre} ({jugadorInfo.posicion.codigo})
                                </p>
                            )}
                            {jugadorInfo.usuario.edad && (
                                <p className="text-[var(--gray-100)] mb-4">
                                    {jugadorInfo.usuario.edad} años
                                </p>
                            )}
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-[var(--gray-100)]" />
                                    <span className="text-[var(--white)] font-semibold">
                                        {jugadorInfo.resumen.total_equipos} equipos
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-[var(--gray-100)]" />
                                    <span className="text-[var(--white)] font-semibold">
                                        {jugadorInfo.resumen.categorias_jugadas} categorías
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-[var(--gray-100)]" />
                                    <span className="text-[var(--white)] font-semibold">
                                        {jugadorInfo.resumen.partidos_totales} partidos
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ImageViewerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imgPublica={jugadorInfo.usuario.img}
                imgSelfie={jugadorInfo.usuario.foto_selfie_url}
                nombre={nombreCompleto}
            />
        </>
    );
};

