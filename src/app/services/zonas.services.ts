import { api } from "../lib/api";
import { ZonasListResponse, ZonaResponse, CrearZonaInput, EditarZonaInput, DatosCrearZonaResponse, ZonaResponseDelete, ZonasList2Response, Zona } from "../types/zonas";

export const zonasService = {
    obtenerZonasPorFase: async (id_categoria_edicion: number, numero_fase: number): Promise<Zona[]> => {
        try {
            const rest = await api.get<ZonasListResponse>(`/admin/zonas/${id_categoria_edicion}/${numero_fase}`);
            return rest.data;
        } catch (error: unknown) {
            if (error instanceof Error && error.message) {
                throw error;
            }
            console.error('Error al obtener zonas por fase:', error);
            throw new Error('No se pudieron cargar las zonas de la fase');
        }
    },

    obtenerDatosParaCrearZona: async (): Promise<DatosCrearZonaResponse> => {
        try {
            return await api.get<DatosCrearZonaResponse>('/admin/zonas/obtener-datos');
        } catch (error: unknown) {
            if (error instanceof Error && error.message) {
                throw error;
            }
            const errorObj = error as { response?: { data?: { message?: string; error?: string } } };
            console.error('Error al obtener datos para crear zona:', error);
            const errorMessage = error instanceof Error ? error.message : 
                               errorObj.response?.data?.error || 
                               errorObj.response?.data?.message || 
                               'No se pudieron cargar los datos';
            throw new Error(errorMessage);
        }
    },

    crearZona: async (id_categoria_edicion: number, numero_fase: number, data: CrearZonaInput): Promise<ZonaResponse> => {
        try {
            return await api.post<ZonaResponse>(`/admin/zonas/${id_categoria_edicion}/${numero_fase}`, data);
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
                throw new Error('Categoría edición o fase no encontrada');
            }

            if (errorObj.response?.status === 409) {
                throw new Error(errorObj.response.data?.error || errorObj.response.data?.message || 'Esta zona ya existe en la fase');
            }

            console.error('Error al crear zona:', error);
            const errorMessage = error instanceof Error ? error.message : 
                               errorObj.response?.data?.error || 
                               errorObj.response?.data?.message || 
                               'No se pudo crear la zona';
            throw new Error(errorMessage);
        }
    },

    editarZona: async (id_zona: number, id_categoria_edicion: number, data: EditarZonaInput): Promise<ZonaResponse> => {
        try {
            return await api.put<ZonaResponse>(`/admin/zonas/${id_zona}/${id_categoria_edicion}`, data);
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
                throw new Error('Zona no encontrada');
            }

            if (errorObj.response?.status === 409) {
                throw new Error(errorObj.response.data?.error || errorObj.response.data?.message || 'Conflicto al actualizar la zona');
            }

            console.error('Error al editar zona:', error);
            const errorMessage = error instanceof Error ? error.message : 
                               errorObj.response?.data?.error || 
                               errorObj.response?.data?.message || 
                               'No se pudo actualizar la zona';
            throw new Error(errorMessage);
        }
    },

    eliminarZona: async (id_zona: number): Promise<ZonaResponseDelete> => {
        try {
            return await api.delete<ZonaResponseDelete>(`/admin/zonas/${id_zona}`);
        } catch (error: unknown) {
            // apiFetch ya extrae el mensaje de error del backend y lo pone en error.message
            if (error instanceof Error && error.message) {
                throw error;
            }

            const errorObj = error as { status?: number; data?: { message?: string; error?: string }; message?: string };
            let mensaje = "No se pudo eliminar la zona";

            if (errorObj.status === 404) {
                mensaje = "Zona no encontrada";
            } else if (errorObj.status === 409) {
                mensaje = errorObj.message || errorObj.data?.error || errorObj.data?.message || "No se puede eliminar la zona";
            } else if (errorObj.data?.message) {
                mensaje = errorObj.data.message;
            } else if (errorObj.data?.error) {
                mensaje = errorObj.data.error;
            } else if (errorObj.message) {
                mensaje = errorObj.message;
            }

            throw new Error(mensaje);
        }
    },

    obtenerTodasLasZonas: async (id_categoria_edicion: number): Promise<ZonasList2Response[]> => {
        try {
            const response = await api.get<ZonasList2Response[]>(`/admin/zonas/todas/${id_categoria_edicion}`);
            return response;
        } catch (error) {
            console.error('Error al obtener las zonas:', error);
            throw new Error('No se pudieron cargar las zonas');
        }
    },
}