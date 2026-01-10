import { useMemo } from 'react';
import { PartidoCompleto, IncidenciaPartido } from '../types/partido';

interface GolConAsistencia extends IncidenciaPartido {
    asistencia?: IncidenciaPartido;
}

export const usePartidoData = (partido: PartidoCompleto | null | undefined, incidencias: IncidenciaPartido[]) => {
    const golesLocal = useMemo(() => {
        if (!partido) return [];

        return incidencias
            .filter((incidencia) => {
                if (incidencia.tipo !== 'gol') return false;

                // if (incidencia.en_contra === 'S') {
                //     return incidencia.id_equipo === partido.equipoVisita?.id_equipo;
                // }
                return incidencia.id_equipo === partido.equipoLocal?.id_equipo;
            })
            .map(gol => {
                const asistencia = incidencias.find(
                    inc => inc.tipo === 'asistencia' && inc.id_gol === gol.id
                );
                return { ...gol, asistencia } as GolConAsistencia;
            });
            
    }, [incidencias, partido]);

    const golesVisita = useMemo(() => {
        if (!partido) return [];

        return incidencias
            .filter((incidencia) => {
                if (incidencia.tipo !== 'gol') return false;

                // if (incidencia.en_contra === 'S') {
                //     return incidencia.id_equipo === partido.equipoLocal?.id_equipo;
                // }
                return incidencia.id_equipo === partido.equipoVisita?.id_equipo;
            })
            .map(gol => {
                const asistencia = incidencias.find(
                    inc => inc.tipo === 'asistencia' && inc.id_gol === gol.id
                );
                return { ...gol, asistencia } as GolConAsistencia;
            });
    }, [incidencias, partido]);

    const tieneGoles = useMemo(() =>
        golesLocal.length > 0 || golesVisita.length > 0,
        [golesLocal.length, golesVisita.length]
    );

    const esPartidoActivo = useMemo(() =>
        partido ? ['C1', 'E', 'C2'].includes(partido.estado) : false,
        [partido]
    );

    const mostrarGoleadores = useMemo(() =>
        partido ? partido.estado !== 'P' && partido.estado !== 'A' && tieneGoles : false,
        [partido, tieneGoles]
    );

    return {
        golesLocal,
        golesVisita,
        tieneGoles,
        esPartidoActivo,
        mostrarGoleadores
    };
};