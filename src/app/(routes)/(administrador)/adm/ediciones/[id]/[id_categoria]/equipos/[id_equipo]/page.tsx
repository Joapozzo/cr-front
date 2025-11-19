'use client';

import { useState } from 'react';
import { Shield, Edit3, AlertTriangle, User, Loader2, Plus } from 'lucide-react';
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
import {
    useSolicitudesEquipo,
    useInvitacionesEnviadas,
    useConfirmarSolicitud,
    useRechazarSolicitud,
    useConfirmarInvitacion,
    useRechazarInvitacion
} from '@/app/hooks/useSolicitudesAdmin';

const LoadingState = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--blue)]" />
            <span className="text-[var(--gray-100)]">Cargando plantel...</span>
        </div>
    </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-6 text-center">
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
    console.log(invitaciones);
    
    // --- Hooks de Mutación de Mercado de Pases (Nuevos) ---
    const confirmarSolicitudMutation = useConfirmarSolicitud();
    const rechazarSolicitudMutation = useRechazarSolicitud();
    const confirmarInvitacionMutation = useConfirmarInvitacion();
    const rechazarInvitacionMutation = useRechazarInvitacion();

    // Lógica de Mutación Unificada para pasar al componente hijo
    const handleAceptarSolicitud = async (id_solicitud: number, id_jugador: number) => {
        await confirmarSolicitudMutation.mutateAsync({ id_solicitud, id_jugador });
    };
    const handleRechazarSolicitud = async (id: number) => {
        await rechazarSolicitudMutation.mutateAsync(id);
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
            confirmarInvitacionMutation.isPending ? confirmarInvitacionMutation.variables?.id_solicitud : null;

    const isRejecting =
        rechazarSolicitudMutation.isPending ? rechazarSolicitudMutation.variables :
            rechazarInvitacionMutation.isPending ? rechazarInvitacionMutation.variables : null;

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

    const { equipo, plantel, estadisticas } = response.data;
    const plantelColumns = getPlantelColumns();

    return (
        <div className="space-y-6">
            {/* Header del equipo */}
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[var(--gray-200)] rounded-full flex items-center justify-center">
                            {equipo.img ? (
                                <img
                                    src={equipo.img}
                                    alt={equipo.nombre}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            ) : (
                                <Shield className="w-8 h-8 text-[var(--gray-100)]" />
                            )}
                        </div>
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

            {/* Estadísticas del plantel */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--green)]/20 rounded-lg">
                            <User className="w-5 h-5 text-[var(--green)]" />
                        </div>
                        <div>
                            <p className="text-[var(--gray-100)] text-sm">Total Jugadores</p>
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
                        solicitudes={solicitudes}
                        invitaciones={invitaciones}
                        isLoadingSolicitudes={isLoadingSolicitudes}
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
                        Lista de buena fe ({estadisticas.total_jugadores} jugadores)
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
                isOpen={isEditarEquipoModalOpen}
                onClose={() => setIsEditarEquipoModalOpen(false)}
                equipo={{
                    id_equipo: equipo.id_equipo,
                    nombre: equipo.nombre,
                    descripcion: equipo.descripcion,
                    img: equipo.img,
                }}
                onSuccess={() => {
                    refetch(); // Recargar datos del equipo
                }}
            />
        </div>
    );
}