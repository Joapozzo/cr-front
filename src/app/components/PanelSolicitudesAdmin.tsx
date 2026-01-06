"use client";

import { useState } from "react";
import { Mail, Send, Check, X, Inbox, Loader2, Shield } from "lucide-react";
import { Button } from '@/app/components/ui/Button';
import { SolicitudResponse, InvitacionEnviadaResponse } from '../services/solicitudes.services';
import { EstadoBadge } from "../utils/solicitudesHelper";
import { ImagenPublica } from "./common/ImagenPublica";
import { Equipo } from "../types/equipo";
import ConfirmActionModal from "./modals/ConfirmActionModal";
import { toast } from 'react-hot-toast';
import { User } from "lucide-react";

interface SolicitudBajaResponse extends SolicitudResponse {
    tipo_solicitud: 'B';
    motivo?: string | null;
    observaciones?: string | null;
    motivo_rechazo?: string | null;
}

type MercadoPaseItem = SolicitudResponse | InvitacionEnviadaResponse | SolicitudBajaResponse;

interface PanelSolicitudesAdminProps {
    // Queries
    solicitudes: SolicitudResponse[] | undefined;
    invitaciones: InvitacionEnviadaResponse[] | undefined;
    isLoadingSolicitudes: boolean;
    isLoadingInvitaciones: boolean;

    // Mutaciones (funciones a ejecutar)
    onAceptarSolicitud: (id_solicitud: number, id_jugador: number) => Promise<void>;
    onRechazarSolicitud: (id: number) => Promise<void>;
    onAceptarInvitacion: (id_solicitud: number, id_jugador: number) => Promise<void>;
    onRechazarInvitacion: (id: number) => Promise<void>;

    // Estado de carga de mutaciones (si es necesario un feedback más específico)
    isAccepting: number | null;
    isRejecting: number | null;

    equipo: Equipo;
}

export default function PanelSolicitudesAdmin({
    solicitudes = [],
    invitaciones = [],
    isLoadingSolicitudes,
    isLoadingInvitaciones,
    onAceptarSolicitud,
    onRechazarSolicitud,
    onAceptarInvitacion,
    onRechazarInvitacion,
    isAccepting,
    isRejecting,
    equipo
}: PanelSolicitudesAdminProps) {
    const [tab, setTab] = useState<'solicitudes' | 'invitaciones'>('solicitudes');
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        action: 'aceptar' | 'rechazar' | null;
        solicitud: MercadoPaseItem | null;
    }>({
        isOpen: false,
        action: null,
        solicitud: null
    });

    // Obtenemos los datos a mostrar según la pestaña
    const displayedData: MercadoPaseItem[] = tab === 'solicitudes' ? solicitudes : invitaciones;
    const isLoading = tab === 'solicitudes' ? isLoadingSolicitudes : isLoadingInvitaciones;
    // Conteo de pendientes (incluyendo solicitudes de baja con estado 'P')
    const solicitudesPendientes = solicitudes.filter(s => s.estado === 'E' || s.estado === 'P').length;
    const invitacionesPendientes = invitaciones.filter(i => i.estado === 'E').length;
    const totalPendientes = solicitudesPendientes + invitacionesPendientes;

    const openModal = (action: 'aceptar' | 'rechazar', solicitud: MercadoPaseItem) => {
        setModalState({
            isOpen: true,
            action,
            solicitud
        });
    };

    const closeModal = () => {
        setModalState({
            isOpen: false,
            action: null,
            solicitud: null
        });
    };

    const handleConfirmAction = async () => {
        if (!modalState.solicitud || !modalState.action) return;

        const { id_solicitud, id_jugador, tipo_solicitud, nombre_jugador } = modalState.solicitud;
        const tipo = tipo_solicitud as 'J' | 'E' | 'B';

        try {
            if (modalState.action === 'aceptar') {
                if (tipo === 'B') {
                    await onAceptarSolicitud(id_solicitud, id_jugador);
                    toast.success(`Solicitud de baja de ${nombre_jugador} aceptada exitosamente`);
                } else if (tipo === 'J') {
                    await onAceptarSolicitud(id_solicitud, id_jugador);
                    toast.success(`Solicitud de ${nombre_jugador} aceptada exitosamente`);
                } else {
                    await onAceptarInvitacion(id_solicitud, id_jugador);
                    toast.success(`Invitación a ${nombre_jugador} aceptada exitosamente`);
                }
            } else {
                if (tipo === 'B') {
                    await onRechazarSolicitud(id_solicitud);
                    toast.success(`Solicitud de baja de ${nombre_jugador} rechazada`);
                } else if (tipo === 'J') {
                    await onRechazarSolicitud(id_solicitud);
                    toast.success(`Solicitud de ${nombre_jugador} rechazada`);
                } else {
                    await onRechazarInvitacion(id_solicitud);
                    toast.success(`Invitación a ${nombre_jugador} rechazada`);
                }
            }
            closeModal();
        } catch (error) {
            console.error('Error al procesar la acción:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al procesar la acción';
            toast.error(errorMessage);
        }
    };
    
    return (
        <div className="space-y-4">
            {/* Header de Solicitudes */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--color-primary)]/20 rounded-lg">
                        <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--white)]">
                            Gestión de solicitudes
                        </h3>
                        <p className="text-[var(--gray-100)] text-sm">
                            {totalPendientes} pendientes
                        </p>
                    </div>
                </div>
            </div>

            {/* Pestañas */}
            <div className="flex border-b border-[var(--gray-300)]">
                <button
                    onClick={() => setTab('solicitudes')}
                    className={`
                        px-4 py-3 text-sm font-medium 
                        ${tab === 'solicitudes' 
                            ? 'text-[var(--white)] border-b-2 border-[var(--color-primary)]' 
                            : 'text-[var(--gray-100)] border-b-2 border-transparent hover:text-[var(--white)]'
                        }
                    `}
                >
                    Solicitudes de jugadores 
                    <span className="ml-2 bg-[var(--gray-300)] text-[var(--white)] text-xs px-2 py-0.5 rounded-full">
                        {solicitudesPendientes}
                    </span>
                </button>
                <button
                    onClick={() => setTab('invitaciones')}
                    className={`
                        px-4 py-3 text-sm font-medium 
                        ${tab === 'invitaciones' 
                            ? 'text-[var(--white)] border-b-2 border-[var(--color-primary)]' 
                            : 'text-[var(--gray-100)] border-b-2 border-transparent hover:text-[var(--white)]'
                        }
                    `}
                >
                    Invitaciones de equipos
                    <span className="ml-2 bg-[var(--gray-300)] text-[var(--white)] text-xs px-2 py-0.5 rounded-full">
                        {invitacionesPendientes}
                    </span>
                </button>
            </div>

            {/* Contenedor de la Lista Vertical */}
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {isLoading && (
                    <div className="text-center py-16 text-[var(--gray-100)]">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                        Cargando...
                    </div>
                )}

                {!isLoading && displayedData.length === 0 && (
                    <div className="bg-[var(--gray-400)] border-2 border-dashed border-[var(--gray-300)] rounded-lg p-8 text-center">
                        <Inbox className="w-12 h-12 text-[var(--gray-200)] mx-auto mb-4" />
                        <h4 className="text-[var(--white)] font-medium mb-2">
                            Bandeja vacía
                        </h4>
                        <p className="text-[var(--gray-100)] text-sm">
                            No hay {tab === 'solicitudes' ? 'solicitudes' : 'invitaciones'} para mostrar.
                        </p>
                    </div>
                )}
                
                {!isLoading && displayedData.map((sol) => (
                    <div 
                        key={sol.id_solicitud} 
                        className="bg-[var(--gray-400)] border border-[var(--gray-300)] rounded-lg p-4 space-y-3"
                    >
                        {/* 1. Información del Jugador */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ImagenPublica
                                    src={sol.img_jugador}
                                    alt={sol.nombre_jugador}
                                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-[var(--gray-300)]"
                                    width={40}
                                    height={40}
                                    fallbackIcon={<User className="text-[var(--gray-100)]" size={20} />}
                                />
                                <div>
                                    <p className="text-[var(--white)] font-semibold text-sm">{sol.nombre_jugador}</p>
                                    <p className="text-[var(--gray-100)] text-xs">
                                        {sol.tipo_solicitud === 'B' ? 'Solicitud de baja' : 
                                         sol.tipo_solicitud === 'J' ? 'Solicitud' : 'Invitación'} N° {sol.id_solicitud}
                                    </p> 
                                </div>
                            </div>
                            {/* Mostrar estado solo si NO está pendiente */}
                            {(sol.estado !== 'E' && sol.estado !== 'P') && (
                                <EstadoBadge estado={sol.estado} />
                            )}
                        </div>

                        {/* 2. Tipo de Solicitud */}
                        <div className="flex items-center gap-2 text-sm text-[var(--gray-100)] pl-12"> 
                            {sol.tipo_solicitud === 'B' ? (
                                <>
                                    <X size={14} className="text-[var(--color-secondary)]" />
                                    <span>Solicita darse de baja de:</span>
                                </>
                            ) : sol.tipo_solicitud === 'J' ? (
                                <>
                                    <Send size={14} className="text-[var(--color-primary)]" />
                                    <span>Solicita unirse a:</span>
                                </>
                            ) : (
                                <>
                                    <Mail size={14} className="text-[var(--blue)]" />
                                    <span>Invitado por:</span>
                                </>
                            )}
                        </div>

                        {/* 3. Información del Equipo */}
                        <div className="flex items-center gap-3 pl-12">
                            <ImagenPublica
                                src={equipo.img}
                                alt={equipo.nombre}
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-[var(--gray-300)]"
                                width={40}
                                height={40}
                                fallbackIcon={<Shield className="text-[var(--gray-100)]" size={20} />}
                            />
                            <div>
                                <p className="text-[var(--white)] font-semibold text-sm">{equipo.nombre}</p>
                                <p className="text-[var(--gray-100)] text-xs">
                                    {sol.nombre_categoria} • {sol.edicion}
                                </p>
                                {sol.respondido_por_username && (
                                    <p className="text-[var(--gray-100)] text-xs mt-1">
                                        Respondida por: <span className="text-[var(--white)] font-medium">{sol.respondido_por_username}</span>
                                    </p>
                                )}
                                {sol.agregado_por && sol.estado === 'A' && sol.tipo_solicitud !== 'B' && (
                                    <p className="text-[var(--gray-100)] text-xs mt-1">
                                        Agregado por: <span className="text-[var(--white)] font-medium">{sol.agregado_por}</span>
                                    </p>
                                )}
                                {/* Mostrar motivo y observaciones para solicitudes de baja */}
                                {sol.tipo_solicitud === 'B' && (sol as SolicitudBajaResponse).motivo && (
                                    <div className="mt-2 p-2 bg-[var(--black-900)] rounded border border-[var(--gray-300)]">
                                        <p className="text-[var(--gray-100)] text-xs mb-1">Motivo:</p>
                                        <p className="text-[var(--white)] text-xs">
                                            {(sol as SolicitudBajaResponse).motivo}
                                        </p>
                                        {(sol as SolicitudBajaResponse).observaciones && (
                                            <>
                                                <p className="text-[var(--gray-100)] text-xs mb-1 mt-2">Observaciones:</p>
                                                <p className="text-[var(--white)] text-xs">
                                                    {(sol as SolicitudBajaResponse).observaciones}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                                {/* Mostrar motivo de rechazo si fue rechazada */}
                                {sol.tipo_solicitud === 'B' && (sol as SolicitudBajaResponse).motivo_rechazo && sol.estado === 'R' && (
                                    <div className="mt-2 p-2 bg-red-500/10 rounded border border-red-500/30">
                                        <p className="text-red-400 text-xs mb-1">Motivo de rechazo:</p>
                                        <p className="text-red-300 text-xs">
                                            {(sol as SolicitudBajaResponse).motivo_rechazo}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 4. Acciones (Solo si está pendiente) */}
                        {(sol.estado === 'E' || sol.estado === 'P') && (
                            <div className="pt-3 mt-3 border-t border-[var(--gray-300)] flex gap-2">
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => openModal('rechazar', sol)}
                                    disabled={isRejecting === sol.id_solicitud || isAccepting === sol.id_solicitud}
                                    className="flex-1 flex items-center justify-center gap-2"
                                >
                                    {isRejecting === sol.id_solicitud ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <X className="w-4 h-4" />
                                    )}
                                    Rechazar
                                </Button>
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => openModal('aceptar', sol)}
                                    disabled={isAccepting === sol.id_solicitud || isRejecting === sol.id_solicitud}
                                    className="flex-1 flex items-center justify-center gap-2"
                                >
                                    {isAccepting === sol.id_solicitud ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Check className="w-4 h-4" />
                                    )}
                                    Aceptar
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal de confirmación */}
            {modalState.solicitud && (
                <ConfirmActionModal
                    isOpen={modalState.isOpen}
                    onClose={closeModal}
                    onConfirm={handleConfirmAction}
                    title={
                        modalState.action === 'aceptar'
                            ? modalState.solicitud.tipo_solicitud === 'B'
                                ? 'Aceptar solicitud de baja'
                                : modalState.solicitud.tipo_solicitud === 'J'
                                    ? 'Aceptar solicitud'
                                    : 'Aceptar invitación'
                            : modalState.solicitud.tipo_solicitud === 'B'
                                ? 'Rechazar solicitud de baja'
                                : modalState.solicitud.tipo_solicitud === 'J'
                                    ? 'Rechazar solicitud'
                                    : 'Rechazar invitación'
                    }
                    message={
                        modalState.action === 'aceptar'
                            ? modalState.solicitud.tipo_solicitud === 'B'
                                ? `¿Estás seguro de que deseas aceptar la solicitud de baja de ${modalState.solicitud.nombre_jugador}? El jugador será removido del plantel.`
                                : `¿Estás seguro de que deseas aceptar ${modalState.solicitud.tipo_solicitud === 'J' ? 'la solicitud de' : 'la invitación a'} ${modalState.solicitud.nombre_jugador}?`
                            : modalState.solicitud.tipo_solicitud === 'B'
                                ? `¿Estás seguro de que deseas rechazar la solicitud de baja de ${modalState.solicitud.nombre_jugador}?`
                                : `¿Estás seguro de que deseas rechazar ${modalState.solicitud.tipo_solicitud === 'J' ? 'la solicitud de' : 'la invitación a'} ${modalState.solicitud.nombre_jugador}?`
                    }
                    confirmText={modalState.action === 'aceptar' ? 'Aceptar' : 'Rechazar'}
                    cancelText="Cancelar"
                    variant={modalState.action === 'aceptar' ? 'success' : 'danger'}
                    isLoading={
                        modalState.action === 'aceptar'
                            ? isAccepting === modalState.solicitud.id_solicitud
                            : isRejecting === modalState.solicitud.id_solicitud
                    }
                    details={
                        <div className="text-left space-y-2">
                            <p className="text-[var(--gray-100)] text-sm">
                                <span className="text-[var(--white)] font-semibold">Jugador:</span>{' '}
                                {modalState.solicitud.nombre_jugador}
                            </p>
                            <p className="text-[var(--gray-100)] text-sm">
                                <span className="text-[var(--white)] font-semibold">Equipo:</span>{' '}
                                {equipo.nombre}
                            </p>
                            <p className="text-[var(--gray-100)] text-sm">
                                <span className="text-[var(--white)] font-semibold">Categoría:</span>{' '}
                                {modalState.solicitud.nombre_categoria} • {modalState.solicitud.edicion}
                            </p>
                            {modalState.solicitud.tipo_solicitud === 'B' && (modalState.solicitud as SolicitudBajaResponse).motivo && (
                                <>
                                    <p className="text-[var(--gray-100)] text-sm">
                                        <span className="text-[var(--white)] font-semibold">Motivo:</span>{' '}
                                        {(modalState.solicitud as SolicitudBajaResponse).motivo}
                                    </p>
                                    {(modalState.solicitud as SolicitudBajaResponse).observaciones && (
                                        <p className="text-[var(--gray-100)] text-sm">
                                            <span className="text-[var(--white)] font-semibold">Observaciones:</span>{' '}
                                            {(modalState.solicitud as SolicitudBajaResponse).observaciones}
                                        </p>
                                    )}
                                </>
                            )}
                            {modalState.solicitud.mensaje_jugador && modalState.solicitud.tipo_solicitud !== 'B' && (
                                <p className="text-[var(--gray-100)] text-sm">
                                    <span className="text-[var(--white)] font-semibold">Mensaje:</span>{' '}
                                    {modalState.solicitud.mensaje_jugador}
                                </p>
                            )}
                        </div>
                    }
                />
            )}
        </div>
    );
}