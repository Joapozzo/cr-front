import { IncidenciaPartido, JugadorPlantel } from "../types/partido";

export const calcularAccionesJugador = (jugador: JugadorPlantel, incidencias: IncidenciaPartido[]) => {
    const acciones = {
        goles: 0,
        amarillas: 0,
        rojas: 0,
        asistencias: 0,
    };

    // Detectar doble amarilla: 2 amarillas + 1 roja/doble_amarilla del mismo jugador
    const amarillasJugador = incidencias.filter(inc => 
        inc.id_jugador === jugador.id_jugador && inc.tipo === 'amarilla'
    );
    const rojasJugador = incidencias.filter(inc => 
        inc.id_jugador === jugador.id_jugador && (inc.tipo === 'roja' || inc.tipo === 'doble_amarilla')
    );
    
    const esDobleAmarilla = amarillasJugador.length === 2 && rojasJugador.length > 0;
    
    // Si es doble amarilla, identificar la roja/doble_amarilla relacionada
    let rojaDobleAmarillaId: number | null = null;
    if (esDobleAmarilla) {
        const amarillasOrdenadas = [...amarillasJugador].sort((a, b) => (a.minuto || 0) - (b.minuto || 0));
        const segundaAmarilla = amarillasOrdenadas[1];
        // Buscar la roja/doble_amarilla más cercana a la segunda amarilla
        const rojaRelacionada = rojasJugador.find(r => 
            (r.minuto || 0) >= (segundaAmarilla.minuto || 0)
        ) || rojasJugador[0];
        rojaDobleAmarillaId = rojaRelacionada.id;
    }

    incidencias.forEach(inc => {
        // Solo procesar incidencias del jugador
        if (inc.id_jugador === jugador.id_jugador) {
            switch (inc.tipo) {
                case 'gol':
                    if (inc.en_contra !== 'S') acciones.goles++;
                    break;
                case 'amarilla':
                    acciones.amarillas++;
                    break;
                case 'roja':
                    // Si es doble amarilla, no contar la roja (ya se cuenta como 2 amarillas)
                    if (!esDobleAmarilla || inc.id !== rojaDobleAmarillaId) {
                        acciones.rojas++;
                    }
                    break;
                case 'doble_amarilla':
                    // Doble amarilla: no contar como roja ni como amarilla adicional
                    // Solo se cuenta cuando hay 2 amarillas + 1 doble_amarilla (ya contadas las 2 amarillas)
                    // No sumar nada aquí, las 2 amarillas ya se contaron arriba
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
