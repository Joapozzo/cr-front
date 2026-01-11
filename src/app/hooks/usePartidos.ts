import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { partidosService } from '../services/partidos.services';
import { Partido, UltimoYProximoPartidoResponse } from '../types/partido';
import { PartidoResponse } from '../schemas/partidos.schema';

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
    // Keys para partidos del jugador autenticado
    jugador: () => [...partidosKeys.all, 'jugador'] as const,
    jugadorUltimosProximos: () => [...partidosKeys.jugador(), 'ultimos-proximos'] as const,
    // Keys para partidos con paginación
    usuario: () => [...partidosKeys.all, 'usuario'] as const,
    usuarioLista: (
        tipo: 'fecha' | 'jornada',
        id_categoria_edicion?: number,
        jornada?: number,
        limit?: number,
        page?: number
    ) => [...partidosKeys.usuario(), 'lista', tipo, id_categoria_edicion, jornada, limit, page] as const,
    usuarioDetalle: (id_partido: number) => [...partidosKeys.usuario(), 'detalle', id_partido] as const,
    equipos: () => [...partidosKeys.all, 'equipos'] as const,
    equipo: (id: number) => [...partidosKeys.equipos(), id] as const,
    equipoUltimos: (id: number) => [...partidosKeys.equipo(id), 'ultimos'] as const,
    equipoUltimo: (id: number) => [...partidosKeys.equipo(id), 'ultimo'] as const,
    equipoProximo: (id: number) => [...partidosKeys.equipo(id), 'proximo'] as const,
    // Key para partidos del equipo con paginación (filtrados por equipo)
    equipoLista: (
        id_equipo: number,
        tipo: 'fecha' | 'jornada',
        id_categoria_edicion?: number | null,
        jornada?: number,
        limit?: number,
        page?: number
    ) => [...partidosKeys.equipo(id_equipo), 'lista', tipo, id_categoria_edicion ?? 'auto', jornada, limit, page] as const,
};

// ==================== HOOKS PARA PARTIDOS GENERALES ====================

/**
 * Hook para obtener los últimos 5 partidos jugados de la última edición
 */
export const useUltimos5PartidosJugados = (
    options?: Omit<UseQueryOptions<any[], Error>, 'queryKey' | 'queryFn'>
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
    options?: Omit<UseQueryOptions<any[], Error>, 'queryKey' | 'queryFn'>
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
    options?: Omit<UseQueryOptions<any[], Error>, 'queryKey' | 'queryFn'>
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
    options?: Omit<UseQueryOptions<any[], Error>, 'queryKey' | 'queryFn'>
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
    options?: Omit<UseQueryOptions<any[], Error>, 'queryKey' | 'queryFn'>
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
    options?: Omit<UseQueryOptions<PartidoResponse[], Error>, 'queryKey' | 'queryFn'>
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
    options?: Omit<UseQueryOptions<any[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: partidosKeys.equipoUltimos(id_equipo),
        queryFn: () => partidosService.obtenerUltimos5PartidosEquipo(id_equipo),
        enabled: !!id_equipo,
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Usar cache si los datos están frescos
        ...options,
    });
};

/**
 * Hook para obtener el último partido de un equipo específico
 */
export const useUltimoPartidoEquipo = (
    id_equipo: number,
    options?: Omit<UseQueryOptions<any | null, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: partidosKeys.equipoUltimo(id_equipo),
        queryFn: () => partidosService.obtenerUltimoPartidoEquipo(id_equipo),
        enabled: !!id_equipo,
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Usar cache si los datos están frescos
        ...options,
    });
};

/**
 * Hook para obtener el próximo partido de un equipo específico
 */
export const useProximoPartidoEquipo = (
    id_equipo: number,
    options?: Omit<UseQueryOptions<any | null, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: partidosKeys.equipoProximo(id_equipo),
        queryFn: () => partidosService.obtenerProximoPartidoEquipo(id_equipo),
        enabled: !!id_equipo,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Usar cache si los datos están frescos
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

// ==================== HOOKS PARA PARTIDOS DEL JUGADOR ====================


export const useUltimosYProximosPartidosJugador = (
    options?: Omit<UseQueryOptions<UltimoYProximoPartidoResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: partidosKeys.jugadorUltimosProximos(),
        queryFn: partidosService.obtenerUltimosYProximosPartidosJugador,
        staleTime: 2 * 60 * 1000, // 2 minutos - datos considerados frescos
        gcTime: 5 * 60 * 1000, // 5 minutos - tiempo en cache después de no usar
        retry: 2, // Reintentar 2 veces en caso de error
        refetchOnWindowFocus: false, // No refetch automático al volver a la ventana (optimización)
        refetchOnMount: true, // Refetch al montar el componente (para datos actualizados)
        refetchOnReconnect: true, // Refetch al reconectar (útil si hay problemas de red)
        ...options, // Permite sobrescribir opciones si es necesario
    });
};

// ==================== HOOKS PARA PARTIDOS CON PAGINACIÓN ====================

export interface PartidosUsuarioResponse {
    partidos: Partido[];
    total: number;
    limit: number;
    offset: number;
    jornadas: number[];
}

/**
 * Hook para obtener partidos con paginación (por fecha o jornada)
 */
export const usePartidosUsuario = (
    tipo: 'fecha' | 'jornada',
    id_categoria_edicion?: number,
    jornada?: number,
    limit?: number,
    page?: number,
    options?: Omit<UseQueryOptions<PartidosUsuarioResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: partidosKeys.usuarioLista(tipo, id_categoria_edicion, jornada, limit, page),
        queryFn: async () => {
            const response = await partidosService.obtenerPartidosUsuario(tipo, id_categoria_edicion, jornada, limit, page);
            return response as PartidosUsuarioResponse;
        },
        staleTime: 0, // Siempre considerar los datos como obsoletos para forzar refetch
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: 'always', // Siempre refetch cuando se monta el componente o cambian los parámetros
        enabled: !!tipo,
        ...options,
    });
};

/**
 * Hook para obtener partido completo por ID
 */
export const usePartidoDetalleUsuario = (
    id_partido: number | null,
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: partidosKeys.usuarioDetalle(id_partido || 0),
        queryFn: () => partidosService.obtenerPartidoDetalleUsuario(id_partido!),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_partido,
        ...options,
    });
};

export const usePartidosUsuarioPorEquipo = (
    id_equipo: number | null,
    tipo: 'fecha' | 'jornada',
    id_categoria_edicion?: number | null,
    jornada?: number,
    limit?: number,
    page?: number,
    options?: Omit<UseQueryOptions<PartidosUsuarioResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: partidosKeys.equipoLista(id_equipo || 0, tipo, id_categoria_edicion, jornada, limit, page),
        queryFn: async () => {
            const response = await partidosService.obtenerPartidosUsuarioPorEquipo(id_equipo!, tipo, id_categoria_edicion ?? undefined, jornada, limit, page);
            return response as PartidosUsuarioResponse;
        },
        staleTime: 0, // Siempre considerar los datos como obsoletos para forzar refetch
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: 'always', // Siempre refetch cuando se monta el componente o cambian los parámetros
        enabled: !!id_equipo && !!tipo, // Habilitar solo si id_equipo y tipo están presentes
        ...options,
    });
};