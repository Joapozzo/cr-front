import { IncidenciaPartido, JugadorPlantel } from "../types/partido";

export const calcularAccionesJugador = (jugador: JugadorPlantel, incidencias: IncidenciaPartido[]) => {
    const acciones = {
        goles: 0,
        amarillas: 0,
        rojas: 0,
        asistencias: 0,
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

export const esJugadorDestacado = (jugadorId: number, equipoId: number, destacados: any[] = []) => {
    return destacados?.some(d => d.id_jugador === jugadorId && d.id_equipo === equipoId) || false;
};
