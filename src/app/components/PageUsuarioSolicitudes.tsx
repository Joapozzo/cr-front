'use client';

import { User as UserIcon } from 'lucide-react';
import { useMemo } from 'react';
import InvitacionesJugador from '@/app/components/Invitations';
import SolicitudesJugador from '@/app/components/Request';
import HistorialChat from '@/app/components/HistorialChat';
import { usePlayerStore } from '../stores/playerStore';
import { useEdicionesActuales } from '../hooks/useEdiciones';
import { useJugadorUsuario } from '../hooks/useJugadorUsuario';

export default function SolicitudesJugadorPage() {
    const { jugador, equipos } = usePlayerStore();
    const { data: edicionesActuales, isLoading: isLoadingEdiciones } = useEdicionesActuales();
    
    // Obtener o crear jugador del usuario autenticado
    const { isLoading: isLoadingJugador } = useJugadorUsuario();

    // Obtener id_edicion: primero de los equipos del jugador, luego de ediciones activas
    const id_edicion = useMemo(() => {
        // Si el jugador tiene equipos, usar la edición del primer equipo (más reciente)
        if (equipos && equipos.length > 0) {
            // Ordenar por temporada descendente y tomar la primera
            const equiposOrdenados = [...equipos].sort((a, b) => b.temporada - a.temporada);
            return equiposOrdenados[0].id_edicion;
        }

        // Si no tiene equipos, usar la primera edición activa disponible
        if (edicionesActuales && edicionesActuales.length > 0) {
            // Ordenar por temporada descendente y tomar la primera
            const edicionesOrdenadas = [...edicionesActuales].sort((a, b) => b.temporada - a.temporada);
            return edicionesOrdenadas[0].id_edicion;
        }

        // Si no hay ediciones activas, retornar null
        return null;
    }, [equipos, edicionesActuales]);

    // Mostrar loading mientras se obtiene/crea el jugador
    if (isLoadingJugador) {
        return (
            <div className="space-y-6 px-6">
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
            <div className="space-y-6 px-6">
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
                    Solicitudes e invitaciones
                </h1>
                <span className="flex items-center gap-1 px-3 py-1 bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-full border border-[var(--color-primary)]/30">
                    <UserIcon className="w-4 h-4" />
                    Jugador
                </span>
            </div>

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
        </div>
    );
}