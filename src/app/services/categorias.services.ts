import { api } from "../lib/api";
import { ActualizarCategoriaInput, CategoriaActual, CategoriaEdicionListResponse, CategoriaEdicionResponse, CategoriaResponse, CrearCategoriaInput, DatosCrearCategoriaResponse, EstadisticasCategoriaEdicionResponse, ExpulsadosResponse, GoleadoresResponse, ProximosPartidosResponse, StatsCategoriaResponse, TablaPosicionesResponse, UltimosPartidosJugadosResponse } from "../types/categoria";
import { ZonasPlayoffResponse } from "../types/zonas";

export const categoriasService = {
    obtenerCategoriasPorEdicion: async (id_edicion: number): Promise<CategoriaEdicionListResponse> => {
        try {
            const rest = await api.get<CategoriaEdicionListResponse>(`/admin/categorias/edicion/${id_edicion}`);
            return rest.data;
        } catch (error) {
            console.error('Error al obtener categorias por edición:', error);
            throw new Error('No se pudieron cargar las categorias de la edición');
        }
    },

    obtenerCategoriasPorEdicionActivas: async (): Promise<CategoriaActual[]> => {
        try {
            const rest = await api.get<CategoriaActual[]>(`/admin/categorias/actuales/activas`)
            return rest;
        } catch (error) {
            console.error('Error al obtener categorias por edición activas:', error);
            throw new Error('No se pudieron cargar las categorias de ediciones activas');
        }
    },

    obtenerCategoriaEdicionPorId: async (id_categoria_edicion: number): Promise<CategoriaEdicionResponse> => {
        try {
            return await api.get<CategoriaEdicionResponse>(`/admin/categorias/${id_categoria_edicion}`);
        } catch (error) {
            console.error('Error al obtener categoria edición por ID:', error);
            throw new Error('No se pudo cargar la categoria edición');
        }
    },

    obtenerDatosParaCrearCategoria: async (): Promise<DatosCrearCategoriaResponse> => {
        try {
            return await api.get<DatosCrearCategoriaResponse>('/admin/categorias/obtener-datos');
        } catch (error: any) {
            console.error('Error al obtener datos para crear categoría:', error);
            throw new Error(error.response?.data?.message || 'No se pudieron cargar los datos');
        }
    },

    crearCategoriaEdicion: async (id_edicion: number, data: CrearCategoriaInput): Promise<CategoriaResponse> => {
        try {
            return await api.post<CategoriaResponse>(`/admin/ediciones/${id_edicion}/categorias`, data);
        } catch (error: any) {
            if (error.response?.status === 400) {
                const backendErrors = error.response.data.errors;
                if (backendErrors && Array.isArray(backendErrors)) {
                    const errorMessages = backendErrors.map((err: any) => err.message).join(', ');
                    throw new Error(errorMessages);
                }
                throw new Error(error.response.data.message || 'Datos inválidos');
            }

            if (error.response?.status === 404) {
                throw new Error('Edición o categoría no encontrada');
            }

            if (error.response?.status === 409) {
                throw new Error('Esta categoría ya existe en la edición');
            }

            console.error('Error al crear categoría edición:', error);
            throw new Error(error.response?.data?.message || 'No se pudo crear la categoría');
        }
    },

    actualizarCategoriaEdicion: async (id_categoria_edicion: number, data: ActualizarCategoriaInput): Promise<CategoriaResponse> => {
        try {
            return await api.put<CategoriaResponse>(`/admin/categorias/${id_categoria_edicion}`, data);
        } catch (error: any) {
            if (error.response?.status === 400) {
                const backendErrors = error.response.data.errors;
                if (backendErrors && Array.isArray(backendErrors)) {
                    const errorMessages = backendErrors.map((err: any) => err.message).join(', ');
                    throw new Error(errorMessages);
                }
                throw new Error(error.response.data.message || 'Datos inválidos');
            }

            if (error.response?.status === 404) {
                throw new Error('Categoría edición no encontrada');
            }

            console.error('Error al actualizar categoría edición:', error);
            throw new Error(error.response?.data?.message || 'No se pudo actualizar la categoría');
        }
    },

    obtenerStatsCategoria: async (id_categoria_edicion: number): Promise<StatsCategoriaResponse> => {
        try {
            return await api.get<StatsCategoriaResponse>(`/admin/categorias/dash/estadisticas/${id_categoria_edicion}`);
        } catch (error) {
            console.error('Error al obtener estadísticas de la categoría:', error);
            throw new Error('No se pudieron obtener las estadísticas de la categoría');
        }
    },

    obtenerPosicionesZonaCategoria: async (id_zona: number, id_categoria_edicion: number): Promise<TablaPosicionesResponse> => {
        try {
            const res = await api.get<TablaPosicionesResponse>(`/admin/categorias/dash/posiciones/${id_zona}/${id_categoria_edicion}`);
            return res;
        } catch (error) {
            console.error('Error al obtener posiciones de la categoría:', error);
            throw new Error('No se pudieron obtener las posiciones de la categoría');
        }
    },

    obtenerGoleadoresCategoria: async (id_categoria_edicion: number, page: number, limit: number): Promise<GoleadoresResponse> => {
        try {
            return await api.get<GoleadoresResponse>(`/admin/categorias/dash/goleadores/${id_categoria_edicion}?page=${page}&limit=${limit}`);
        } catch (error) {
            console.error('Error al obtener goleadores de la categoría:', error);
            throw new Error('No se pudieron obtener los goleadores de la categoría');
        }
    },

    obtenerExpulsadosCategoria: async (id_categoria_edicion: number, page: number, limit: number): Promise<ExpulsadosResponse> => {
        try {
            return await api.get<ExpulsadosResponse>(`/admin/categorias/dash/expulsados/${id_categoria_edicion}?page=${page}&limit=${limit}`);
        } catch (error) {
            console.error('Error al obtener expulsados de la categoría:', error);
            throw new Error('No se pudieron obtener los expulsados de la categoría');
        }
    },

    obtenerZonasPlayoffCategoria: async (id_categoria_edicion: number): Promise<ZonasPlayoffResponse> => {
        try {
            return await api.get<ZonasPlayoffResponse>(`/admin/categorias/dash/playoff/${id_categoria_edicion}`);
        } catch (error) {
            console.error('Error al obtener zonas de playoff de la categoría:', error);
            throw new Error('No se pudieron obtener las zonas de playoff de la categoría');
        }
    },

    obtenerEstadisticasCategoriaEdicion: async (id_categoria_edicion: number): Promise<EstadisticasCategoriaEdicionResponse> => {
        try {
            return await api.get<EstadisticasCategoriaEdicionResponse>(`/admin/categorias/resumen/estadisticas/${id_categoria_edicion}`);
        } catch (error) {
            console.error('Error al obtener estadísticas de categoría edición:', error);
            throw new Error('No se pudieron cargar las estadísticas de la categoría edición');
        }
    },

    obtenerProximosPartidos: async (id_categoria_edicion: number): Promise<ProximosPartidosResponse> => {
        try {
            return await api.get<ProximosPartidosResponse>(`/admin/categorias/resumen/proximos-partidos/${id_categoria_edicion}`);
        } catch (error) {
            console.error('Error al obtener próximos partidos:', error);
            throw new Error('No se pudieron cargar los próximos partidos');
        }
    },

    obtenerUltimosPartidosJugados: async (id_categoria_edicion: number): Promise<UltimosPartidosJugadosResponse> => {
        try {
            return await api.get<UltimosPartidosJugadosResponse>(`/admin/categorias/resumen/ultimos-partidos-jugados/${id_categoria_edicion}`);
        } catch (error) {
            console.error('Error al obtener últimos partidos jugados:', error);
            throw new Error('No se pudieron cargar los últimos partidos jugados');
        }
    },
}