import { api } from "../lib/api";
import { Jugador, JugadorDestacadoDt, JugadoresDestacadosResponse, ObtenerEquiposActualesDelJugadorResponse, PosicionJugadorResponse, SearchJugadoresResponse, SearchJugadoresCategoriaResponse } from "../types/jugador";
import { PosicionJugador } from "../types/partido";
import { EnviarSolicitudData } from "../types/solicitudes";
import { getCapitanData } from "../utils/capitanHelpers";
import { EquipoUsuario } from "../stores/authStore";

export interface BuscarJugadoresPorNombreParams {
    query: string;
    limit?: number;
}

export interface BuscarJugadoreResponse {
    jugadores: Jugador[];
    total: number;
}

export const jugadorService = {
    obtenerPerfilJugador: async (id: number): Promise<any> => {
        const response = await api.get(`/user/jugador/${id}/perfil`);
        return response;
    },

    /**
     * Obtener o crear jugador del usuario autenticado
     */
    obtenerJugadorAutenticado: async (): Promise<any> => {
        const response = await api.get('/user/jugador/perfil-autenticado');
        return response;
    },

    enviarSolicitudJugador: async (data: EnviarSolicitudData): Promise<any> => {
        const response = await api.post(`/user/enviar-solicitud`, data);
        return response;
    },

    obtenerSolicitudesJugador: async (id: number): Promise<any> => {
        const response = await api.get(`/user/solicitudes-jugador/${id}`);
        return response;
    },

    // Confirmar invitación (jugador acepta invitación de equipo)
    confirmarInvitacion: async (id_solicitud: number, id_jugador: number): Promise<any> => {
        const response = await api.put(`/user/confirmar-invitacion/${id_solicitud}`, {
            id_jugador
        });
        return response;
    },

    // jugadorService
    rechazarInvitacion: async (id_solicitud: number): Promise<any> => {
        const response = await api.put(`/user/rechazar-invitacion/${id_solicitud}`);
        ('🔍 Response del servicio:', response);
        return response;
    },

    // Cancelar solicitud (jugador cancela su propia solicitud)
    cancelarSolicitud: async (id_solicitud: number): Promise<any> => {
        const response = await api.put(`/user/cancelar-solicitud/${id_solicitud}`);
        return response;
    },

    // Buscar jugadores por nombre
    buscarJugadoresPorNombre: async (params: BuscarJugadoresPorNombreParams): Promise<BuscarJugadoreResponse> => {
        const { query, limit = 10 } = params;
        const encodedQuery = encodeURIComponent(query);
        const response = await api.get<BuscarJugadoreResponse>(`/user/jugadores/buscar?query=${encodedQuery}&limit=${limit}`);
        return response;
    },

    obtenerEquiposJugador: async (id_jugador: number): Promise<ObtenerEquiposActualesDelJugadorResponse[]> => {
        const response = await api.get<ObtenerEquiposActualesDelJugadorResponse[]>(`/user/jugador/equipos/${id_jugador}`);
        return response;
    },

    /**
     * Obtener equipos del usuario autenticado (solo id, nombre, img)
     */
    obtenerEquiposUsuario: async (): Promise<EquipoUsuario[]> => {
        const response = await api.get<EquipoUsuario[]>('/user/partidos/equipos');
        return response;
    },

    /**
     * Obtener equipos del usuario autenticado con información completa (incluyendo id_categoria_edicion)
     */
    obtenerEquiposUsuarioCompletos: async (): Promise<ObtenerEquiposActualesDelJugadorResponse[]> => {
        const response = await api.get<ObtenerEquiposActualesDelJugadorResponse[]>('/user/equipos/equipos-completos');
        return response;
    },

    solicitarBajaJugador: async (id_jugador_baja: number, motivo: string, observaciones: string): Promise<any> => {
        const capitanData = getCapitanData();

        if (!capitanData) {
            throw new Error('No tienes permisos de capitán para esta acción');
        }
        const response = await api.post(`/user/solicitar-baja/${capitanData.id_equipo}/${capitanData.id_jugador}/${capitanData.id_categoria_edicion}`, {
            id_jugador_baja,
            motivo,
            observaciones
        });
        return response;
    },

    obtenerDestacadosJornada: async (
        id_categoria_edicion: number,
        jornada: number,
        id_posicion?: number
    ): Promise<JugadorDestacadoDt[]> => {
        try {
            // Construir URL con query params opcionales
            let url = `/admin/jugadores/destacados/${id_categoria_edicion}/jornada/${jornada}`;

            if (id_posicion) {
                url += `?id_posicion=${id_posicion}`;
            }

            const response = await api.get<JugadoresDestacadosResponse>(url);

            return response.data;
        } catch (error) {
            console.error('Error al obtener jugadores destacados:', error);
            throw error;
        }
    },

    obtenerPosiciones: async (): Promise<PosicionJugador[]> => {
        const response = await api.get<PosicionJugadorResponse>('/admin/jugadores/posiciones');
        return response.data;
    },

    buscarJugadoresPorNombreEnJornada: async (
        query: string,
        id_categoria_edicion: number,
        jornada: number,
        limit?: number
    ): Promise<SearchJugadoresResponse> => {
        const response = await api.get<SearchJugadoresResponse>(
            `/admin/jugadores/buscar/${id_categoria_edicion}/${jornada}?query=${query}&limit=${limit}`
        );
        return response;
    },

    // Buscar jugadores por nombre en una categoría edición (sin filtro de jornada)
    buscarJugadoresPorNombreEnCategoria: async (
        query: string,
        id_categoria_edicion: number,
        limit: number = 10
    ): Promise<SearchJugadoresCategoriaResponse> => {
        const response = await api.get<SearchJugadoresCategoriaResponse>(
            `/admin/jugadores/buscar-categoria/${id_categoria_edicion}?query=${query}&limit=${limit}`
        );
        return response;
    }
}