import { api } from "../lib/api";
import {
    ConsultarDisponibilidadParams,
    ConsultarDisponibilidadResponse,
    DisponibilidadCancha,
    CanchaDisponible
} from "../types/canchas";

export const canchasService = {
    /**
     * Obtener partidos por cancha y fecha
     */
    obtenerPartidosPorCanchaYFecha: async (
        id_cancha: number,
        fecha: string,
        incluirPasados: boolean = false
    ): Promise<any[]> => {
        try {
            const queryParams = new URLSearchParams({
                fecha,
                ...(incluirPasados && { incluir_pasados: 'true' })
            });

            const url = `/admin/canchas/${id_cancha}/partidos?${queryParams.toString()}`;
            const response = await api.get<{ partidos: any[]; total: number }>(url);
            return response.partidos;
        } catch (error: unknown) {
            console.error('Error al obtener partidos por cancha:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('No se pudieron obtener los partidos de la cancha');
        }
    },

    /**
     * Consultar disponibilidad de canchas
     */
    consultarDisponibilidad: async (
        params: ConsultarDisponibilidadParams
    ): Promise<ConsultarDisponibilidadResponse> => {
        try {
            const queryParams = new URLSearchParams({
                fecha: params.fecha,
                hora_inicio: params.hora_inicio,
                id_categoria_edicion: params.id_categoria_edicion.toString(),
            });

            if (params.id_predio) {
                queryParams.append('id_predio', params.id_predio.toString());
            }

            if (params.id_cancha) {
                queryParams.append('id_cancha', params.id_cancha.toString());
            }

            if (params.id_partido_excluir) {
                queryParams.append('id_partido_excluir', params.id_partido_excluir.toString());
            }

            const url = `/admin/canchas/disponibilidad?${queryParams.toString()}`;
            return await api.get<ConsultarDisponibilidadResponse>(url);
        } catch (error: unknown) {
            console.error('Error al consultar disponibilidad de canchas:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('No se pudo consultar la disponibilidad de canchas');
        }
    },

    /**
     * Verificar disponibilidad de una cancha específica
     */
    verificarDisponibilidadCancha: async (
        fecha: string,
        hora_inicio: string,
        id_categoria_edicion: number,
        id_cancha: number,
        id_partido_excluir?: number
    ): Promise<DisponibilidadCancha> => {
        try {
            const params: ConsultarDisponibilidadParams = {
                fecha,
                hora_inicio,
                id_categoria_edicion,
                id_cancha,
                ...(id_partido_excluir && { id_partido_excluir }),
            };

            const response = await canchasService.consultarDisponibilidad(params);
            
            return {
                disponible: response.disponible ?? false,
                conflictos: response.conflictos || [],
                mensaje: response.mensaje,
                total_partidos_dia: response.total_partidos_dia,
                llegara_al_limite: response.llegara_al_limite,
                advertencia: response.advertencia,
            };
        } catch (error: unknown) {
            console.error('Error al verificar disponibilidad de cancha:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('No se pudo verificar la disponibilidad de la cancha');
        }
    },

    /**
     * Obtener todas las canchas disponibles para un horario
     */
    obtenerCanchasDisponibles: async (
        fecha: string,
        hora_inicio: string,
        id_categoria_edicion: number,
        id_predio?: number
    ): Promise<CanchaDisponible[]> => {
        try {
            const params: ConsultarDisponibilidadParams = {
                fecha,
                hora_inicio,
                id_categoria_edicion,
                ...(id_predio && { id_predio }),
            };

            const response = await canchasService.consultarDisponibilidad(params);
            return response.canchas || [];
        } catch (error: unknown) {
            console.error('Error al obtener canchas disponibles:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('No se pudieron obtener las canchas disponibles');
        }
    },
};

