'use client';
import { useState, useCallback } from 'react';
import ModalCrearPartido from '@/app/components/modals/ModalCrearPartido';
import ModalActualizarPartido from '@/app/components/modals/ModalActualizarPartido';
import ModalGenerarFixture from '@/app/components/modals/ModalGenerarFixture';
import { usePartidosPorJornadaYCategoria } from '@/app/hooks/usePartidosAdmin';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { DeleteModal } from '@/app/components/modals/ModalAdmin';
import DescriptionModal from '@/app/components/modals/DescripcionPartidoModal';
import { useJornadaNavigation } from '../../../../../../../hooks/useJornadaNavigation';
import { useFixtureModals } from '../../../../../../../hooks/useFixtureModals';
import { useEliminarPartidoFlow } from '../../../../../../../hooks/useEliminarPartidoFlow';
import { FixtureHeader } from '../../../../../../../components/admin/FixtureHeader';
import { JornadaNavigator } from '../../../../../../../components/admin/JornadaNavigator';
import { FixtureActions } from '../../../../../../../components/admin/FixtureActions';
import { FixtureTable } from '../../../../../../../components/admin/FixtureTable';
import { DreamTeamSection } from '../../../../../../../components/admin/DreamTeamSection';

export default function FixtureDreamTeamPage() {
    const { categoriaSeleccionada } = useCategoriaStore();
    const idCategoriaEdicion = Number(categoriaSeleccionada?.id_categoria_edicion);
    const [vistaActual, setVistaActual] = useState<'fixture' | 'dreamteam'>('fixture');
    const [isRefetch, setIsRefetch] = useState(false);
    const [isModalGenerarFixtureOpen, setIsModalGenerarFixtureOpen] = useState(false);

    // Query inicial para obtener totalJornadas (usando jornada 1)
    const {
        data: partidosInicial,
    } = usePartidosPorJornadaYCategoria(1, idCategoriaEdicion);

    // Hook de navegación de jornadas
    const totalJornadas = partidosInicial?.totalJornadas || 1;
    const {
        jornadaActual,
        jornadasDisponibles,
        indexActual,
        cambiarJornada,
    } = useJornadaNavigation({
        totalJornadas,
        initialJornada: 1,
    });

    // Query para obtener partidos de la jornada actual
    const {
        data: partidosPorJornada,
        isLoading,
        isError,
        refetch,
    } = usePartidosPorJornadaYCategoria(jornadaActual, idCategoriaEdicion);

    // Hook de modales
    const {
        modals,
        openModal,
        closeModal,
        partidoAEliminar,
        partidoAEditar,
        partidoDescripcion,
        handleEliminarPartido,
        handleEditarPartido,
        handleVerDescripcion,
        closeEditModal,
        closeDeleteModal,
        closeInfoModal,
    } = useFixtureModals();

    // Hook de eliminación
    const handleRefresh = useCallback(() => {
        setIsRefetch(true);
        refetch().finally(() => {
            setTimeout(() => {
                setIsRefetch(false);
            }, 500);
        });
    }, [refetch]);

    const {
        confirmarEliminacion,
        deleteError,
        resetDeleteMutation,
    } = useEliminarPartidoFlow({
        onSuccess: () => {
            handleRefresh();
            closeDeleteModal();
        },
    });

    // Handlers
    const handlePartidoCreado = () => {
        handleRefresh();
    };

    const handlePartidoActualizado = () => {
        handleRefresh();
        closeEditModal();
    };

    const handleConfirmarEliminacion = async () => {
        if (partidoAEliminar) {
            await confirmarEliminacion(partidoAEliminar.id_partido);
        }
    };

    return (
        <div className="space-y-6">
            <FixtureHeader categoriaNombre={categoriaSeleccionada?.nombre_completo} />

            <JornadaNavigator
                jornadaActual={jornadaActual}
                indexActual={indexActual}
                jornadasDisponibles={jornadasDisponibles}
                cambiarJornada={cambiarJornada}
                vistaActual={vistaActual}
                setVistaActual={setVistaActual}
            />

            {vistaActual === 'fixture' && (
                <FixtureActions
                    onCrearPartido={() => openModal('create')}
                    onGenerarFixture={() => setIsModalGenerarFixtureOpen(true)}
                    onRefresh={handleRefresh}
                    categoriaSeleccionada={!!categoriaSeleccionada}
                />
            )}

            {!categoriaSeleccionada && (
                <div className="bg-[var(--import)]/10 border border-[var(--import)]/30 rounded-lg p-4">
                    <p className="text-[var(--import)] text-sm">
                        Selecciona una categoría para ver y gestionar los partidos.
                    </p>
                </div>
            )}

            {vistaActual === 'fixture' ? (
                <FixtureTable
                    partidos={partidosPorJornada?.partidos || []}
                    onEliminarPartido={handleEliminarPartido}
                    onEditarPartido={handleEditarPartido}
                    onVerDescripcion={handleVerDescripcion}
                    isLoading={isLoading || isRefetch}
                />
            ) : (
                <DreamTeamSection
                    categoriaNombre={categoriaSeleccionada?.nombre_completo}
                    jornada={jornadaActual}
                    idCategoriaEdicion={idCategoriaEdicion}
                />
            )}

            <ModalCrearPartido
                isOpen={modals.create}
                onClose={() => closeModal('create')}
                jornada={jornadaActual}
                onSuccess={handlePartidoCreado}
            />

            <ModalActualizarPartido
                isOpen={modals.edit}
                onClose={closeEditModal}
                partido={partidoAEditar}
                onSuccess={handlePartidoActualizado}
            />

            <DeleteModal
                isOpen={modals.delete}
                onClose={() => {
                    resetDeleteMutation();
                    closeDeleteModal();
                }}
                title="Eliminar Partido"
                message="¿Estás seguro de que deseas eliminar este partido?"
                itemName={
                    partidoAEliminar
                        ? `${partidoAEliminar?.equipoLocal?.nombre || 'Equipo 1'} vs ${partidoAEliminar?.equipoVisita?.nombre || 'Equipo 2'} - Fecha ${partidoAEliminar?.jornada}`
                        : ''
                }
                onConfirm={handleConfirmarEliminacion}
                error={deleteError}
            />

            <DescriptionModal
                isOpen={modals.info}
                onClose={closeInfoModal}
                partido={partidoDescripcion}
            />

            <ModalGenerarFixture
                isOpen={isModalGenerarFixtureOpen}
                onClose={() => setIsModalGenerarFixtureOpen(false)}
                onSuccess={() => {
                    refetch();
                    setIsModalGenerarFixtureOpen(false);
                }}
            />

            {isError && (
                <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-4">
                    <p className="text-[var(--red)] text-sm">
                        Error al cargar los partidos. Intenta recargar la página.
                    </p>
                </div>
            )}
        </div>
    );
}