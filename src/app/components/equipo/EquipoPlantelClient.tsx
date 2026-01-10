'use client';

import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { useEquipoConPlantel } from '@/app/hooks/useEquipos';
import {
    useSolicitudesEquipo,
    useInvitacionesEnviadas,
    useConfirmarSolicitud,
    useRechazarSolicitud,
    useConfirmarInvitacion,
    useRechazarInvitacion,
    useSolicitudesBajaEquipo,
    useConfirmarBajaJugador,
    useRechazarBajaJugador
} from '@/app/hooks/useSolicitudesAdmin';
import { equiposService } from '@/app/services/equipos.services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Button } from '@/app/components/ui/Button';
import EquipoHeader from './EquipoHeader';
import EquipoStatsCards from './EquipoStatsCards';
import CapitanesBlock from './CapitanesBlock';
import SolicitudesBlock from './SolicitudesBlock';
import PlantelTable from './PlantelTable';
import AgregarJugadorModal from '@/app/components/modals/ModalAgregarJugador';
import ModalEditarEquipo from '@/app/components/modals/ModalEditarEquipo';
import { ModalDarBajaJugador } from '@/app/components/modals/ModalDarBajaJugador';
import { ModalExpulsarJugador } from '@/app/components/modals/ModalExpulsarJugador';
import ModalApercibimientos from '@/app/components/modals/ModalApercibimientos';

const LoadingState = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--blue)]" />
            <span className="text-[var(--gray-100)]">Cargando plantel...</span>
        </div>
    </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-6 text-center flex flex-col items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-[var(--red)] mx-auto mb-3" />
        <h3 className="text-[var(--red)] font-medium mb-2">Error al cargar los datos</h3>
        <p className="text-[var(--red)]/80 text-sm mb-4">{message}</p>
        <Button variant="danger" onClick={onRetry}>
            Reintentar
        </Button>
    </div>
);

export default function EquipoPlantelClient() {
    const params = useParams();
    const { categoriaSeleccionada } = useCategoriaStore();
    const queryClient = useQueryClient();

    // Estado para los modales
    const [isAgregarJugadorModalOpen, setIsAgregarJugadorModalOpen] = useState(false);
    const [isEditarEquipoModalOpen, setIsEditarEquipoModalOpen] = useState(false);
    const [isDarBajaModalOpen, setIsDarBajaModalOpen] = useState(false);
    const [isExpulsarModalOpen, setIsExpulsarModalOpen] = useState(false);
    const [isApercibimientosModalOpen, setIsApercibimientosModalOpen] = useState(false);
    const [jugadorSeleccionado, setJugadorSeleccionado] = useState<{ id: number; nombre: string } | null>(null);
    const [imageTimestamp, setImageTimestamp] = useState(Date.now());

    // Priorizar el param de la URL sobre el store
    const idCategoriaEdicion = params?.id_categoria 
        ? Number(params.id_categoria) 
        : (categoriaSeleccionada?.id_categoria_edicion ? Number(categoriaSeleccionada.id_categoria_edicion) : 0);
    const idEquipo = Number(params.id_equipo);

    // Hook para obtener datos
    const {
        data: response,
        isLoading,
        error,
        refetch,
        isError
    } = useEquipoConPlantel(idEquipo, idCategoriaEdicion, {
        enabled: !!idCategoriaEdicion && !!idEquipo
    });

    // Hooks de solicitudes
    const { data: solicitudes, isLoading: isLoadingSolicitudes } = useSolicitudesEquipo(idEquipo, idCategoriaEdicion, {
        enabled: !!idCategoriaEdicion && !!idEquipo
    });
    const { data: invitaciones, isLoading: isLoadingInvitaciones } = useInvitacionesEnviadas(idEquipo, idCategoriaEdicion, {
        enabled: !!idCategoriaEdicion && !!idEquipo
    });
    const { data: solicitudesBaja, isLoading: isLoadingSolicitudesBaja } = useSolicitudesBajaEquipo(idEquipo, idCategoriaEdicion, {
        enabled: !!idCategoriaEdicion && !!idEquipo
    });

    // Hooks de mutación de solicitudes
    const confirmarSolicitudMutation = useConfirmarSolicitud();
    const rechazarSolicitudMutation = useRechazarSolicitud();
    const confirmarInvitacionMutation = useConfirmarInvitacion();
    const rechazarInvitacionMutation = useRechazarInvitacion();
    const confirmarBajaMutation = useConfirmarBajaJugador();
    const rechazarBajaMutation = useRechazarBajaJugador();

    // Mutaciones para dar de baja y expulsar
    const darBajaMutation = useMutation({
        mutationFn: async ({ id_jugador }: { id_jugador: number }) => {
            return await equiposService.darBajaJugadorPlantel(idEquipo, id_jugador, idCategoriaEdicion);
        },
        onSuccess: async () => {
            toast.success('Jugador dado de baja exitosamente');
            await queryClient.invalidateQueries({
                queryKey: ['equipos', 'detail', idEquipo, 'plantel', idCategoriaEdicion]
            });
            await refetch();
            setIsDarBajaModalOpen(false);
            setJugadorSeleccionado(null);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al dar de baja al jugador');
        }
    });

    const expulsarMutation = useMutation({
        mutationFn: async ({ id_jugador, motivo }: { id_jugador: number; motivo?: string }) => {
            return await equiposService.expulsarJugadorTorneo(id_jugador, motivo);
        },
        onSuccess: async () => {
            toast.success('Jugador expulsado exitosamente');
            await queryClient.invalidateQueries({
                queryKey: ['equipos', 'detail', idEquipo, 'plantel', idCategoriaEdicion]
            });
            await refetch();
            setIsExpulsarModalOpen(false);
            setJugadorSeleccionado(null);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al expulsar al jugador');
        }
    });

    // Combinar solicitudes de equipo y solicitudes de baja
    const solicitudesCombinadas = useMemo(
        () => [...(solicitudes || []), ...(solicitudesBaja || [])],
        [solicitudes, solicitudesBaja]
    );

    // Handlers de solicitudes
    const handleAceptarSolicitud = useCallback(
        async (id_solicitud: number, id_jugador: number) => {
            const solicitudBaja = solicitudesBaja?.find((s) => s.id_solicitud === id_solicitud);
            if (solicitudBaja && solicitudBaja.tipo_solicitud === 'B') {
                await confirmarBajaMutation.mutateAsync(id_solicitud);
            } else {
                await confirmarSolicitudMutation.mutateAsync({ id_solicitud, id_jugador });
            }
        },
        [solicitudesBaja, confirmarBajaMutation, confirmarSolicitudMutation]
    );

    const handleRechazarSolicitud = useCallback(
        async (id: number) => {
            const solicitudBaja = solicitudesBaja?.find((s) => s.id_solicitud === id);
            if (solicitudBaja && solicitudBaja.tipo_solicitud === 'B') {
                await rechazarBajaMutation.mutateAsync({ id_solicitud: id });
            } else {
                await rechazarSolicitudMutation.mutateAsync(id);
            }
        },
        [solicitudesBaja, rechazarBajaMutation, rechazarSolicitudMutation]
    );

    const handleAceptarInvitacion = useCallback(
        async (id_solicitud: number, id_jugador: number) => {
            await confirmarInvitacionMutation.mutateAsync({ id_solicitud, id_jugador });
        },
        [confirmarInvitacionMutation]
    );

    const handleRechazarInvitacion = useCallback(
        async (id: number) => {
            await rechazarInvitacionMutation.mutateAsync(id);
        },
        [rechazarInvitacionMutation]
    );

    // Estados de carga de mutaciones
    const isAccepting = useMemo(() => {
        if (confirmarSolicitudMutation.isPending && confirmarSolicitudMutation.variables)
            return confirmarSolicitudMutation.variables.id_solicitud;
        if (confirmarInvitacionMutation.isPending && confirmarInvitacionMutation.variables)
            return confirmarInvitacionMutation.variables.id_solicitud;
        if (confirmarBajaMutation.isPending && confirmarBajaMutation.variables)
            return confirmarBajaMutation.variables;
        return null;
    }, [
        confirmarSolicitudMutation.isPending,
        confirmarSolicitudMutation.variables,
        confirmarInvitacionMutation.isPending,
        confirmarInvitacionMutation.variables,
        confirmarBajaMutation.isPending,
        confirmarBajaMutation.variables
    ]);

    const isRejecting = useMemo(() => {
        if (rechazarSolicitudMutation.isPending) return rechazarSolicitudMutation.variables;
        if (rechazarInvitacionMutation.isPending) return rechazarInvitacionMutation.variables;
        if (rechazarBajaMutation.isPending && rechazarBajaMutation.variables)
            return rechazarBajaMutation.variables.id_solicitud;
        return null;
    }, [
        rechazarSolicitudMutation.isPending,
        rechazarSolicitudMutation.variables,
        rechazarInvitacionMutation.isPending,
        rechazarInvitacionMutation.variables,
        rechazarBajaMutation.isPending,
        rechazarBajaMutation.variables
    ]);

    // Handlers para acciones del plantel
    const handleDarBaja = useCallback(
        (id_jugador: number, nombre: string) => {
            setJugadorSeleccionado({ id: id_jugador, nombre });
            setIsDarBajaModalOpen(true);
        },
        []
    );

    const handleExpulsar = useCallback(
        (id_jugador: number, nombre: string) => {
            setJugadorSeleccionado({ id: id_jugador, nombre });
            setIsExpulsarModalOpen(true);
        },
        []
    );

    const handleEditSuccess = useCallback(async () => {
        await refetch();
        setImageTimestamp(Date.now());
    }, [refetch]);

    // Validaciones tempranas
    if (!idCategoriaEdicion) {
        return (
            <div className="bg-[var(--yellow)]/10 border border-[var(--yellow)]/30 rounded-lg p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-[var(--yellow)] mx-auto mb-3" />
                <h3 className="text-[var(--yellow)] font-medium">Categoría no seleccionada</h3>
                <p className="text-[var(--yellow)]/80 text-sm">Selecciona una categoría para ver el plantel.</p>
            </div>
        );
    }

    if (!idEquipo) {
        return (
            <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-[var(--red)] mx-auto mb-3" />
                <h3 className="text-[var(--red)] font-medium">Equipo no encontrado</h3>
                <p className="text-[var(--red)]/80 text-sm">El equipo solicitado no existe.</p>
            </div>
        );
    }

    // Estados de carga
    if (isLoading) return <LoadingState />;
    if (isError || !response?.data) {
        return (
            <ErrorState
                message={error?.message || 'No se pudieron cargar los datos del equipo'}
                onRetry={() => refetch()}
            />
        );
    }

    const { equipo, plantel, estadisticas, id_zona } = response.data;

    return (
        <div className="space-y-6">
            <EquipoHeader
                equipo={equipo}
                apercibimientos={estadisticas.apercibimientos || 0}
                onEditEquipo={() => setIsEditarEquipoModalOpen(true)}
                onApercibimientos={() => setIsApercibimientosModalOpen(true)}
            />

            <EquipoStatsCards estadisticas={estadisticas} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CapitanesBlock
                    plantel={plantel}
                    idEquipo={idEquipo}
                    idCategoriaEdicion={idCategoriaEdicion}
                    equipo={equipo}
                />

                <SolicitudesBlock
                    solicitudes={solicitudesCombinadas}
                    invitaciones={invitaciones || []}
                    isLoadingSolicitudes={isLoadingSolicitudes || isLoadingSolicitudesBaja}
                    isLoadingInvitaciones={isLoadingInvitaciones}
                    onAceptarSolicitud={handleAceptarSolicitud}
                    onRechazarSolicitud={handleRechazarSolicitud}
                    onAceptarInvitacion={handleAceptarInvitacion}
                    onRechazarInvitacion={handleRechazarInvitacion}
                    isAccepting={isAccepting}
                    isRejecting={isRejecting}
                    equipo={equipo}
                />
            </div>

            <PlantelTable
                plantel={plantel}
                totalJugadores={estadisticas.total_jugadores}
                onAddJugador={() => setIsAgregarJugadorModalOpen(true)}
                onDarBaja={handleDarBaja}
                onExpulsar={handleExpulsar}
            />

            {/* Modales */}
            <AgregarJugadorModal
                isOpen={isAgregarJugadorModalOpen}
                onClose={() => setIsAgregarJugadorModalOpen(false)}
                idEquipo={idEquipo}
                idCategoriaEdicion={idCategoriaEdicion}
                equipoNombre={equipo.nombre}
            />

            <ModalEditarEquipo
                key={`equipo-${equipo.id_equipo}-${equipo.img || 'no-img'}-${imageTimestamp}`}
                isOpen={isEditarEquipoModalOpen}
                onClose={() => setIsEditarEquipoModalOpen(false)}
                equipo={{
                    id_equipo: equipo.id_equipo,
                    nombre: equipo.nombre,
                    descripcion: equipo.descripcion,
                    img: equipo.img
                }}
                onSuccess={handleEditSuccess}
            />

            <ModalDarBajaJugador
                isOpen={isDarBajaModalOpen}
                onClose={() => {
                    setIsDarBajaModalOpen(false);
                    setJugadorSeleccionado(null);
                }}
                onConfirm={async () => {
                    if (jugadorSeleccionado) {
                        await darBajaMutation.mutateAsync({ id_jugador: jugadorSeleccionado.id });
                    }
                }}
                jugadorNombre={jugadorSeleccionado?.nombre || ''}
                isLoading={darBajaMutation.isPending}
            />

            <ModalExpulsarJugador
                isOpen={isExpulsarModalOpen}
                onClose={() => {
                    setIsExpulsarModalOpen(false);
                    setJugadorSeleccionado(null);
                }}
                onConfirm={async (motivo) => {
                    if (jugadorSeleccionado) {
                        await expulsarMutation.mutateAsync({ id_jugador: jugadorSeleccionado.id, motivo });
                    }
                }}
                jugadorNombre={jugadorSeleccionado?.nombre || ''}
                isLoading={expulsarMutation.isPending}
                esExpulsado={false}
            />

            {id_zona && (
                <ModalApercibimientos
                    isOpen={isApercibimientosModalOpen}
                    onClose={() => setIsApercibimientosModalOpen(false)}
                    idEquipo={idEquipo}
                    idCategoriaEdicion={idCategoriaEdicion}
                    idZona={id_zona}
                    apercibimientosActuales={estadisticas.apercibimientos || 0}
                    equipoNombre={equipo.nombre}
                />
            )}
        </div>
    );
}

