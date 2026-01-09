// Tipos para el endpoint público optimizado
export interface DreamTeamPublicoResponse {
    id_dreamteam: number;
    id_categoria_edicion: number;
    jornada: number;
    formacion: string | null;
    jugadores: JugadorDreamTeamPublico[];
}

export interface JugadorDreamTeamPublico {
    id_jugador: number;
    nombre: string;
    apellido: string;
    img: string;
    posicion_index: number | null;
    posicion_codigo: string | null;
    equipo: {
        id_equipo: number;
        nombre: string;
        img: string;
    };
}

