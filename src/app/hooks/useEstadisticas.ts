import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { estadisticasService, PosicionZona } from '../services/estadisticas.services';
import { JugadorEstadistica } from '../types/estadisticas';

export const estadisticasKeys = {
    all: ['estadisticas'] as const,
    posiciones: (id_categoria_edicion: number) => [...estadisticasKeys.all, 'posiciones', id_categoria_edicion] as const,
    playoff: (id_categoria_edicion: number) => [...estadisticasKeys.all, 'playoff', id_categoria_edicion] as const,
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
    // Usar un número estable para evitar cambios de key
    const stableId = id_categoria_edicion ?? 0;
    const isEnabled = !!id_categoria_edicion && id_categoria_edicion > 0;
    
    return useQuery({
        queryKey: estadisticasKeys.posiciones(stableId),
        queryFn: () => estadisticasService.obtenerPosicionesPorCategoriaEdicion(id_categoria_edicion!),
        staleTime: 0, // Siempre considerar stale para datos en vivo
        gcTime: 5 * 60 * 1000, // 5 minutos (mantener cache para no perder datos)
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: true, // Forzar refetch al montar
        enabled: isEnabled,
        ...options,
    });
};

/**
 * Hook para obtener zonas de playoff por categoría edición
 */
export const useZonasPlayoffPorCategoriaEdicion = (
    id_categoria_edicion: number | null,
    options?: Omit<UseQueryOptions<any[], Error>, 'queryKey' | 'queryFn'>
) => {
    const stableId = id_categoria_edicion ?? 0;
    const isEnabled = !!id_categoria_edicion && id_categoria_edicion > 0;
    
    return useQuery({
        queryKey: estadisticasKeys.playoff(stableId),
        queryFn: () => estadisticasService.obtenerZonasPlayoffPorCategoriaEdicion(id_categoria_edicion!),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 15 * 60 * 1000, // 15 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: isEnabled,
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
    const stableId = id_categoria_edicion ?? 0;
    const isEnabled = !!id_categoria_edicion && id_categoria_edicion > 0;
    
    return useQuery({
        queryKey: estadisticasKeys.goleadores(stableId),
        queryFn: () => estadisticasService.obtenerGoleadoresPorCategoriaEdicion(id_categoria_edicion!),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 15 * 60 * 1000, // 15 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: isEnabled,
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
    const stableId = id_categoria_edicion ?? 0;
    const isEnabled = !!id_categoria_edicion && id_categoria_edicion > 0;
    
    return useQuery({
        queryKey: estadisticasKeys.asistencias(stableId),
        queryFn: () => estadisticasService.obtenerAsistenciasPorCategoriaEdicion(id_categoria_edicion!),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 15 * 60 * 1000, // 15 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: isEnabled,
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
    const stableId = id_categoria_edicion ?? 0;
    const isEnabled = !!id_categoria_edicion && id_categoria_edicion > 0;
    
    return useQuery({
        queryKey: estadisticasKeys.amarillas(stableId),
        queryFn: () => estadisticasService.obtenerAmarillasPorCategoriaEdicion(id_categoria_edicion!),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 15 * 60 * 1000, // 15 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: isEnabled,
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
    const stableId = id_categoria_edicion ?? 0;
    const isEnabled = !!id_categoria_edicion && id_categoria_edicion > 0;
    
    return useQuery({
        queryKey: estadisticasKeys.rojas(stableId),
        queryFn: () => estadisticasService.obtenerRojasPorCategoriaEdicion(id_categoria_edicion!),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 15 * 60 * 1000, // 15 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: isEnabled,
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
    const stableId = id_categoria_edicion ?? 0;
    const isEnabled = !!id_categoria_edicion && id_categoria_edicion > 0;
    
    return useQuery({
        queryKey: estadisticasKeys.mvps(stableId),
        queryFn: () => estadisticasService.obtenerMVPsPorCategoriaEdicion(id_categoria_edicion!),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 15 * 60 * 1000, // 15 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: isEnabled,
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
    const stableEquipoId = id_equipo ?? 0;
    const isEnabled = !!id_equipo && id_equipo > 0;
    
    return useQuery({
        queryKey: estadisticasEquipoKeys.goleadores(stableEquipoId, id_categoria_edicion),
        queryFn: () => estadisticasService.obtenerGoleadoresPorEquipo(id_equipo!, id_categoria_edicion ?? undefined),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 15 * 60 * 1000, // 15 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: isEnabled,
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
    const stableEquipoId = id_equipo ?? 0;
    const isEnabled = !!id_equipo && id_equipo > 0;
    
    return useQuery({
        queryKey: estadisticasEquipoKeys.asistencias(stableEquipoId, id_categoria_edicion),
        queryFn: () => estadisticasService.obtenerAsistenciasPorEquipo(id_equipo!, id_categoria_edicion ?? undefined),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 15 * 60 * 1000, // 15 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: isEnabled,
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
    const stableEquipoId = id_equipo ?? 0;
    const isEnabled = !!id_equipo && id_equipo > 0;
    
    return useQuery({
        queryKey: estadisticasEquipoKeys.amarillas(stableEquipoId, id_categoria_edicion),
        queryFn: () => estadisticasService.obtenerAmarillasPorEquipo(id_equipo!, id_categoria_edicion ?? undefined),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 15 * 60 * 1000, // 15 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: isEnabled,
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
    const stableEquipoId = id_equipo ?? 0;
    const isEnabled = !!id_equipo && id_equipo > 0;
    
    return useQuery({
        queryKey: estadisticasEquipoKeys.rojas(stableEquipoId, id_categoria_edicion),
        queryFn: () => estadisticasService.obtenerRojasPorEquipo(id_equipo!, id_categoria_edicion ?? undefined),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 15 * 60 * 1000, // 15 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: isEnabled,
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
    const stableEquipoId = id_equipo ?? 0;
    const isEnabled = !!id_equipo && id_equipo > 0;
    
    return useQuery({
        queryKey: estadisticasEquipoKeys.mvps(stableEquipoId, id_categoria_edicion),
        queryFn: () => estadisticasService.obtenerMVPsPorEquipo(id_equipo!, id_categoria_edicion ?? undefined),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 15 * 60 * 1000, // 15 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: isEnabled,
        ...options,
    });
};

