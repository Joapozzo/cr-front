'use client';

import { ArrowLeft, Users, Calendar, Trophy, Eye, Ban, LogOut } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { ImageViewerModal } from '@/app/components/ui/ImageViewerModal';
import { ImagenPublica } from '@/app/components/common/ImagenPublica';
import { JugadorInformacionBasica } from '@/app/types/legajos';
import { useState } from 'react';
import { useAuth } from '@/app/hooks/auth/useAuth';
import { ModalExpulsarJugador } from '@/app/components/modals/ModalExpulsarJugador';
import { equiposService } from '@/app/services/equipos.services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

interface JugadorHeaderProps {
    jugadorInfo: JugadorInformacionBasica;
    onBack: () => void;
}

export const JugadorHeader = ({ jugadorInfo, onBack }: JugadorHeaderProps) => {
    const nombreCompleto = `${jugadorInfo.usuario.nombre} ${jugadorInfo.usuario.apellido}`;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExpulsarModalOpen, setIsExpulsarModalOpen] = useState(false);
    const hasImages = jugadorInfo.usuario.img || jugadorInfo.usuario.foto_selfie_url;
    const { hasRole } = useAuth();
    const queryClient = useQueryClient();
    const esAdmin = hasRole('ADMIN');

    // Mutación para expulsar jugador del torneo
    const expulsarMutation = useMutation({
        mutationFn: async ({ motivo }: { motivo?: string }) => {
            return await equiposService.expulsarJugadorTorneo(jugadorInfo.id_jugador, motivo);
        },
        onSuccess: () => {
            toast.success('Jugador expulsado exitosamente');
            queryClient.invalidateQueries({ queryKey: ['legajos-jugadores'] });
            queryClient.invalidateQueries({ queryKey: ['jugador', jugadorInfo.id_jugador] });
            setIsExpulsarModalOpen(false);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al expulsar al jugador');
        }
    });

    // Mutación para reactivar jugador
    const reactivarMutation = useMutation({
        mutationFn: async () => {
            return await equiposService.reactivarJugadorTorneo(jugadorInfo.id_jugador);
        },
        onSuccess: () => {
            toast.success('Jugador reactivado exitosamente');
            queryClient.invalidateQueries({ queryKey: ['legajos-jugadores'] });
            queryClient.invalidateQueries({ queryKey: ['jugador', jugadorInfo.id_jugador] });
            setIsExpulsarModalOpen(false);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al reactivar al jugador');
        }
    });

    // Obtener estado del jugador
    const estadoJugador = jugadorInfo.estado || 'A';
    const estaExpulsado = estadoJugador === 'E';

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
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex items-start gap-6 flex-1">
                            <div className="relative flex-shrink-0 overflow-visible">
                                {jugadorInfo.usuario.foto_selfie_url ? (
                                    <>
                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-[var(--gray-300)] border-2 border-[var(--color-primary)]">
                                            <ImagenPublica
                                                src={jugadorInfo.usuario.foto_selfie_url}
                                                alt={`${nombreCompleto} - Selfie`}
                                                width={96}
                                                height={96}
                                                className="w-24 h-24 object-cover"
                                                fallbackIcon={<Users className="w-12 h-12 text-[var(--gray-100)]" />}
                                            />
                                        </div>
                                        {hasImages && (
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="absolute top-0 right-0 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center backdrop-blur-sm transition-all z-10 -translate-y-1 translate-x-1"
                                                title="Ver ambas imágenes"
                                            >
                                                <Eye className="w-4 h-4 text-white" />
                                            </button>
                                        )}
                                    </>
                                ) : jugadorInfo.usuario.img ? (
                                    <>
                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-[var(--gray-300)]">
                                            <ImagenPublica
                                                src={jugadorInfo.usuario.img}
                                                alt={nombreCompleto}
                                                width={96}
                                                height={96}
                                                className="w-24 h-24 object-cover"
                                                fallbackIcon={<Users className="w-12 h-12 text-[var(--gray-100)]" />}
                                            />
                                        </div>
                                        {hasImages && (
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="absolute top-0 right-0 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center backdrop-blur-sm transition-all z-10 -translate-y-1 translate-x-1"
                                                title="Ver ambas imágenes"
                                            >
                                                <Eye className="w-4 h-4 text-white" />
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-24 h-24 rounded-lg bg-[var(--gray-300)] flex items-center justify-center">
                                        <Users className="w-12 h-12 text-[var(--gray-100)]" />
                                    </div>
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
                                    <p className="text-[var(--gray-100)] mb-2">
                                        {jugadorInfo.usuario.edad} años
                                    </p>
                                )}
                                {estaExpulsado && (
                                    <div className="mb-4">
                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold bg-[var(--color-danger)] text-[var(--white)]">
                                            <Ban className="w-4 h-4" />
                                            Jugador Expulsado
                                        </span>
                                    </div>
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

                        {/* Botón de expulsar/reactivar (solo para admin) */}
                        {esAdmin && (
                            <div className="flex-shrink-0">
                                <Button
                                    variant={estaExpulsado ? 'success' : 'danger'}
                                    onClick={() => setIsExpulsarModalOpen(true)}
                                    className="flex items-center gap-2"
                                >
                                    {estaExpulsado ? (
                                        <>
                                            <LogOut className="w-4 h-4" />
                                            Reactivar jugador
                                        </>
                                    ) : (
                                        <>
                                            <Ban className="w-4 h-4" />
                                            Expulsar jugador
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ImageViewerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imgPublica={jugadorInfo.usuario.img}
                imgSelfie={jugadorInfo.usuario.foto_selfie_url}
                nombre={nombreCompleto}
                id_jugador={jugadorInfo.id_jugador}
            />

            {/* Modal para expulsar/reactivar jugador */}
            {esAdmin && (
                <ModalExpulsarJugador
                    isOpen={isExpulsarModalOpen}
                    onClose={() => setIsExpulsarModalOpen(false)}
                    onConfirm={async (motivo) => {
                        if (estaExpulsado) {
                            await reactivarMutation.mutateAsync();
                        } else {
                            await expulsarMutation.mutateAsync({ motivo });
                        }
                    }}
                    jugadorNombre={nombreCompleto}
                    isLoading={expulsarMutation.isPending || reactivarMutation.isPending}
                    esExpulsado={estaExpulsado}
                />
            )}
        </>
    );
};

