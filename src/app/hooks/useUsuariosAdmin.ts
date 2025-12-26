import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { usuariosService } from '../services/usuarios.services';
import { UsuariosAdminPaginados } from '../types/user';
import { Rol } from '../services/usuarios.services';

// Query keys para usuarios admin
export const usuariosAdminKeys = {
    all: ['usuarios-admin'] as const,
    lista: (page: number, limit: number, busqueda?: string, id_rol?: number) => 
        [...usuariosAdminKeys.all, 'lista', page, limit, busqueda, id_rol] as const,
    rolesAdministrativos: () => [...usuariosAdminKeys.all, 'roles-administrativos'] as const,
};

// Hook para obtener usuarios admin con paginación y filtros
export const useUsuariosAdmin = (
    page: number = 1,
    limit: number = 10,
    busqueda?: string,
    id_rol?: number,
    options?: Omit<
        UseQueryOptions<UsuariosAdminPaginados, Error>,
        'queryKey' | 'queryFn'
    >
) => {
    return useQuery<UsuariosAdminPaginados, Error>({
        queryKey: usuariosAdminKeys.lista(page, limit, busqueda, id_rol),
        queryFn: () => usuariosService.obtenerUsuariosAdmin(page, limit, busqueda, id_rol),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

// Hook para obtener roles administrativos
export const useRolesAdministrativos = () => {
    return useQuery<Rol[], Error>({
        queryKey: usuariosAdminKeys.rolesAdministrativos(),
        queryFn: () => usuariosService.obtenerRolesAdministrativos(),
        staleTime: 10 * 60 * 1000, // 10 minutos
        gcTime: 30 * 60 * 1000, // 30 minutos
    });
};

// Hook para generar password seguro
export const useGenerarPasswordSeguro = () => {
    return useMutation<string, Error, number>({
        mutationFn: (length: number) => usuariosService.generarPasswordSeguro(length),
    });
};

// Hook para crear usuario administrativo
export const useCrearUsuarioAdministrativo = (
    options?: Omit<
        UseMutationOptions<any, Error, {
            nombre: string;
            apellido: string;
            email: string;
            password: string;
            id_rol: number;
        }>,
        'mutationFn'
    >
) => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, {
        nombre: string;
        apellido: string;
        email: string;
        password: string;
        id_rol: number;
    }>({
        mutationFn: (datos) => usuariosService.crearUsuarioAdministrativo(datos),
        onSuccess: () => {
            // Invalidar queries de usuarios para refrescar la lista
            queryClient.invalidateQueries({ queryKey: usuariosAdminKeys.all });
        },
        ...options,
    });
};

// Hook para resetear password de usuario administrativo
export const useResetPasswordAdministrativo = (
    options?: Omit<
        UseMutationOptions<{ password: string; message: string }, Error, { uid: string; nuevaPassword?: string }>,
        'mutationFn'
    >
) => {
    return useMutation<{ password: string; message: string }, Error, { uid: string; nuevaPassword?: string }>({
        mutationFn: ({ uid, nuevaPassword }) => usuariosService.resetPasswordAdministrativo(uid, nuevaPassword),
        ...options,
    });
};

// Hook para cambiar estado de usuario administrativo (Activar/Desactivar)
export const useCambiarEstadoUsuarioAdministrativo = (
    options?: Omit<
        UseMutationOptions<any, Error, { uid: string; estado: 'A' | 'I' }>,
        'mutationFn'
    >
) => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, { uid: string; estado: 'A' | 'I' }>({
        mutationFn: ({ uid, estado }) => usuariosService.cambiarEstadoUsuarioAdministrativo(uid, estado),
        onSuccess: () => {
            // Invalidar queries de usuarios para refrescar la lista
            queryClient.invalidateQueries({ queryKey: usuariosAdminKeys.all });
        },
        ...options,
    });
};

