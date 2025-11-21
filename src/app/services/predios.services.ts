import { api } from "../lib/api";
import {
    CrearPredioInput,
    ActualizarPredioInput,
    CrearCanchaInput,
    ActualizarCanchaInput,
    PredioConCanchas,
    PredioDetalle,
    CanchaConPredio,
    CanchaDetalle,
    ObtenerPrediosResponse,
    ObtenerCanchasResponse,
    CrearPredioResponse,
    ActualizarPredioResponse,
    EliminarPredioResponse,
    CrearCanchaResponse,
    ActualizarCanchaResponse,
    EliminarCanchaResponse,
    ObtenerCanchasParams
} from "../types/predios";

export const prediosService = {
    // ============ SERVICIOS PARA PREDIOS ============

    /**
     * Crear un nuevo predio
     */
    crearPredio: async (data: CrearPredioInput): Promise<CrearPredioResponse> => {
        try {
            return await api.post<CrearPredioResponse>('/admin/predios', data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            console.error('Error al crear predio:', error);
            throw new Error('No se pudo crear el predio');
        }
    },

    /**
     * Obtener todos los predios
     */
    obtenerPredios: async (incluirInactivos: boolean = false): Promise<PredioConCanchas[]> => {
        try {
            const params = new URLSearchParams();
            if (incluirInactivos) {
                params.append('incluir_inactivos', 'true');
            }
            
            const url = params.toString() 
                ? `/admin/predios?${params.toString()}`
                : '/admin/predios';
            
            const response = await api.get<ObtenerPrediosResponse>(url);
            return response.predios;
        } catch (error: unknown) {
            console.error('Error al obtener predios:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('No se pudieron cargar los predios');
        }
    },

    /**
     * Obtener un predio por ID
     */
    obtenerPredioPorId: async (id_predio: number): Promise<PredioDetalle> => {
        try {
            return await api.get<PredioDetalle>(`/admin/predios/${id_predio}`);
        } catch (error: unknown) {
            console.error(`Error al obtener predio ${id_predio}:`, error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('No se pudo cargar el predio');
        }
    },

    /**
     * Actualizar un predio
     */
    actualizarPredio: async (
        id_predio: number,
        data: ActualizarPredioInput
    ): Promise<ActualizarPredioResponse> => {
        try {
            return await api.put<ActualizarPredioResponse>(`/admin/predios/${id_predio}`, data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            console.error('Error al actualizar predio:', error);
            throw new Error('No se pudo actualizar el predio');
        }
    },

    /**
     * Eliminar (desactivar) un predio
     */
    eliminarPredio: async (id_predio: number): Promise<EliminarPredioResponse> => {
        try {
            return await api.delete<EliminarPredioResponse>(`/admin/predios/${id_predio}`);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            console.error('Error al eliminar predio:', error);
            throw new Error('No se pudo eliminar el predio');
        }
    },

    // ============ SERVICIOS PARA CANCHAS ============

    /**
     * Crear una nueva cancha
     */
    crearCancha: async (data: CrearCanchaInput): Promise<CrearCanchaResponse> => {
        try {
            return await api.post<CrearCanchaResponse>('/admin/predios/canchas', data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            console.error('Error al crear cancha:', error);
            throw new Error('No se pudo crear la cancha');
        }
    },

    /**
     * Obtener todas las canchas
     */
    obtenerCanchas: async (params?: ObtenerCanchasParams): Promise<CanchaConPredio[]> => {
        try {
            const queryParams = new URLSearchParams();
            
            if (params?.id_predio) {
                queryParams.append('id_predio', params.id_predio.toString());
            }
            
            if (params?.incluir_inactivas) {
                queryParams.append('incluir_inactivas', 'true');
            }
            
            const url = queryParams.toString()
                ? `/admin/predios/canchas/predio/${params.id_predio}?${queryParams.toString()}`
                : '/admin/predios/canchas';
            
            const response = await api.get<ObtenerCanchasResponse>(url);
            return response.canchas;
        } catch (error: unknown) {
            console.error('Error al obtener canchas:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('No se pudieron cargar las canchas');
        }
    },

    /**
     * Obtener una cancha por ID
     */
    obtenerCanchaPorId: async (id_cancha: number): Promise<CanchaDetalle> => {
        try {
            return await api.get<CanchaDetalle>(`/admin/predios/canchas/${id_cancha}`);
        } catch (error: unknown) {
            console.error(`Error al obtener cancha ${id_cancha}:`, error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('No se pudo cargar la cancha');
        }
    },

    /**
     * Actualizar una cancha
     */
    actualizarCancha: async (
        id_cancha: number,
        data: ActualizarCanchaInput
    ): Promise<ActualizarCanchaResponse> => {
        try {
            return await api.put<ActualizarCanchaResponse>(`/admin/predios/canchas/${id_cancha}`, data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            console.error('Error al actualizar cancha:', error);
            throw new Error('No se pudo actualizar la cancha');
        }
    },

    /**
     * Eliminar (desactivar) una cancha
     */
    eliminarCancha: async (id_cancha: number): Promise<EliminarCanchaResponse> => {
        try {
            return await api.delete<EliminarCanchaResponse>(`/admin/predios/canchas/${id_cancha}`);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            console.error('Error al eliminar cancha:', error);
            throw new Error('No se pudo eliminar la cancha');
        }
    },
};

