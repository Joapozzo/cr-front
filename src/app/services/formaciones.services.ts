import { api } from "../lib/api";

// ====================================================================
// TIPOS
// ====================================================================

export interface Formacion {
    id_partido: number;
    id_jugador: number;
    id_categoria_edicion: number;
    id_equipo: number;
    dorsal: number | null;
    titular: boolean;
    en_cancha: boolean;
    minuto_entrada: number | null;
    minuto_salida: number | null;
    cantidad_cambios: number | null;
    goles: number | null;
    asistencias: number | null;
    amarillas: number | null;
    rojas: number | null;
    minutos_jugados: number | null;
    destacado: boolean;
    estado: boolean;
    jugador: {
        id_jugador: number;
        usuario: {
            nombre: string;
            apellido: string;
        };
    };
}

export interface MarcarEnCanchaData {
    id_categoria_edicion: number;
    id_equipo: number;
    id_jugador: number;
}

export interface DesmarcarEnCanchaData {
    id_categoria_edicion: number;
    id_equipo: number;
}

export interface ActualizarFormacionData {
    id_categoria_edicion: number;
    id_equipo: number;
    titular?: boolean;
    en_cancha?: boolean;
    dorsal?: number;
    minuto_entrada?: number;
    minuto_salida?: number;
}

export interface FormacionResponse {
    message: string;
    formacion: Formacion;
}

// ====================================================================
// SERVICIO
// ====================================================================

export const formacionesService = {
    /**
     * Marca un jugador como en cancha (titular)
     */
    marcarEnCancha: async (
        idPartido: number,
        enCanchaData: MarcarEnCanchaData,
        idPlanillero: string
    ): Promise<FormacionResponse> => {
        try {
            const response = await api.post<FormacionResponse>(
                `/planillero/formaciones/titular/${idPartido}`,
                enCanchaData
            );
            return response;
        } catch (error) {
            console.error('Error al marcar jugador en cancha:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('No se pudo marcar el jugador en cancha');
        }
    },

    /**
     * Desmarca un jugador de cancha
     */
    desmarcarEnCancha: async (
        idPartido: number,
        idJugador: number,
        desmarcarData: DesmarcarEnCanchaData,
        idPlanillero: string
    ): Promise<FormacionResponse> => {
        try {
            const response = await api.put<FormacionResponse>(
                `/planillero/formaciones/titular/${idPartido}/${idJugador}`,
                {
                    ...desmarcarData,
                    solo_en_cancha: true // Flag para indicar que solo se desmarca de cancha
                }
            );
            return response;
        } catch (error) {
            console.error('Error al desmarcar jugador de cancha:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('No se pudo desmarcar el jugador de cancha');
        }
    },

    /**
     * Actualiza una formación (PUT genérico)
     */
    actualizarFormacion: async (
        idPartido: number,
        idJugador: number,
        formacionData: ActualizarFormacionData,
        idPlanillero: string
    ): Promise<FormacionResponse> => {
        try {
            const response = await api.put<FormacionResponse>(
                `/planillero/formaciones/${idPartido}/${idJugador}`,
                formacionData
            );
            return response;
        } catch (error) {
            console.error('Error al actualizar formación:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('No se pudo actualizar la formación');
        }
    }
};


