import { api } from "../lib/api";
import { ZonasListResponse, ZonaResponse, CrearZonaInput, EditarZonaInput, DatosCrearZonaResponse, ZonaResponseDelete, ZonasList2Response } from "../types/zonas";

export const zonasService = {
    obtenerZonasPorFase: async (id_categoria_edicion: number, numero_fase: number): Promise<ZonasListResponse> => {
        try {
            const rest = await api.get<ZonasListResponse>(`/admin/zonas/${id_categoria_edicion}/${numero_fase}`);
            return rest.data;
        } catch (error) {
            console.error('Error al obtener zonas por fase:', error);
            throw new Error('No se pudieron cargar las zonas de la fase');
        }
    },

    obtenerDatosParaCrearZona: async (): Promise<DatosCrearZonaResponse> => {
        try {
            return await api.get<DatosCrearZonaResponse>('/admin/zonas/obtener-datos');
        } catch (error: any) {
            console.error('Error al obtener datos para crear zona:', error);
            throw new Error(error.response?.data?.message || 'No se pudieron cargar los datos');
        }
    },

    crearZona: async (id_categoria_edicion: number, numero_fase: number, data: CrearZonaInput): Promise<ZonaResponse> => {
        try {
            return await api.post<ZonaResponse>(`/admin/zonas/${id_categoria_edicion}/${numero_fase}`, data);
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
                throw new Error('Categoría edición o fase no encontrada');
            }

            if (error.response?.status === 409) {
                throw new Error('Esta zona ya existe en la fase');
            }

            console.error('Error al crear zona:', error);
            throw new Error(error.response?.data?.message || 'No se pudo crear la zona');
        }
    },

    editarZona: async (id_zona: number, id_categoria_edicion: number, data: EditarZonaInput): Promise<ZonaResponse> => {
        try {
            return await api.put<ZonaResponse>(`/admin/zonas/${id_zona}/${id_categoria_edicion}`, data);
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
                throw new Error('Zona no encontrada');
            }

            if (error.response?.status === 409) {
                throw new Error(error.response.data.error || 'Conflicto al actualizar la zona');
            }

            console.error('Error al editar zona:', error);
            throw new Error(error.response?.data?.message || 'No se pudo actualizar la zona');
        }
    },

    eliminarZona: async (id_zona: number): Promise<ZonaResponseDelete> => {
        try {
            return await api.delete<ZonaResponseDelete>(`/admin/zonas/${id_zona}`);
        } catch (error: any) {
            let mensaje = "No se pudo eliminar la zona";

            if (error) {
                // Ahora tenemos acceso a los datos del servidor
                if (error.status === 404) {
                    mensaje = "Zona no encontrada";
                } else if (error.status === 409) {
                    // El mensaje del servidor está en error.message (que viene de responseData.error)
                    mensaje = error.message || "No se puede eliminar la zona";
                } else if (error.data?.message) {
                    mensaje = error.data.message;
                } else {
                    mensaje = error.message;
                }
            } else if (error.message) {
                mensaje = error.message;
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