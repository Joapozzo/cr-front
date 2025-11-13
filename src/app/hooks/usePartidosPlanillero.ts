import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { planilleroService } from '../services/planillero.services'; 

export const planilleroKeys = {
    all: ['planillero'] as const,
    partidosPendientes: () => [...planilleroKeys.all, 'partidos-pendientes'] as const,
    partidosPlanillados: () => [...planilleroKeys.all, 'partidos-planillados'] as const,
};

export const usePartidosPendientesPlanillero = (
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: planilleroKeys.partidosPendientes(),
        queryFn: () => planilleroService.partidosPendientesPlanillero(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const usePartidosPlanilladosPlanillero = (
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: planilleroKeys.partidosPlanillados(),
        queryFn: () => planilleroService.partidosPlanilladosPlanillero(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};