import React from 'react';
import { BaseCard, CardHeader } from './BaseCard';
import { IncidenciaPartido, Partido } from '../types/partido';
import { ConfirmDeleteIncidentModal } from './modals/ModalAdmin';
import IncidentsSkeleton from './skeletons/CardIndicentsSkeleton';
import SingleIncident from './SingleIncident';
import IncidentsHeader from './IncidentsHeader';
import EmptyIncidents from './EmptyIncidents';
import { useIncidentsLogic } from '../hooks/useIncidents'; 
import { canShowActions } from '../utils/incidentsHelpers';

interface IncidentsProps {
    incidencias: IncidenciaPartido[];
    partido: Partido;
    onEditAction?: (action: IncidenciaPartido) => void;
    onDeleteAction?: (action: IncidenciaPartido) => void;
    loading?: boolean;
    showActions?: boolean;
    isLoadingDelete?: boolean;
}

const Incidents: React.FC<IncidentsProps> = ({
    incidencias,
    partido,
    onEditAction,
    onDeleteAction,
    loading = false,
    showActions = false,
    isLoadingDelete
}) => {
    const {
        incidenciasAgrupadas,
        showDeleteModal,
        incidenciaAEliminar,
        handleOpenDeleteModal,
        handleCloseDeleteModal,
    } = useIncidentsLogic({ incidencias, partido });

    const permitirAcciones = canShowActions(showActions, partido);

    const handleEditAction = (action: IncidenciaPartido) => {
        if (permitirAcciones && onEditAction) {
            onEditAction(action);
        }
    };

    const handleDeleteAction = (action: IncidenciaPartido) => {
        if (permitirAcciones) {
            handleOpenDeleteModal(action);
        }
    };

    const confirmarEliminacion = async (incidencia: IncidenciaPartido) => {
        try {
            await onDeleteAction?.(incidencia);
            handleCloseDeleteModal();
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

    if (loading || !partido) {
        return <IncidentsSkeleton />;
    }

    return (
        <BaseCard className="mx-auto w-full">
            <CardHeader title="Incidencias" />

            <div className="p-6">
                <IncidentsHeader partido={partido} />

                <div className="space-y-1">
                    {incidenciasAgrupadas.map((grupo) => {
                        if (grupo.tipo === 'gol') {
                            const gol = grupo.gol!;
                            const asistencia = grupo.asistencia;

                            return (
                                <div key={grupo.id} className="space-y-1">
                                    <SingleIncident
                                        incidencia={gol}
                                        partido={partido}
                                        showActions={permitirAcciones}
                                        onEdit={handleEditAction}
                                        onDelete={handleDeleteAction}
                                    />

                                    {asistencia && (
                                        <SingleIncident
                                            incidencia={asistencia}
                                            partido={partido}
                                            isAsistencia={true}
                                            showActions={false}
                                        />
                                    )}
                                </div>
                            );
                        } else {
                            const incidencia = grupo.incidencia!;

                            return (
                                <div key={grupo.id}>
                                    <SingleIncident
                                        incidencia={incidencia}
                                        partido={partido}
                                        showActions={permitirAcciones}
                                        onEdit={handleEditAction}
                                        onDelete={handleDeleteAction}
                                        segundaAmarillaRelacionada={grupo.segundaAmarillaRelacionada}
                                        rojaRelacionada={grupo.rojaRelacionada}
                                        esDobleAmarilla={grupo.esDobleAmarilla}
                                        dobleAmarillaData={grupo.dobleAmarillaData}
                                    />
                                </div>
                            );
                        }
                    })}
                </div>

                {incidencias.length === 0 && <EmptyIncidents />}
            </div>

            {incidenciaAEliminar && (
                <ConfirmDeleteIncidentModal
                    isOpen={showDeleteModal}
                    onClose={handleCloseDeleteModal}
                    tipoIncidencia={incidenciaAEliminar.tipo}
                    onConfirm={() => confirmarEliminacion(incidenciaAEliminar)}
                    isLoading={isLoadingDelete}
                />
            )}
        </BaseCard>
    );
};

export default Incidents;