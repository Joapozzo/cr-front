'use client';

import { SolicitudesJugador } from '@/app/types/legajos';
import { Mail, CheckCircle, XCircle, Clock } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { EscudoEquipo } from '@/app/components/common/EscudoEquipo';

interface JugadorSolicitudesTabProps {
    solicitudes: SolicitudesJugador | undefined;
    isLoading: boolean;
}

export const JugadorSolicitudesTab = ({ solicitudes, isLoading }: JugadorSolicitudesTabProps) => {
    if (isLoading) {
        return (
            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                <div className="space-y-4">
                    <Skeleton height={200} borderRadius={6} />
                    <Skeleton height={200} borderRadius={6} />
                </div>
            </SkeletonTheme>
        );
    }

    if (!solicitudes) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">No hay solicitudes disponibles</p>
        );
    }

    const tieneSolicitudes = solicitudes.solicitudes_entrada.length > 0 || solicitudes.solicitudes_baja.length > 0;

    if (!tieneSolicitudes) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">No hay solicitudes registradas</p>
        );
    }

    return (
        <div className="space-y-6">
            {/* Solicitudes de Entrada */}
            {solicitudes.solicitudes_entrada.length > 0 && (
                <div className="bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                        <h2 className="text-xl font-bold text-[var(--white)]">
                            Solicitudes de entrada ({solicitudes.solicitudes_entrada.length})
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {solicitudes.solicitudes_entrada.map((solicitud) => (
                            <div
                                key={solicitud.id_solicitud}
                                className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4"
                            >
                                <div className="flex items-start gap-4">
                                    <EscudoEquipo
                                        src={solicitud.equipo.img}
                                        alt={solicitud.equipo.nombre}
                                        size={64}
                                        className="rounded-lg flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-[var(--white)] font-semibold">{solicitud.equipo.nombre}</h3>
                                                <p className="text-sm text-[var(--gray-100)]">
                                                    {solicitud.categoria_edicion.categoria.nombre} - {solicitud.categoria_edicion.edicion.nombre}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {solicitud.estado === 'aceptado' && (
                                                    <CheckCircle className="w-5 h-5 text-[var(--color-primary)]" />
                                                )}
                                                {solicitud.estado === 'rechazado' && (
                                                    <XCircle className="w-5 h-5 text-[var(--color-danger)]" />
                                                )}
                                                {solicitud.estado === 'enviado' && (
                                                    <Clock className="w-5 h-5 text-[var(--yellow)]" />
                                                )}
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    solicitud.estado === 'aceptado'
                                                        ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                                                        : solicitud.estado === 'rechazado'
                                                        ? 'bg-[var(--color-danger)]/20 text-[var(--color-danger)] border border-[var(--color-danger)]/30'
                                                        : 'bg-[var(--yellow)]/20 text-[var(--yellow)] border border-[var(--yellow)]/30'
                                                }`}>
                                                    {solicitud.estado === 'aceptado' ? 'Aceptado' : solicitud.estado === 'rechazado' ? 'Rechazado' : 'Enviado'}
                                                </span>
                                            </div>
                                        </div>
                                        {solicitud.mensaje_jugador && (
                                            <p className="text-sm text-[var(--gray-100)] mt-2">
                                                <span className="font-semibold">Mensaje:</span> {solicitud.mensaje_jugador}
                                            </p>
                                        )}
                                        <p className="text-xs text-[var(--gray-100)] mt-2">
                                            {new Date(solicitud.fecha_solicitud).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Solicitudes de Baja */}
            {solicitudes.solicitudes_baja.length > 0 && (
                <div className="bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                        <h2 className="text-xl font-bold text-[var(--white)]">
                            Solicitudes de Baja ({solicitudes.solicitudes_baja.length})
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {solicitudes.solicitudes_baja.map((solicitud) => (
                            <div
                                key={solicitud.id_solicitud}
                                className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4"
                            >
                                <div className="flex items-start gap-4">
                                    <EscudoEquipo
                                        src={solicitud.equipo.img}
                                        alt={solicitud.equipo.nombre}
                                        size={64}
                                        className="rounded-lg flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-[var(--white)] font-semibold">{solicitud.equipo.nombre}</h3>
                                                <p className="text-sm text-[var(--gray-100)]">
                                                    {solicitud.categoria_edicion.categoria.nombre} - {solicitud.categoria_edicion.edicion.nombre}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {solicitud.estado === 'aceptado' && (
                                                    <CheckCircle className="w-5 h-5 text-[var(--color-primary)]" />
                                                )}
                                                {solicitud.estado === 'rechazado' && (
                                                    <XCircle className="w-5 h-5 text-[var(--color-danger)]" />
                                                )}
                                                {solicitud.estado === 'pendiente' && (
                                                    <Clock className="w-5 h-5 text-[var(--yellow)]" />
                                                )}
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    solicitud.estado === 'aceptado'
                                                        ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                                                        : solicitud.estado === 'rechazado'
                                                        ? 'bg-[var(--color-danger)]/20 text-[var(--color-danger)] border border-[var(--color-danger)]/30'
                                                        : 'bg-[var(--yellow)]/20 text-[var(--yellow)] border border-[var(--yellow)]/30'
                                                }`}>
                                                    {solicitud.estado === 'aceptado' ? 'Aceptado' : solicitud.estado === 'rechazado' ? 'Rechazado' : 'Pendiente'}
                                                </span>
                                            </div>
                                        </div>
                                        {solicitud.motivo && (
                                            <p className="text-sm text-[var(--gray-100)] mt-2">
                                                <span className="font-semibold">Motivo:</span> {solicitud.motivo}
                                            </p>
                                        )}
                                        <p className="text-xs text-[var(--gray-100)] mt-2">
                                            Solicitado por: {solicitud.solicitado_por.nombre} {solicitud.solicitado_por.apellido} - {new Date(solicitud.fecha_solicitud).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

