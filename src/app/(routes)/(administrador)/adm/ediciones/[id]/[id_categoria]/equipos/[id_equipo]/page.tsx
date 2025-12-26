'use client';

import { useState } from 'react';
import { Edit3, AlertTriangle, User, Loader2, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { DataTable } from '@/app/components/ui/DataTable';
import { useParams } from 'next/navigation';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { useEquipoConPlantel } from '@/app/hooks/useEquipos';
import getPlantelColumns from '@/app/components/columns/PlantelesColumns';
import CapitanesManager from '@/app/components/CapitanesManager';
import AgregarJugadorModal from '@/app/components/modals/ModalAgregarJugador';
import PanelSolicitudesAdmin from '@/app/components/PanelSolicitudesAdmin';
import ModalEditarEquipo from '@/app/components/modals/ModalEditarEquipo';
import { ModalDarBajaJugador } from '@/app/components/modals/ModalDarBajaJugador';
import { ModalExpulsarJugador } from '@/app/components/modals/ModalExpulsarJugador';
import { equiposService } from '@/app/services/equipos.services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
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
import { EscudoEquipo } from '@/app/components/common/EscudoEquipo';
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

export default function EquipoPlantelPage() {
    const params = useParams();
    const { categoriaSeleccionada } = useCategoriaStore();

    // Estado para los modales
    const [isAgregarJugadorModalOpen, setIsAgregarJugadorModalOpen] = useState(false);
    const [isEditarEquipoModalOpen, setIsEditarEquipoModalOpen] = useState(false);
    const [isDarBajaModalOpen, setIsDarBajaModalOpen] = useState(false);
    const [isExpulsarModalOpen, setIsExpulsarModalOpen] = useState(false);
    const [isApercibimientosModalOpen, setIsApercibimientosModalOpen] = useState(false);
    const [jugadorSeleccionado, setJugadorSeleccionado] = useState<{ id: number; nombre: string } | null>(null);

    // Estado para forzar actualización de imagen (evitar caché)
    const [imageTimestamp, setImageTimestamp] = useState(Date.now());

    const queryClient = useQueryClient();

    // Mutaciones para dar de baja y expulsar
    const darBajaMutation = useMutation({
        mutationFn: async ({ id_jugador }: { id_jugador: number }) => {
            return await equiposService.darBajaJugadorPlantel(idEquipo, id_jugador, idCategoriaEdicion);
        },
        onSuccess: async () => {
            toast.success('Jugador dado de baja exitosamente');
            // Invalidar y refrescar inmediatamente el plantel
            await queryClient.invalidateQueries({
                queryKey: ['equipos', 'detail', idEquipo, 'plantel', idCategoriaEdicion]
            });
            // Forzar refetch inmediato
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
            // Invalidar y refrescar inmediatamente el plantel
            await queryClient.invalidateQueries({
                queryKey: ['equipos', 'detail', idEquipo, 'plantel', idCategoriaEdicion]
            });
            // Forzar refetch inmediato
            await refetch();
            setIsExpulsarModalOpen(false);
            setJugadorSeleccionado(null);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al expulsar al jugador');
        }
    });

    const idCategoriaEdicion = Number(categoriaSeleccionada?.id_categoria_edicion);
    const idEquipo = Number(params.id_equipo);

    // Hook para obtener datos
    const {
        data: response,
        isLoading,
        error,
        refetch,
        isError
    } = useEquipoConPlantel(idEquipo, idCategoriaEdicion);

    // --- Hooks de Mercado de Pases (Nuevos) ---
    const { data: solicitudes, isLoading: isLoadingSolicitudes } = useSolicitudesEquipo(idEquipo, idCategoriaEdicion);
    const { data: invitaciones, isLoading: isLoadingInvitaciones } = useInvitacionesEnviadas(idEquipo, idCategoriaEdicion);
    const { data: solicitudesBaja, isLoading: isLoadingSolicitudesBaja } = useSolicitudesBajaEquipo(idEquipo, idCategoriaEdicion);

    // --- Hooks de Mutación de Mercado de Pases (Nuevos) ---
    const confirmarSolicitudMutation = useConfirmarSolicitud();
    const rechazarSolicitudMutation = useRechazarSolicitud();
    const confirmarInvitacionMutation = useConfirmarInvitacion();
    const rechazarInvitacionMutation = useRechazarInvitacion();
    const confirmarBajaMutation = useConfirmarBajaJugador();
    const rechazarBajaMutation = useRechazarBajaJugador();

    // Combinar solicitudes de equipo y solicitudes de baja
    const solicitudesCombinadas = [
        ...(solicitudes || []),
        ...(solicitudesBaja || [])
    ];

    // Lógica de Mutación Unificada para pasar al componente hijo
    const handleAceptarSolicitud = async (id_solicitud: number, id_jugador: number) => {
        // Verificar si es una solicitud de baja
        const solicitudBaja = solicitudesBaja?.find(s => s.id_solicitud === id_solicitud);
        if (solicitudBaja && solicitudBaja.tipo_solicitud === 'B') {
            await confirmarBajaMutation.mutateAsync(id_solicitud);
        } else {
            await confirmarSolicitudMutation.mutateAsync({ id_solicitud, id_jugador });
        }
    };
    const handleRechazarSolicitud = async (id: number) => {
        // Verificar si es una solicitud de baja
        const solicitudBaja = solicitudesBaja?.find(s => s.id_solicitud === id);
        if (solicitudBaja && solicitudBaja.tipo_solicitud === 'B') {
            await rechazarBajaMutation.mutateAsync({ id_solicitud: id });
        } else {
            await rechazarSolicitudMutation.mutateAsync(id);
        }
    };
    const handleAceptarInvitacion = async (id_solicitud: number, id_jugador: number) => {
        await confirmarInvitacionMutation.mutateAsync({ id_solicitud, id_jugador });
    };
    const handleRechazarInvitacion = async (id: number) => {
        await rechazarInvitacionMutation.mutateAsync(id);
    };

    // Estados de Carga de Mutación
    const isAccepting =
        confirmarSolicitudMutation.isPending ? confirmarSolicitudMutation.variables?.id_solicitud :
            confirmarInvitacionMutation.isPending ? confirmarInvitacionMutation.variables?.id_solicitud :
                confirmarBajaMutation.isPending ? confirmarBajaMutation.variables : null;

    const isRejecting =
        rechazarSolicitudMutation.isPending ? rechazarSolicitudMutation.variables :
            rechazarInvitacionMutation.isPending ? rechazarInvitacionMutation.variables :
                rechazarBajaMutation.isPending ? rechazarBajaMutation.variables?.id_solicitud : null;

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
        return <ErrorState
            message={error?.message || 'No se pudieron cargar los datos del equipo'}
            onRetry={() => refetch()}
        />;
    }

    const { equipo, plantel, estadisticas, id_zona } = response.data;

    // Handlers para acciones del plantel
    const handleDarBaja = (id_jugador: number, nombre: string) => {
        setJugadorSeleccionado({ id: id_jugador, nombre });
        setIsDarBajaModalOpen(true);
    };

    const handleExpulsar = (id_jugador: number, nombre: string) => {
        setJugadorSeleccionado({ id: id_jugador, nombre });
        setIsExpulsarModalOpen(true);
    };

    const plantelColumns = getPlantelColumns({
        onDarBaja: handleDarBaja,
        onExpulsar: handleExpulsar
    });

    return (
        <div className="space-y-6">
            {/* Header del equipo */}
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <EscudoEquipo
                            src={equipo.img}
                            alt={equipo.nombre}
                            width={64}
                            height={64}
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--white)]">
                                {equipo.nombre}
                            </h1>
                            {equipo.descripcion && (
                                <p className="text-[var(--gray-100)] text-sm mt-1">
                                    {equipo.descripcion}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="success"
                            onClick={() => setIsApercibimientosModalOpen(true)}
                            className="flex items-center gap-2"
                        >
                            <AlertTriangle className="w-4 h-4" />
                            Apercibimientos ({estadisticas.apercibimientos || 0})
                        </Button>
                        <Button
                            variant="success"
                            onClick={() => setIsEditarEquipoModalOpen(true)}
                            className="flex items-center gap-2"
                        >
                            <Edit3 className="w-4 h-4" />
                            Editar equipo
                        </Button>
                    </div>
                </div>
            </div>

            {/* Estadísticas del plantel */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--green)]/20 rounded-lg">
                            <User className="w-5 h-5 text-[var(--green)]" />
                        </div>
                        <div>
                            <p className="text-[var(--gray-100)] text-sm">Total jugadores</p>
                            <p className="text-[var(--white)] text-xl font-bold">
                                {estadisticas.total_jugadores}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--yellow)]/20 rounded-lg">
                            <User className="w-5 h-5 text-[var(--yellow)]" />
                        </div>
                        <div>
                            <p className="text-[var(--gray-100)] text-sm">Capitanes</p>
                            <p className="text-[var(--white)] text-xl font-bold">
                                {estadisticas.capitanes || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--blue)]/20 rounded-lg">
                            <User className="w-5 h-5 text-[var(--blue)]" />
                        </div>
                        <div>
                            <p className="text-[var(--gray-100)] text-sm">Eventuales</p>
                            <p className="text-[var(--white)] text-xl font-bold">
                                {estadisticas.jugadores_eventuales}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--red)]/20 rounded-lg">
                            <User className="w-5 h-5 text-[var(--red)]" />
                        </div>
                        <div>
                            <p className="text-[var(--gray-100)] text-sm">Sancionados</p>
                            <p className="text-[var(--white)] text-xl font-bold">
                                {estadisticas.jugadores_sancionados}
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Gestión de Capitanes */}
                <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                    <CapitanesManager
                        plantel={plantel}
                        idEquipo={idEquipo}
                        idCategoriaEdicion={idCategoriaEdicion}
                        equipoNombre={equipo.nombre}
                    />
                </div>

                <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                    <PanelSolicitudesAdmin
                        solicitudes={solicitudesCombinadas}
                        invitaciones={invitaciones}
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
            </div>

            {/* Acciones del plantel */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-[var(--white)] mb-1">
                        Lista de buena fé ({estadisticas.total_jugadores}) {estadisticas.total_jugadores > 1 ? 'jugadores' : 'jugador'}
                    </h2>
                    <p className="text-[var(--gray-100)] text-sm">
                        Gestiona los jugadores del plantel
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="success"
                        onClick={() => setIsAgregarJugadorModalOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Agregar jugador
                    </Button>
                </div>
            </div>

            {/* Tabla del plantel */}
            <DataTable
                data={plantel}
                columns={plantelColumns}
                emptyMessage="No se encontraron jugadores en el plantel."
            />

            {/* Modal para agregar jugador */}
            <AgregarJugadorModal
                isOpen={isAgregarJugadorModalOpen}
                onClose={() => setIsAgregarJugadorModalOpen(false)}
                idEquipo={idEquipo}
                idCategoriaEdicion={idCategoriaEdicion}
                equipoNombre={equipo.nombre}
            />

            {/* Modal para editar equipo */}
            <ModalEditarEquipo
                key={`equipo-${equipo.id_equipo}-${equipo.img || 'no-img'}`} // Forzar re-render cuando cambia la imagen
                isOpen={isEditarEquipoModalOpen}
                onClose={() => setIsEditarEquipoModalOpen(false)}
                equipo={{
                    id_equipo: equipo.id_equipo,
                    nombre: equipo.nombre,
                    descripcion: equipo.descripcion,
                    img: equipo.img,
                }}
                onSuccess={async () => {
                    // Recargar datos del equipo para obtener la imagen actualizada
                    await refetch();
                    // Forzar actualización de imagen evitando caché
                    setImageTimestamp(Date.now());
                }}
            />

            {/* Modal para dar de baja jugador */}
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

            {/* Modal para expulsar jugador */}
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

            {/* Modal para gestionar apercibimientos */}
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