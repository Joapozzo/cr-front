import { api } from "../lib/api";
import { EquipoActual, Equipo, CrearEquipoInput, EquipoResponse, EquiposPorCategoriaResponse, BuscarEquiposDisponiblesResponse, EquipoExpulsadoResponse, BuscarEquiposEdicionResponse, ActualizarEquipoInput, ActualizarEquipoResponse, EquipoDisponible } from "../types/equipo";
import { UltimoYProximoPartidoResponse } from "../types/partido";
import { EstadisticasPlantelResponse } from "../types/plantel";
import { CancelarInvitacionParams, ConfirmarSolicitudParams, EnviarInvitacionParams, ObtenerSolicitudesEquipoResponse, RechazarSolicitudParams, SolicitudBajaResponse } from "../types/solicitudes";
import { getCapitanData } from "../utils/capitanHelpers";

export const equiposService = {
    obtenerEquiposActuales: async (): Promise<EquipoActual[]> => {
        try {
            return await api.get<EquipoActual[]>('/user/equipos');
        } catch (error) {
            console.error('Error al obtener equipos actuales:', error);
            throw new Error('No se pudieron cargar los equipos actuales');
        }
    },

    obtenerTodosLosEquipos: async (): Promise<Equipo[]> => {
        try {
            return await api.get<Equipo[]>('/admin/equipos');
        } catch (error) {
            console.error('Error al obtener todos los equipos:', error);
            throw new Error('No se pudieron cargar todos los equipos');
        }
    },

    obtenerEquipoPorId: async (id: number): Promise<Equipo> => {
        try {
            return await api.get<Equipo>(`/user/equipos/${id}`);
        } catch (error) {
            console.error(`Error al obtener equipo ${id}:`, error);
            throw new Error('No se pudo cargar el equipo');
        }
    },

    crearEquipo: async (data: CrearEquipoInput): Promise<EquipoResponse> => {
        try {
            return await api.post<EquipoResponse>('/admin/equipos', data);
        } catch (error: unknown) {
            // api.ts ya procesa el error y extrae el mensaje de errorData.error || errorData.message
            // El mensaje del backend ya está en error.message
            if (error instanceof Error) {
                // El mensaje del backend ya viene procesado desde api.ts
                throw new Error(error.message);
            }
            
            console.error('Error al crear equipo:', error);
            throw new Error('No se pudo crear el equipo');
        }
    },

    obtenerEquiposPorCategoriaEdicion: async (id_categoria_edicion: number): Promise<EquiposPorCategoriaResponse> => {
        try {
            return await api.get<EquiposPorCategoriaResponse>(`/admin/equipos/${id_categoria_edicion}`);
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Categoría edición no encontrada');
            }

            console.error('Error al obtener equipos por categoría edición:', error);
            throw new Error(error.response?.data?.message || 'No se pudieron cargar los equipos');
        }
    },

    buscarEquiposDisponibles: async (
        query: string,
        id_edicion: number,
        limit: number = 10
    ): Promise<{ equipos: EquipoDisponible[]; total: number }> => {
        try {
            if (query.trim().length < 2) {
                return { equipos: [], total: 0 };
            }

            const params = new URLSearchParams({
                q: query.trim(),
                edicion_id: id_edicion.toString(),
                limit: limit.toString()
            });

            const response = await api.get<BuscarEquiposDisponiblesResponse>(
                `/admin/equipos/buscar?${params}`
            );

            return response.data;

        } catch (error: any) {
            console.error('Error al buscar equipos disponibles:', error);
            throw new Error(error.response?.data?.message || 'No se pudieron buscar los equipos');
        }
    },

    buscarEquiposEdicionDisponibles: async (
        query: string,
        id_edicion: number,
        limit: number = 10
    ): Promise<{ equipos: Equipo[]; total: number }> => {
        try {
            if (query.trim().length < 2) {
                return { equipos: [], total: 0 };
            }

            const params = new URLSearchParams({
                q: query.trim(),
                edicion_id: id_edicion.toString(),
                limit: limit.toString()
            });

            const response = await api.get<BuscarEquiposEdicionResponse>(
                `/user/equipos-edicion?${params}`
            );

            return response.data;

        } catch (error: any) {
            console.error('Error al buscar equipos disponibles:', error);
            throw new Error(error.response?.data?.message || 'No se pudieron buscar los equipos');
        }
    },

    obtenerEquipoConPlantel: async (id_equipo: number, id_categoria_edicion: number) => {
        try {
            return await api.get(`/admin/equipos/plantel/${id_equipo}/${id_categoria_edicion}`);
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Equipo o categoría no encontrados');
            }

            if (error.response?.status === 400) {
                throw new Error(error.response.data.error || 'El equipo no participa en esta categoría');
            }

            console.error('Error al obtener equipo con plantel:', error);
            throw new Error(error.response?.data?.error || 'No se pudo cargar el plantel del equipo');
        }
    },

    agregarJugadorAlPlantel: async (
        id_equipo: number,
        id_categoria_edicion: number,
        id_jugador: number
    ) => {
        try {
            return await api.post(
                `/admin/equipos/agregar-jugador/${id_equipo}/${id_categoria_edicion}`,
                { id_jugador }
            );
        } catch (error: any) {
            console.error('Error al agregar jugador al plantel:', error);
            throw error;
        }
    },

    agregarJugadorYAsignarCapitan: async (
        id_equipo: number,
        id_categoria_edicion: number,
        id_jugador: number
    ) => {
        try {
            return await api.post(
                `/admin/equipos/agregar-jugador-capitan/${id_equipo}/${id_categoria_edicion}`,
                { id_jugador }
            );
        } catch (error: any) {
            console.error('Error al agregar jugador al plantel y asignar como capitán:', error);
            throw error;
        }
    },

    asignarCapitan: async (
        id_equipo: number,
        id_categoria_edicion: number,
        id_jugador: number
    ) => {
        try {
            return await api.post(
                `/admin/equipos/activar-capitan/${id_equipo}/${id_categoria_edicion}`,
                { id_jugador }
            );
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Jugador, equipo o categoría no encontrados');
            }

            if (error.response?.status === 400) {
                throw new Error(error.response.data.error || 'El jugador no pertenece al plantel del equipo');
            }

            if (error.response?.status === 409) {
                throw new Error(error.response.data.error || 'Ya existen 2 capitanes activos o el jugador ya es capitán');
            }

            console.error('Error al asignar capitán:', error);
            throw new Error(error.response?.data?.error || 'No se pudo asignar el capitán');
        }
    },

    desactivarCapitan: async (
        id_equipo: number,
        id_categoria_edicion: number,
        id_jugador: number
    ) => {
        try {
            return await api.put(
                `/admin/equipos/desactivar-capitan/${id_equipo}/${id_categoria_edicion}`,
                { id_jugador }
            );
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Jugador, equipo o categoría no encontrados');
            }

            if (error.response?.status === 400) {
                throw new Error(error.response.data.error || 'El jugador no es capitán de este equipo');
            }

            if (error.response?.status === 409) {
                throw new Error(error.response.data.error || 'El capitán ya está desactivado');
            }

            console.error('Error al desactivar capitán:', error);
            throw new Error(error.response?.data?.error || 'No se pudo desactivar el capitán');
        }
    },

    buscarJugadores: async (
        query: string,
        limit: number = 10
    ): Promise<{ jugadores: any[]; total: number }> => {
        try {
            if (query.trim().length < 2) {
                return { jugadores: [], total: 0 };
            }

            const params = new URLSearchParams({
                q: query.trim(),
                limit: limit.toString()
            });

            const response = await api.get<any>(
                `/admin/equipos/jugadores/buscar?${params}`
            );

            return response.data;

        } catch (error: any) {
            console.error('Error al buscar jugadores:', error);
            throw new Error(error.response?.data?.error || 'No se pudieron buscar los jugadores');
        }
    },

    expulsarEquipo: async (
        id_equipo: number,
        id_categoria_edicion: number,
    ): Promise<{ message: string; expulsion: any }> => {
        try {
            return await api.post(`/admin/equipos/expulsar/${id_equipo}/${id_categoria_edicion}`);
        } catch (error: any) {
            if (error.response?.status === 400) {
                throw new Error(error.response.data.error || 'Datos inválidos');
            }

            if (error.response?.status === 404) {
                throw new Error('Equipo o categoría edición no encontrados');
            }

            if (error.response?.status === 409) {
                throw new Error('El equipo ya está expulsado de esta categoría');
            }

            console.error('Error al expulsar equipo:', error);
            throw new Error(error.response?.data?.error || 'No se pudo expulsar el equipo');
        }
    },

    reactivarEquipo: async (
        id_equipo: number,
        id_categoria_edicion: number
    ): Promise<{ message: string; registros_actualizados: number }> => {
        try {
            return await api.put(`/admin/equipos/reactivar/${id_equipo}/${id_categoria_edicion}`);
        } catch (error: any) {
            if (error.response?.status === 400) {
                throw new Error(error.response.data.error || 'Datos inválidos');
            }

            if (error.response?.status === 404) {
                throw new Error('No se encontró una expulsión activa para este equipo en esta categoría');
            }

            console.error('Error al reactivar equipo:', error);
            throw new Error(error.response?.data?.error || 'No se pudo reactivar el equipo');
        }
    },

    obtenerEquiposInactivosPorCategoriaEdicion: async (id_categoria_edicion: number): Promise<EquipoExpulsadoResponse> => {
        try {
            return await api.get<EquipoExpulsadoResponse>(`/admin/equipos/inactivos/${id_categoria_edicion}`);
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Categoría edición no encontrada');
            }

            console.error('Error al obtener equipos por categoría edición:', error);
            throw new Error(error.response?.data?.message || 'No se pudieron cargar los equipos');
        }
    },

    // Capitanes
    confirmarSolicitud: async (params: ConfirmarSolicitudParams): Promise<any> => {
        const capitanData = getCapitanData();
        if (!capitanData) {
            throw new Error('No tienes permisos de capitán para esta acción');
        }

        const { id_solicitud, id_jugador } = params;
        const response = await api.put(
            `/user/confirmar-solicitud/${capitanData.id_equipo}/${capitanData.id_jugador}/${capitanData.id_categoria_edicion}`,
            { id_solicitud, id_jugador }
        );
        return response;
    },

    rechazarSolicitud: async (params: RechazarSolicitudParams): Promise<any> => {
        const capitanData = getCapitanData();
        if (!capitanData) {
            throw new Error('No tienes permisos de capitán para esta acción');
        }

        const { id_solicitud, id_jugador } = params;
        const response = await api.put(
            `/user/rechazar-solicitud/${capitanData.id_equipo}/${capitanData.id_jugador}/${capitanData.id_categoria_edicion}`,
            { id_solicitud, id_jugador }
        );
        return response;
    },

    enviarInvitacion: async (params: EnviarInvitacionParams): Promise<any> => {
        const capitanData = getCapitanData();
        if (!capitanData) {
            throw new Error('No tienes permisos de capitán para esta acción');
        }

        const { id_jugador_invitado, mensaje_capitan } = params;
        const response = await api.post(
            `/user/enviar-invitacion/${capitanData.id_equipo}/${capitanData.id_jugador}/${capitanData.id_categoria_edicion}`,
            { id_jugador_invitado, mensaje_capitan }
        );
        return response;
    },

    cancelarInvitacion: async (params: CancelarInvitacionParams): Promise<any> => {
        const capitanData = getCapitanData();
        if (!capitanData) {
            throw new Error('No tienes permisos de capitán para esta acción');
        }

        const { id_solicitud } = params;
        const response = await api.put(
            `/user/cancelar-invitacion/${id_solicitud}`,
            {
                id_equipo: capitanData.id_equipo,
                id_jugador: capitanData.id_jugador,
                id_categoria_edicion: capitanData.id_categoria_edicion
            }
        );
        return response;
    },

    obtenerSolicitudesEquipo: async (): Promise<ObtenerSolicitudesEquipoResponse> => {
        const capitanData = getCapitanData();
        if (!capitanData) {
            throw new Error('No tienes permisos de capitán para esta acción');
        }

        const response = await api.get<ObtenerSolicitudesEquipoResponse>(
            `/user/solicitudes-equipo/${capitanData.id_equipo}/${capitanData.id_jugador}/${capitanData.id_categoria_edicion}`
        );
        return response;
    },

    obtenerInvitacionesEnviadas: async (): Promise<ObtenerSolicitudesEquipoResponse> => {
        const capitanData = getCapitanData();
        if (!capitanData) {
            throw new Error('No tienes permisos de capitán para esta acción');
        }

        const response = await api.get<ObtenerSolicitudesEquipoResponse>(
            `/user/invitaciones-equipo/${capitanData.id_equipo}/${capitanData.id_jugador}/${capitanData.id_categoria_edicion}`
        );
        return response;
    },

    obtenerEstadisticasJugadoresPlantel: async (id_equipo: number, id_categoria_edicion: number): Promise<EstadisticasPlantelResponse[]> => {
        const response = await api.get<EstadisticasPlantelResponse[]>(
            `/user/estadisticas-plantel/${id_equipo}/${id_categoria_edicion}`
        );

        return response;
    },

    //! REVISAR: Recibe data de capitan por parametro useSolitudesBaja
    obtenerSolicitudesBajaEquipo: async (id_equipo: number, id_jugador: number, id_categoria_edicion: number): Promise<SolicitudBajaResponse> => {
        const response = await api.get<SolicitudBajaResponse>(
            `/user/solicitudes-baja/${id_equipo}/${id_jugador}/${id_categoria_edicion}`
        );
        return response;
    },

    obtenerUltimoyProximoPartido: async (id_equipo: number, id_categoria_edicion: number): Promise<UltimoYProximoPartidoResponse> => {
        const response = await api.get<UltimoYProximoPartidoResponse>(
            `/user/ultimo-proximo-partido/${id_equipo}/${id_categoria_edicion}`
        );
        return response;
    },

    actualizarEquipo: async (id_equipo: number, data: ActualizarEquipoInput): Promise<ActualizarEquipoResponse> => {
        try {
            return await api.put<ActualizarEquipoResponse>(`/admin/equipos/${id_equipo}`, data);
        } catch (error: any) {
            if (error.response?.status === 400) {
                const backendErrors = error.response.data.errors;
                if (backendErrors && Array.isArray(backendErrors)) {
                    const errorMessages = backendErrors.map((err: any) => err.message).join(', ');
                    throw new Error(errorMessages);
                }
                throw new Error(error.response.data.error || 'Datos inválidos');
            }

            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Equipo no encontrado');
            }

            if (error.response?.status === 409) {
                throw new Error(error.response.data.error || 'Ya existe un equipo con ese nombre');
            }

            console.error('Error al actualizar equipo:', error);
            throw new Error(error.response?.data?.error || 'No se pudo actualizar el equipo');
        }
    },
};