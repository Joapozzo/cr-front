import { api } from "../lib/api";

export const usuariosService = {
    obtenerPlanilleros: async (): Promise<any> => {
        try {
            const response = await api.get<any>('/admin/usuarios/planilleros');
            return response;
        } catch (error) {
            console.error('Error al obtener planilleros:', error);
            throw new Error('No se pudieron cargar los planilleros');
        }
    },
}