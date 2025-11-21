import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { jugadorService } from '../services/jugador.services';
import { PosicionJugador } from '../types/partido';

// Query Keys para posiciones de jugadores
export const posicionesJugadorKeys = {
    all: ['posiciones-jugador'] as const,
    todas: () => [...posicionesJugadorKeys.all, 'todas'] as const,
};

/**
 * Hook para obtener posiciones de jugadores (Arquero, Defensor, etc.)
 * @param options - Opciones adicionales de useQuery
 */
export const usePosiciones = (
    options?: Omit<UseQueryOptions<PosicionJugador[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: posicionesJugadorKeys.todas(),
        queryFn: () => jugadorService.obtenerPosiciones(),
        staleTime: 30 * 60 * 1000, // 30 minutos - las posiciones no cambian frecuentemente
        gcTime: 60 * 60 * 1000, // 1 hora - mantener en cache
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

