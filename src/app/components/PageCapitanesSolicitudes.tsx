'use client';

import { Crown } from 'lucide-react';
import SolicitudesCapitan from '@/app/components/CaptainRequest';
import InvitacionesCapitan from '@/app/components/CaptainInvitaciones';
import HistorialEquipoChat from '@/app/components/HistorialEquipoChat';
import { ObtenerEquiposActualesDelJugadorResponse } from '../types/jugador';

interface SolicitudesCapitanPageProps {
    equipoSeleccionado: ObtenerEquiposActualesDelJugadorResponse | null;
    esCapitan: boolean;
}

export default function SolicitudesCapitanPage({  equipoSeleccionado, esCapitan }: SolicitudesCapitanPageProps) {

    const id_categoria_edicion = equipoSeleccionado?.id_categoria_edicion;
    const id_equipo = equipoSeleccionado?.id_equipo;

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

    return (
        <div className="space-y-6 px-6">
            {/* Header */}
            <div className="text-start mb-6 flex items-start justify-center flex-col gap-2 my-6">
                <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                    Gestión de Equipo
                </h1>
                <span className="flex items-center gap-1 px-3 py-1 bg-[var(--green)]/20 text-[var(--green)] rounded-full border border-[var(--green)]/30">
                    <Crown className="w-4 h-4" />
                    Capitán
                </span>
            </div>

            {/* Solicitudes recibidas de jugadores */}
            <div>
                <h2 className="text-lg font-semibold text-[var(--white)] mb-3">
                    Solicitudes de Jugadores
                </h2>
                <SolicitudesCapitan
                    id_equipo={id_equipo}
                    onAcceptSolicitud={() => {}}
                    onRejectSolicitud={() => {}}
                />
            </div>

            {/* Invitar jugadores */}
            <div>
                <h2 className="text-lg font-semibold text-[var(--white)] mb-3">
                    Invitar Jugadores
                </h2>
                <InvitacionesCapitan
                    id_equipo={id_equipo}
                />
            </div>

            {/* Historial de actividad del equipo */}
            <div>
                <h2 className="text-lg font-semibold text-[var(--white)] mb-3">
                    Historial de Actividad del Equipo
                </h2>
                <HistorialEquipoChat
                    id_equipo={id_equipo}
                    id_categoria_edicion={id_categoria_edicion}
                />
            </div>
        </div>
    );
}