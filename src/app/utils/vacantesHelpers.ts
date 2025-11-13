import { Zona } from '../types/zonas';
import { Temporada } from '../types/temporada';
import { PartidoZona as Partido } from '../types/partido';

export interface VacanteInfo {
    isOcupada: boolean;
    label: string;
    tipo: 'equipo_directo' | 'automatizacion_posicion' | 'automatizacion_partido' | 'vacia';
    detalles?: {
        equipoNombre?: string;
        zonaPrevia?: string;
        posicionPrevia?: number;
        partidoInfo?: string;
        resultado?: 'ganador' | 'perdedor';
    };
}

export const obtenerInfoVacante = (
    vacante: number,
    temporada: Temporada | undefined,
    partido?: Partido
): VacanteInfo => {
    // CASO 1: Equipo asignado directamente en temporada
    if (temporada?.id_equipo) {
        return {
            isOcupada: true,
            label: temporada.equipo?.nombre || 'Equipo asignado',
            tipo: 'equipo_directo',
            detalles: {
                equipoNombre: temporada.equipo?.nombre
            }
        };
    }

    // CASO 2: Automatización por posición (Todos contra todos → siguiente fase)
    if (temporada?.id_zona_previa && temporada?.pos_zona_previa) {
        return {
            isOcupada: true,
            label: `${temporada.pos_zona_previa}° ${temporada.zonaPreviaRef?.nombre || 'zona anterior'}`,
            tipo: 'automatizacion_posicion',
            detalles: {
                zonaPrevia: temporada.zonaPreviaRef?.nombre,
                posicionPrevia: temporada.pos_zona_previa
            }
        };
    }

    if (partido) {
        const esLocal = partido.vacante_local === vacante;
        const esVisita = partido.vacante_visita === vacante;

        if (esLocal && partido.id_partido_previo_local && partido.res_partido_previo_local) {
            const resultado = partido.res_partido_previo_local === 'G' ? 'Ganador' : 'Perdedor';
            // ✅ Usar nomenclatura del backend
            const nomenclatura = partido.nomenclatura_partido_previo_local || 'Cruce anterior';

            return {
                isOcupada: true,
                label: `${resultado} ${nomenclatura}`,
                tipo: 'automatizacion_partido',
                detalles: {
                    partidoInfo: nomenclatura,
                    resultado: resultado === 'Ganador' ? 'ganador' : 'perdedor'
                }
            };
        }

        if (esVisita && partido.id_partido_previo_visita && partido.res_partido_previo_visita) {
            const resultado = partido.res_partido_previo_visita === 'G' ? 'Ganador' : 'Perdedor';
            // ✅ Usar nomenclatura del backend
            const nomenclatura = partido.nomenclatura_partido_previo_visita || 'Cruce anterior';

            return {
                isOcupada: true,
                label: `${resultado} ${nomenclatura}`,
                tipo: 'automatizacion_partido',
                detalles: {
                    partidoInfo: nomenclatura,
                    resultado: resultado === 'Ganador' ? 'ganador' : 'perdedor'
                }
            };
        }
    }

    // CASO 4: Vacante vacía
    return {
        isOcupada: false,
        label: 'Seleccionar equipo',
        tipo: 'vacia'
    };
};

export const calcularVacantesOcupadas = (zona: Zona): number => {
    const temporadas = zona.temporadas || [];
    const partidos = zona.partidos || [];

    let ocupadas = 0;

    temporadas.forEach(temporada => {
        // Buscar el partido correspondiente si es eliminación directa
        const partido = partidos.find(
            p => p.vacante_local === temporada.vacante || p.vacante_visita === temporada.vacante
        );

        const info = obtenerInfoVacante(temporada.vacante, temporada, partido);
        if (info.isOcupada) {
            ocupadas++;
        }
    });

    return ocupadas;
};

export const obtenerLabelVacante = (
    vacante: number,
    temporada: Temporada | undefined,
    partido?: Partido
): string => {
    const info = obtenerInfoVacante(vacante, temporada, partido);
    return info.label;
};

export const tieneAutomatizacion = (
    temporada: Temporada | undefined,
    partido?: Partido,
    vacante?: number
): boolean => {
    const info = obtenerInfoVacante(vacante || 0, temporada, partido);
    return info.tipo === 'automatizacion_posicion' || info.tipo === 'automatizacion_partido';
};