/**
 * React Query hooks para búsqueda de legajos
 */
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { busquedaLegajosService } from '@/app/services/legajos/busqueda.service';
import { BusquedaJugadoresParams, BusquedaJugadoresResponse, BusquedaEquiposParams, BusquedaEquiposResponse } from '@/app/types/legajos';

export const legajosBusquedaKeys = {
    all: ['legajos-busqueda'] as const,
    jugadores: (params: BusquedaJugadoresParams) => [...legajosBusquedaKeys.all, 'jugadores', params] as const,
    equipos: (params: BusquedaEquiposParams) => [...legajosBusquedaKeys.all, 'equipos', params] as const,
};

/**
 * Hook para buscar jugadores
 */
export const useJugadoresBusqueda = (
    params: BusquedaJugadoresParams,
    options?: Omit<UseQueryOptions<BusquedaJugadoresResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: legajosBusquedaKeys.jugadores(params),
        queryFn: () => busquedaLegajosService.buscarJugadores(params),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!params.q || params.id_categoria_edicion !== undefined || params.estado !== undefined,
        ...options,
    });
};

/**
 * Hook para buscar equipos
 */
export const useEquiposBusqueda = (
    params: BusquedaEquiposParams,
    options?: Omit<UseQueryOptions<BusquedaEquiposResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: legajosBusquedaKeys.equipos(params),
        queryFn: () => busquedaLegajosService.buscarEquipos(params),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!params.q || params.id_categoria_edicion !== undefined,
        ...options,
    });
};

