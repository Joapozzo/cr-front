"use client";

import { Shield, Clock, CheckCircle, XCircle, Mail, Send, User } from "lucide-react";
import { useState } from "react";
import { useObtenerSolicitudesJugador } from "../hooks/useSolicitudes";
import HistorialChatSkeleton from "./skeletons/HistorialSkeletont";
import { PlayerData } from "../stores/playerStore";
import { SolicitudEnviada, SolicitudEstado } from "../types/solicitudes";
import { ImagenPublica } from "./common/ImagenPublica";

interface HistorialChatProps {
    userPlayer: PlayerData | null;
    isLoading?: boolean;
}

const HistorialChat: React.FC<HistorialChatProps> = ({ isLoading = false, userPlayer }) => {
    const [showMore, setShowMore] = useState(false);
    const ITEMS_POR_PAGINA = 6;

    const { data: solicitudes, isLoading: isSolicitudesLoading } = useObtenerSolicitudesJugador(userPlayer?.id_jugador || 0);

    const allSolicitudes: SolicitudEnviada[] = solicitudes?.data || [];
    const invitaciones = allSolicitudes.filter((s: SolicitudEnviada) => s.tipo_solicitud === 'E');
    const solicitudesEnviadas = allSolicitudes.filter((s: SolicitudEnviada) => s.tipo_solicitud === 'J');

    const displayedInvitaciones = showMore ? invitaciones : invitaciones.slice(0, ITEMS_POR_PAGINA);
    const displayedSolicitudes = showMore ? solicitudesEnviadas : solicitudesEnviadas.slice(0, ITEMS_POR_PAGINA);

    const getEstadoInfo = (estado: string | SolicitudEstado) => {
        const estadoStr = String(estado);
        switch (estadoStr) {
            case 'A':
            case 'aceptada':
                return { text: 'Aceptada', color: 'text-green-400', icon: <CheckCircle size={14} /> };
            case 'R':
            case 'rechazada':
                return { text: 'Rechazada', color: 'text-red-400', icon: <XCircle size={14} /> };
            case 'C':
            case 'cancelada':
                return { text: 'Cancelada', color: 'text-gray-400', icon: <XCircle size={14} /> };
            case 'E':
            case 'pendiente':
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
            <div className="bg-[var(--black-900)] px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-[var(--gray-300)]">
                <h3 className="text-[var(--white)] font-bold text-sm">Historial de actividad</h3>
            </div>

            {/* Chat Container */}
            <div className="p-3 sm:p-4 md:p-6 space-y-4 max-h-[600px] overflow-y-auto">
                {/* Invitaciones de Equipos (Izquierda) */}
                {displayedInvitaciones.map((invitacion) => {
                    const estadoInfo = getEstadoInfo(invitacion.estado);
                    return (
                        <div key={`inv-${invitacion.id_solicitud}`} className="flex gap-2 sm:gap-3 items-start">
                            {/* Avatar Equipo */}
                            <div className="w-10 h-10 flex-shrink-0">
                                <ImagenPublica
                                    src={invitacion.img_equipo}
                                    alt={invitacion.nombre_equipo}
                                    className="w-10 h-10 rounded-full object-cover"
                                    width={40}
                                    height={40}
                                    fallbackIcon={<Shield className="text-[var(--gray-100)]" size={20} />}
                                />
                            </div>

                            {/* Mensaje */}
                            <div className="flex-1 max-w-[85%] sm:max-w-[75%] md:max-w-[70%]">
                                <div className="bg-[var(--black-800)] rounded-2xl rounded-tl-none p-3 sm:p-4 border border-[var(--gray-300)]">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Mail size={12} className="text-[var(--color-primary)]" />
                                        <span className="px-2 py-0.5 bg-[var(--blue)]/20 text-[var(--blue)] text-[10px] font-medium rounded">
                                            Invitación recibida
                                        </span>
                                    </div>
                                    <p className="text-[var(--white)] font-semibold text-sm mb-1">
                                        {invitacion.nombre_equipo}
                                    </p>
                                    <p className="text-[var(--gray-100)] text-xs mb-2">
                                        {invitacion.nombre_categoria}
                                    </p>
                                    {invitacion.mensaje_capitan && (
                                        <p className="text-[var(--white)] text-sm mb-2">
                                            {invitacion.mensaje_capitan}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--gray-300)]">
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
                        <div key={`sol-${solicitud.id_solicitud}`} className="flex gap-2 sm:gap-3 items-start justify-end">
                            {/* Mensaje */}
                            <div className="flex-1 max-w-[85%] sm:max-w-[75%] md:max-w-[70%] flex flex-col items-end">
                                <div className="bg-[var(--color-primary)]/10 rounded-2xl rounded-tr-none p-3 sm:p-4 border border-[var(--color-primary)]/30">
                                    <div className="flex items-center gap-1 mb-1 justify-end">
                                        <span className="px-2 py-0.5 bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-[10px] font-medium rounded">
                                            Solicitud enviada
                                        </span>
                                        <Send size={12} className="text-[var(--color-primary)]" />
                                    </div>
                                    <p className="text-[var(--white)] font-semibold text-sm mb-1 text-right">
                                        {solicitud.nombre_equipo}
                                    </p>
                                    <p className="text-[var(--gray-100)] text-xs mb-2 text-right">
                                        {solicitud.nombre_categoria}
                                    </p>
                                    {solicitud.mensaje_jugador && (
                                        <p className="text-[var(--white)] text-sm mb-2 text-right">
                                            {solicitud.mensaje_jugador}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 justify-end mt-2 pt-2 border-t border-[var(--color-primary)]/30">
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
                            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0 p-1">
                                <ImagenPublica
                                    src={solicitud.img_jugador || userPlayer?.img}
                                    alt={solicitud.nombre_jugador || "Tu perfil"}
                                    className="w-8 h-8 rounded-full object-cover"
                                    width={32}
                                    height={32}
                                    fallbackIcon={<User className="text-[var(--gray-100)]" size={20} />}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Ver más button */}
            {(invitaciones.length > ITEMS_POR_PAGINA || solicitudesEnviadas.length > ITEMS_POR_PAGINA) && (
                <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-[var(--gray-300)]">
                    <button
                        onClick={() => setShowMore(!showMore)}
                        className="w-full py-2 text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 text-sm font-medium transition-colors"
                    >
                        {showMore ? 'Ver menos' : `Ver más (${allSolicitudes.length - ITEMS_POR_PAGINA} restantes)`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default HistorialChat;