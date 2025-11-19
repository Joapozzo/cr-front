import { api } from "../lib/api";
import { 
    PostPartido, 
    UpdatePartido, 
    PartidoResponse,
    PartidosPorJornadaResponse,
    CrearPartidoResponse,
    ActualizarPartidoResponse,
    EliminarPartidoResponse,
    PostPartidoSchema,
    UpdatePartidoSchema,
    PartidoResponseSchema,
    PartidosPorJornadaResponseSchema,
    CrearPartidoResponseSchema,
    ActualizarPartidoResponseSchema,
    EliminarPartidoResponseSchema
} from "../schemas/partidos.schema";
import { UltimoYProximoPartidoResponse } from "../types/partido";

export const partidosService = {
    obtenerUltimos5PartidosJugados: async (): Promise<PartidoResponse[]> => {
        try {
            const response = await api.get<PartidoResponse[]>('/user/partidos/ultimos-jugados');
            return response.map(partido => PartidoResponseSchema.parse(partido));
        } catch (error) {
            console.error('Error al obtener últimos 5 partidos jugados:', error);
            throw new Error('No se pudieron cargar los últimos partidos jugados');
        }
    },

    obtenerUltimos5PartidosEquipo: async (id_equipo: number): Promise<PartidoResponse[]> => {
        try {
            const response = await api.get<PartidoResponse[]>(`/user/partidos/equipo/${id_equipo}/ultimos`);
            return response.map(partido => PartidoResponseSchema.parse(partido));
        } catch (error) {
            console.error(`Error al obtener últimos 5 partidos del equipo ${id_equipo}:`, error);
            throw new Error('No se pudieron cargar los últimos partidos del equipo');
        }
    },

    obtenerUltimoPartidoEquipo: async (id_equipo: number): Promise<PartidoResponse | null> => {
        try {
            const response = await api.get<PartidoResponse | null>(`/user/partidos/equipo/${id_equipo}/ultimo`);
            return response ? PartidoResponseSchema.parse(response) : null;
        } catch (error) {
            console.error(`Error al obtener último partido del equipo ${id_equipo}:`, error);
            throw new Error('No se pudo cargar el último partido del equipo');
        }
    },

    obtenerProximoPartidoEquipo: async (id_equipo: number): Promise<PartidoResponse | null> => {
        try {
            const response = await api.get<PartidoResponse | null>(`/user/partidos/equipo/${id_equipo}/proximo`);
            return response ? PartidoResponseSchema.parse(response) : null;
        } catch (error) {
            console.error(`Error al obtener próximo partido del equipo ${id_equipo}:`, error);
            throw new Error('No se pudo cargar el próximo partido del equipo');
        }
    },

    obtenerProximos5PartidosProximaJornada: async (): Promise<PartidoResponse[]> => {
        try {
            const response = await api.get<PartidoResponse[]>('/user/partidos/proximos-jornada');
            return response.map(partido => PartidoResponseSchema.parse(partido));
        } catch (error) {
            console.error('Error al obtener próximos 5 partidos de la próxima jornada:', error);
            throw new Error('No se pudieron cargar los próximos partidos de la jornada');
        }
    },

    obtenerProximosPartidosCategorias: async (): Promise<PartidoResponse[]> => {
        try {
            const response = await api.get<PartidoResponse[]>('/user/partidos/proxima-jornada/todas-categorias');
            return response.map(partido => PartidoResponseSchema.parse(partido));
        } catch (error) {
            console.error('Error al obtener próximos 5 partidos de la próxima jornada:', error);
            throw new Error('No se pudieron cargar los próximos partidos de la jornada');
        }
    },

    obtenerUltimosPartidosCategorias: async (): Promise<PartidoResponse[]> => {
        try {
            const response = await api.get<PartidoResponse[]>('/user/partidos/ultima-jornada/todas-categorias');
            return response.map(partido => PartidoResponseSchema.parse(partido));
        } catch (error) {
            console.error('Error al obtener últimos partidos de todas las categorías:', error);
            throw new Error('No se pudieron cargar los últimos partidos de las categorías');
        }
    },

    obtenerPartidosProximaJornadaDia: async (dia: string): Promise<PartidoResponse[]> => {
        try {
            const response = await api.get<PartidoResponse[]>(`/user/partidos/proxima-fecha/${dia}`);
            return response.map(partido => PartidoResponseSchema.parse(partido));
        } catch (error) {
            console.error('Error al obtener partidos de próxima fecha por día:', error);
            throw new Error('No se pudieron cargar los partidos de la próxima fecha');
        }
    },

    crearPartido: async (id_categoria_edicion: number, partidoData: PostPartido): Promise<any> => {
        try {
            const validatedData = PostPartidoSchema.parse(partidoData);
            
            const response = await api.post<any>(`/admin/partidos/${id_categoria_edicion}`, validatedData);
            
            // return CrearPartidoResponseSchema.parse(response);
            return response;
        } catch (error: any) {
            console.error('Error al crear partido:', error);
            throw error;
        }
    },

    obtenerPartidosPorJornadaYCategoria: async (jornada: number, id_categoria_edicion: number): Promise<PartidosPorJornadaResponse> => {
        try {
            const response = await api.get<PartidosPorJornadaResponse>(`/admin/partidos/jornada/${jornada}/${id_categoria_edicion}`);
            return response;
            // return PartidosPorJornadaResponseSchema.parse(response);
        } catch (error) {
            console.error('Error al obtener partidos por jornada y categoría:', error);
            throw new Error('No se pudieron cargar los partidos de la jornada y categoría');
        }
    },

    eliminarPartido: async (id_partido: number): Promise<EliminarPartidoResponse> => {
        try {
            const response = await api.put<EliminarPartidoResponse>(`/admin/partidos/eliminar/${id_partido}`);
            
            return response;
        } catch (error) {
            console.error('Error al eliminar partido:', error);
            throw error;
        }
    },

    actualizarPartido: async (id_categoria_edicion: number, id_partido: number, partidoData: UpdatePartido): Promise<ActualizarPartidoResponse> => {
        try {
            console.log(partidoData);
            
            const validatedData = UpdatePartidoSchema.parse(partidoData);
            const response = await api.put<ActualizarPartidoResponse>(`/admin/partidos/${id_categoria_edicion}/${id_partido}`, validatedData);
            return response;
        } catch (error) {
            console.error('Error al actualizar partido:', error);
            throw error;
        }
    },

    /**
     * Obtener últimos y próximos partidos del jugador autenticado
     */
    obtenerUltimosYProximosPartidosJugador: async (): Promise<UltimoYProximoPartidoResponse> => {
        try {
            const response = await api.get<UltimoYProximoPartidoResponse>('/user/partidos/ultimos-proximos');
            return response;
        } catch (error) {
            console.error('Error al obtener últimos y próximos partidos del jugador:', error);
            throw new Error('No se pudieron cargar los partidos del jugador');
        }
    },

    /**
     * Obtener partidos con paginación para usuarios
     */
    obtenerPartidosUsuario: async (
        tipo: 'fecha' | 'jornada',
        id_categoria_edicion?: number,
        jornada?: number,
        limit?: number,
        page?: number
    ) => {
        try {
            const params = new URLSearchParams();
            params.append('tipo', tipo);
            if (id_categoria_edicion) params.append('id_categoria_edicion', id_categoria_edicion.toString());
            if (jornada) params.append('jornada', jornada.toString());
            if (limit) params.append('limit', limit.toString());
            if (page) params.append('page', page.toString());

            const queryString = params.toString();
            const endpoint = `/user/partidos${queryString ? `?${queryString}` : ''}`;
            
            return await api.get(endpoint);
        } catch (error: any) {
            console.error('Error al obtener partidos del usuario:', error);
            throw new Error(error.response?.data?.error || 'No se pudieron obtener los partidos');
        }
    },

    /**
     * Obtener partido completo por ID para usuarios
     */
    obtenerPartidoDetalleUsuario: async (id_partido: number) => {
        try {
            return await api.get(`/user/partidos/${id_partido}`);
        } catch (error: any) {
            console.error('Error al obtener detalle del partido:', error);
            throw new Error(error.response?.data?.error || 'No se pudo obtener el detalle del partido');
        }
    },

    // ============================================
    // PARTIDOS POR EQUIPO (filtrados por equipo)
    // ============================================

    /**
     * Obtener partidos del equipo con paginación (por fecha o jornada)
     * @param id_equipo - ID del equipo (requerido)
     * @param tipo - Tipo de filtrado: 'fecha' o 'jornada'
     * @param id_categoria_edicion - ID de la categoría edición (opcional). Si no se pasa, se usará la última categoría activa donde participa el equipo
     * @param jornada - Jornada específica (opcional, solo si tipo === 'jornada')
     * @param limit - Límite de resultados por página (default: 20)
     * @param page - Número de página (default: 1)
     */
    obtenerPartidosUsuarioPorEquipo: async (
        id_equipo: number,
        tipo: 'fecha' | 'jornada',
        id_categoria_edicion?: number | null,
        jornada?: number,
        limit?: number,
        page?: number
    ) => {
        try {
            const params = new URLSearchParams();
            params.append('tipo', tipo);
            if (id_categoria_edicion) params.append('id_categoria_edicion', id_categoria_edicion.toString());
            if (jornada) params.append('jornada', jornada.toString());
            if (limit) params.append('limit', limit.toString());
            if (page) params.append('page', page.toString());

            const queryString = params.toString();
            const endpoint = `/user/partidos/equipo/${id_equipo}${queryString ? `?${queryString}` : ''}`;
            
            return await api.get(endpoint);
        } catch (error: any) {
            console.error('Error al obtener partidos del equipo:', error);
            throw new Error(error.response?.data?.error || 'No se pudieron obtener los partidos del equipo');
        }
    },
};