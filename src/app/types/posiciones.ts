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
    puntos: number; // Puntos base (sin descuento)
    puntos_descontados?: number; // Descuento por apercibimientos
    puntos_finales?: number; // Puntos finales (puntos - descuento)
    ultima_actualizacion: string;
    img_equipo?: string;
    apercibimientos?: number;
}

export interface IEquipoPosicion {
    posicion: number;
    id_equipo: number;
    nombre_equipo: string;
    img_equipo?: string | null;
    puntos: number; // Puntos base (sin descuento)
    puntos_descontados?: number; // Descuento por apercibimientos
    puntos_finales?: number; // Puntos finales (puntos - descuento)
    partidos_jugados: number;
    partidos_ganados: number;
    partidos_empatados: number;
    partidos_perdidos: number;
    goles_favor: number;
    goles_contra: number;
    diferencia_goles: number;
    apercibimientos?: number;
}

import { FormatoPosicion } from './zonas';

export interface ITablaPosicion {
    id_equipo: number; // ID del equipo del usuario al que pertenece esta tabla
    nombre_equipo: string; // Nombre del equipo del usuario
    categoria_edicion: string; // Ej: "Primera - Apertura 2024"
    posiciones: IEquipoPosicion[]; // 6 equipos (contexto alrededor del equipo del usuario)
    formatosPosicion?: FormatoPosicion[]; // Formatos de posición para mostrar badges y leyenda
}
