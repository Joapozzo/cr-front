import { api } from "../lib/api";
import { FaseResponse } from "../types/fase";

export const fasesService = {
    obtenerFases: async (id_categoria_edicion: number): Promise<FaseResponse> => {
        try {
            return await api.get(`/admin/fases/${id_categoria_edicion}`);
        } catch (error) {
            console.error('Error al obtener las fases:', error);
            throw new Error('No se pudieron cargar las fases');
        }
    },

    crearFase: async (id_categoria_edicion: number): Promise<any> => {
        try {
            return await api.post(`/admin/fases/${id_categoria_edicion}`);
        } catch (error) {
            console.error('Error al crear la fase:', error);
            throw new Error('No se pudo crear la fase');
        }
    },

    eliminarFase: async (id_categoria_edicion: number, numero_fase: number): Promise<any> => {
        try {
            return await api.delete(`/admin/fases/${id_categoria_edicion}/${numero_fase}`);
        } catch (error: any) {
            console.error('Error al eliminar la fase:', error);
            throw error;
        }
    },
};