import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { usuariosService } from '../services/usuarios.services';
import { UsuariosAdminPaginados } from '../types/user';

// Query keys para usuarios admin
export const usuariosAdminKeys = {
    all: ['usuarios-admin'] as const,
    lista: (page: number, limit: number, busqueda?: string, id_rol?: number) => 
        [...usuariosAdminKeys.all, 'lista', page, limit, busqueda, id_rol] as const,
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

