/**
 * Servicio para endpoints de jugadores en legajos
 */
import { api } from '@/app/lib/api';
import {
    JugadorInformacionBasica,
    EstadisticasJugador,
    HistorialEquiposJugador,
    HistorialPartidosJugadorResponse,
    HistorialDisciplinarioJugador,
    DestacadosJugador,
    SolicitudesJugador,
    EstadoSolicitud,
} from '@/app/types/legajos';

export const jugadoresLegajosService = {
    /**
     * Obtener información básica de un jugador
     */
    obtenerJugadorDetalle: async (id_jugador: number): Promise<JugadorInformacionBasica> => {
        try {
            const response = await api.get<{ success: boolean; data: JugadorInformacionBasica }>(`/legajos/jugador/${id_jugador}`);
            if (!response.data) throw new Error('Jugador no encontrado');
            return response.data;
        } catch (error) {
            console.error('Error al obtener información del jugador:', error);
            throw new Error('No se pudo cargar la información del jugador');
        }
    },

    /**
     * Obtener historial de equipos de un jugador
     */
    obtenerJugadorEquipos: async (id_jugador: number): Promise<HistorialEquiposJugador[]> => {
        try {
            const response = await api.get<{ success: boolean; data: HistorialEquiposJugador[] }>(`/legajos/jugador/${id_jugador}/equipos`);
            return response.data || [];
        } catch (error) {
            console.error('Error al obtener equipos del jugador:', error);
            throw new Error('No se pudo cargar el historial de equipos');
        }
    },

    /**
     * Obtener estadísticas generales de un jugador
     */
    obtenerJugadorEstadisticas: async (id_jugador: number, id_categoria_edicion?: number): Promise<EstadisticasJugador> => {
        try {
            const url = id_categoria_edicion
                ? `/legajos/jugador/${id_jugador}/estadisticas/${id_categoria_edicion}`
                : `/legajos/jugador/${id_jugador}/estadisticas`;
            const response = await api.get<{ success: boolean; data: EstadisticasJugador }>(url);
            if (!response.data) throw new Error('No se pudieron cargar las estadísticas');
            return response.data;
        } catch (error) {
            console.error('Error al obtener estadísticas del jugador:', error);
            throw new Error('No se pudieron cargar las estadísticas');
        }
    },

    /**
     * Obtener historial de partidos de un jugador
     */
    obtenerJugadorPartidos: async (
        id_jugador: number,
        params?: {
            page?: number;
            limit?: number;
            id_categoria_edicion?: number;
            id_equipo?: number;
            resultado?: 'G' | 'E' | 'P';
        }
    ): Promise<HistorialPartidosJugadorResponse> => {
        try {
            const queryParams = new URLSearchParams();
            if (params?.page) queryParams.append('page', String(params.page));
            if (params?.limit) queryParams.append('limit', String(params.limit));
            if (params?.id_categoria_edicion) queryParams.append('id_categoria_edicion', String(params.id_categoria_edicion));
            if (params?.id_equipo) queryParams.append('id_equipo', String(params.id_equipo));
            if (params?.resultado) queryParams.append('resultado', params.resultado);

            const url = `/legajos/jugador/${id_jugador}/partidos${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            const response = await api.get<{ success: boolean; data: HistorialPartidosJugadorResponse['data']; pagination: HistorialPartidosJugadorResponse['pagination'] }>(url);
            return {
                data: response.data || [],
                pagination: response.pagination
            };
        } catch (error) {
            console.error('Error al obtener partidos del jugador:', error);
            throw new Error('No se pudo cargar el historial de partidos');
        }
    },

    /**
     * Obtener historial disciplinario de un jugador
     */
    obtenerJugadorDisciplina: async (id_jugador: number, id_categoria_edicion?: number): Promise<HistorialDisciplinarioJugador> => {
        try {
            const url = id_categoria_edicion
                ? `/legajos/jugador/${id_jugador}/disciplina?id_categoria_edicion=${id_categoria_edicion}`
                : `/legajos/jugador/${id_jugador}/disciplina`;
            const response = await api.get<{ success: boolean; data: HistorialDisciplinarioJugador }>(url);
            if (!response.data) throw new Error('No se pudo cargar el historial disciplinario');
            return response.data;
        } catch (error) {
            console.error('Error al obtener historial disciplinario:', error);
            throw new Error('No se pudo cargar el historial disciplinario');
        }
    },

    /**
     * Obtener destacados de un jugador
     */
    obtenerJugadorDestacados: async (id_jugador: number): Promise<DestacadosJugador> => {
        try {
            const response = await api.get<{ success: boolean; data: DestacadosJugador }>(`/legajos/jugador/${id_jugador}/destacados`);
            if (!response.data) throw new Error('No se pudieron cargar los destacados');
            return response.data;
        } catch (error) {
            console.error('Error al obtener destacados del jugador:', error);
            throw new Error('No se pudieron cargar los destacados');
        }
    },

    /**
     * Obtener solicitudes de un jugador
     */
    obtenerJugadorSolicitudes: async (id_jugador: number, estado?: EstadoSolicitud): Promise<SolicitudesJugador> => {
        try {
            const url = estado
                ? `/legajos/jugador/${id_jugador}/solicitudes?estado=${estado}`
                : `/legajos/jugador/${id_jugador}/solicitudes`;
            const response = await api.get<{ success: boolean; data: SolicitudesJugador }>(url);
            if (!response.data) throw new Error('No se pudieron cargar las solicitudes');
            return response.data;
        } catch (error) {
            console.error('Error al obtener solicitudes del jugador:', error);
            throw new Error('No se pudieron cargar las solicitudes');
        }
    },
};

