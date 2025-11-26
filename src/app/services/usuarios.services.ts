import { api } from "../lib/api";
import { UsuarioAdmin, UsuariosAdminPaginados } from "../types/user";

export interface Rol {
    id_rol: number;
    nombre: string;
}

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

    obtenerUsuariosAdmin: async (
        page: number = 1, 
        limit: number = 10,
        busqueda?: string,
        id_rol?: number
    ): Promise<UsuariosAdminPaginados> => {
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            if (busqueda) params.append('busqueda', busqueda);
            if (id_rol) params.append('id_rol', id_rol.toString());
            
            const response = await api.get<UsuariosAdminPaginados>(`/admin/usuarios/lista?${params.toString()}`);
            return response;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw new Error('No se pudieron cargar los usuarios');
        }
    },

    obtenerRolesDisponibles: async (): Promise<Rol[]> => {
        try {
            const response = await api.get<Rol[]>('/admin/usuarios/roles');
            return response;
        } catch (error) {
            console.error('Error al obtener roles:', error);
            throw new Error('No se pudieron cargar los roles');
        }
    },
}