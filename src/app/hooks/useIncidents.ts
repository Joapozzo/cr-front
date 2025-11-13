import { useState, useMemo } from 'react';
import { IncidenciaPartido, Partido } from '../types/partido';

interface UseIncidentsLogicProps {
    incidencias: IncidenciaPartido[];
    partido: Partido;
}

export const useIncidentsLogic = ({ incidencias, partido }: UseIncidentsLogicProps) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [incidenciaAEliminar, setIncidenciaAEliminar] = useState<IncidenciaPartido | null>(null);

    const incidenciasSeguras = incidencias || [];

    const incidenciasAgrupadas = useMemo(() => {
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

    const handleOpenDeleteModal = (incidencia: IncidenciaPartido) => {
        setIncidenciaAEliminar(incidencia);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setIncidenciaAEliminar(null);
    };

    return {
        incidenciasAgrupadas,
        showDeleteModal,
        incidenciaAEliminar,
        handleOpenDeleteModal,
        handleCloseDeleteModal,
    };
};