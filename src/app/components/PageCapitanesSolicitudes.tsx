'use client';

import { useState, useMemo } from 'react';
import { Crown, User as UserIcon } from 'lucide-react';
import SolicitudesCapitan from '@/app/components/CaptainRequest';
import InvitacionesCapitan from '@/app/components/CaptainInvitaciones';
import HistorialEquipoChat from '@/app/components/HistorialEquipoChat';
import InvitacionesJugador from '@/app/components/Invitations';
import SolicitudesJugador from '@/app/components/Request';
import HistorialChat from '@/app/components/HistorialChat';
import { ObtenerEquiposActualesDelJugadorResponse } from '../types/jugador';
import { usePlayerStore } from '../stores/playerStore';
import { useEdicionesActuales } from '../hooks/useEdiciones';
import { useJugadorUsuario } from '../hooks/useJugadorUsuario';

interface SolicitudesCapitanPageProps {
    equipoSeleccionado: ObtenerEquiposActualesDelJugadorResponse | null;
    esCapitan: boolean;
}

type TabType = 'capitan' | 'jugador';

export default function SolicitudesCapitanPage({  equipoSeleccionado, esCapitan }: SolicitudesCapitanPageProps) {
    const [activeTab, setActiveTab] = useState<TabType>('capitan');
    const { jugador, equipos } = usePlayerStore();
    const { data: edicionesActuales, isLoading: isLoadingEdiciones } = useEdicionesActuales();
    const { isLoading: isLoadingJugador } = useJugadorUsuario();

    const id_categoria_edicion = equipoSeleccionado?.id_categoria_edicion;
    const id_equipo = equipoSeleccionado?.id_equipo;

    // Obtener id_edicion para la vista de jugador
    const id_edicion = useMemo(() => {
        if (equipos && equipos.length > 0) {
            const equiposOrdenados = [...equipos].sort((a, b) => b.temporada - a.temporada);
            return equiposOrdenados[0].id_edicion;
        }
        if (edicionesActuales && edicionesActuales.length > 0) {
            const edicionesOrdenadas = [...edicionesActuales].sort((a, b) => b.temporada - a.temporada);
            return edicionesOrdenadas[0].id_edicion;
        }
        return null;
    }, [equipos, edicionesActuales]);

    if (!esCapitan) {
        return (
            <div className="px-6 py-8">
                <div className="bg-[var(--card-background)] rounded-2xl border border-[var(--gray-300)] p-6">
                    <div className="text-center py-8">
                        <Crown className="w-12 h-12 text-[var(--gray-100)] mx-auto mb-3" />
                        <h3 className="text-[var(--white)] font-semibold text-lg mb-2">
                            No eres capitán de equipo
                        </h3>
                        <p className="text-[var(--gray-100)] text-sm">
                            Necesitas ser capitán para acceder a esta sección
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Mostrar loading mientras se obtiene/crea el jugador
    if (isLoadingJugador) {
        return (
            <div className="space-y-6 px-3 sm:px-4 md:px-6">
                <div className="text-center py-8">
                    <p className="text-[var(--gray-100)] text-sm">
                        Cargando información del jugador...
                    </p>
                </div>
            </div>
        );
    }

    // Si después de cargar no hay jugador, mostrar mensaje
    if (!jugador?.id_jugador) {
        return (
            <div className="space-y-6 px-3 sm:px-4 md:px-6">
                <div className="text-center py-8">
                    <p className="text-[var(--gray-100)] text-sm">
                        No se pudo obtener la información del jugador
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 px-3 sm:px-4 md:px-6">
            {/* Header */}
            <div className="text-start mb-6 flex items-start justify-center flex-col gap-2 my-6">
                <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                    {activeTab === 'capitan' ? 'Gestión de equipo' : 'Solicitudes e invitaciones'}
                </h1>
                <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                        activeTab === 'capitan' 
                            ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border-[var(--color-primary)]/30' 
                            : 'bg-[var(--gray-400)]/20 text-[var(--gray-200)] border-[var(--gray-300)]/30'
                    }`}
                    onClick={() => setActiveTab('capitan')}
                    >
                        <Crown className="w-4 h-4" />
                        Capitán
                    </span>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                        activeTab === 'jugador' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : 'bg-[var(--gray-400)]/20 text-[var(--gray-200)] border-[var(--gray-300)]/30'
                    }`}
                    onClick={() => setActiveTab('jugador')}
                    >
                        <UserIcon className="w-4 h-4" />
                        Jugador
                    </span>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'capitan' ? (
                <>

            {/* Solicitudes recibidas de jugadores */}
            <div>
                <h2 className="text-lg font-semibold text-[var(--white)] mb-3">
                    Solicitudes de jugadores
                </h2>
                {id_equipo && id_categoria_edicion ? (
                    <SolicitudesCapitan
                        id_equipo={id_equipo}
                        id_categoria_edicion={id_categoria_edicion}
                        onAcceptSolicitud={() => {}}
                        onRejectSolicitud={() => {}}
                    />
                ) : (
                    <div className="bg-[var(--card-background)] rounded-2xl border border-[var(--gray-300)] p-6">
                        <div className="text-center py-8">
                            <p className="text-[var(--gray-100)] text-sm">
                                Selecciona un equipo para ver las solicitudes
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Invitar jugadores */}
            <div>
                <h2 className="text-lg font-semibold text-[var(--white)] mb-3">
                    Invitar jugadores
                </h2>
                {id_equipo && id_categoria_edicion ? (
                    <InvitacionesCapitan
                        id_equipo={id_equipo}
                        id_categoria_edicion={id_categoria_edicion}
                    />
                ) : (
                    <div className="bg-[var(--card-background)] rounded-2xl border border-[var(--gray-300)] p-6">
                        <div className="text-center py-8">
                            <p className="text-[var(--gray-100)] text-sm">
                                Selecciona un equipo para invitar jugadores
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Historial de actividad del equipo */}
            <div>
                <h2 className="text-lg font-semibold text-[var(--white)] mb-3">
                    Historial de actividad del equipo
                </h2>
                {id_equipo && id_categoria_edicion ? (
                    <HistorialEquipoChat
                        id_equipo={id_equipo}
                        id_categoria_edicion={id_categoria_edicion}
                    />
                ) : (
                    <div className="bg-[var(--card-background)] rounded-2xl border border-[var(--gray-300)] p-6">
                        <div className="text-center py-8">
                            <p className="text-[var(--gray-100)] text-sm">
                                Selecciona un equipo para ver el historial
                            </p>
                        </div>
                    </div>
                )}
            </div>
                </>
            ) : (
                <>
                    {/* Invitaciones recibidas de equipos */}
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--white)] mb-3">
                            Invitaciones de equipos
                        </h2>
                        <InvitacionesJugador
                            onAcceptInvitation={() => {}}
                            onRejectInvitation={() => {}}
                            isLoading={false}
                            id_jugador={jugador.id_jugador}
                        />
                    </div>

                    {/* Solicitudes enviadas a equipos */}
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--white)] mb-3">
                            Solicitar unirse a equipos
                        </h2>
                        <SolicitudesJugador
                            id_edicion={id_edicion}
                            id_jugador={jugador.id_jugador}
                            isLoading={isLoadingEdiciones}
                        />
                    </div>

                    {/* Historial de actividad */}
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--white)] mb-3">
                            Historial de actividad
                        </h2>
                        <HistorialChat isLoading={false} userPlayer={jugador}/>
                    </div>
                </>
            )}
        </div>
    );
}