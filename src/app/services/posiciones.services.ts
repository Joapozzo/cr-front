
import { api } from "../lib/api"; 
import { EquipoPosicion } from "../types/posiciones";

export interface TablaPosicionesResponse {
    mensaje?: string;
    data?: EquipoPosicion[];
    tabla?: EquipoPosicion[];
    formatosPosicion?: FormatoPosicion[];
}

import { FormatoPosicion } from '../types/zonas';

export interface TablaZona {
    id_zona: number;
    nombre_zona: string;
    tabla: EquipoPosicion[];
    formatosPosicion?: FormatoPosicion[];
}

export interface TablasTodasZonasResponse {
    mensaje: string;
    data: {
        [zona_id: string]: TablaZona;
    };
}

// Tipos para el nuevo endpoint de tablas por equipos
export interface TablaPosicionEquipo {
    id_equipo: number;
    nombre_equipo: string;
    categoria_edicion: string;
    posiciones: IEquipoPosicion[];
    total_posiciones?: number;
    id_zona?: number;
    id_categoria_edicion?: number;
    formatosPosicion?: FormatoPosicion[];
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

export interface TablasPosicionesPorEquiposResponse {
    tablas: TablaPosicionEquipo[];
    total: number;
    limitTablas: number | null;
    limitPosiciones: number | null;
    offset: number;
}

export const tablasService = {
    /**
     * Obtener tabla de posiciones de una zona específica
     */
    obtenerTablaPosiciones: async (
        id_categoria_edicion: number,
        id_zona: number
    ): Promise<EquipoPosicion[]> => {
        try {
            const response = await api.get<TablaPosicionesResponse>(
                `/user/tabla/${id_categoria_edicion}/${id_zona}`
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener tabla de posiciones:', error);
            throw new Error('No se pudo cargar la tabla de posiciones');
        }
    },

    /**
     * Obtener tablas de todas las zonas de una categoría-edición
     */
    obtenerTablasTodasLasZonas: async (
        id_categoria_edicion: number
    ): Promise<{ [zona_id: string]: TablaZona }> => {
        try {
            const response = await api.get<TablasTodasZonasResponse>(
                `/user/tablas/${id_categoria_edicion}`
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener tablas de todas las zonas:', error);
            throw new Error('No se pudieron cargar las tablas de posiciones');
        }
    },

    /**
     * Obtener tablas de posiciones por equipos del usuario
     * @param limitPosiciones - Cantidad máxima de posiciones por tabla (para home: 6)
     * @param limitTablas - Cantidad máxima de tablas a retornar
     * @param page - Número de página para paginación
     * @param equiposIds - Array de IDs de equipos (opcional, si no se pasa usa equipos del usuario)
     */
    obtenerTablasPosicionesPorEquipos: async (
        limitPosiciones?: number,
        limitTablas?: number,
        page?: number,
        equiposIds?: number[]
    ): Promise<TablasPosicionesPorEquiposResponse> => {
        try {
            const params = new URLSearchParams();
            if (limitPosiciones) params.append('limitPosiciones', limitPosiciones.toString());
            if (limitTablas) params.append('limitTablas', limitTablas.toString());
            if (page) params.append('page', page.toString());
            if (equiposIds && equiposIds.length > 0) {
                params.append('equiposIds', JSON.stringify(equiposIds));
            }

            const queryString = params.toString();
            const endpoint = `/user/posiciones${queryString ? `?${queryString}` : ''}`;
            
            const response = await api.get<TablasPosicionesPorEquiposResponse>(endpoint);
            return response;
        } catch (error) {
            console.error('Error al obtener tablas de posiciones por equipos:', error);
            throw new Error('No se pudieron cargar las tablas de posiciones');
        }
    }
};