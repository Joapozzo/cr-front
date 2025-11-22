import { api } from "../lib/api";
import { OcuparVacanteInput, OcuparVacanteResponse, LiberarVacanteInput, LiberarVacanteResponse, ActualizarVacanteInput, ActualizarVacanteResponse, ConfigurarAutomatizacionPartidoInput, ConfigurarAutomatizacionPartidoResponse, OcuparVacanteConAutomatizacionInput, OcuparVacanteConAutomatizacionResponse } from "../types/temporada";

export const temporadasService = {
    ocuparVacante: async (
        id_zona: number,
        id_categoria_edicion: number,
        data: OcuparVacanteInput
    ): Promise<OcuparVacanteResponse> => {
        try {
            return await api.put<OcuparVacanteResponse>(
                `/admin/temporadas/${id_zona}/${id_categoria_edicion}`,
                data
            );
        } catch (error: unknown) {
            // apiFetch ya extrae el mensaje de error del backend y lo pone en error.message
            if (error instanceof Error && error.message) {
                throw error;
            }

            const errorObj = error as { response?: { status?: number; data?: { errors?: Array<{ message?: string }>; message?: string; error?: string } } };
            
            if (errorObj.response?.status === 400) {
                const backendErrors = errorObj.response.data?.errors;
                if (backendErrors && Array.isArray(backendErrors)) {
                    const errorMessages = backendErrors.map((err) => err.message || '').filter(Boolean).join(', ');
                    throw new Error(errorMessages || 'Datos inválidos');
                }
                throw new Error(errorObj.response.data?.error || errorObj.response.data?.message || 'Datos inválidos');
            }

            if (errorObj.response?.status === 404) {
                throw new Error('Zona, categoría o equipo no encontrados');
            }

            if (errorObj.response?.status === 409) {
                throw new Error(errorObj.response.data?.error || errorObj.response.data?.message || 'La vacante ya está ocupada o el equipo ya participa en esta temporada');
            }

            console.error('Error al ocupar vacante:', error);
            const errorMessage = error instanceof Error ? error.message : 
                               errorObj.response?.data?.error || 
                               errorObj.response?.data?.message || 
                               'No se pudo ocupar la vacante';
            throw new Error(errorMessage);
        }
    },

    liberarVacante: async (
        id_zona: number,
        id_categoria_edicion: number,
        data: LiberarVacanteInput
    ): Promise<LiberarVacanteResponse> => {
        try {
            return await api.put<LiberarVacanteResponse>(
                `/admin/temporadas/vaciar/${id_zona}/${id_categoria_edicion}`,
                data
            );
        } catch (error: unknown) {
            // apiFetch ya extrae el mensaje de error del backend y lo pone en error.message
            // Si el error ya tiene un mensaje (viene de apiFetch), usarlo directamente
            if (error instanceof Error && error.message) {
                throw error; // Re-lanzar el error con el mensaje original
            }

            const errorObj = error as { response?: { status?: number; data?: { error?: string; message?: string } } };

            // Fallback: intentar extraer el mensaje de response si existe
            if (errorObj.response?.status === 400) {
                const errorMessage = errorObj.response.data?.error || 
                                   errorObj.response.data?.message || 
                                   'Datos inválidos';
                throw new Error(errorMessage);
            }

            if (errorObj.response?.status === 404) {
                throw new Error('Zona o categoría no encontradas');
            }

            if (errorObj.response?.status === 409) {
                throw new Error(errorObj.response.data?.error || errorObj.response.data?.message || 'La vacante ya está libre');
            }

            // Si no hay mensaje específico, usar el mensaje del error o uno genérico
            const errorMessage = error instanceof Error ? error.message : 
                               errorObj.response?.data?.error || 
                               errorObj.response?.data?.message || 
                               'No se pudo liberar la vacante';
            throw new Error(errorMessage);
        }
    },

    actualizarVacante: async (
        id_zona: number,
        id_categoria_edicion: number,
        data: ActualizarVacanteInput
    ): Promise<ActualizarVacanteResponse> => {
        try {
            return await api.put<ActualizarVacanteResponse>(
                `/admin/temporadas/actualizar/${id_zona}/${id_categoria_edicion}`,
                data
            );
        } catch (error: unknown) {
            if (error instanceof Error && error.message) {
                throw error;
            }

            const errorObj = error as { response?: { status?: number; data?: { errors?: Array<{ message?: string }>; message?: string; error?: string } } };

            if (errorObj.response?.status === 400) {
                const backendErrors = errorObj.response.data?.errors;
                if (backendErrors && Array.isArray(backendErrors)) {
                    const errorMessages = backendErrors.map((err) => err.message || '').filter(Boolean).join(', ');
                    throw new Error(errorMessages || 'Datos inválidos');
                }
                throw new Error(errorObj.response.data?.error || errorObj.response.data?.message || 'Datos inválidos');
            }

            if (errorObj.response?.status === 404) {
                throw new Error('Zona, categoría o equipo no encontrados');
            }

            if (errorObj.response?.status === 409) {
                throw new Error(errorObj.response.data?.error || errorObj.response.data?.message || 'El equipo ya participa en esta temporada');
            }

            console.error('Error al actualizar vacante:', error);
            const errorMessage = error instanceof Error ? error.message : 
                               errorObj.response?.data?.error || 
                               errorObj.response?.data?.message || 
                               'No se pudo actualizar la vacante';
            throw new Error(errorMessage);
        }
    },

    ocuparVacanteConAutomatizacion: async (
        data: OcuparVacanteConAutomatizacionInput
    ): Promise<OcuparVacanteConAutomatizacionResponse> => {
        try {
            return await api.put<OcuparVacanteConAutomatizacionResponse>(
                `/admin/temporadas/automatizar-vacante`,
                data
            );
        } catch (error: unknown) {
            if (error instanceof Error && error.message) {
                throw error;
            }

            const errorObj = error as { response?: { status?: number; data?: { errors?: Array<{ message?: string }>; message?: string; error?: string } } };

            if (errorObj.response?.status === 400) {
                const backendErrors = errorObj.response.data?.errors;
                if (backendErrors && Array.isArray(backendErrors)) {
                    const errorMessages = backendErrors.map((err) => err.message || '').filter(Boolean).join(', ');
                    throw new Error(errorMessages || 'Datos inválidos para la automatización');
                }
                throw new Error(errorObj.response.data?.error || errorObj.response.data?.message || 'Datos inválidos para la automatización');
            }

            if (errorObj.response?.status === 404) {
                throw new Error('Zona, categoría o zona previa no encontradas');
            }

            if (errorObj.response?.status === 409) {
                throw new Error(errorObj.response.data?.error || errorObj.response.data?.message || 'Conflicto al configurar la automatización');
            }

            console.error('Error al ocupar vacante con automatización:', error);
            const errorMessage = error instanceof Error ? error.message : 
                               errorObj.response?.data?.error || 
                               errorObj.response?.data?.message || 
                               'No se pudo configurar la vacante con automatización';
            throw new Error(errorMessage);
        }
    },

    configurarAutomatizacionPartido: async (
        id_partido: number,
        data: ConfigurarAutomatizacionPartidoInput
    ): Promise<ConfigurarAutomatizacionPartidoResponse> => {
        try {
            return await api.put<ConfigurarAutomatizacionPartidoResponse>(
                `/admin/temporadas/automatizar-partido/${id_partido}/vacante`,
                data
            );
        } catch (error: unknown) {
            if (error instanceof Error && error.message) {
                throw error;
            }

            const errorObj = error as { response?: { status?: number; data?: { errors?: Array<{ message?: string }>; message?: string; error?: string } } };

            if (errorObj.response?.status === 400) {
                const backendErrors = errorObj.response.data?.errors;
                if (backendErrors && Array.isArray(backendErrors)) {
                    const errorMessages = backendErrors.map((err) => err.message || '').filter(Boolean).join(', ');
                    throw new Error(errorMessages || 'Datos inválidos para la automatización del partido');
                }
                throw new Error(errorObj.response.data?.error || errorObj.response.data?.message || 'Datos inválidos para la automatización del partido');
            }

            if (errorObj.response?.status === 404) {
                throw new Error('Partido o partido previo no encontrado');
            }

            if (errorObj.response?.status === 409) {
                throw new Error(errorObj.response.data?.error || errorObj.response.data?.message || 'Conflicto al configurar la automatización del partido');
            }

            console.error('Error al configurar automatización de partido:', error);
            const errorMessage = error instanceof Error ? error.message : 
                               errorObj.response?.data?.error || 
                               errorObj.response?.data?.message || 
                               'No se pudo configurar la automatización del partido';
            throw new Error(errorMessage);
        }
    },
};