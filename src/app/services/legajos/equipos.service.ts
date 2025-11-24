/**
 * Servicio para endpoints de equipos en legajos
 */
import { api } from '@/app/lib/api';
import {
    EquipoInformacionBasica,
    PlantelEquipo,
    CategoriaEquipo,
    EstadisticasEquipo,
    HistorialPartidosEquipoResponse,
    TablaPosiciones,
    GoleadorEquipo,
    HistorialCapitanes,
    SancionEquipo,
    FixtureEquipo,
    SolicitudesEquipo,
    TipoRanking,
    TipoFixture,
    EstadoSolicitud,
} from '@/app/types/legajos';

export const equiposLegajosService = {
    /**
     * Obtener información básica de un equipo
     */
    obtenerEquipoDetalle: async (id_equipo: number): Promise<EquipoInformacionBasica> => {
        try {
            const response = await api.get<{ success: boolean; data: EquipoInformacionBasica }>(`/legajos/equipo/${id_equipo}`);
            if (!response.data?.data) throw new Error('Equipo no encontrado');
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener información del equipo:', error);
            throw new Error('No se pudo cargar la información del equipo');
        }
    },

    /**
     * Obtener categorías de un equipo
     */
    obtenerEquipoCategorias: async (id_equipo: number): Promise<CategoriaEquipo[]> => {
        try {
            const response = await api.get<{ success: boolean; data: CategoriaEquipo[] }>(`/legajos/equipo/${id_equipo}/categorias`);
            return response.data?.data || [];
        } catch (error) {
            console.error('Error al obtener categorías del equipo:', error);
            throw new Error('No se pudieron cargar las categorías');
        }
    },

    /**
     * Obtener plantel de un equipo por categoría-edición
     */
    obtenerEquipoPlantel: async (id_equipo: number, id_categoria_edicion: number): Promise<PlantelEquipo> => {
        try {
            const response = await api.get<{ success: boolean; data: PlantelEquipo }>(`/legajos/equipo/${id_equipo}/plantel/${id_categoria_edicion}`);
            if (!response.data?.data) throw new Error('Plantel no encontrado');
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener plantel del equipo:', error);
            throw new Error('No se pudo cargar el plantel');
        }
    },

    /**
     * Obtener estadísticas de un equipo por categoría-edición
     */
    obtenerEquipoEstadisticas: async (id_equipo: number, id_categoria_edicion: number): Promise<EstadisticasEquipo> => {
        try {
            const response = await api.get<{ success: boolean; data: EstadisticasEquipo }>(`/legajos/equipo/${id_equipo}/estadisticas/${id_categoria_edicion}`);
            if (!response.data?.data) throw new Error('No se pudieron cargar las estadísticas');
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener estadísticas del equipo:', error);
            throw new Error('No se pudieron cargar las estadísticas');
        }
    },

    /**
     * Obtener historial de partidos de un equipo
     */
    obtenerEquipoPartidos: async (
        id_equipo: number,
        params?: {
            page?: number;
            limit?: number;
            id_categoria_edicion?: number;
            id_zona?: number;
            fase?: number;
            estado?: 'P' | 'C' | 'F';
        }
    ): Promise<HistorialPartidosEquipoResponse> => {
        try {
            const queryParams = new URLSearchParams();
            if (params?.page) queryParams.append('page', String(params.page));
            if (params?.limit) queryParams.append('limit', String(params.limit));
            if (params?.id_categoria_edicion) queryParams.append('id_categoria_edicion', String(params.id_categoria_edicion));
            if (params?.id_zona) queryParams.append('id_zona', String(params.id_zona));
            if (params?.fase) queryParams.append('fase', String(params.fase));
            if (params?.estado) queryParams.append('estado', params.estado);

            const url = `/legajos/equipo/${id_equipo}/partidos${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            const response = await api.get<{ success: boolean; data: HistorialPartidosEquipoResponse['data']; pagination: HistorialPartidosEquipoResponse['pagination'] }>(url);
            return {
                data: response.data?.data || [],
                pagination: response.data?.pagination || { total: 0, totalPages: 0, currentPage: 1, hasNext: false, hasPrev: false }
            };
        } catch (error) {
            console.error('Error al obtener partidos del equipo:', error);
            throw new Error('No se pudo cargar el historial de partidos');
        }
    },

    /**
     * Obtener tablas de posiciones de un equipo
     */
    obtenerEquipoTabla: async (id_equipo: number, id_categoria_edicion: number): Promise<TablaPosiciones> => {
        try {
            const response = await api.get<{ success: boolean; data: TablaPosiciones }>(`/legajos/equipo/${id_equipo}/tabla/${id_categoria_edicion}`);
            if (!response.data?.data) throw new Error('No se pudieron cargar las tablas');
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener tablas de posiciones:', error);
            throw new Error('No se pudieron cargar las tablas de posiciones');
        }
    },

    /**
     * Obtener goleadores y rankings de un equipo
     */
    obtenerEquipoGoleadores: async (id_equipo: number, id_categoria_edicion: number, tipo: TipoRanking = 'goles'): Promise<GoleadorEquipo[]> => {
        try {
            const response = await api.get<{ success: boolean; data: GoleadorEquipo[] }>(`/legajos/equipo/${id_equipo}/goleadores/${id_categoria_edicion}?tipo=${tipo}`);
            return response.data?.data || [];
        } catch (error) {
            console.error('Error al obtener goleadores del equipo:', error);
            throw new Error('No se pudieron cargar los goleadores');
        }
    },

    /**
     * Obtener historial de capitanes de un equipo
     */
    obtenerEquipoCapitanes: async (id_equipo: number, id_categoria_edicion: number): Promise<HistorialCapitanes> => {
        try {
            const response = await api.get<{ success: boolean; data: HistorialCapitanes }>(`/legajos/equipo/${id_equipo}/capitanes/${id_categoria_edicion}`);
            if (!response.data?.data) throw new Error('No se pudo cargar el historial de capitanes');
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener capitanes del equipo:', error);
            throw new Error('No se pudo cargar el historial de capitanes');
        }
    },

    /**
     * Obtener sanciones de un equipo
     */
    obtenerEquipoSanciones: async (id_equipo: number): Promise<SancionEquipo[]> => {
        try {
            const response = await api.get<{ success: boolean; data: SancionEquipo[] }>(`/legajos/equipo/${id_equipo}/sanciones`);
            return response.data?.data || [];
        } catch (error) {
            console.error('Error al obtener sanciones del equipo:', error);
            throw new Error('No se pudieron cargar las sanciones');
        }
    },

    /**
     * Obtener fixtures de un equipo
     */
    obtenerEquipoFixtures: async (id_equipo: number, id_categoria_edicion: number, tipo: TipoFixture = 'proximos'): Promise<FixtureEquipo[]> => {
        try {
            const response = await api.get<{ success: boolean; data: FixtureEquipo[] }>(`/legajos/equipo/${id_equipo}/fixtures/${id_categoria_edicion}?tipo=${tipo}`);
            return response.data?.data || [];
        } catch (error) {
            console.error('Error al obtener fixtures del equipo:', error);
            throw new Error('No se pudieron cargar los fixtures');
        }
    },

    /**
     * Obtener solicitudes de un equipo
     */
    obtenerEquipoSolicitudes: async (id_equipo: number, id_categoria_edicion: number, estado?: EstadoSolicitud): Promise<SolicitudesEquipo> => {
        try {
            const url = estado
                ? `/legajos/equipo/${id_equipo}/solicitudes/${id_categoria_edicion}?estado=${estado}`
                : `/legajos/equipo/${id_equipo}/solicitudes/${id_categoria_edicion}`;
            const response = await api.get<{ success: boolean; data: SolicitudesEquipo }>(url);
            if (!response.data?.data) throw new Error('No se pudieron cargar las solicitudes');
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener solicitudes del equipo:', error);
            throw new Error('No se pudieron cargar las solicitudes');
        }
    },
};

