import { api } from '../lib/api';
import { JugadorEstadistica } from '../types/estadisticas';
import { IEquipoPosicion } from '../types/posiciones';
import { FormatoPosicion } from '../types/zonas';

export interface PosicionZona {
    id_zona: number;
    nombre_zona: string;
    posiciones: IEquipoPosicion[];
    formatosPosicion?: FormatoPosicion[];
}

export const estadisticasService = {
    /**
     * Obtener posiciones por categoría edición
     */
    obtenerPosicionesPorCategoriaEdicion: async (id_categoria_edicion: number): Promise<PosicionZona[]> => {
        try {
            return await api.get<PosicionZona[]>(`/user/estadisticas/posiciones/${id_categoria_edicion}`);
        } catch (error: any) {
            console.error('Error al obtener posiciones por categoría edición:', error);
            
            // Detectar errores de conexión a base de datos
            const errorMessage = error.message || '';
            const isDatabaseError = 
                error.status === 503 ||
                errorMessage.includes('conexión a la base de datos') ||
                errorMessage.includes('Can\'t reach database server') ||
                errorMessage.includes('database server');
            
            if (isDatabaseError) {
                throw new Error('Error de conexión a la base de datos. Por favor, intente nuevamente en unos momentos.');
            }
            
            throw new Error(error.response?.data?.error || error.message || 'No se pudieron obtener las posiciones');
        }
    },

    /**
     * Obtener zonas de playoff por categoría edición
     */
    obtenerZonasPlayoffPorCategoriaEdicion: async (id_categoria_edicion: number): Promise<any[]> => {
        try {
            return await api.get<any[]>(`/user/estadisticas/playoff/${id_categoria_edicion}`);
        } catch (error: any) {
            console.error('Error al obtener zonas de playoff por categoría edición:', error);
            
            // Detectar errores de conexión a base de datos
            const errorMessage = error.message || '';
            const isDatabaseError = 
                error.status === 503 ||
                errorMessage.includes('conexión a la base de datos') ||
                errorMessage.includes('Can\'t reach database server') ||
                errorMessage.includes('database server');
            
            if (isDatabaseError) {
                throw new Error('Error de conexión a la base de datos. Por favor, intente nuevamente en unos momentos.');
            }
            
            throw new Error(error.response?.data?.error || error.message || 'No se pudieron obtener las zonas de playoff');
        }
    },

    /**
     * Obtener goleadores por categoría edición
     */
    obtenerGoleadoresPorCategoriaEdicion: async (id_categoria_edicion: number): Promise<JugadorEstadistica[]> => {
        try {
            return await api.get<JugadorEstadistica[]>(`/user/estadisticas/goleadores/${id_categoria_edicion}`);
        } catch (error: any) {
            console.error('Error al obtener goleadores por categoría edición:', error);
            
            // Detectar errores de conexión a base de datos
            const errorMessage = error.message || '';
            const isDatabaseError = 
                error.status === 503 ||
                errorMessage.includes('conexión a la base de datos') ||
                errorMessage.includes('Can\'t reach database server') ||
                errorMessage.includes('database server');
            
            if (isDatabaseError) {
                throw new Error('Error de conexión a la base de datos. Por favor, intente nuevamente en unos momentos.');
            }
            
            throw new Error(error.response?.data?.error || error.message || 'No se pudieron obtener los goleadores');
        }
    },

    /**
     * Obtener asistencias por categoría edición
     */
    obtenerAsistenciasPorCategoriaEdicion: async (id_categoria_edicion: number): Promise<JugadorEstadistica[]> => {
        try {
            return await api.get<JugadorEstadistica[]>(`/user/estadisticas/asistencias/${id_categoria_edicion}`);
        } catch (error: any) {
            console.error('Error al obtener asistencias por categoría edición:', error);
            
            // Detectar errores de conexión a base de datos
            const errorMessage = error.message || '';
            const isDatabaseError = 
                error.status === 503 ||
                errorMessage.includes('conexión a la base de datos') ||
                errorMessage.includes('Can\'t reach database server') ||
                errorMessage.includes('database server');
            
            if (isDatabaseError) {
                throw new Error('Error de conexión a la base de datos. Por favor, intente nuevamente en unos momentos.');
            }
            
            throw new Error(error.response?.data?.error || error.message || 'No se pudieron obtener las asistencias');
        }
    },

    /**
     * Obtener amarillas por categoría edición
     */
    obtenerAmarillasPorCategoriaEdicion: async (id_categoria_edicion: number): Promise<JugadorEstadistica[]> => {
        try {
            return await api.get<JugadorEstadistica[]>(`/user/estadisticas/amarillas/${id_categoria_edicion}`);
        } catch (error: any) {
            console.error('Error al obtener amarillas por categoría edición:', error);
            
            // Detectar errores de conexión a base de datos
            const errorMessage = error.message || '';
            const isDatabaseError = 
                error.status === 503 ||
                errorMessage.includes('conexión a la base de datos') ||
                errorMessage.includes('Can\'t reach database server') ||
                errorMessage.includes('database server');
            
            if (isDatabaseError) {
                throw new Error('Error de conexión a la base de datos. Por favor, intente nuevamente en unos momentos.');
            }
            
            throw new Error(error.response?.data?.error || error.message || 'No se pudieron obtener las amarillas');
        }
    },

    /**
     * Obtener rojas por categoría edición
     */
    obtenerRojasPorCategoriaEdicion: async (id_categoria_edicion: number): Promise<JugadorEstadistica[]> => {
        try {
            return await api.get<JugadorEstadistica[]>(`/user/estadisticas/rojas/${id_categoria_edicion}`);
        } catch (error: any) {
            console.error('Error al obtener rojas por categoría edición:', error);
            
            // Detectar errores de conexión a base de datos
            const errorMessage = error.message || '';
            const isDatabaseError = 
                error.status === 503 ||
                errorMessage.includes('conexión a la base de datos') ||
                errorMessage.includes('Can\'t reach database server') ||
                errorMessage.includes('database server');
            
            if (isDatabaseError) {
                throw new Error('Error de conexión a la base de datos. Por favor, intente nuevamente en unos momentos.');
            }
            
            throw new Error(error.response?.data?.error || error.message || 'No se pudieron obtener las rojas');
        }
    },

    /**
     * Obtener MVPs por categoría edición
     */
    obtenerMVPsPorCategoriaEdicion: async (id_categoria_edicion: number): Promise<JugadorEstadistica[]> => {
        try {
            return await api.get<JugadorEstadistica[]>(`/user/estadisticas/mvps/${id_categoria_edicion}`);
        } catch (error: any) {
            console.error('Error al obtener MVPs por categoría edición:', error);
            
            // Detectar errores de conexión a base de datos
            const errorMessage = error.message || '';
            const isDatabaseError = 
                error.status === 503 ||
                errorMessage.includes('conexión a la base de datos') ||
                errorMessage.includes('Can\'t reach database server') ||
                errorMessage.includes('database server');
            
            if (isDatabaseError) {
                throw new Error('Error de conexión a la base de datos. Por favor, intente nuevamente en unos momentos.');
            }
            
            throw new Error(error.response?.data?.error || error.message || 'No se pudieron obtener los MVPs');
        }
    },

    // ============================================
    // ESTADÍSTICAS POR EQUIPO (filtradas por equipo)
    // ============================================

    /**
     * Obtener goleadores del equipo
     * @param id_equipo - ID del equipo (requerido)
     * @param id_categoria_edicion - ID de la categoría edición (opcional). Si no se pasa, se usará la última categoría activa donde participa el equipo
     */
    obtenerGoleadoresPorEquipo: async (
        id_equipo: number,
        id_categoria_edicion?: number | null
    ): Promise<JugadorEstadistica[]> => {
        try {
            const url = id_categoria_edicion
                ? `/user/estadisticas/equipo/${id_equipo}/goleadores?id_categoria_edicion=${id_categoria_edicion}`
                : `/user/estadisticas/equipo/${id_equipo}/goleadores`;
            return await api.get<JugadorEstadistica[]>(url);
        } catch (error: any) {
            console.error('Error al obtener goleadores del equipo:', error);
            throw new Error(error.response?.data?.error || 'No se pudieron obtener los goleadores del equipo');
        }
    },

    /**
     * Obtener asistencias del equipo
     */
    obtenerAsistenciasPorEquipo: async (
        id_equipo: number,
        id_categoria_edicion?: number | null
    ): Promise<JugadorEstadistica[]> => {
        try {
            const url = id_categoria_edicion
                ? `/user/estadisticas/equipo/${id_equipo}/asistencias?id_categoria_edicion=${id_categoria_edicion}`
                : `/user/estadisticas/equipo/${id_equipo}/asistencias`;
            return await api.get<JugadorEstadistica[]>(url);
        } catch (error: any) {
            console.error('Error al obtener asistencias del equipo:', error);
            throw new Error(error.response?.data?.error || 'No se pudieron obtener las asistencias del equipo');
        }
    },

    /**
     * Obtener amarillas del equipo
     */
    obtenerAmarillasPorEquipo: async (
        id_equipo: number,
        id_categoria_edicion?: number | null
    ): Promise<JugadorEstadistica[]> => {
        try {
            const url = id_categoria_edicion
                ? `/user/estadisticas/equipo/${id_equipo}/amarillas?id_categoria_edicion=${id_categoria_edicion}`
                : `/user/estadisticas/equipo/${id_equipo}/amarillas`;
            return await api.get<JugadorEstadistica[]>(url);
        } catch (error: any) {
            console.error('Error al obtener amarillas del equipo:', error);
            throw new Error(error.response?.data?.error || 'No se pudieron obtener las amarillas del equipo');
        }
    },

    /**
     * Obtener rojas del equipo
     */
    obtenerRojasPorEquipo: async (
        id_equipo: number,
        id_categoria_edicion?: number | null
    ): Promise<JugadorEstadistica[]> => {
        try {
            const url = id_categoria_edicion
                ? `/user/estadisticas/equipo/${id_equipo}/rojas?id_categoria_edicion=${id_categoria_edicion}`
                : `/user/estadisticas/equipo/${id_equipo}/rojas`;
            return await api.get<JugadorEstadistica[]>(url);
        } catch (error: any) {
            console.error('Error al obtener rojas del equipo:', error);
            throw new Error(error.response?.data?.error || 'No se pudieron obtener las rojas del equipo');
        }
    },

    /**
     * Obtener MVPs del equipo
     */
    obtenerMVPsPorEquipo: async (
        id_equipo: number,
        id_categoria_edicion?: number | null
    ): Promise<JugadorEstadistica[]> => {
        try {
            const url = id_categoria_edicion
                ? `/user/estadisticas/equipo/${id_equipo}/mvps?id_categoria_edicion=${id_categoria_edicion}`
                : `/user/estadisticas/equipo/${id_equipo}/mvps`;
            return await api.get<JugadorEstadistica[]>(url);
        } catch (error: any) {
            console.error('Error al obtener MVPs del equipo:', error);
            throw new Error(error.response?.data?.error || 'No se pudieron obtener los MVPs del equipo');
        }
    },
};

