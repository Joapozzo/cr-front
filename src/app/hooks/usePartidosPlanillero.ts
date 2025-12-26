import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { planilleroService } from '../services/planillero.services';
import { useAuthStore } from '../stores/authStore';

export const planilleroKeys = {
    all: ['planillero'] as const,
    partidosPendientes: () => [...planilleroKeys.all, 'partidos-pendientes'] as const,
    partidosPlanillados: () => [...planilleroKeys.all, 'partidos-planillados'] as const,
};

export const usePartidosPendientesPlanillero = (
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
    const usuario = useAuthStore((state) => state.usuario);

    return useQuery({
        queryKey: planilleroKeys.partidosPendientes(),
        queryFn: () => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.partidosPendientesPlanillero();
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!usuario?.uid,
        ...options,
    });
};

export const usePartidosPlanilladosPlanillero = (
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
    const usuario = useAuthStore((state) => state.usuario);

    return useQuery({
        queryKey: planilleroKeys.partidosPlanillados(),
        queryFn: () => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.partidosPlanilladosPlanillero();
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!usuario?.uid,
        ...options,
    });
};