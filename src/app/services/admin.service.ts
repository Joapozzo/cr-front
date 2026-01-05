import { api } from '@/app/lib/api';
import {
    CategoriaActiva,
    ZonaSinTerminar,
    SancionActiva,
    PartidoEnVivo,
    JugadorEventual,
    EstadisticasChart
} from '@/app/types/admin.types';

/**
 * Servicio para consumir endpoints del dashboard de administración
 */

export const adminService = {
    /**
     * Obtener todas las categorías publicadas de ediciones activas del año actual
     */
    getCategoriasActivas: async (): Promise<CategoriaActiva[]> => {
        try {
            const data = await api.get<CategoriaActiva[]>('/admin/dashboard/categorias-activas');
            return data;
        } catch (error: any) {
            console.error('Error al obtener categorías activas:', error);
            throw new Error(error.message || 'Error al obtener las categorías activas');
        }
    },

    /**
     * Obtener zonas de tipo "todos contra todos" que no están terminadas
     */
    getZonasSinTerminar: async (): Promise<ZonaSinTerminar[]> => {
        try {
            const data = await api.get<ZonaSinTerminar[]>('/admin/dashboard/zonas-sin-terminar');
            return data;
        } catch (error: any) {
            console.error('Error al obtener zonas sin terminar:', error);
            throw new Error(error.message || 'Error al obtener las zonas sin terminar');
        }
    },

    /**
     * Obtener expulsiones con estado = 'A' y fechas_restantes > 0
     */
    getSancionesActivas: async (): Promise<SancionActiva[]> => {
        try {
            const data = await api.get<SancionActiva[]>('/admin/dashboard/sanciones-activas');
            return data;
        } catch (error: any) {
            console.error('Error al obtener sanciones activas:', error);
            throw new Error(error.message || 'Error al obtener las sanciones activas');
        }
    },

    /**
     * Obtener partidos con estado en curso (C1, E, C2, T)
     */
    getPartidosEnVivo: async (): Promise<PartidoEnVivo[]> => {
        try {
            const data = await api.get<PartidoEnVivo[]>('/admin/dashboard/partidos-en-vivo');
            return data;
        } catch (error: any) {
            console.error('Error al obtener partidos en vivo:', error);
            throw new Error(error.message || 'Error al obtener los partidos en vivo');
        }
    },

    /**
     * Obtener jugadores con eventual = 'S' de planteles activos
     */
    getJugadoresEventuales: async (): Promise<JugadorEventual[]> => {
        try {
            const data = await api.get<JugadorEventual[]>('/admin/dashboard/jugadores-eventuales');
            return data;
        } catch (error: any) {
            console.error('Error al obtener jugadores eventuales:', error);
            throw new Error(error.message || 'Error al obtener los jugadores eventuales');
        }
    },

    /**
     * Obtener estadísticas para charts del dashboard
     */
    getEstadisticas: async (): Promise<EstadisticasChart> => {
        try {
            const data = await api.get<EstadisticasChart>('/admin/dashboard/estadisticas');
            return data;
        } catch (error: any) {
            console.error('Error al obtener estadísticas:', error);
            throw new Error(error.message || 'Error al obtener las estadísticas');
        }
    }
};

