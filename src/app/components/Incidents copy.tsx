import React, { useState } from 'react';
import { Edit, X, Shield } from 'lucide-react';
import { TbRectangleVerticalFilled } from "react-icons/tb";
import { GiSoccerKick } from "react-icons/gi";
import { BaseCard, CardHeader } from './BaseCard';
import { IncidenciaPartido, Partido } from '../types/partido';
import { PiSoccerBallFill } from "react-icons/pi";
import IncidentsSkeleton from './skeletons/CardIndicentsSkeleton';
import ConfirmDeleteIncidentModal from './modals/ConfirmDeleteIncidentModal.';

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
    isLoadingDelete,
    showActions = false
}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [incidenciaAEliminar, setIncidenciaAEliminar] = useState<IncidenciaPartido | null>(null);

    const permitirAcciones = showActions && ['P', 'C', 'T', 'C1', 'E', 'C2', 'F'].includes(partido?.estado);

    const incidenciasSeguras = incidencias || [];

    const incidenciasAgrupadas = React.useMemo(() => {
        const grupos: Array<{
            tipo: 'gol' | 'incidencia';
            gol?: IncidenciaPartido;
            asistencia?: IncidenciaPartido;
            incidencia?: IncidenciaPartido;
            id: string;
        }> = [];

        const goles = incidenciasSeguras.filter(inc => inc.tipo === 'gol');
        const asistencias = incidenciasSeguras.filter(inc => inc.tipo === 'asistencia');
        const otrasIncidencias = incidenciasSeguras.filter(inc => inc.tipo !== 'gol' && inc.tipo !== 'asistencia');

        goles.forEach(gol => {
            const asistenciaAsociada = asistencias.find(asist => asist.id_gol === gol.id);
            grupos.push({
                tipo: 'gol',
                gol,
                asistencia: asistenciaAsociada,
                id: `gol-${gol.id}`
            });
        });

        otrasIncidencias.forEach(inc => {
            grupos.push({
                tipo: 'incidencia',
                incidencia: inc,
                id: `inc-${inc.id}`
            });
        });

        return grupos.sort((a, b) => {
            const minutoA = a.gol?.minuto || a.incidencia?.minuto || 0;
            const minutoB = b.gol?.minuto || b.incidencia?.minuto || 0;
            return minutoA - minutoB;
        });
    }, [incidenciasSeguras]);

    const renderActionIcon = (action: IncidenciaPartido) => {
        switch (action.tipo) {
            case 'gol':
                return <PiSoccerBallFill className="w-4 h-4 text-[var(--green)] fill-current" />;
            case 'amarilla':
                return <TbRectangleVerticalFilled className="w-4 h-4 text-yellow-500" />;
            case 'roja':
                return <TbRectangleVerticalFilled className="w-4 h-4 text-red-500" />;
            case 'doble_amarilla':
                return (
                    <div className="flex gap-0.5">
                        <TbRectangleVerticalFilled className="w-3 h-3 text-yellow-500" />
                        <TbRectangleVerticalFilled className="w-3 h-3 text-yellow-500" />
                    </div>
                );
            case 'asistencia':
                return <GiSoccerKick className="w-4 h-4 text-[var(--green)]" />;
            default:
                return null;
        }
    };

    const handleEditAction = (action: IncidenciaPartido) => {
        if (permitirAcciones && onEditAction) {
            (action);

            onEditAction(action);
        }
    };

    const handleDeleteAction = (action: IncidenciaPartido) => {
        if (permitirAcciones) {
            setIncidenciaAEliminar(action);
            setShowDeleteModal(true);
        }
    };

    const renderIncidencia = (action: IncidenciaPartido, isLocal: boolean, isAsistencia: boolean = false) => {
        return (
            <div
                className={`flex items-center w-full py-2 px-3 rounded-lg transition-colors ${isLocal ? 'justify-start' : 'justify-end bg-[#171717]'
                    } ${isAsistencia ? 'opacity-70' : ''}`}
            >
                {isLocal ? (
                    // Layout para equipo local (izquierda)
                    <>
                        {/* Minuto */}
                        <span className={`font-semibold text-sm min-w-[32px] ${isAsistencia ? 'text-[#737373]' : 'text-white'}`}>
                            {isAsistencia ? '' : `${action.minuto}'`}
                        </span>

                        {/* Icono de la acción */}
                        <div className="flex items-center justify-center mx-3">
                            {renderActionIcon(action)}
                        </div>

                        {/* Información del jugador */}
                        <div className="flex-1">
                            <span className={`font-medium text-sm ${isAsistencia ? 'text-[#737373]' : 'text-white'}`}>
                                {action.nombre} {action.apellido}
                                {action.tipo === 'gol' && action.en_contra === 'S' && (
                                    <span className="text-red-400 ml-1">(e.c)</span>
                                )}
                                {action.tipo === 'gol' && action.penal === 'S' && (
                                    <span className="text-yellow-400 ml-1">(p)</span>
                                )}
                            </span>
                        </div>

                        {/* Botones de acción al final - Solo para planillero */}
                        {permitirAcciones && !isAsistencia && (
                            <div className="flex items-center gap-1 ml-auto">
                                <button
                                    onClick={() => handleEditAction(action)}
                                    className="p-1.5 hover:bg-[#262626] rounded transition-colors"
                                    title="Editar"
                                >
                                    <Edit className="w-4 h-4 text-[#737373] hover:text-white" />
                                </button>
                                <button
                                    onClick={() => handleDeleteAction(action)}
                                    className="p-1.5 hover:bg-[#262626] rounded transition-colors"
                                    title="Eliminar"
                                >
                                    <X className="w-4 h-4 text-red-500 hover:text-red-400" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    // Layout para equipo visitante (derecha)
                    <>
                        {/* Botones de acción al inicio - Solo para planillero */}
                        {permitirAcciones && !isAsistencia && (
                            <div className="flex items-center gap-1 mr-auto">
                                <button
                                    onClick={() => handleEditAction(action)}
                                    className="p-1.5 hover:bg-[#262626] rounded transition-colors"
                                    title="Editar"
                                >
                                    <Edit className="w-4 h-4 text-[#737373] hover:text-white" />
                                </button>
                                <button
                                    onClick={() => handleDeleteAction(action)}
                                    className="p-1.5 hover:bg-[#262626] rounded transition-colors"
                                    title="Eliminar"
                                >
                                    <X className="w-4 h-4 text-red-500 hover:text-red-400" />
                                </button>
                            </div>
                        )}

                        {/* Información del jugador */}
                        <div className="flex-1 text-right">
                            <span className={`font-medium text-sm ${isAsistencia ? 'text-[#737373]' : 'text-white'}`}>
                                {action.nombre} {action.apellido}
                                {action.tipo === 'gol' && action.en_contra === 'S' && (
                                    <span className="text-red-400 ml-1">(e.c)</span>
                                )}
                                {action.tipo === 'gol' && action.penal === 'S' && (
                                    <span className="text-yellow-400 ml-1">(p)</span>
                                )}
                            </span>
                        </div>

                        {/* Icono de la acción */}
                        <div className="flex items-center justify-center mx-3">
                            {renderActionIcon(action)}
                        </div>

                        {/* Minuto */}
                        <span className={`font-semibold text-sm min-w-[32px] text-right ${isAsistencia ? 'text-[#737373]' : 'text-white'}`}>
                            {isAsistencia ? '' : `${action.minuto}'`}
                        </span>
                    </>
                )}
            </div>
        );
    };

    const cerrarModal = () => {
        setShowDeleteModal(false);
        setIncidenciaAEliminar(null);
    };

    const confirmarEliminacion = async (incidencia: IncidenciaPartido) => {
        try {
            await onDeleteAction?.(incidencia); // Esperar a que termine
            // Solo cerrar si la operación fue exitosa
            setShowDeleteModal(false);
            setIncidenciaAEliminar(null);
        } catch (error) {
            // Si hay error, no cerrar el modal
            console.error('Error al eliminar:', error);
        }
    };

    if (loading || !partido) {
        return <IncidentsSkeleton />;
    }

    return (
        <BaseCard className="max-w-2xl mx-auto w-full">
            <CardHeader title="Incidencias" />

            <div className="p-6">
                {/* Header con nombres de equipos */}
                <div className="flex items-center justify-between mb-6 text-sm text-[#737373]">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span className="font-medium">{partido.equipoLocal.nombre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{partido.equipoVisita.nombre}</span>
                        <Shield className="w-4 h-4" />
                    </div>
                </div>

                {/* Lista de incidencias agrupadas */}
                <div className="space-y-1">
                    {incidenciasAgrupadas.map((grupo) => {
                        if (grupo.tipo === 'gol') {
                            const gol = grupo.gol!;
                            const asistencia = grupo.asistencia;
                            const isLocal = gol.id_equipo === partido.equipoLocal.id_equipo;

                            return (
                                <div key={grupo.id} className="space-y-1">
                                    {/* Renderizar el gol */}
                                    {renderIncidencia(gol, isLocal)}

                                    {/* Renderizar la asistencia si existe */}
                                    {asistencia && renderIncidencia(asistencia, isLocal, true)}
                                </div>
                            );
                        } else {
                            // Renderizar otras incidencias
                            const incidencia = grupo.incidencia!;
                            const isLocal = incidencia.id_equipo === partido.equipoLocal.id_equipo;

                            return (
                                <div key={grupo.id}>
                                    {renderIncidencia(incidencia, isLocal)}
                                </div>
                            );
                        }
                    })}
                </div>

                {incidencias.length === 0 && (
                    <div className="text-center py-8 text-[#737373]">
                        <p>No hay incidencias registradas</p>
                    </div>
                )}
            </div>
            <ConfirmDeleteIncidentModal
                isOpen={showDeleteModal}
                onClose={cerrarModal}
                incidencia={incidenciaAEliminar}
                onConfirm={confirmarEliminacion}
                isLoading={isLoadingDelete}
            />
        </BaseCard>
    );
};

export default Incidents;