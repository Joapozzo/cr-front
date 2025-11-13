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
        } catch (error: any) {
            if (error.response?.status === 400) {
                const backendErrors = error.response.data.errors;
                if (backendErrors && Array.isArray(backendErrors)) {
                    const errorMessages = backendErrors.map((err: any) => err.message).join(', ');
                    throw new Error(errorMessages);
                }
                throw new Error(error.response.data.message || 'Datos inválidos');
            }

            if (error.response?.status === 404) {
                throw new Error('Zona, categoría o equipo no encontrados');
            }

            if (error.response?.status === 409) {
                throw new Error(error.response.data.message || 'La vacante ya está ocupada o el equipo ya participa en esta temporada');
            }

            console.error('Error al ocupar vacante:', error);
            throw new Error(error.response?.data?.message || 'No se pudo ocupar la vacante');
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
        } catch (error: any) {
            if (error.response?.status === 400) {
                const backendErrors = error.response.data.errors;
                if (backendErrors && Array.isArray(backendErrors)) {
                    const errorMessages = backendErrors.map((err: any) => err.message).join(', ');
                    throw new Error(errorMessages);
                }
                throw new Error(error.response.data.message || 'Datos inválidos');
            }

            if (error.response?.status === 404) {
                throw new Error('Zona o categoría no encontradas');
            }

            if (error.response?.status === 409) {
                throw new Error(error.response.data.message || 'La vacante ya está libre');
            }

            console.error('Error al liberar vacante:', error);
            throw new Error(error.response?.data?.message || 'No se pudo liberar la vacante');
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
        } catch (error: any) {
            if (error.response?.status === 400) {
                const backendErrors = error.response.data.errors;
                if (backendErrors && Array.isArray(backendErrors)) {
                    const errorMessages = backendErrors.map((err: any) => err.message).join(', ');
                    throw new Error(errorMessages);
                }
                throw new Error(error.response.data.message || 'Datos inválidos');
            }

            if (error.response?.status === 404) {
                throw new Error('Zona, categoría o equipo no encontrados');
            }

            if (error.response?.status === 409) {
                throw new Error(error.response.data.message || 'El equipo ya participa en esta temporada');
            }

            console.error('Error al actualizar vacante:', error);
            throw new Error(error.response?.data?.message || 'No se pudo actualizar la vacante');
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
        } catch (error: any) {
            if (error.response?.status === 400) {
                const backendErrors = error.response.data.errors;
                if (backendErrors && Array.isArray(backendErrors)) {
                    const errorMessages = backendErrors.map((err: any) => err.message).join(', ');
                    throw new Error(errorMessages);
                }
                throw new Error(error.response.data.message || 'Datos inválidos para la automatización');
            }

            if (error.response?.status === 404) {
                throw new Error('Zona, categoría o zona previa no encontradas');
            }

            if (error.response?.status === 409) {
                throw new Error(error.response.data.message || 'Conflicto al configurar la automatización');
            }

            console.error('Error al ocupar vacante con automatización:', error);
            throw new Error(error.response?.data?.message || 'No se pudo configurar la vacante con automatización');
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
        } catch (error: any) {
            if (error.response?.status === 400) {
                const backendErrors = error.response.data.errors;
                if (backendErrors && Array.isArray(backendErrors)) {
                    const errorMessages = backendErrors.map((err: any) => err.message).join(', ');
                    throw new Error(errorMessages);
                }
                throw new Error(error.response.data.message || 'Datos inválidos para la automatización del partido');
            }

            if (error.response?.status === 404) {
                throw new Error('Partido o partido previo no encontrado');
            }

            if (error.response?.status === 409) {
                throw new Error(error.response.data.message || 'Conflicto al configurar la automatización del partido');
            }

            console.error('Error al configurar automatización de partido:', error);
            throw new Error(error.response?.data?.message || 'No se pudo configurar la automatización del partido');
        }
    },
};