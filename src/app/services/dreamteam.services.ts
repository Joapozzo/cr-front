import { api } from "../lib/api";
import {
    DreamTeam,
    DreamTeamResponse,
    AgregarJugadorRequest,
    AgregarJugadorResponse,
    convertirDreamTeamBackendAFrontend,
    JugadorDreamTeam
} from "../types/dreamteam";
import { DreamTeamPublicoResponse } from "../types/dreamteamPublico";

export const dreamteamService = {
    obtenerJornadasDisponibles: async (
        id_categoria_edicion: number
    ): Promise<number[]> => {
        try {
            // Usar ruta pública optimizada
            const response = await api.get<number[]>(
                `/user/public/dreamteam/categoria/${id_categoria_edicion}/jornadas`
            );
            return response;
        } catch (error: any) {
            console.error('Error al obtener jornadas disponibles:', error);
            return [];
        }
    },

    obtenerDreamTeamCategoriaJornada: async (
        id_categoria_edicion: number,
        jornada: number
    ): Promise<DreamTeam | null> => {
        try {
            // Usar ruta pública optimizada (sin autenticación)
            const response = await api.get<DreamTeamPublicoResponse>(
                `/user/public/dreamteam/categoria/${id_categoria_edicion}/jornada/${jornada}`
            );
            
            // Transformar respuesta optimizada a formato DreamTeam
            const jugadores: JugadorDreamTeam[] = response.jugadores.map((j) => ({
                id_jugador: j.id_jugador,
                id_partido: 0, // No necesario para visualización
                id_equipo: j.equipo.id_equipo,
                nombre: j.nombre,
                apellido: j.apellido,
                posicion: {
                    id_posicion: 0, // No disponible en respuesta pública optimizada
                    codigo: j.posicion_codigo || '',
                    nombre: j.posicion_codigo || '',
                },
                posicionEnFormacion: String(j.posicion_index || 0),
                posicion_index: j.posicion_index || undefined,
                posicion_codigo: j.posicion_codigo || undefined,
                equipo: j.equipo,
                usuario: {
                    img: j.img,
                    nombre: j.nombre,
                    apellido: j.apellido,
                },
            }));

            return {
                id_dreamteam: response.id_dreamteam,
                id_categoria_edicion: response.id_categoria_edicion,
                jornada: response.jornada,
                formacion: response.formacion,
                publicado: true, // Siempre true porque solo traemos publicados
                jugadores,
                creado_en: '',
                actualizado_en: '',
            };
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