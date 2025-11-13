"use client";

import { User, Shield, Clock, CheckCircle, XCircle, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useObtenerSolicitudesJugador } from "../hooks/useSolicitudes";
import HistorialChatSkeleton from "./skeletons/HistorialSkeletont";

interface HistorialChatProps {
    userPlayer: number;
    isLoading?: boolean;
}

const HistorialChat: React.FC<HistorialChatProps> = ({ isLoading = false, userPlayer }) => {
    const [showMore, setShowMore] = useState(false);
    const ITEMS_POR_PAGINA = 6;

    const { data: solicitudes, isLoading: isSolicitudesLoading } = useObtenerSolicitudesJugador(userPlayer?.id_jugador);

    const allSolicitudes = solicitudes || [];
    const invitaciones = allSolicitudes.filter(s => s.tipo_solicitud === 'E');
    const solicitudesEnviadas = allSolicitudes.filter(s => s.tipo_solicitud === 'J');

    const displayedInvitaciones = showMore ? invitaciones : invitaciones.slice(0, ITEMS_POR_PAGINA);
    const displayedSolicitudes = showMore ? solicitudesEnviadas : solicitudesEnviadas.slice(0, ITEMS_POR_PAGINA);

    const getEstadoInfo = (estado: string) => {
        switch (estado) {
            case 'A':
                return { text: 'Aceptada', color: 'text-green-400', icon: <CheckCircle size={14} /> };
            case 'R':
                return { text: 'Rechazada', color: 'text-red-400', icon: <XCircle size={14} /> };
            case 'C':
                return { text: 'Cancelada', color: 'text-gray-400', icon: <XCircle size={14} /> };
            default:
                return { text: 'Pendiente', color: 'text-orange-400', icon: <Clock size={14} /> };
        }
    };

    const formatFecha = (fecha: string) => {
        const date = new Date(fecha);
        const hoy = new Date();
        const diff = Math.floor((hoy.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diff === 0) return 'Hoy';
        if (diff === 1) return 'Ayer';
        if (diff < 7) return `Hace ${diff} días`;
        return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
    };

    if (isSolicitudesLoading || isLoading) {
        return (
            <HistorialChatSkeleton/>
        );
    }

    if (allSolicitudes.length === 0) {
        return (
            <div className="bg-[var(--card-background)] rounded-2xl border border-[var(--gray-300)] p-6">
                <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-[var(--gray-100)] mx-auto mb-3" />
                    <h3 className="text-[var(--white)] font-semibold text-lg mb-2">
                        Sin actividad
                    </h3>
                    <p className="text-[var(--gray-100)] text-sm">
                        Aún no tienes solicitudes ni invitaciones
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--card-background)] rounded-2xl border border-[var(--gray-300)] overflow-hidden">
            {/* Header */}
            <div className="bg-[var(--black-900)] px-6 py-4 border-b border-[var(--gray-300)]">
                <h3 className="text-[var(--white)] font-bold text-sm">Historial de Actividad</h3>
            </div>

            {/* Chat Container */}
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                {/* Invitaciones de Equipos (Izquierda) */}
                {displayedInvitaciones.map((invitacion) => {
                    const estadoInfo = getEstadoInfo(invitacion.estado);
                    return (
                        <div key={`inv-${invitacion.id_solicitud}`} className="flex gap-3 items-start">
                            {/* Avatar Equipo */}
                            <div className="w-10 h-10 rounded-full bg-[var(--black-800)] flex items-center justify-center flex-shrink-0">
                                {invitacion.img_equipo ? (
                                    <img
                                        src={invitacion.img_equipo}
                                        alt={invitacion.nombre_equipo}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <Shield className="text-[var(--gray-100)]" size={20} />
                                )}
                            </div>

                            {/* Mensaje */}
                            <div className="flex-1 max-w-[70%]">
                                <div className="bg-[var(--black-800)] rounded-2xl rounded-tl-none p-3 border border-[var(--gray-300)]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-[var(--white)] font-semibold text-sm">
                                            {invitacion.nombre_equipo}
                                        </p>
                                        <Mail size={12} className="text-[var(--green)]" />
                                    </div>
                                    <p className="text-[var(--gray-100)] text-xs mb-2">
                                        {invitacion.nombre_categoria} • {invitacion.edicion}
                                    </p>
                                    {invitacion.mensaje_capitan && (
                                        <p className="text-[var(--white)] text-sm mb-2">
                                            {invitacion.mensaje_capitan}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--gray-300)]">
                                        <span className={`flex items-center gap-1 text-xs ${estadoInfo.color}`}>
                                            {estadoInfo.icon}
                                            {estadoInfo.text}
                                        </span>
                                        <span className="text-[var(--gray-100)] text-xs">
                                            {formatFecha(invitacion.fecha_solicitud)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Solicitudes del Jugador (Derecha) */}
                {displayedSolicitudes.map((solicitud) => {
                    const estadoInfo = getEstadoInfo(solicitud.estado);
                    return (
                        <div key={`sol-${solicitud.id_solicitud}`} className="flex gap-3 items-start justify-end">
                            {/* Mensaje */}
                            <div className="flex-1 max-w-[70%] flex flex-col items-end">
                                <div className="bg-[var(--green)]/10 rounded-2xl rounded-tr-none p-3 border border-[var(--green)]/30">
                                    <div className="flex items-center gap-2 mb-1 justify-end">
                                        <Send size={12} className="text-[var(--green)]" />
                                        <p className="text-[var(--white)] font-semibold text-sm">
                                            {solicitud.nombre_equipo}
                                        </p>
                                    </div>
                                    <p className="text-[var(--gray-100)] text-xs mb-2 text-right">
                                        {solicitud.nombre_categoria} • {solicitud.edicion}
                                    </p>
                                    {solicitud.mensaje_jugador && (
                                        <p className="text-[var(--white)] text-sm mb-2 text-right">
                                            {solicitud.mensaje_jugador}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--green)]/30">
                                        <span className="text-[var(--gray-100)] text-xs">
                                            {formatFecha(solicitud.fecha_solicitud)}
                                        </span>
                                        <span className={`flex items-center gap-1 text-xs ${estadoInfo.color}`}>
                                            {estadoInfo.icon}
                                            {estadoInfo.text}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Avatar Jugador */}
                            <div className="w-10 h-10 rounded-full bg-[var(--green)]/20 flex items-center justify-center flex-shrink-0">
                                {userPlayer?.img ? (
                                    <img
                                        src={userPlayer.img}
                                        alt="Tu perfil"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="text-[var(--green)]" size={20} />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Ver más button */}
            {(invitaciones.length > ITEMS_POR_PAGINA || solicitudesEnviadas.length > ITEMS_POR_PAGINA) && (
                <div className="px-6 py-4 border-t border-[var(--gray-300)]">
                    <button
                        onClick={() => setShowMore(!showMore)}
                        className="w-full py-2 text-[var(--green)] hover:text-[var(--green)]/80 text-sm font-medium transition-colors"
                    >
                        {showMore ? 'Ver menos' : `Ver más (${allSolicitudes.length - ITEMS_POR_PAGINA} restantes)`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default HistorialChat;