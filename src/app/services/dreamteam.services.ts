import { vaciarFormacion } from './../../../../cr-back/src/services/dreamteam.service';
import { api } from "../lib/api";
import {
    DreamTeam,
    DreamTeamResponse,
    AgregarJugadorRequest,
    AgregarJugadorResponse,
    convertirDreamTeamBackendAFrontend
} from "../types/dreamteam";

export const dreamteamService = {
    obtenerDreamTeamCategoriaJornada: async (
        id_categoria_edicion: number,
        jornada: number
    ): Promise<DreamTeam | null> => {
        try {
            const response = await api.get<DreamTeamResponse>(
                `/admin/dreamteam/categoria/${id_categoria_edicion}/jornada/${jornada}`
            );
            return convertirDreamTeamBackendAFrontend(response);
        } catch (error: any) {
            // Si no existe el dreamteam, retornar null en lugar de error
            if (error.response?.status === 404) {
                return null;
            }
            console.error('Error al obtener dreamteam:', error);
            throw new Error('No se pudo cargar el dreamteam');
        }
    },

    agregarJugadorADreamteam: async (
        data: AgregarJugadorRequest
    ): Promise<AgregarJugadorResponse> => {
        try {
            const response = await api.post<AgregarJugadorResponse>(
                '/admin/dreamteam/jugador',
                data
            );
            return response;
        } catch (error: any) {
            const mensajeError = error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                'No se pudo agregar el jugador al dreamteam';
            console.error('Error al agregar jugador al dreamteam:', mensajeError);
            throw new Error(mensajeError);
        }
    },

    publicarDreamteam: async (id_dreamteam: number, formacion?: string): Promise<{ mensaje: string }> => {
        try {
            const response = await api.put<{ mensaje: string }>(
                `/admin/dreamteam/${id_dreamteam}/publicar`,
                { formacion }
            );
            return response;
        } catch (error: any) {
            const mensajeError = error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                'No se pudo publicar el dreamteam';
            console.error('Error al publicar dreamteam:', mensajeError);
            throw new Error(mensajeError);
        }
    },

    eliminarJugadorDeDreamteam: async (
        id_dreamteam: number,
        id_partido: number,
        id_jugador: number
    ): Promise<{ mensaje: string }> => {
        try {
            const response = await api.delete<{ mensaje: string }>(
                `/admin/dreamteam/${id_dreamteam}/partido/${id_partido}/jugador/${id_jugador}`
            );
            return response;
        } catch (error: any) {
            console.error('Error al eliminar jugador del dreamteam:', error);
            throw new Error(
                error.response?.data?.error || 'No se pudo eliminar el jugador del dreamteam'
            );
        }
    },

    vaciarFormacion: async (id_dreamteam: number): Promise<{ mensaje: string }> => {
        try {
            const response = await api.put<{ mensaje: string }>(
                `/admin/dreamteam/${id_dreamteam}/vaciar`
            );
            return response;
        } catch (error: any) {
            console.error('Error al vaciar la formación del dreamteam:', error);
            throw new Error(
                error.response?.data?.error || 'No se pudo vaciar la formación del dreamteam'
            );
        }
    },
};