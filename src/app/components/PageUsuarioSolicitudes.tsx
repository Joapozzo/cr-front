'use client';

import { useState } from 'react';
import { User as UserIcon } from 'lucide-react';
import InvitacionesJugador from '@/app/components/Invitations';
import SolicitudesJugador from '@/app/components/Request';
import HistorialChat from '@/app/components/HistorialChat';
import { ObtenerEquiposActualesDelJugadorResponse } from '../types/jugador';
import { usePlayerStore } from '../stores/playerStore';

interface SolicitudesJugadorPageProps {
    equipoSeleccionado: ObtenerEquiposActualesDelJugadorResponse | null;
}

export default function SolicitudesJugadorPage({equipoSeleccionado}: SolicitudesJugadorPageProps) {
    const { jugador } = usePlayerStore();
    const [isLoading, setIsLoading] = useState(false);

    const id_edicion = 10;

    return (
        <div className="space-y-6 px-6">
            {/* Header */}
            <div className="text-start mb-6 flex items-start justify-center flex-col gap-2 my-6">
                <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                    Solicitudes e Invitaciones
                </h1>
                <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                    <UserIcon className="w-4 h-4" />
                    Jugador
                </span>
            </div>

            {/* Invitaciones recibidas de equipos */}
            <div>
                <h2 className="text-lg font-semibold text-[var(--white)] mb-3">
                    Invitaciones de Equipos
                </h2>
                <InvitacionesJugador
                    onAcceptInvitation={() => {}}
                    onRejectInvitation={() => {}}
                    isLoading={isLoading}
                    id_jugador={jugador?.id_jugador}
                />
            </div>

            {/* Solicitudes enviadas a equipos */}
            <div>
                <h2 className="text-lg font-semibold text-[var(--white)] mb-3">
                    Solicitar Unirse a Equipos
                </h2>
                <SolicitudesJugador
                    id_edicion={id_edicion}
                    id_jugador={jugador?.id_jugador}
                    isLoading={isLoading}
                />
            </div>

            {/* Historial de actividad */}
            <div>
                <h2 className="text-lg font-semibold text-[var(--white)] mb-3">
                    Historial de Actividad
                </h2>
                <HistorialChat isLoading={isLoading} userPlayer={jugador}/>
            </div>
        </div>
    );
}