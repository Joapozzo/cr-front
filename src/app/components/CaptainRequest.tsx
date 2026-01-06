"use client";

import { Mail, Check, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/Button";
import ConfirmModal from "./modals/ConfirModal";
import SlideCard from "./SlideCard";
import { SolicitudRecibida, SolicitudEstado } from "../types/solicitudes";
import toast from "react-hot-toast";
// import { useConfirmarSolicitud, useRechazarSolicitud } from "../hooks/useSolicitudes";
import { useConfirmarSolicitud, useObtenerSolicitudesEquipo, useRechazarSolicitud } from "../hooks/useSolicitudesCapitan";
import SolicitudesSkeleton from "./skeletons/CardSolicitudesSkeleton";
import UserAvatar from "./ui/UserAvatar";

interface SolicitudesCapitanProps {
    id_equipo: number;
    id_categoria_edicion: number;
    onAcceptSolicitud: (id_solicitud: number) => void;
    onRejectSolicitud: (id_solicitud: number) => void;
}

const SolicitudesCapitan: React.FC<SolicitudesCapitanProps> = ({
    id_equipo,
    id_categoria_edicion,
    onAcceptSolicitud,
    onRejectSolicitud,
}) => {

    // Obtener solicitudes recibidas de jugadores
    const { data: solicitudesData, isLoading: isSolicitudesLoading } = useObtenerSolicitudesEquipo(id_equipo, id_categoria_edicion);
    const { mutateAsync: aceptarSolicitud, isPending: isAceptando } = useConfirmarSolicitud(id_equipo);
    const { mutateAsync: rechazarSolicitud, isPending: isRechazando } = useRechazarSolicitud(id_equipo);
    // (id_equipo, id_categoria_edicion);
    // Filtrar solo solicitudes de jugadores pendientes
    // El backend retorna 'E' como estado pendiente
    const solicitudesPendientes = solicitudesData?.data?.filter(s => s.tipo_solicitud === 'J' && String(s.estado) === 'E') || [];
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudRecibida | null>(null);

    const handleAccept = (solicitud: SolicitudRecibida) => {
        setSelectedSolicitud(solicitud);
        setShowAcceptModal(true);
    };

    const handleReject = (solicitud: SolicitudRecibida) => {
        setSelectedSolicitud(solicitud);
        setShowRejectModal(true);
    };

    const confirmAccept = async () => {
        if (!selectedSolicitud) return;

        try {
            const data = await aceptarSolicitud({
                id_solicitud: selectedSolicitud.id_solicitud,
                id_jugador: selectedSolicitud.id_jugador,
            });
            toast.success(data.message || 'Solicitud aceptada correctamente');
            onAcceptSolicitud?.(selectedSolicitud.id_solicitud);
            setShowAcceptModal(false);
            setSelectedSolicitud(null);
        } catch (error: unknown) {
            console.error('Error completo:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al aceptar la solicitud';
            toast.error(errorMessage);
        }
    };

    const confirmReject = async () => {
        if (!selectedSolicitud) return;

        try {
            const data = await rechazarSolicitud({
                id_solicitud: selectedSolicitud.id_solicitud,
                id_jugador: selectedSolicitud.id_jugador,
            });

            toast.success(data.message || 'Solicitud rechazada correctamente');
            onRejectSolicitud?.(selectedSolicitud.id_solicitud);
            setShowRejectModal(false);
            setSelectedSolicitud(null);
        } catch (error: unknown) {
            console.error('Error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al rechazar la solicitud';
            toast.error(errorMessage);
        }
    };

    const renderSolicitud = (solicitud: SolicitudRecibida) => (
        <div className="bg-[var(--background)] rounded-lg border border-[var(--gray-300)] p-4">
            <div className="flex items-start gap-3">
                {/* Avatar del jugador */}
                <UserAvatar
                    img={solicitud.img_jugador}
                    alt={solicitud.nombre_jugador}
                    size="lg"
                    rounded="full"
                />

                <div className="flex-1">
                    {/* Nombre del jugador */}
                    <h4 className="text-[var(--white)] font-semibold text-base mb-1">
                        {solicitud.nombre_jugador}
                    </h4>

                    {/* Categoría */}
                    <p className="text-[#8C8C8C]  text-sm mb-2">
                        {solicitud.nombre_categoria}
                    </p>

                    {/* Mensaje del jugador */}
                    {solicitud.mensaje_jugador && (
                        <div className="bg-[var(--black-800)] rounded-lg p-3 mb-3 border border-[var(--gray-300)]">
                            <p className="text-[#8C8C8C]  text-xs mb-1">Mensaje:</p>
                            <p className="text-[var(--white)] text-sm italic">
                                &ldquo;{solicitud.mensaje_jugador}&rdquo;
                            </p>
                        </div>
                    )}

                    {/* Fecha */}
                    <p className="text-[#8C8C8C] text-xs mb-2">
                        Enviada: {new Date(solicitud.fecha_solicitud).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </p>

                    {/* Información de respuesta */}
                    {solicitud.respondido_por_username && (
                        <p className="text-[#8C8C8C] text-xs mb-2">
                            Respondida por: <span className="text-[var(--white)] font-medium">{solicitud.respondido_por_username}</span>
                        </p>
                    )}

                    {solicitud.agregado_por && solicitud.estado === SolicitudEstado.A && (
                        <p className="text-[#8C8C8C] text-xs mb-3">
                            Agregado por: <span className="text-[var(--white)] font-medium">{solicitud.agregado_por}</span>
                        </p>
                    )}

                    {/* Botones de acción */}
                    <div className="flex gap-2">
                        <Button
                            onClick={() => handleAccept(solicitud)}
                            variant="footer"
                            size="sm"
                            className="flex-1 flex items-center justify-center gap-1"
                            disabled={isAceptando || isRechazando}
                        >
                            <Check size={16} />
                            Aceptar
                        </Button>
                        <Button
                            onClick={() => handleReject(solicitud)}
                            variant="more"
                            size="sm"
                            className="flex-1 flex items-center justify-center gap-1"
                            disabled={isAceptando || isRechazando}
                        >
                            <X size={16} />
                            Rechazar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isSolicitudesLoading) {
        return <SolicitudesSkeleton />;
    }

    return (
        <>
            <SlideCard
                items={solicitudesPendientes}
                icon={<Mail className="text-[var(--color-primary)]" size={16} />}
                title="Solicitudes de jugadores"
                renderItem={renderSolicitud}
                autoSlideInterval={6000}
            />

            {/* Modal de Aceptar */}
            <ConfirmModal
                isOpen={showAcceptModal}
                onClose={() => setShowAcceptModal(false)}
                onConfirm={confirmAccept}
                title="Aceptar Solicitud"
                description="¿Estás seguro que quieres aceptar esta solicitud?"
                confirmText="Aceptar"
                variant="success"
                icon={<Check className="w-5 h-5" />}
                isLoading={isAceptando}
            >
                {selectedSolicitud && (
                    <div className="text-left space-y-2">
                        <p className="text-[#737373] text-sm">
                            Jugador: <span className="text-white font-medium">
                                {selectedSolicitud.nombre_jugador}
                            </span>
                        </p>
                        <p className="text-[#737373] text-sm">
                            Categoría: <span className="text-white font-medium">
                                {selectedSolicitud.nombre_categoria}
                            </span>
                        </p>
                    </div>
                )}
            </ConfirmModal>

            {/* Modal de Rechazar */}
            <ConfirmModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onConfirm={confirmReject}
                title="Rechazar"
                description="¿Estás seguro que quieres rechazar esta solicitud?"
                confirmText="Rechazar Solicitud"
                variant="danger"
                icon={<X className="w-5 h-5" />}
                isLoading={isRechazando}
            >
                {selectedSolicitud && (
                    <div className="text-left space-y-2">
                        <p className="text-[#737373] text-sm">
                            Jugador: <span className="text-white font-medium">
                                {selectedSolicitud.nombre_jugador}
                            </span>
                        </p>
                        <p className="text-[#737373] text-sm">
                            Una vez rechazada, el jugador será notificado.
                        </p>
                    </div>
                )}
            </ConfirmModal>
        </>
    );
};

export default SolicitudesCapitan;