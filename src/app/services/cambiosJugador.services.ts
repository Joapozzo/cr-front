import { api } from "../lib/api";

// ====================================================================
// TIPOS
// ====================================================================

export interface CambioJugador {
    id_cambio: number;
    id_partido: number;
    id_jugador_entra: number | null;
    id_jugador_sale: number | null;
    minuto: number;
    tiempo: string | null;
    tipo_cambio: 'ENTRADA' | 'SALIDA';
    registrado_por: string | null;
    registrado_en: string;
    observaciones: string | null;
    jugadorEntra?: {
        id_jugador: number;
        usuario: {
            nombre: string;
            apellido: string;
        };
    } | null;
    jugadorSale?: {
        id_jugador: number;
        usuario: {
            nombre: string;
            apellido: string;
        };
    } | null;
    registrador?: {
        nombre: string;
        apellido: string;
    } | null;
}

export interface CrearCambioJugadorData {
    id_categoria_edicion: number;
    id_equipo: number;
    tipo_cambio: 'ENTRADA' | 'SALIDA';
    id_jugador: number;
    minuto: number;
    tiempo?: string;
    observaciones?: string;
}

export interface EditarCambioJugadorData {
    minuto?: number;
    tiempo?: string;
    observaciones?: string;
}

export interface CambiosJugadorResponse {
    message: string;
    cambios: CambioJugador[];
}

export interface CambioJugadorResponse {
    message: string;
    cambio: CambioJugador;
}

// ====================================================================
// SERVICIO
// ====================================================================

export const cambiosJugadorService = {
    /**
     * Crea un cambio de jugador (ENTRADA o SALIDA)
     */
    crearCambio: async (
        idPartido: number,
        cambioData: CrearCambioJugadorData
    ): Promise<CambioJugadorResponse> => {
        try {
            const response = await api.post<CambioJugadorResponse>(
                `/planillero/cambios/${idPartido}`,
                cambioData
            );
            return response;
        } catch (error) {
            console.error('Error al crear cambio de jugador:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('No se pudo crear el cambio de jugador');
        }
    },

    /**
     * Obtiene todos los cambios de un partido
     */
    obtenerCambiosPorPartido: async (idPartido: number): Promise<CambiosJugadorResponse> => {
        try {
            const response = await api.get<CambiosJugadorResponse>(
                `/planillero/cambios/partido/${idPartido}`
            );
            return response;
        } catch (error) {
            console.error('Error al obtener cambios del partido:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('No se pudieron cargar los cambios del partido');
        }
    },

    /**
     * Obtiene un cambio por su ID
     */
    obtenerCambioPorId: async (
        idCambio: number,
        idPartido: number
    ): Promise<CambioJugadorResponse> => {
        try {
            const response = await api.get<CambioJugadorResponse>(
                `/planillero/cambios/${idCambio}/${idPartido}`
            );
            return response;
        } catch (error) {
            console.error('Error al obtener cambio:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('No se pudo cargar el cambio');
        }
    },

    /**
     * Edita un cambio de jugador
     */
    editarCambio: async (
        idCambio: number,
        idPartido: number,
        cambioData: EditarCambioJugadorData
    ): Promise<CambioJugadorResponse> => {
        try {
            const response = await api.put<CambioJugadorResponse>(
                `/planillero/cambios/${idCambio}/${idPartido}`,
                cambioData
            );
            return response;
        } catch (error) {
            console.error('Error al editar cambio:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('No se pudo editar el cambio');
        }
    },

    /**
     * Elimina un cambio de jugador
     */
    eliminarCambio: async (
        idCambio: number,
        idPartido: number
    ): Promise<{ message: string }> => {
        try {
            const response = await api.delete<{ message: string }>(
                `/planillero/cambios/${idCambio}/${idPartido}`
            );
            return response;
        } catch (error) {
            console.error('Error al eliminar cambio:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('No se pudo eliminar el cambio');
        }
    }
};


