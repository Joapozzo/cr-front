import { api } from "../lib/api";
import {
    CrearSancionInput,
    EditarSancionInput,
    SancionesResponse,
    SancionResponse,
    VerificarSancionResponse
} from "../types/sancion";
import { SancionesActivasResponse } from "../hooks/useSanciones";

export const sancionesService = {
    /**
     * Crear una nueva sanción
     */
    crearSancion: async (data: CrearSancionInput): Promise<SancionResponse> => {
        try {
            return await api.post<SancionResponse>('/admin/sanciones', data);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'No se pudo crear la sanción';
            console.error('Error al crear sanción:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    /**
     * Editar una sanción existente
     */
    editarSancion: async (id_expulsion: number, data: EditarSancionInput): Promise<SancionResponse> => {
        try {
            return await api.put<SancionResponse>(`/admin/sanciones/${id_expulsion}`, data);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'No se pudo editar la sanción';
            console.error('Error al editar sanción:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    /**
     * Eliminar (revocar) una sanción
     */
    eliminarSancion: async (id_expulsion: number): Promise<SancionResponse> => {
        try {
            return await api.delete<SancionResponse>(`/admin/sanciones/${id_expulsion}`);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'No se pudo revocar la sanción';
            console.error('Error al eliminar sanción:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    /**
     * Obtener una sanción por ID
     */
    obtenerSancionPorId: async (id_expulsion: number): Promise<SancionResponse> => {
        try {
            return await api.get<SancionResponse>(`/admin/sanciones/${id_expulsion}`);
        } catch (error: any) {
            console.error('Error al obtener sanción:', error);
            throw new Error(error.response?.data?.message || 'No se pudo obtener la sanción');
        }
    },

    /**
     * Obtener sanciones por categoría edición
     */
    obtenerSancionesPorCategoria: async (
        id_categoria_edicion: number,
        estado?: string
    ): Promise<SancionesResponse> => {
        try {
            const params = estado ? `?estado=${estado}` : '';
            return await api.get<SancionesResponse>(
                `/admin/sanciones/categoria/${id_categoria_edicion}${params}`
            );
        } catch (error: any) {
            console.error('Error al obtener sanciones por categoría:', error);
            throw new Error(error.response?.data?.message || 'No se pudieron obtener las sanciones');
        }
    },

    /**
     * Verificar si un jugador está sancionado
     */
    verificarJugadorSancionado: async (
        id_jugador: number,
        id_categoria_edicion: number
    ): Promise<VerificarSancionResponse> => {
        try {
            return await api.get<VerificarSancionResponse>(
                `/admin/sanciones/verificar/${id_jugador}/${id_categoria_edicion}`
            );
        } catch (error: any) {
            console.error('Error al verificar sanción del jugador:', error);
            throw new Error(error.response?.data?.message || 'No se pudo verificar la sanción');
        }
    },

    /**
     * Obtener sanciones activas de un jugador
     */
    obtenerSancionesActivasJugador: async (
        id_jugador: number,
        id_categoria_edicion: number
    ): Promise<SancionesResponse> => {
        try {
            return await api.get<SancionesResponse>(
                `/admin/sanciones/jugador/${id_jugador}/categoria/${id_categoria_edicion}`
            );
        } catch (error: any) {
            console.error('Error al obtener sanciones activas del jugador:', error);
            throw new Error(error.response?.data?.message || 'No se pudieron obtener las sanciones activas');
        }
    },

    /**
     * Obtener sanciones activas para el usuario
     * @param id_categoria_edicion - Opcional, filtrar por categoría edición
     * @param limit - Cantidad máxima de sanciones (para home: 5)
     * @param page - Número de página para paginación
     */
    obtenerSancionesActivasUsuario: async (
        id_categoria_edicion?: number,
        limit?: number,
        page?: number
    ): Promise<SancionesActivasResponse> => {
        try {
            const params = new URLSearchParams();
            if (id_categoria_edicion) params.append('id_categoria_edicion', id_categoria_edicion.toString());
            if (limit) params.append('limit', limit.toString());
            if (page) params.append('page', page.toString());

            const queryString = params.toString();
            const endpoint = `/user/sanciones${queryString ? `?${queryString}` : ''}`;
            
            return await api.get<SancionesActivasResponse>(endpoint);
        } catch (error: any) {
            console.error('Error al obtener sanciones activas del usuario:', error);
            throw new Error(error.response?.data?.error || 'No se pudieron obtener las sanciones activas');
        }
    }
};
