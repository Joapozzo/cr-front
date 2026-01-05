import { useMemo } from 'react';
import { IncidenciaPartido, EstadoPartido } from '@/app/types/partido';
import { IncidenciaAgrupada, EquipoData } from '../types';
import {
    expandirAsistencias,
    detectarDobleAmarilla,
    asociarAsistenciasConGoles,
    agruparPorTiempo
} from '../utils/incidencias.utils';

interface UseIncidenciasProcessorParams {
    incidencias: IncidenciaPartido[];
    incidenciasCambios: IncidenciaPartido[];
    estadoPartido?: EstadoPartido;
    equipoLocal: EquipoData;
    equipoVisita: EquipoData;
    mode: 'view' | 'planillero';
}

export const useIncidenciasProcessor = ({
    incidencias,
    incidenciasCambios,
    estadoPartido
}: UseIncidenciasProcessorParams) => {
    // Crear lista de incidencias con asistencias expandidas para calcular acciones
    const incidenciasParaAcciones = useMemo(() => {
        return expandirAsistencias(incidencias);
    }, [incidencias]);

    // Procesar incidencias: separar asistencias, asociarlas con goles, combinar con cambios y agrupar por tiempos
    const incidenciasProcesadas = useMemo<IncidenciaAgrupada[]>(() => {
        // Separar asistencias (objetos con tipo 'asistencia')
        const incidenciasSinAsistencias = incidencias.filter(i => i.tipo !== 'asistencia');

        // Asociar asistencias con goles
        const asistenciasPorGol = asociarAsistenciasConGoles(incidencias);

        // Combinar incidencias con cambios
        const todasIncidencias = [
            ...incidenciasSinAsistencias,
            ...incidenciasCambios
        ];

        // Detectar doble amarilla
        const dobleAmarillaMap = detectarDobleAmarilla(todasIncidencias);

        // Asociar asistencias con goles y marcar doble amarilla
        const incidenciasOrdenadas = todasIncidencias
            .map(incidencia => {
                const dobleAmarilla = incidencia.id_jugador ? dobleAmarillaMap.get(incidencia.id_jugador) : null;
                const esSegundaAmarilla = !!(dobleAmarilla && incidencia.id === dobleAmarilla.segundaAmarilla.id);
                const esRojaDobleAmarilla = !!(dobleAmarilla && incidencia.id === dobleAmarilla.roja.id);
                
                return {
                    incidencia,
                    asistenciaRelacionada: incidencia.tipo === 'gol'
                        ? asistenciasPorGol.get(incidencia.id)
                        : undefined,
                    // Agrupar segunda amarilla con roja (tanto en planillero como en usuario)
                    segundaAmarillaRelacionada: esSegundaAmarilla && dobleAmarilla ? dobleAmarilla.roja : undefined,
                    rojaRelacionada: esRojaDobleAmarilla && dobleAmarilla ? dobleAmarilla.segundaAmarilla : undefined,
                    esDobleAmarilla: esSegundaAmarilla || esRojaDobleAmarilla ? true : undefined,
                    dobleAmarillaData: dobleAmarilla || undefined
                };
            })
            .sort((a, b) => (b.incidencia.minuto || 0) - (a.incidencia.minuto || 0)); // Orden inverso

        // Agrupar por tiempos
        return agruparPorTiempo(incidenciasOrdenadas, estadoPartido);
    }, [incidencias, incidenciasCambios, estadoPartido]);

    return {
        incidenciasProcesadas,
        incidenciasParaAcciones
    };
};

