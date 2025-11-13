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