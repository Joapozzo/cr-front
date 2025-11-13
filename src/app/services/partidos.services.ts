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
};