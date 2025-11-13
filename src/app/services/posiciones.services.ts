
import { api } from "../lib/api"; 
import { EquipoPosicion } from "../types/posiciones";

export interface TablaPosicionesResponse {
    mensaje: string;
    data: EquipoPosicion[];
}

export interface TablaZona {
    id_zona: number;
    nombre_zona: string;
    tabla: EquipoPosicion[];
}

export interface TablasTodasZonasResponse {
    mensaje: string;
    data: {
        [zona_id: string]: TablaZona;
    };
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
    }
};