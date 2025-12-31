import { api } from "../lib/api";
import { EquipoActual, Equipo, CrearEquipoInput, EquipoResponse, EquiposPorCategoriaResponse, BuscarEquiposDisponiblesResponse, EquipoExpulsadoResponse, BuscarEquiposEdicionResponse, ActualizarEquipoInput, ActualizarEquipoResponse, EquipoDisponible } from "../types/equipo";
import { UltimoYProximoPartidoResponse } from "../types/partido";
import { EstadisticasPlantelResponse, JugadorBusqueda, BuscarJugadoresResponse } from "../types/plantel";
import { CancelarInvitacionParams, ConfirmarSolicitudParams, EnviarInvitacionParams, ObtenerSolicitudesEquipoResponse, RechazarSolicitudParams, SolicitudBajaResponse, SolicitudResponse } from "../types/solicitudes";

// Tipo para errores de API con response
interface ApiError extends Error {
    response?: {
        status?: number;
        data?: {
            error?: string;
            message?: string;
            errors?: Array<{ message: string }>;
        };
    };
}

// Helper para verificar si es un ApiError
const isApiError = (error: unknown): error is ApiError => {
    return error instanceof Error && 'response' in error;
};

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
            const response = await api.get<{ success: boolean; data: { id_equipo: number; nombre: string; descripcion?: string; img: string | null } }>(`/legajos/equipo/${id}`);
            // Transformar la respuesta del endpoint de legajos al formato Equipo esperado
            return {
                id_equipo: response.data.id_equipo,
                nombre: response.data.nombre,
                descripcion: response.data.descripcion,
                img: response.data.img,
                categorias: [] // Se puede obtener por separado si es necesario
            };
        } catch (error) {
            console.error(`Error al obtener equipo ${id}:`, error);
            throw new Error('No se pudo cargar el equipo');
        }
    },

    crearEquipo: async (data: CrearEquipoInput): Promise<EquipoResponse> => {
        try {
            return await api.post<EquipoResponse>('/admin/equipos', data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            
            console.error('Error al crear equipo:', error);
            throw new Error('No se pudo crear el equipo');
        }
    },

    obtenerEquiposPorCategoriaEdicion: async (id_categoria_edicion: number): Promise<EquiposPorCategoriaResponse> => {
        try {
            return await api.get<EquiposPorCategoriaResponse>(`/admin/equipos/${id_categoria_edicion}`);
        } catch (error: unknown) {
            if (isApiError(error)) {
                if (error.response?.status === 404) {
                    throw new Error('Categoría edición no encontrada');
                }
                throw new Error(error.response?.data?.message || 'No se pudieron cargar los equipos');
            }
            console.error('Error al obtener equipos por categoría edición:', error);
            throw new Error('No se pudieron cargar los equipos');
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

        } catch (error: unknown) {
            console.error('Error al buscar equipos disponibles:', error);
            if (isApiError(error)) {
                throw new Error(error.response?.data?.message || 'No se pudieron buscar los equipos');
            }
            throw new Error('No se pudieron buscar los equipos');
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

        } catch (error: unknown) {
            console.error('Error al buscar equipos disponibles:', error);
            if (isApiError(error)) {
                throw new Error(error.response?.data?.message || 'No se pudieron buscar los equipos');
            }
            throw new Error('No se pudieron buscar los equipos');
        }
    },

    obtenerEquipoConPlantel: async (id_equipo: number, id_categoria_edicion: number) => {
        try {
            return await api.get(`/admin/equipos/plantel/${id_equipo}/${id_categoria_edicion}`);
        } catch (error: unknown) {
            if (isApiError(error)) {
                if (error.response?.status === 404) {
                    throw new Error(error.response.data?.error || 'Equipo o categoría no encontrados');
                }
                if (error.response?.status === 400) {
                    throw new Error(error.response.data?.error || 'El equipo no participa en esta categoría');
                }
                throw new Error(error.response?.data?.error || 'No se pudo cargar el plantel del equipo');
            }
            console.error('Error al obtener equipo con plantel:', error);
            throw new Error('No se pudo cargar el plantel del equipo');
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
        } catch (error: unknown) {
            if (isApiError(error)) {
                // Propagar el mensaje de error del backend
                throw new Error(error.response?.data?.error || 'No se pudo agregar el jugador al plantel');
            }
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
        } catch (error: unknown) {
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
        } catch (error: unknown) {
            if (isApiError(error)) {
                if (error.response?.status === 404) {
                    throw new Error(error.response.data?.error || 'Jugador, equipo o categoría no encontrados');
                }
                if (error.response?.status === 400) {
                    throw new Error(error.response.data?.error || 'El jugador no pertenece al plantel del equipo');
                }
                if (error.response?.status === 409) {
                    throw new Error(error.response.data?.error || 'Ya existen 2 capitanes activos o el jugador ya es capitán');
                }
                throw new Error(error.response?.data?.error || 'No se pudo asignar el capitán');
            }
            console.error('Error al asignar capitán:', error);
            throw new Error('No se pudo asignar el capitán');
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
        } catch (error: unknown) {
            if (isApiError(error)) {
                if (error.response?.status === 404) {
                    throw new Error(error.response.data?.error || 'Jugador, equipo o categoría no encontrados');
                }
                if (error.response?.status === 400) {
                    // Incluye el error de "No se puede desactivar" cuando es el último capitán
                    throw new Error(error.response.data?.error || 'El jugador no es capitán de este equipo');
                }
                if (error.response?.status === 409) {
                    throw new Error(error.response.data?.error || 'El capitán ya está desactivado');
                }
                throw new Error(error.response?.data?.error || 'No se pudo desactivar el capitán');
            }
            console.error('Error al desactivar capitán:', error);
            throw new Error('No se pudo desactivar el capitán');
        }
    },

    buscarJugadores: async (
        query: string,
        limit: number = 10
    ): Promise<{ jugadores: JugadorBusqueda[]; total: number }> => {
        try {
            if (query.trim().length < 2) {
                return { jugadores: [], total: 0 };
            }

            const params = new URLSearchParams({
                q: query.trim(),
                limit: limit.toString()
            });

            const response = await api.get<BuscarJugadoresResponse>(
                `/admin/equipos/jugadores/buscar?${params}`
            );

            return response.data;

        } catch (error: unknown) {
            console.error('Error al buscar jugadores:', error);
            if (isApiError(error)) {
                throw new Error(error.response?.data?.error || 'No se pudieron buscar los jugadores');
            }
            throw new Error('No se pudieron buscar los jugadores');
        }
    },

    expulsarEquipo: async (
        id_equipo: number,
        id_categoria_edicion: number,
        motivo?: string
    ): Promise<{ message: string; expulsion: unknown }> => {
        try {
            return await api.post(`/admin/equipos/expulsar/${id_equipo}/${id_categoria_edicion}`, {
                motivo: motivo || undefined
            });
        } catch (error: unknown) {
            if (isApiError(error)) {
                if (error.response?.status === 400) {
                    throw new Error(error.response.data?.error || 'Datos inválidos');
                }
                if (error.response?.status === 404) {
                    throw new Error('Equipo o categoría edición no encontrados');
                }
                if (error.response?.status === 409) {
                    throw new Error('El equipo ya está expulsado de esta categoría');
                }
                throw new Error(error.response?.data?.error || 'No se pudo expulsar el equipo');
            }
            console.error('Error al expulsar equipo:', error);
            throw new Error('No se pudo expulsar el equipo');
        }
    },

    reactivarEquipo: async (
        id_equipo: number,
        id_categoria_edicion: number
    ): Promise<{ message: string; registros_actualizados: number }> => {
        try {
            return await api.put(`/admin/equipos/reactivar/${id_equipo}/${id_categoria_edicion}`);
        } catch (error: unknown) {
            if (isApiError(error)) {
                if (error.response?.status === 400) {
                    throw new Error(error.response.data?.error || 'Datos inválidos');
                }
                if (error.response?.status === 404) {
                    throw new Error('No se encontró una expulsión activa para este equipo en esta categoría');
                }
                throw new Error(error.response?.data?.error || 'No se pudo reactivar el equipo');
            }
            console.error('Error al reactivar equipo:', error);
            throw new Error('No se pudo reactivar el equipo');
        }
    },

    obtenerEquiposInactivosPorCategoriaEdicion: async (id_categoria_edicion: number): Promise<EquipoExpulsadoResponse> => {
        try {
            return await api.get<EquipoExpulsadoResponse>(`/admin/equipos/inactivos/${id_categoria_edicion}`);
        } catch (error: unknown) {
            if (isApiError(error)) {
                if (error.response?.status === 404) {
                    throw new Error('Categoría edición no encontrada');
                }
                throw new Error(error.response?.data?.message || 'No se pudieron cargar los equipos');
            }
            console.error('Error al obtener equipos por categoría edición:', error);
            throw new Error('No se pudieron cargar los equipos');
        }
    },

    // Capitanes - reciben id_jugador_capitan como parámetro para evitar SSR issues
    confirmarSolicitud: async (params: ConfirmarSolicitudParams & { id_jugador_capitan: number }): Promise<SolicitudResponse> => {
        const { id_solicitud, id_jugador, id_jugador_capitan, id_equipo, id_categoria_edicion } = params;
        const response = await api.put<SolicitudResponse>(
            `/user/confirmar-solicitud/${id_equipo}/${id_jugador_capitan}/${id_categoria_edicion}`,
            { id_solicitud, id_jugador }
        );
        return response;
    },

    rechazarSolicitud: async (params: RechazarSolicitudParams & { id_jugador_capitan: number }): Promise<SolicitudResponse> => {
        const { id_solicitud, id_jugador, id_jugador_capitan, id_equipo, id_categoria_edicion } = params;
        const response = await api.put<SolicitudResponse>(
            `/user/rechazar-solicitud/${id_equipo}/${id_jugador_capitan}/${id_categoria_edicion}`,
            { id_solicitud, id_jugador }
        );
        return response;
    },

    enviarInvitacion: async (params: EnviarInvitacionParams & { id_jugador_capitan: number; id_categoria_edicion: number }): Promise<SolicitudResponse> => {
        const { id_equipo, id_jugador_invitado, mensaje_capitan, id_jugador_capitan, id_categoria_edicion } = params;
        const response = await api.post<SolicitudResponse>(
            `/user/enviar-invitacion/${id_equipo}/${id_jugador_capitan}/${id_categoria_edicion}`,
            { id_jugador_invitado, mensaje_capitan }
        );
        return response;
    },

    cancelarInvitacion: async (params: CancelarInvitacionParams & { id_jugador_capitan: number }): Promise<{ data: SolicitudResponse }> => {
        const { id_solicitud, id_equipo, id_jugador_capitan, id_categoria_edicion } = params;
        const response = await api.put<{ data: SolicitudResponse }>(
            `/user/cancelar-invitacion/${id_solicitud}`,
            {
                id_equipo,
                id_jugador: id_jugador_capitan,
                id_categoria_edicion
            }
        );
        return response;
    },

    obtenerSolicitudesEquipo: async (id_equipo: number, id_jugador_capitan: number, id_categoria_edicion: number): Promise<ObtenerSolicitudesEquipoResponse> => {
        const response = await api.get<ObtenerSolicitudesEquipoResponse>(
            `/user/solicitudes-equipo/${id_equipo}/${id_jugador_capitan}/${id_categoria_edicion}`
        );
        return response;
    },

    obtenerInvitacionesEnviadas: async (id_equipo: number, id_jugador_capitan: number, id_categoria_edicion: number): Promise<ObtenerSolicitudesEquipoResponse> => {
        const response = await api.get<ObtenerSolicitudesEquipoResponse>(
            `/user/invitaciones-equipo/${id_equipo}/${id_jugador_capitan}/${id_categoria_edicion}`
        );
        return response;
    },

    obtenerEstadisticasJugadoresPlantel: async (id_equipo: number, id_categoria_edicion: number): Promise<EstadisticasPlantelResponse> => {
        const response = await api.get<EstadisticasPlantelResponse>(
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

    obtenerSolicitudesBajaPorJugador: async (id_jugador: number): Promise<{ data: any[]; total: number; pendientes: number; aprobadas: number; rechazadas: number }> => {
        const response = await api.get<{ message: string; data: any[]; total: number; pendientes: number; aprobadas: number; rechazadas: number }>(
            `/user/solicitudes-baja-jugador/${id_jugador}`
        );
        return {
            data: response.data,
            total: response.total,
            pendientes: response.pendientes,
            aprobadas: response.aprobadas,
            rechazadas: response.rechazadas
        };
    },

    obtenerSolicitudesBajaAdmin: async (id_equipo?: number, id_categoria_edicion?: number): Promise<{ solicitudes: any[]; total: number; pendientes: number; aprobadas: number; rechazadas: number }> => {
        try {
            const params = new URLSearchParams();
            if (id_equipo) params.append('id_equipo', id_equipo.toString());
            if (id_categoria_edicion) params.append('id_categoria_edicion', id_categoria_edicion.toString());
            // No filtrar por estado para traer todas las solicitudes (pendientes, aceptadas y rechazadas)
            
            const response = await api.get<{ solicitudes: any[]; total: number; pendientes: number; aprobadas: number; rechazadas: number }>(
                `/admin/equipos/solicitudes-baja?${params.toString()}`
            );
            // Formatear las solicitudes para que sean compatibles con SolicitudResponse
            const solicitudesFormateadas = response.solicitudes?.map((s: any) => {
                const usuarioJugador = s.jugador;
                return {
                    id_solicitud: s.id_solicitud,
                    id_jugador: usuarioJugador.id_jugador,
                    nombre_jugador: `${usuarioJugador.nombre} ${usuarioJugador.apellido}`,
                    img_jugador: usuarioJugador.img || null,
                    id_equipo: s.equipo.id_equipo,
                    nombre_equipo: s.equipo.nombre,
                    img_equipo: s.equipo.img,
                    nombre_categoria: s.categoria || s.categoriaEdicion?.categoria || '',
                    id_categoria_edicion: s.categoriaEdicion?.id_categoria_edicion || 0,
                    edicion: s.categoriaEdicion?.edicion || '',
                    estado: s.estado, // Mantener el estado original ('P', 'A', 'R')
                    tipo_solicitud: 'B' as const, // 'B' para Baja
                    motivo: s.motivo,
                    observaciones: s.observaciones,
                    motivo_rechazo: s.motivo_rechazo,
                    fecha_solicitud: s.fecha_solicitud,
                    fecha_respuesta: s.fecha_respuesta,
                    respondido_por_username: s.respondido_por || null
                };
            }) || [];
            return {
                solicitudes: solicitudesFormateadas,
                total: response.total,
                pendientes: response.pendientes,
                aprobadas: response.aprobadas,
                rechazadas: response.rechazadas
            };
        } catch (error: unknown) {
            if (isApiError(error)) {
                throw new Error(error.response?.data?.error || 'No se pudieron obtener las solicitudes de baja');
            }
            console.error('Error al obtener solicitudes de baja:', error);
            throw new Error('No se pudieron obtener las solicitudes de baja');
        }
    },

    confirmarBajaJugador: async (id_solicitud: number): Promise<{ message: string }> => {
        try {
            const response = await api.put<{ message: string }>(
                `/admin/equipos/confirmar-baja/${id_solicitud}`
            );
            return response;
        } catch (error: unknown) {
            if (isApiError(error)) {
                throw new Error(error.response?.data?.error || 'No se pudo confirmar la baja');
            }
            console.error('Error al confirmar baja:', error);
            throw new Error('No se pudo confirmar la baja');
        }
    },

    rechazarBajaJugador: async (id_solicitud: number, motivo_rechazo?: string): Promise<{ message: string }> => {
        try {
            const response = await api.put<{ message: string }>(
                `/admin/equipos/rechazar-baja/${id_solicitud}`,
                { motivo_rechazo }
            );
            return response;
        } catch (error: unknown) {
            if (isApiError(error)) {
                throw new Error(error.response?.data?.error || 'No se pudo rechazar la baja');
            }
            console.error('Error al rechazar baja:', error);
            throw new Error('No se pudo rechazar la baja');
        }
    },

    // Solicitar baja de jugador
    // Si id_jugador_capitan === id_jugador_baja, usa la ruta de baja propia
    // Si son diferentes, usa la ruta de capitán (requiere validarCapitan)
    solicitarBajaJugador: async (
        id_equipo: number,
        id_jugador_capitan: number,
        id_categoria_edicion: number,
        id_jugador_baja: number,
        motivo?: string,
        observaciones?: string
    ): Promise<{ message: string }> => {
        try {
            const esPropiaBaja = id_jugador_capitan === id_jugador_baja;
            
            // Si es su propia baja, usar ruta de baja propia (no requiere ser capitán)
            // Si es capitán (incluso su propia baja), usar ruta de capitán
            const url = esPropiaBaja 
                ? `/user/solicitar-baja-propia/${id_equipo}/${id_jugador_baja}/${id_categoria_edicion}`
                : `/user/solicitar-baja/${id_equipo}/${id_jugador_capitan}/${id_categoria_edicion}`;
            
            const body = esPropiaBaja
                ? { motivo, observaciones }
                : { id_jugador_baja, motivo, observaciones };

            const response = await api.post<{ message: string }>(url, body);
            return response;
        } catch (error: unknown) {
            if (isApiError(error)) {
                throw new Error(error.response?.data?.error || 'No se pudo solicitar la baja');
            }
            console.error('Error al solicitar baja:', error);
            throw new Error('No se pudo solicitar la baja');
        }
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
        } catch (error: unknown) {
            if (error instanceof Error) {
                // El error 429 viene del middleware de rate limiting
                if (error.message?.includes('429') || error.message?.includes('límite')) {
                    throw error;
                }
            }

            if (isApiError(error)) {
                if (error.response?.status === 400) {
                    const backendErrors = error.response.data?.errors;
                    if (backendErrors && Array.isArray(backendErrors)) {
                        const errorMessages = backendErrors.map((err) => err.message).join(', ');
                        throw new Error(errorMessages);
                    }
                    throw new Error(error.response.data?.error || 'Datos inválidos');
                }
                if (error.response?.status === 404) {
                    throw new Error(error.response.data?.error || 'Equipo no encontrado');
                }
                if (error.response?.status === 409) {
                    throw new Error(error.response.data?.error || 'Ya existe un equipo con ese nombre');
                }
                if (error.response?.status === 429) {
                    throw new Error(error.response.data?.error || 'Has alcanzado el límite de cambios de imagen por mes');
                }
                throw new Error(error.response?.data?.error || error.message || 'No se pudo actualizar el equipo');
            }

            console.error('Error al actualizar equipo:', error);
            throw new Error('No se pudo actualizar el equipo');
        }
    },

    /**
     * Dar de baja a un jugador del plantel (cambiar estado del plantel a 'I')
     */
    darBajaJugadorPlantel: async (
        id_equipo: number,
        id_jugador: number,
        id_categoria_edicion: number
    ): Promise<{ message: string; data: any }> => {
        try {
            const response = await api.put<{ message: string; data: any }>(
                `/admin/equipos/dar-baja-jugador/${id_equipo}/${id_jugador}/${id_categoria_edicion}`
            );
            return response;
        } catch (error: any) {
            console.error('Error al dar de baja jugador del plantel:', error);
            if (isApiError(error)) {
                throw new Error(error.response?.data?.error || error.message || 'No se pudo dar de baja al jugador');
            }
            throw new Error('No se pudo dar de baja al jugador');
        }
    },

    /**
     * Expulsar permanentemente a un jugador del torneo (cambiar estado del jugador a 'E')
     */
    expulsarJugadorTorneo: async (
        id_jugador: number,
        motivo?: string
    ): Promise<{ message: string; data: any }> => {
        try {
            const response = await api.put<{ message: string; data: any }>(
                `/admin/equipos/expulsar-jugador/${id_jugador}`,
                { motivo }
            );
            return response;
        } catch (error: any) {
            console.error('Error al expulsar jugador del torneo:', error);
            if (isApiError(error)) {
                throw new Error(error.response?.data?.error || error.message || 'No se pudo expulsar al jugador');
            }
            throw new Error('No se pudo expulsar al jugador');
        }
    },

    /**
     * Reactivar a un jugador expulsado (cambiar estado del jugador de 'E' a 'A')
     */
    reactivarJugadorTorneo: async (
        id_jugador: number
    ): Promise<{ message: string; data: any }> => {
        try {
            const response = await api.put<{ message: string; data: any }>(
                `/admin/equipos/reactivar-jugador/${id_jugador}`
            );
            return response;
        } catch (error: any) {
            console.error('Error al reactivar jugador del torneo:', error);
            if (isApiError(error)) {
                throw new Error(error.response?.data?.error || error.message || 'No se pudo reactivar al jugador');
            }
            throw new Error('No se pudo reactivar al jugador');
        }
    },

    updateApercibimientos: async (
        idEquipo: number,
        idCategoriaEdicion: number,
        idZona: number,
        apercibimientos: number
    ) => {
        try {
            return await api.patch(
                `/admin/equipos/${idEquipo}/apercibimientos`,
                {
                    apercibimientos,
                    id_categoria_edicion: idCategoriaEdicion,
                    id_zona: idZona
                }
            );
        } catch (error: unknown) {
            if (isApiError(error)) {
                throw new Error(error.response?.data?.error || 'No se pudieron actualizar los apercibimientos');
            }
            console.error('Error al actualizar apercibimientos:', error);
            throw new Error('No se pudieron actualizar los apercibimientos');
        }
    },
};
