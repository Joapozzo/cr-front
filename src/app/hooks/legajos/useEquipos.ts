/**
 * React Query hooks para equipos en legajos
 */
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { equiposLegajosService } from '@/app/services/legajos/equipos.service';
import {
    EquipoInformacionBasica,
    PlantelEquipo,
    CategoriaEquipo,
    EstadisticasEquipo,
    HistorialPartidosEquipoResponse,
    TablaPosiciones,
    GoleadorEquipo,
    HistorialCapitanes,
    SancionEquipo,
    FixtureEquipo,
    SolicitudesEquipo,
    TipoRanking,
    TipoFixture,
    EstadoSolicitud,
} from '@/app/types/legajos';

export const equiposLegajosKeys = {
    all: ['legajos-equipos'] as const,
    detalle: (id: number) => [...equiposLegajosKeys.all, 'detalle', id] as const,
    categorias: (id: number) => [...equiposLegajosKeys.all, 'categorias', id] as const,
    plantel: (id: number, idCategoria: number) => [...equiposLegajosKeys.all, 'plantel', id, idCategoria] as const,
    estadisticas: (id: number, idCategoria: number) => [...equiposLegajosKeys.all, 'estadisticas', id, idCategoria] as const,
    partidos: (id: number, params?: any) => [...equiposLegajosKeys.all, 'partidos', id, params] as const,
    tabla: (id: number, idCategoria: number) => [...equiposLegajosKeys.all, 'tabla', id, idCategoria] as const,
    goleadores: (id: number, idCategoria: number, tipo: TipoRanking) => [...equiposLegajosKeys.all, 'goleadores', id, idCategoria, tipo] as const,
    capitanes: (id: number, idCategoria: number) => [...equiposLegajosKeys.all, 'capitanes', id, idCategoria] as const,
    sanciones: (id: number) => [...equiposLegajosKeys.all, 'sanciones', id] as const,
    fixtures: (id: number, idCategoria: number, tipo: TipoFixture) => [...equiposLegajosKeys.all, 'fixtures', id, idCategoria, tipo] as const,
    solicitudes: (id: number, idCategoria: number, estado?: EstadoSolicitud) => [...equiposLegajosKeys.all, 'solicitudes', id, idCategoria, estado] as const,
};

/**
 * Hook para obtener información básica de un equipo
 */
export const useEquipoDetalle = (
    id_equipo: number,
    options?: Omit<UseQueryOptions<EquipoInformacionBasica, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposLegajosKeys.detalle(id_equipo),
        queryFn: () => equiposLegajosService.obtenerEquipoDetalle(id_equipo),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo,
        ...options,
    });
};

/**
 * Hook para obtener categorías de un equipo
 */
export const useEquipoCategorias = (
    id_equipo: number,
    options?: Omit<UseQueryOptions<CategoriaEquipo[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposLegajosKeys.categorias(id_equipo),
        queryFn: () => equiposLegajosService.obtenerEquipoCategorias(id_equipo),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo,
        ...options,
    });
};

/**
 * Hook para obtener plantel de un equipo
 */
export const useEquipoPlantel = (
    id_equipo: number,
    id_categoria_edicion: number,
    options?: Omit<UseQueryOptions<PlantelEquipo, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposLegajosKeys.plantel(id_equipo, id_categoria_edicion),
        queryFn: () => equiposLegajosService.obtenerEquipoPlantel(id_equipo, id_categoria_edicion),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo && !!id_categoria_edicion,
        ...options,
    });
};

/**
 * Hook para obtener estadísticas de un equipo
 */
export const useEquipoEstadisticas = (
    id_equipo: number,
    id_categoria_edicion: number,
    options?: Omit<UseQueryOptions<EstadisticasEquipo, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposLegajosKeys.estadisticas(id_equipo, id_categoria_edicion),
        queryFn: () => equiposLegajosService.obtenerEquipoEstadisticas(id_equipo, id_categoria_edicion),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo && !!id_categoria_edicion,
        ...options,
    });
};

/**
 * Hook para obtener historial de partidos de un equipo
 */
export const useEquipoPartidos = (
    id_equipo: number,
    params?: {
        page?: number;
        limit?: number;
        id_categoria_edicion?: number;
        id_zona?: number;
        fase?: number;
        estado?: 'P' | 'C' | 'F';
    },
    options?: Omit<UseQueryOptions<HistorialPartidosEquipoResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposLegajosKeys.partidos(id_equipo, params),
        queryFn: () => equiposLegajosService.obtenerEquipoPartidos(id_equipo, params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo,
        ...options,
    });
};

/**
 * Hook para obtener tablas de posiciones de un equipo
 */
export const useEquipoTabla = (
    id_equipo: number,
    id_categoria_edicion: number,
    options?: Omit<UseQueryOptions<TablaPosiciones, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposLegajosKeys.tabla(id_equipo, id_categoria_edicion),
        queryFn: () => equiposLegajosService.obtenerEquipoTabla(id_equipo, id_categoria_edicion),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo && !!id_categoria_edicion,
        ...options,
    });
};

/**
 * Hook para obtener goleadores de un equipo
 */
export const useEquipoGoleadores = (
    id_equipo: number,
    id_categoria_edicion: number,
    tipo: TipoRanking = 'goles',
    options?: Omit<UseQueryOptions<GoleadorEquipo[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposLegajosKeys.goleadores(id_equipo, id_categoria_edicion, tipo),
        queryFn: () => equiposLegajosService.obtenerEquipoGoleadores(id_equipo, id_categoria_edicion, tipo),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo && !!id_categoria_edicion,
        ...options,
    });
};

/**
 * Hook para obtener historial de capitanes de un equipo
 */
export const useEquipoCapitanes = (
    id_equipo: number,
    id_categoria_edicion: number,
    options?: Omit<UseQueryOptions<HistorialCapitanes, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposLegajosKeys.capitanes(id_equipo, id_categoria_edicion),
        queryFn: () => equiposLegajosService.obtenerEquipoCapitanes(id_equipo, id_categoria_edicion),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo && !!id_categoria_edicion,
        ...options,
    });
};

/**
 * Hook para obtener sanciones de un equipo
 */
export const useEquipoSanciones = (
    id_equipo: number,
    options?: Omit<UseQueryOptions<SancionEquipo[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposLegajosKeys.sanciones(id_equipo),
        queryFn: () => equiposLegajosService.obtenerEquipoSanciones(id_equipo),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo,
        ...options,
    });
};

/**
 * Hook para obtener fixtures de un equipo
 */
export const useEquipoFixtures = (
    id_equipo: number,
    id_categoria_edicion: number,
    tipo: TipoFixture = 'proximos',
    options?: Omit<UseQueryOptions<FixtureEquipo[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposLegajosKeys.fixtures(id_equipo, id_categoria_edicion, tipo),
        queryFn: () => equiposLegajosService.obtenerEquipoFixtures(id_equipo, id_categoria_edicion, tipo),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo && !!id_categoria_edicion,
        ...options,
    });
};

/**
 * Hook para obtener solicitudes de un equipo
 */
export const useEquipoSolicitudes = (
    id_equipo: number,
    id_categoria_edicion: number,
    estado?: EstadoSolicitud,
    options?: Omit<UseQueryOptions<SolicitudesEquipo, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposLegajosKeys.solicitudes(id_equipo, id_categoria_edicion, estado),
        queryFn: () => equiposLegajosService.obtenerEquipoSolicitudes(id_equipo, id_categoria_edicion, estado),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo && !!id_categoria_edicion,
        ...options,
    });
};

