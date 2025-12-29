"use client";

import { History, Check, X, Clock, ArrowRight, User } from "lucide-react";
import Image from 'next/image';

interface MovimientoHistorial {
    id: number;
    tipo: 'invitacion_recibida' | 'invitacion_enviada' | 'solicitud_recibida' | 'solicitud_enviada';
    estado: 'aceptada' | 'rechazada' | 'pendiente';
    nombre_equipo: string;
    img_equipo?: string;
    nombre_categoria: string;
    fecha: string;
    mensaje?: string;
    nombre_otro_usuario?: string; // Capitán o jugador dependiendo del contexto
}

interface HistorialProps {
    movimientos: MovimientoHistorial[];
    isLoading?: boolean;
}

const Historial: React.FC<HistorialProps> = ({
    movimientos = [],
    isLoading = false
}) => {
    const getTipoTexto = (tipo: string, estado: string) => {
        switch (tipo) {
            case 'invitacion_recibida':
                return estado === 'aceptada' ? 'Invitación aceptada' :
                    estado === 'rechazada' ? 'Invitación rechazada' : 'Invitación recibida';
            case 'invitacion_enviada':
                return estado === 'aceptada' ? 'Tu invitación fue aceptada' :
                    estado === 'rechazada' ? 'Tu invitación fue rechazada' : 'Invitación enviada';
            case 'solicitud_recibida':
                return estado === 'aceptada' ? 'Solicitud aceptada' :
                    estado === 'rechazada' ? 'Solicitud rechazada' : 'Solicitud recibida';
            case 'solicitud_enviada':
                return estado === 'aceptada' ? 'Tu solicitud fue aceptada' :
                    estado === 'rechazada' ? 'Tu solicitud fue rechazada' : 'Solicitud enviada';
            default:
                return 'Movimiento';
        }
    };

    const getTipoIcon = (tipo: string, estado: string) => {
        if (estado === 'aceptada') return <Check className="w-4 h-4 text-green-400" />;
        if (estado === 'rechazada') return <X className="w-4 h-4 text-red-400" />;
        if (estado === 'pendiente') return <Clock className="w-4 h-4 text-orange-400" />;

        switch (tipo) {
            case 'invitacion_recibida':
            case 'invitacion_enviada':
                return <ArrowRight className="w-4 h-4 text-blue-400" />;
            case 'solicitud_recibida':
            case 'solicitud_enviada':
                return <ArrowRight className="w-4 h-4 text-purple-400" />;
            default:
                return <History className="w-4 h-4 text-[var(--gray-100)]" />;
        }
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'aceptada':
                return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'rechazada':
                return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'pendiente':
                return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            default:
                return 'text-[var(--gray-100)] bg-[var(--gray-300)]/10 border-[var(--gray-300)]/20';
        }
    };

    const formatearFecha = (fecha: string) => {
        const fechaObj = new Date(fecha);
        const ahora = new Date();
        const diferenciaDias = Math.floor(
            (ahora.getTime() - fechaObj.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diferenciaDias === 0) return 'Hoy';
        if (diferenciaDias === 1) return 'Ayer';
        if (diferenciaDias < 7) return `Hace ${diferenciaDias} días`;
        if (diferenciaDias < 30) return `Hace ${Math.floor(diferenciaDias / 7)} semana${Math.floor(diferenciaDias / 7) > 1 ? 's' : ''}`;

        return fechaObj.toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="bg-[var(--card-background)] rounded-2xl border border-[var(--gray-300)] p-6">
                <div className="flex items-center gap-2 mb-4">
                    <History className="text-[var(--gray-100)]" size={20} />
                    <h3 className="text-[var(--white)] font-bold text-lg">Historial</h3>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-3 bg-[var(--background)] rounded-lg animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[var(--gray-300)] rounded-lg"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-[var(--gray-300)] rounded w-3/4"></div>
                                    <div className="h-3 bg-[var(--gray-300)] rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (movimientos.length === 0) {
        return (
            <div className="bg-[var(--card-background)] rounded-2xl border border-[var(--gray-300)] p-6">
                <div className="flex items-center gap-2 mb-4">
                    <History className="text-[var(--gray-100)]" size={20} />
                    <h3 className="text-[var(--white)] font-bold text-lg">Historial</h3>
                </div>
                <div className="text-center py-8">
                    <History className="w-12 h-12 text-[var(--gray-100)] mx-auto mb-3" />
                    <h4 className="text-[var(--white)] font-semibold text-lg mb-2">
                        Sin actividad
                    </h4>
                    <p className="text-[var(--gray-100)] text-sm">
                        Tu historial de solicitudes e invitaciones aparecerá aquí
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--card-background)] rounded-2xl border border-[var(--gray-300)] p-6">
            <div className="flex items-center gap-2 mb-4">
                <History className="text-[var(--gray-100)]" size={20} />
                <h3 className="text-[var(--white)] font-bold text-lg">Historial</h3>
                <span className="text-[var(--gray-100)] text-sm">
                    ({movimientos.length} movimiento{movimientos.length !== 1 ? 's' : ''})
                </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
                {movimientos.map((movimiento) => (
                    <div
                        key={movimiento.id}
                        className="p-3 bg-[var(--background)] rounded-lg border border-[var(--gray-300)] hover:border-[var(--gray-200)] transition-colors"
                    >
                        <div className="flex items-start gap-3">
                            {/* Icono del tipo de movimiento */}
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--card-background)] border border-[var(--gray-300)]">
                                {getTipoIcon(movimiento.tipo, movimiento.estado)}
                            </div>

                            {/* Logo del equipo */}
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                {movimiento.img_equipo ? (
                                    <Image
                                        src={movimiento.img_equipo}
                                        alt={movimiento.nombre_equipo}
                                        width={24}
                                        height={24}
                                        className="rounded-lg object-cover"
                                    />
                                ) : (
                                    <User className="text-[var(--gray-100)]" size={16} />
                                )}
                            </div>

                            {/* Contenido */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-[var(--white)] font-medium text-sm truncate">
                                        {getTipoTexto(movimiento.tipo, movimiento.estado)}
                                    </p>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getEstadoColor(movimiento.estado)}`}>
                                        {movimiento.estado === 'aceptada' ? 'Aceptada' :
                                            movimiento.estado === 'rechazada' ? 'Rechazada' : 'Pendiente'}
                                    </span>
                                </div>

                                <p className="text-[var(--gray-100)] text-sm mb-1">
                                    <span className="font-medium">{movimiento.nombre_equipo}</span> - {movimiento.nombre_categoria}
                                </p>

                                <div className="flex items-center justify-between">
                                    <p className="text-[var(--gray-100)] text-xs">
                                        {formatearFecha(movimiento.fecha)}
                                    </p>

                                    {movimiento.nombre_otro_usuario && (
                                        <p className="text-[var(--gray-100)] text-xs">
                                            {movimiento.tipo.includes('recibida') ? 'De:' : 'Para:'} {movimiento.nombre_otro_usuario}
                                        </p>
                                    )}
                                </div>

                                {movimiento.mensaje && (
                                    <div className="mt-2 p-2 bg-[var(--card-background)] rounded border border-[var(--gray-300)]">
                                        <p className="text-[var(--gray-100)] text-xs mb-1">Mensaje:</p>
                                        <p className="text-[var(--white)] text-xs italic">
                                            &ldquo;{movimiento.mensaje}&rdquo;
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Historial;