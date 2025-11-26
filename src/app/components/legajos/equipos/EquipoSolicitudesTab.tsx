'use client';

import { SolicitudesEquipo } from '@/app/types/legajos';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface EquipoSolicitudesTabProps {
    solicitudes: SolicitudesEquipo | undefined;
    isLoading: boolean;
    categoriaSeleccionada: number | undefined;
}

export const EquipoSolicitudesTab = ({ solicitudes, isLoading, categoriaSeleccionada }: EquipoSolicitudesTabProps) => {
    if (!categoriaSeleccionada) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">Selecciona una categoría para ver las solicitudes</p>
        );
    }

    if (isLoading) {
        return (
            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                <Skeleton height={200} borderRadius={6} />
            </SkeletonTheme>
        );
    }

    if (!solicitudes) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">No se pudieron cargar las solicitudes</p>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--white)] mb-4">Solicitudes</h2>

            {solicitudes.jugadores_solicitaron.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-[var(--white)] mb-3">Jugadores que Solicitaron</h3>
                    <div className="space-y-3">
                        {solicitudes.jugadores_solicitaron.map((solicitud) => (
                            <div key={solicitud.id_solicitud} className="bg-[var(--gray-300)] rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[var(--white)] font-semibold">
                                            {solicitud.jugador.nombre} {solicitud.jugador.apellido}
                                        </p>
                                        {solicitud.mensaje_jugador && (
                                            <p className="text-sm text-[var(--gray-100)] mt-1">
                                                {solicitud.mensaje_jugador}
                                            </p>
                                        )}
                                        <p className="text-xs text-[var(--gray-100)] mt-1">
                                            {new Date(solicitud.fecha_solicitud).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded text-sm ${solicitud.estado === 'aceptado'
                                            ? 'bg-[var(--green)] text-[var(--white)]'
                                            : solicitud.estado === 'rechazado'
                                                ? 'bg-[var(--red)] text-[var(--white)]'
                                                : 'bg-[var(--yellow)] text-[var(--white)]'
                                        }`}>
                                        {solicitud.estado}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {solicitudes.invitaciones_enviadas.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-[var(--white)] mb-3">Invitaciones Enviadas</h3>
                    <div className="space-y-3">
                        {solicitudes.invitaciones_enviadas.map((invitacion) => (
                            <div key={invitacion.id_solicitud} className="bg-[var(--gray-300)] rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[var(--white)] font-semibold">
                                            {invitacion.jugador.nombre} {invitacion.jugador.apellido}
                                        </p>
                                        {invitacion.mensaje_capitan && (
                                            <p className="text-sm text-[var(--gray-100)] mt-1">
                                                {invitacion.mensaje_capitan}
                                            </p>
                                        )}
                                        <p className="text-xs text-[var(--gray-100)] mt-1">
                                            {new Date(invitacion.fecha_solicitud).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded text-sm ${invitacion.estado === 'aceptado'
                                            ? 'bg-[var(--green)] text-[var(--white)]'
                                            : invitacion.estado === 'rechazado'
                                                ? 'bg-[var(--red)] text-[var(--white)]'
                                                : 'bg-[var(--yellow)] text-[var(--white)]'
                                        }`}>
                                        {invitacion.estado}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {solicitudes.jugadores_solicitaron.length === 0 && solicitudes.invitaciones_enviadas.length === 0 && (
                <p className="text-[var(--gray-100)] text-center py-8">No hay solicitudes</p>
            )}
        </div>
    );
};

