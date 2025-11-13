import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { usuariosService } from '../services/usuarios.services';

export const usuariosKeys = {
    all: ['usuarios'] as const,
    planilleros: () => [...usuariosKeys.all, 'planilleros'] as const,
};

export const useObtenerPlanilleros = (
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: usuariosKeys.planilleros(),
        queryFn: () => usuariosService.obtenerPlanilleros(),
        staleTime: 10 * 60 * 1000, // 10 minutos
        gcTime: 15 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};