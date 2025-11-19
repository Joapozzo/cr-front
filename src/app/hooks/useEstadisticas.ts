import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { estadisticasService, PosicionZona } from '../services/estadisticas.services';
import { JugadorEstadistica } from '../types/estadisticas';

export const estadisticasKeys = {
    all: ['estadisticas'] as const,
    posiciones: (id_categoria_edicion: number) => [...estadisticasKeys.all, 'posiciones', id_categoria_edicion] as const,
    goleadores: (id_categoria_edicion: number) => [...estadisticasKeys.all, 'goleadores', id_categoria_edicion] as const,
    asistencias: (id_categoria_edicion: number) => [...estadisticasKeys.all, 'asistencias', id_categoria_edicion] as const,
    amarillas: (id_categoria_edicion: number) => [...estadisticasKeys.all, 'amarillas', id_categoria_edicion] as const,
    rojas: (id_categoria_edicion: number) => [...estadisticasKeys.all, 'rojas', id_categoria_edicion] as const,
    mvps: (id_categoria_edicion: number) => [...estadisticasKeys.all, 'mvps', id_categoria_edicion] as const,
};

/**
 * Hook para obtener posiciones por categoría edición
 */
export const usePosicionesPorCategoriaEdicion = (
    id_categoria_edicion: number | null,
    options?: Omit<UseQueryOptions<PosicionZona[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: estadisticasKeys.posiciones(id_categoria_edicion || 0),
        queryFn: () => estadisticasService.obtenerPosicionesPorCategoriaEdicion(id_categoria_edicion!),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_categoria_edicion,
        ...options,
    });
};

/**
 * Hook para obtener goleadores por categoría edición
 */
export const useGoleadoresPorCategoriaEdicion = (
    id_categoria_edicion: number | null,
    options?: Omit<UseQueryOptions<JugadorEstadistica[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: estadisticasKeys.goleadores(id_categoria_edicion || 0),
        queryFn: () => estadisticasService.obtenerGoleadoresPorCategoriaEdicion(id_categoria_edicion!),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_categoria_edicion,
        ...options,
    });
};

/**
 * Hook para obtener asistencias por categoría edición
 */
export const useAsistenciasPorCategoriaEdicion = (
    id_categoria_edicion: number | null,
    options?: Omit<UseQueryOptions<JugadorEstadistica[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: estadisticasKeys.asistencias(id_categoria_edicion || 0),
        queryFn: () => estadisticasService.obtenerAsistenciasPorCategoriaEdicion(id_categoria_edicion!),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_categoria_edicion,
        ...options,
    });
};

/**
 * Hook para obtener amarillas por categoría edición
 */
export const useAmarillasPorCategoriaEdicion = (
    id_categoria_edicion: number | null,
    options?: Omit<UseQueryOptions<JugadorEstadistica[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: estadisticasKeys.amarillas(id_categoria_edicion || 0),
        queryFn: () => estadisticasService.obtenerAmarillasPorCategoriaEdicion(id_categoria_edicion!),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_categoria_edicion,
        ...options,
    });
};

/**
 * Hook para obtener rojas por categoría edición
 */
export const useRojasPorCategoriaEdicion = (
    id_categoria_edicion: number | null,
    options?: Omit<UseQueryOptions<JugadorEstadistica[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: estadisticasKeys.rojas(id_categoria_edicion || 0),
        queryFn: () => estadisticasService.obtenerRojasPorCategoriaEdicion(id_categoria_edicion!),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_categoria_edicion,
        ...options,
    });
};

/**
 * Hook para obtener MVPs por categoría edición
 */
export const useMVPsPorCategoriaEdicion = (
    id_categoria_edicion: number | null,
    options?: Omit<UseQueryOptions<JugadorEstadistica[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: estadisticasKeys.mvps(id_categoria_edicion || 0),
        queryFn: () => estadisticasService.obtenerMVPsPorCategoriaEdicion(id_categoria_edicion!),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_categoria_edicion,
        ...options,
    });
};

// ============================================
// ESTADÍSTICAS POR EQUIPO (filtradas por equipo)
// ============================================

export const estadisticasEquipoKeys = {
    all: ['estadisticasEquipo'] as const,
    goleadores: (id_equipo: number, id_categoria_edicion?: number | null) => 
        [...estadisticasEquipoKeys.all, 'goleadores', id_equipo, id_categoria_edicion ?? 'auto'] as const,
    asistencias: (id_equipo: number, id_categoria_edicion?: number | null) => 
        [...estadisticasEquipoKeys.all, 'asistencias', id_equipo, id_categoria_edicion ?? 'auto'] as const,
    amarillas: (id_equipo: number, id_categoria_edicion?: number | null) => 
        [...estadisticasEquipoKeys.all, 'amarillas', id_equipo, id_categoria_edicion ?? 'auto'] as const,
    rojas: (id_equipo: number, id_categoria_edicion?: number | null) => 
        [...estadisticasEquipoKeys.all, 'rojas', id_equipo, id_categoria_edicion ?? 'auto'] as const,
    mvps: (id_equipo: number, id_categoria_edicion?: number | null) => 
        [...estadisticasEquipoKeys.all, 'mvps', id_equipo, id_categoria_edicion ?? 'auto'] as const,
};

/**
 * Hook para obtener goleadores del equipo
 * @param id_equipo - ID del equipo (requerido)
 * @param id_categoria_edicion - ID de la categoría edición (opcional). Si no se pasa, se usará la última categoría activa donde participa el equipo
 */
export const useGoleadoresPorEquipo = (
    id_equipo: number | null,
    id_categoria_edicion?: number | null,
    options?: Omit<UseQueryOptions<JugadorEstadistica[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: estadisticasEquipoKeys.goleadores(id_equipo || 0, id_categoria_edicion),
        queryFn: () => estadisticasService.obtenerGoleadoresPorEquipo(id_equipo!, id_categoria_edicion ?? undefined),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo, // Solo requiere id_equipo, id_categoria_edicion es opcional
        ...options,
    });
};

/**
 * Hook para obtener asistencias del equipo
 */
export const useAsistenciasPorEquipo = (
    id_equipo: number | null,
    id_categoria_edicion?: number | null,
    options?: Omit<UseQueryOptions<JugadorEstadistica[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: estadisticasEquipoKeys.asistencias(id_equipo || 0, id_categoria_edicion),
        queryFn: () => estadisticasService.obtenerAsistenciasPorEquipo(id_equipo!, id_categoria_edicion ?? undefined),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo,
        ...options,
    });
};

/**
 * Hook para obtener amarillas del equipo
 */
export const useAmarillasPorEquipo = (
    id_equipo: number | null,
    id_categoria_edicion?: number | null,
    options?: Omit<UseQueryOptions<JugadorEstadistica[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: estadisticasEquipoKeys.amarillas(id_equipo || 0, id_categoria_edicion),
        queryFn: () => estadisticasService.obtenerAmarillasPorEquipo(id_equipo!, id_categoria_edicion ?? undefined),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo,
        ...options,
    });
};

/**
 * Hook para obtener rojas del equipo
 */
export const useRojasPorEquipo = (
    id_equipo: number | null,
    id_categoria_edicion?: number | null,
    options?: Omit<UseQueryOptions<JugadorEstadistica[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: estadisticasEquipoKeys.rojas(id_equipo || 0, id_categoria_edicion),
        queryFn: () => estadisticasService.obtenerRojasPorEquipo(id_equipo!, id_categoria_edicion ?? undefined),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo,
        ...options,
    });
};

/**
 * Hook para obtener MVPs del equipo
 */
export const useMVPsPorEquipo = (
    id_equipo: number | null,
    id_categoria_edicion?: number | null,
    options?: Omit<UseQueryOptions<JugadorEstadistica[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: estadisticasEquipoKeys.mvps(id_equipo || 0, id_categoria_edicion),
        queryFn: () => estadisticasService.obtenerMVPsPorEquipo(id_equipo!, id_categoria_edicion ?? undefined),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo,
        ...options,
    });
};

