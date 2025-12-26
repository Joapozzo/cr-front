import { Check, User, X } from "lucide-react";
import { SolicitudEnviada } from "../types/solicitudes";
import { Button } from "./ui/Button";
import UserAvatar from "./ui/UserAvatar";

interface InvitationProps {
    invitacion: SolicitudEnviada;
    handleAccept: (invitacion: SolicitudEnviada) => void;
    handleReject: (invitacion: SolicitudEnviada) => void;
    isLoading: boolean;
}

const renderInvitation = ({handleAccept, handleReject, isLoading, invitacion}: InvitationProps) => {

    const diasPendiente = Math.floor(
        (new Date().getTime() - new Date(invitacion.fecha_solicitud).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return (
        <div className="flex items-start gap-4">
            <div className="relative">
                <UserAvatar
                    img={invitacion.img_equipo}
                    alt={invitacion.nombre_equipo}
                    size="lg"
                    className="opacity-60"
                />
                {/* Indicador de nueva invitación */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--green)] rounded-full animate-pulse"></div>
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[#E5E5E5] font-medium">
                        {invitacion.nombre_equipo}
                    </h4>
                    <span className="px-2 py-0.5 bg-[var(--green)]/20 text-[var(--green)] text-xs font-medium rounded border border-[var(--green)]/30">
                        Invitación
                    </span>
                </div>

                <p className="text-[#737373] text-sm mb-2">
                    {invitacion.nombre_categoria}
                </p>

                <div className="flex items-center gap-4 text-xs text-[#8C8C8C] mb-3">
                    <span>
                        Recibida hace {diasPendiente === 0 ? 'hoy' : `${diasPendiente} día${diasPendiente > 1 ? 's' : ''}`}
                    </span>
                    {invitacion.estado !== 'E' && invitacion.respondido_por_username && (
                        <span>
                            Respondida por: <span className="text-[var(--white)] font-medium">{invitacion.respondido_por_username}</span>
                        </span>
                    )}
                    {invitacion.estado === 'E' && (
                        <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-[var(--green)] rounded-full animate-pulse"></div>
                            Esperando respuesta
                        </span>
                    )}
                </div>

                {invitacion.agregado_por && invitacion.estado === 'A' && (
                    <p className="text-[#8C8C8C] text-xs mb-3">
                        Agregado por: <span className="text-[var(--white)] font-medium">{invitacion.agregado_por}</span>
                    </p>
                )}

                {invitacion.mensaje_capitan && (
                    <div className="mb-4 p-3 bg-[var(--black-950)] rounded-lg border border-[#262626]">
                        <p className="text-[#8C8C8C] text-xs mb-1">Mensaje del capitán:</p>
                        <p className="text-[#E5E5E5] text-sm italic">
                            "{invitacion.mensaje_capitan}"
                        </p>
                    </div>
                )}

                {/* Botones de acción */}
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleAccept(invitacion)}
                        variant="footer"
                        size="sm"
                        className="flex items-center gap-1"
                        disabled={isLoading}
                    >
                        <Check size={14} />
                        Aceptar
                    </Button>
                    <Button
                        onClick={() => handleReject(invitacion)}
                        variant="more"
                        size="sm"
                        className="flex items-center gap-1"
                        disabled={isLoading}
                    >
                        <X size={14} />
                        Rechazar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default renderInvitation;