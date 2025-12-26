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

    obtenerRolesAdministrativos: async (): Promise<Rol[]> => {
        try {
            const response = await api.get<Rol[]>('/admin/usuarios/roles-administrativos');
            return response;
        } catch (error) {
            console.error('Error al obtener roles administrativos:', error);
            throw new Error('No se pudieron cargar los roles administrativos');
        }
    },

    generarPasswordSeguro: async (length: number = 16): Promise<string> => {
        try {
            const response = await api.get<{ password: string }>(`/admin/usuarios/generar-password?length=${length}`);
            return response.password;
        } catch (error) {
            console.error('Error al generar password:', error);
            throw new Error('No se pudo generar la contraseña');
        }
    },

    crearUsuarioAdministrativo: async (datos: {
        nombre: string;
        apellido: string;
        email: string;
        password: string;
        id_rol: number;
    }): Promise<any> => {
        try {
            const response = await api.post<any>('/admin/usuarios/crear', datos);
            return response;
        } catch (error: any) {
            console.error('Error al crear usuario administrativo:', error);
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            if (error.response?.data?.errors) {
                throw error.response.data;
            }
            throw new Error('No se pudo crear el usuario');
        }
    },

    resetPasswordAdministrativo: async (uid: string, nuevaPassword?: string): Promise<{ password: string; message: string }> => {
        try {
            const response = await api.post<{ success: boolean; password: string; message: string }>(
                `/admin/usuarios/reset-password/${uid}`,
                nuevaPassword ? { nuevaPassword } : {}
            );
            return { password: response.password, message: response.message };
        } catch (error: any) {
            console.error('Error al resetear contraseña:', error);
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('No se pudo resetear la contraseña');
        }
    },

    cambiarEstadoUsuarioAdministrativo: async (uid: string, estado: 'A' | 'I'): Promise<any> => {
        try {
            const response = await api.patch<any>(
                `/admin/usuarios/cambiar-estado/${uid}`,
                { estado }
            );
            return response;
        } catch (error: any) {
            console.error('Error al cambiar estado del usuario:', error);
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('No se pudo cambiar el estado del usuario');
        }
    },
}