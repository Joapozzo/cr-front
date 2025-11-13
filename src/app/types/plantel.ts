export interface IPlantel {
    id_equipo: number;
    nombre_equipo: string;
    img_equipo?: string | null;
    id_jugador: number;
    id_categoria_edicion: number;
    nombre_cat_edicion: string;
    eventual: string;
    sancionado: string;
}

export interface EstadisticasPlantelResponse {
    jugadores: EstadisticasJugador[];
}

export interface EstadisticasJugador {
    id_jugador: number;
    nombre: string;
    apellido: string;
    img: string | null;
    partidos_jugados: number;
    goles: number;
    amarillas: number;
    rojas: number;
    mvp: number;
    eventual: 'S' | 'N';
    sancionado: 'S' | 'N';
    solicitud_baja?: boolean;
}