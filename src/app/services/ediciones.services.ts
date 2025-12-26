import { api } from "../lib/api";
import { CrearEdicion, Edicion, EdicionAdmin, EdicionConCategorias, EdicionResponse } from "../types/edicion";

export const edicionesService = {
    obtenerEdicionesConCategorias: async (): Promise<EdicionConCategorias[]> => {
        try {
            return await api.get<EdicionConCategorias[]>('/user/ediciones/categorias');
        } catch (error) {
            console.error('Error al obtener ediciones con categorías:', error);
            throw new Error('No se pudieron cargar las ediciones con categorías');
        }
    },

    obtenerEdicionesActuales: async (): Promise<Edicion[]> => {
        try {
            return await api.get<Edicion[]>('/user/ediciones');
        } catch (error) {
            console.error('Error al obtener ediciones actuales:', error);
            throw new Error('No se pudieron cargar las ediciones actuales');
        }
    },

    obtenerTodasLasEdiciones: async (): Promise<EdicionAdmin[]> => {
        try {
            return await api.get<EdicionAdmin[]>('/admin/ediciones');
        } catch (error) {
            console.error('Error al obtener ediciones actuales:', error);
            throw new Error('No se pudieron cargar las ediciones actuales');
        }
    },

    crearEdicion: async (data: CrearEdicion): Promise<EdicionResponse> => {
        try {
            const response = await api.post<EdicionResponse>('/admin/ediciones', data);
            return response;
        } catch (error: any) {
            if (error.response?.status === 400) {
                const backendErrors = error.response.data.errors;
                if (backendErrors && Array.isArray(backendErrors)) {
                    const errorMessages = backendErrors.map((err: any) => err.message).join(', ');
                    throw new Error(errorMessages);
                }
                throw new Error(error.response.data.message || 'Datos inválidos');
            }

            console.error('Error al crear edición:', error);
            throw new Error(error.response?.data?.message || 'No se pudo crear la edición');
        }
    },

    actualizarEdicion: async (id: number, data: Partial<CrearEdicion>): Promise<EdicionResponse> => {
        try {
            const response = await api.put<EdicionResponse>(`/admin/ediciones/${id}`, data);
            return response;
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
                throw new Error('Edición no encontrada');
            }

            console.error('Error al actualizar edición:', error);
            throw new Error(error.response?.data?.message || 'No se pudo actualizar la edición');
        }
    },

    cambiarEstadoEdicion: async (id: number, estado: 'I' | 'A' | 'T'): Promise<{ success: boolean; message: string; data: any }> => {
        try {
            const response = await api.patch<{ success: boolean; message: string; data: any }>(
                `/admin/ediciones/${id}/cambiar-estado`,
                { estado }
            );
            return response;
        } catch (error: any) {
            console.error('Error al cambiar estado de la edición:', error);
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error(error.response?.data?.message || 'No se pudo cambiar el estado de la edición');
        }
    },
};