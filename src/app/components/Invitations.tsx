"use client";

import { Mail, Check, X } from "lucide-react";
import { useState } from "react";
import ConfirmModal from "./modals/ConfirModal";
import SlideCard from "./SlideCard";
import { useConfirmarInvitacion, useObtenerSolicitudesJugador, useRechazarInvitacion } from "../hooks/useSolicitudes";
import { SolicitudEnviada } from "../types/solicitudes";
import toast from "react-hot-toast";
import renderInvitation from "./Invitation";
import SolicitudesSkeleton from "./skeletons/CardSolicitudesSkeleton";

interface InvitacionesProps {
    onAcceptInvitation: (id_invitacion: number) => void;
    onRejectInvitation: (id_invitacion: number) => void;
    isLoading?: boolean;
    id_jugador: number;
}

const Invitaciones: React.FC<InvitacionesProps> = ({
    onAcceptInvitation,
    onRejectInvitation,
    id_jugador,
}) => {

    const { data: solicitudes, isLoading: isSolicitudesLoading } = useObtenerSolicitudesJugador(id_jugador);
    const { mutateAsync: aceptarInvitacion, isPending: isAceptandoInvitacion } = useConfirmarInvitacion(id_jugador);
    const { mutateAsync: rechazarInvitacion, isPending: isRechazandoInvitacion } = useRechazarInvitacion(id_jugador);

    // Filtrar invitaciones (tipo 'E') con estado pendiente ('E' o 'pendiente')
    const todasLasSolicitudes = solicitudes?.data || [];
    const invitaciones: SolicitudEnviada[] = todasLasSolicitudes.filter((s: SolicitudEnviada) => {
        const esInvitacion = s.tipo_solicitud === 'E';
        if (!esInvitacion) return false;
        
        const estadoStr = String(s.estado).toUpperCase();
        // Solo mostrar invitaciones pendientes (estado 'E')
        const estaPendiente = estadoStr === 'E' || estadoStr === 'PENDIENTE';
        return estaPendiente;
    });

    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedInvitation, setSelectedInvitation] = useState<SolicitudEnviada | null>(null);

    const handleAccept = (invitacion: SolicitudEnviada) => {
        setSelectedInvitation(invitacion);
        setShowAcceptModal(true);
    };

    const handleReject = (invitacion: SolicitudEnviada) => {
        setSelectedInvitation(invitacion);
        setShowRejectModal(true);
    };

    const confirmAccept = async () => {
        if (!selectedInvitation) return;

        try {
            const data = await aceptarInvitacion(selectedInvitation.id_solicitud);
            ('Data recibida:', data);
            toast.success(data.message || 'Invitación aceptada correctamente');
            onAcceptInvitation?.(selectedInvitation.id_solicitud);
            setShowAcceptModal(false);
            setSelectedInvitation(null);
        } catch (error: unknown) {
            console.error('Error completo:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al aceptar la invitación';
            toast.error(errorMessage);
        }
    };

    const confirmReject = async () => {
        if (!selectedInvitation) return;

        try {
            // mutateAsync devuelve directamente la data
            const data = await rechazarInvitacion(selectedInvitation.id_solicitud);

            ('Data recibida:', data);
            toast.success(data.message || 'Invitación rechazada correctamente');
            onRejectInvitation?.(selectedInvitation.id_solicitud);
            setShowRejectModal(false);
            setSelectedInvitation(null);
        } catch (error: unknown) {
            console.error('Error:', error);
            const errorMessage = error instanceof Error 
                ? error.message 
                : (error as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Error al rechazar la invitación';
            toast.error(errorMessage);
        }
    };

    if (isSolicitudesLoading) {
        return <SolicitudesSkeleton />;
    }

    return (
        <>
            <SlideCard
                items={invitaciones}
                icon={<Mail className="text-[var(--green)]" size={16} />}
                title="Invitaciones recibidas"
                renderItem={(invitacion) => renderInvitation({
                    invitacion,
                    handleAccept,
                    handleReject,
                    isLoading: isAceptandoInvitacion || isRechazandoInvitacion
                })}
                autoSlideInterval={6000}
            />

            {/* Modals */}
            <ConfirmModal
                isOpen={showAcceptModal}
                onClose={() => setShowAcceptModal(false)}
                onConfirm={confirmAccept}
                title="Aceptar invitación"
                description="¿Estás seguro que quieres aceptar esta invitación?"
                confirmText="Aceptar invitación"
                variant="success"
                icon={<Check className="w-5 h-5" />}
                isLoading={isAceptandoInvitacion}
            >
                {selectedInvitation && (
                    <div className="text-left space-y-2">
                        <p className="text-[#737373] text-sm">
                            Equipo: <span className="text-white font-medium">
                                {selectedInvitation.nombre_equipo}
                            </span>
                        </p>
                        <p className="text-[#737373] text-sm">
                            Categoría: <span className="text-white font-medium">
                                {selectedInvitation.nombre_categoria}
                            </span>
                        </p>
                    </div>
                )}
            </ConfirmModal>

            <ConfirmModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onConfirm={confirmReject}
                title="Rechazar Invitación"
                description="¿Estás seguro que quieres rechazar esta invitación?"
                confirmText="Rechazar Invitación"
                variant="danger"
                icon={<X className="w-5 h-5" />}
                isLoading={isRechazandoInvitacion}
            >
                {selectedInvitation && (
                    <div className="text-left space-y-2">
                        <p className="text-[#737373] text-sm">
                            Equipo: <span className="text-white font-medium">
                                {selectedInvitation.nombre_equipo}
                            </span>
                        </p>
                        <p className="text-[#737373] text-sm">
                            Una vez rechazada, no podrás recuperar esta invitación.
                        </p>
                    </div>
                )}
            </ConfirmModal>
        </>
    );
};

export default Invitaciones;