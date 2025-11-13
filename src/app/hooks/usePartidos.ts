import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { partidosService } from '../services/partidos.services';
import { Partido } from '../types/partido';

// Query Keys para partidos
export const partidosKeys = {
    all: ['partidos'] as const,
    generales: () => [...partidosKeys.all, 'generales'] as const,
    ultimosJugados: () => [...partidosKeys.generales(), 'ultimos-jugados'] as const,
    proximosJornada: () => [...partidosKeys.generales(), 'proximos-jornada'] as const,
    // NUEVAS KEYS
    ultimaJornadaCategorias: () => [...partidosKeys.generales(), 'ultima-jornada-categorias'] as const,
    proximaJornadaCategorias: () => [...partidosKeys.generales(), 'proxima-jornada-categorias'] as const,
    proximaFechaDia: (dia: string) => [...partidosKeys.generales(), 'proxima-fecha', dia] as const,
    equipos: () => [...partidosKeys.all, 'equipos'] as const,
    equipo: (id: number) => [...partidosKeys.equipos(), id] as const,
    equipoUltimos: (id: number) => [...partidosKeys.equipo(id), 'ultimos'] as const,
    equipoUltimo: (id: number) => [...partidosKeys.equipo(id), 'ultimo'] as const,
    equipoProximo: (id: number) => [...partidosKeys.equipo(id), 'proximo'] as const,
};

// ==================== HOOKS PARA PARTIDOS GENERALES ====================

/**
 * Hook para obtener los últimos 5 partidos jugados de la última edición
 */
export const useUltimos5PartidosJugados = (
    options?: Omit<UseQueryOptions<Partido[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: partidosKeys.ultimosJugados(),
        queryFn: partidosService.obtenerUltimos5PartidosJugados,
        staleTime: 2 * 60 * 1000, // 2 minutos (los partidos cambian frecuentemente)
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook para obtener los próximos 5 partidos de la próxima jornada
 */
export const useProximos5PartidosProximaJornada = (
    options?: Omit<UseQueryOptions<Partido[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: partidosKeys.proximosJornada(),
        queryFn: partidosService.obtenerProximos5PartidosProximaJornada,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

// ==================== NUEVOS HOOKS ====================

/**
 * Hook para obtener partidos de última jornada de todas las categorías
 */
export const useUltimosPartidosCategorias = (
    options?: Omit<UseQueryOptions<Partido[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: partidosKeys.ultimaJornadaCategorias(),
        queryFn: partidosService.obtenerUltimosPartidosCategorias,
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook para obtener partidos de próxima jornada de todas las categorías
 */
export const useProximosPartidosCategorias = (
    options?: Omit<UseQueryOptions<Partido[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: partidosKeys.proximaJornadaCategorias(),
        queryFn: partidosService.obtenerProximosPartidosCategorias,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook para obtener partidos de próxima fecha por día específico
 */
export const usePartidosProximaJornadaDia = (
    dia: string,
    options?: Omit<UseQueryOptions<Partido[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: partidosKeys.proximaFechaDia(dia),
        queryFn: () => partidosService.obtenerPartidosProximaJornadaDia(dia),
        enabled: !!dia && ['sabado', 'domingo', 'lunes'].includes(dia.toLowerCase()),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

// Hook unificado para partidos generales (ACTUALIZADO)
type PartidosGeneralesType = 'ultimos-jugados' | 'proximos-jornada' | 'ultima-jornada-categorias' | 'proxima-jornada-categorias';

export const usePartidosGenerales = <T extends PartidosGeneralesType>(
    type: T,
    options?: Omit<UseQueryOptions<Partido[], Error>, 'queryKey' | 'queryFn'>
) => {
    const queryConfig = {
        'ultimos-jugados': {
            queryKey: partidosKeys.ultimosJugados(),
            queryFn: partidosService.obtenerUltimos5PartidosJugados,
            staleTime: 2 * 60 * 1000,
        },
        'proximos-jornada': {
            queryKey: partidosKeys.proximosJornada(),
            queryFn: partidosService.obtenerProximos5PartidosProximaJornada,
            staleTime: 5 * 60 * 1000,
        },
        'ultima-jornada-categorias': {
            queryKey: partidosKeys.ultimaJornadaCategorias(),
            queryFn: partidosService.obtenerUltimosPartidosCategorias,
            staleTime: 2 * 60 * 1000,
        },
        'proxima-jornada-categorias': {
            queryKey: partidosKeys.proximaJornadaCategorias(),
            queryFn: partidosService.obtenerProximosPartidosCategorias,
            staleTime: 5 * 60 * 1000,
        },
    };

    return useQuery({
        ...queryConfig[type],
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

// ==================== HOOKS PARA PARTIDOS DEL EQUIPO ====================

/**
 * Hook para obtener los últimos 5 partidos de un equipo específico
 */
export const useUltimos5PartidosEquipo = (
    id_equipo: number,
    options?: Omit<UseQueryOptions<Partido[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: partidosKeys.equipoUltimos(id_equipo),
        queryFn: () => partidosService.obtenerUltimos5PartidosEquipo(id_equipo),
        enabled: !!id_equipo,
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook para obtener el último partido de un equipo específico
 */
export const useUltimoPartidoEquipo = (
    id_equipo: number,
    options?: Omit<UseQueryOptions<Partido | null, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: partidosKeys.equipoUltimo(id_equipo),
        queryFn: () => partidosService.obtenerUltimoPartidoEquipo(id_equipo),
        enabled: !!id_equipo,
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook para obtener el próximo partido de un equipo específico
 */
export const useProximoPartidoEquipo = (
    id_equipo: number,
    options?: Omit<UseQueryOptions<Partido | null, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: partidosKeys.equipoProximo(id_equipo),
        queryFn: () => partidosService.obtenerProximoPartidoEquipo(id_equipo),
        enabled: !!id_equipo,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

// Hook unificado para partidos del equipo
type PartidosEquipoType = 'ultimos' | 'ultimo' | 'proximo';

export const usePartidosEquipo = <T extends PartidosEquipoType>(
    type: T,
    id_equipo: number,
    options?: Omit<
        UseQueryOptions<
            T extends 'ultimos' ? Partido[] : Partido | null,
            Error
        >,
        'queryKey' | 'queryFn'
    >
) => {
    const queryConfig = {
        ultimos: {
            queryKey: partidosKeys.equipoUltimos(id_equipo),
            queryFn: () => partidosService.obtenerUltimos5PartidosEquipo(id_equipo),
            staleTime: 2 * 60 * 1000,
        },
        ultimo: {
            queryKey: partidosKeys.equipoUltimo(id_equipo),
            queryFn: () => partidosService.obtenerUltimoPartidoEquipo(id_equipo),
            staleTime: 2 * 60 * 1000,
        },
        proximo: {
            queryKey: partidosKeys.equipoProximo(id_equipo),
            queryFn: () => partidosService.obtenerProximoPartidoEquipo(id_equipo),
            staleTime: 5 * 60 * 1000,
        },
    };

    return useQuery({
        ...queryConfig[type],
        enabled: !!id_equipo,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    } as any);
};