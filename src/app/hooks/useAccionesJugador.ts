import { IncidenciaPartido, JugadorPlantel } from '@/app/types/partido';

export interface AccionesJugador {
    goles: number;
    amarillas: number;
    rojas: number;
    asistencias: number;
    esDestacado: boolean;
}

/**
 * Función utilitaria para calcular las acciones de un jugador basado en las incidencias del partido
 * @param jugador - El jugador del cual calcular las acciones
 * @param incidencias - Array de incidencias del partido
 * @returns Objeto con las acciones calculadas del jugador
 */
export const calcularAccionesJugador = (
    jugador: JugadorPlantel,
    incidencias: IncidenciaPartido[]
): AccionesJugador => {
    const acciones: AccionesJugador = {
        goles: 0,
        amarillas: 0,
        rojas: 0,
        asistencias: 0,
        esDestacado: jugador.destacado
    };

    incidencias.forEach(inc => {
        if (inc.id_jugador === jugador.id_jugador) {
            switch (inc.tipo) {
                case 'gol':
                    if (inc.en_contra !== 'S') acciones.goles++;
                    break;
                case 'amarilla':
                    acciones.amarillas++;
                    break;
                case 'roja':
                case 'doble_amarilla':
                    acciones.rojas++;
                    break;
                case 'asistencia':
                    acciones.asistencias++;
                    break;
            }
        }
    });

    return acciones;
};

