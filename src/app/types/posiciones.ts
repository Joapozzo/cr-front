export interface EquipoPosicion {
    id_equipo: number;
    nombre_equipo: string;
    partidos_jugados: number;
    ganados: number;
    empatados: number;
    perdidos: number;
    goles_favor: number;
    goles_contra: number;
    diferencia_goles: number;
    puntos: number;
    ultima_actualizacion: string;
    img_equipo?: string;
}

export interface IEquipoPosicion {
    posicion: number;
    id_equipo: number;
    nombre_equipo: string;
    img_equipo?: string | null;
    puntos: number;
    partidos_jugados: number;
    partidos_ganados: number;
    partidos_empatados: number;
    partidos_perdidos: number;
    goles_favor: number;
    goles_contra: number;
    diferencia_goles: number;
}

export interface ITablaPosicion {
    id_equipo: number; // ID del equipo del usuario al que pertenece esta tabla
    nombre_equipo: string; // Nombre del equipo del usuario
    categoria_edicion: string; // Ej: "Primera - Apertura 2024"
    posiciones: IEquipoPosicion[]; // 6 equipos (contexto alrededor del equipo del usuario)
}
