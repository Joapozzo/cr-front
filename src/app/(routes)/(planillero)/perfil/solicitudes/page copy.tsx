'use client';

import { useUserStore } from '@/app/stores/userStore';
import { useState, useEffect } from 'react';
import Invitaciones from '@/app/components/Invitations';
import Solicitudes from '@/app/components/Request';
import Historial from '@/app/components/HistorialRequestInvitations';
import { Crown, User as UserIcon } from 'lucide-react';
import { Equipo } from '@/app/types/equipo';
import HistorialChat from '@/app/components/HistorialChat';
import { SolicitudEnviada } from '@/app/types/solicitudes';

export default function SolicitudesPage() {
    const { userData, userPlayer, isAuthenticated } = useUserStore();

    // Estados para datos
    const [invitaciones, setInvitaciones] = useState<SolicitudEnviada[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Determinar el rol del usuario
    const esCapitan = userData?.id_rol === 2; 
    const esJugador = !!userPlayer;

    // Funciones para manejar las acciones (implementar según tu API)
    const handleAcceptInvitation = async (id_invitacion: number) => {
        setIsLoading(true);
        try {
            // Llamada a la API para aceptar invitación
            console.log('Aceptando invitación:', id_invitacion);

            // Remover de invitaciones y agregar al historial
            setInvitaciones(prev => prev.filter(inv => inv.id_invitacion !== id_invitacion));

            // Actualizar historial (ejemplo)
            // await actualizarHistorial();

        } catch (error) {
            console.error('Error al aceptar invitación:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRejectInvitation = async (id_invitacion: number) => {
        setIsLoading(true);
        try {
            // Llamada a la API para rechazar invitación
            console.log('Rechazando invitación:', id_invitacion);

            // Remover de invitaciones
            setInvitaciones(prev => prev.filter(inv => inv.id_invitacion !== id_invitacion));

        } catch (error) {
            console.error('Error al rechazar invitación:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 px-6">
            {/* Header */}
            <div className="text-start mb-6 flex items-start justify-center flex-col gap-2 my-6">
                <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                    Solicitudes e Invitaciones
                </h1>
                <div className="flex items-center justify-center gap-2 text-sm">
                    {esCapitan && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-[var(--green)]/20 text-[var(--green)] rounded-full border border-[var(--green)]/30">
                            <Crown className="w-4 h-4" />
                            Capitán
                        </span>
                    )}
                    {esJugador && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                            <UserIcon className="w-4 h-4" />
                            Jugador
                        </span>
                    )}
                </div>
            </div>

            {/* Contenido según el rol */}
            {esJugador && (
                <>
                    {/* Invitaciones recibidas */}
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--white)] mb-3">
                            Invitaciones de Equipos
                        </h2>
                        <Invitaciones
                            onAcceptInvitation={handleAcceptInvitation}
                            onRejectInvitation={handleRejectInvitation}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Solicitudes enviadas */}
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--white)] mb-3">
                            Solicitar Unirse a Equipos
                        </h2>
                        <Solicitudes
                            id_edicion={id_edicion}
                            isLoading={isLoading}
                        />
                    </div>
                </>
            )}

            {/* Para capitanes - funcionalidad inversa */}
            {esCapitan && (
                <>
                    {/* Solicitudes recibidas de jugadores */}
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--white)] mb-3">
                            Solicitudes de Jugadores
                        </h2>
                        <div className="bg-[var(--card-background)] rounded-2xl border border-[var(--gray-300)] p-6">
                            <div className="text-center py-8">
                                <UserIcon className="w-12 h-12 text-[var(--gray-100)] mx-auto mb-3" />
                                <h3 className="text-[var(--white)] font-semibold text-lg mb-2">
                                    Solicitudes de Jugadores
                                </h3>
                                <p className="text-[var(--gray-100)] text-sm">
                                    Las solicitudes de jugadores para unirse a tus equipos aparecerán aquí
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Invitaciones enviadas a jugadores */}
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--white)] mb-3">
                            Invitar Jugadores
                        </h2>
                        <div className="bg-[var(--card-background)] rounded-2xl border border-[var(--gray-300)] p-6">
                            <div className="text-center py-8">
                                <Crown className="w-12 h-12 text-[var(--gray-100)] mx-auto mb-3" />
                                <h3 className="text-[var(--white)] font-semibold text-lg mb-2">
                                    Invitar Jugadores
                                </h3>
                                <p className="text-[var(--gray-100)] text-sm">
                                    Busca y envía invitaciones a jugadores para tus equipos
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Mensaje si no es jugador ni capitán */}
            {!esJugador && !esCapitan && (
                <div className="bg-[var(--card-background)] rounded-2xl border border-[var(--gray-300)] p-6">
                    <div className="text-center py-8">
                        <UserIcon className="w-12 h-12 text-[var(--gray-100)] mx-auto mb-3" />
                        <h3 className="text-[var(--white)] font-semibold text-lg mb-2">
                            Función no disponible
                        </h3>
                        <p className="text-[var(--gray-100)] text-sm">
                            Necesitas ser jugador registrado o capitán de equipo para acceder a las solicitudes
                        </p>
                    </div>
                </div>
            )}

            {/* Historial - Para todos los usuarios que tengan actividad */}
            {(esJugador || esCapitan) && (
                <HistorialChat isLoading={isLoading} />
            )}
        </div>
    );
}