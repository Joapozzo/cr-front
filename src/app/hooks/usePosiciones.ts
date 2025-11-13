import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { jugadorService } from '../services/jugador.services';

export interface Posicion {
    id_posicion: number;
    codigo: string;
    nombre: string;
}

export const posicionesKeys = {
    all: ['posiciones'] as const,
};

export const usePosiciones = (
    options?: Omit<UseQueryOptions<Posicion[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: posicionesKeys.all,
        queryFn: () => jugadorService.obtenerPosiciones(),
        staleTime: Infinity, // Las posiciones casi nunca cambian
        gcTime: 24 * 60 * 60 * 1000, // 24 horas
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};