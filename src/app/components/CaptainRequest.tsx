"use client";

import { Mail, Check, X, User, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/Button";
import ConfirmModal from "./modals/ConfirModal";
import SlideCard from "./SlideCard";
import { SolicitudEstado, SolicitudRecibida } from "../types/solicitudes";
import toast from "react-hot-toast";
// import { useConfirmarSolicitud, useRechazarSolicitud } from "../hooks/useSolicitudes";
import { useConfirmarSolicitud, useObtenerSolicitudesEquipo, useRechazarSolicitud } from "../hooks/useSolicitudesCapitan";
import SolicitudesSkeleton from "./skeletons/CardSolicitudesSkeleton";

interface SolicitudesCapitanProps {
    id_equipo: number;
    onAcceptSolicitud: (id_solicitud: number) => void;
    onRejectSolicitud: (id_solicitud: number) => void;
}

const SolicitudesCapitan: React.FC<SolicitudesCapitanProps> = ({
    id_equipo,
    onAcceptSolicitud,
    onRejectSolicitud,
}) => {

    // Obtener solicitudes recibidas de jugadores
    const { data: solicitudesData, isLoading: isSolicitudesLoading } = useObtenerSolicitudesEquipo(id_equipo);
    const { mutateAsync: aceptarSolicitud, isPending: isAceptando } = useConfirmarSolicitud(id_equipo);
    const { mutateAsync: rechazarSolicitud, isPending: isRechazando } = useRechazarSolicitud(id_equipo);
    
    // Filtrar solo solicitudes de jugadores pendientes
    const solicitudesPendientes = solicitudesData?.filter(s => s.tipo_solicitud === 'J' && s.estado === 'E') || [];
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
        } catch (error: any) {
            console.error('Error completo:', error);
            toast.error(error.message || 'Error al aceptar la solicitud');
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
        } catch (error: any) {
            console.error('Error:', error);
            toast.error(error.message || 'Error al rechazar la solicitud');
        }
    };

    const renderSolicitud = (solicitud: SolicitudRecibida) => (
        <div className="bg-[var(--background)] rounded-lg border border-[var(--gray-300)] p-4">
            <div className="flex items-start gap-3">
                {/* Avatar del jugador */}
                <div className="w-12 h-12 rounded-full bg-[var(--black-800)] flex items-center justify-center flex-shrink-0">
                    {solicitud.img_jugador ? (
                        <img
                            src={solicitud.img_jugador}
                            alt={`${solicitud.nombre_jugador}`}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <User className="text-[var(--gray-100)]" size={24} />
                    )}
                </div>

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
                                "{solicitud.mensaje_jugador}"
                            </p>
                        </div>
                    )}

                    {/* Fecha */}
                    <p className="text-[#8C8C8C] text-xs mb-3">
                        Enviada: {new Date(solicitud.fecha_solicitud).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </p>

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
                icon={<Mail className="text-[var(--green)]" size={16} />}
                title="Solicitudes de Jugadores"
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