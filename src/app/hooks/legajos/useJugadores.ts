/**
 * React Query hooks para jugadores en legajos
 */
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { jugadoresLegajosService } from '@/app/services/legajos/jugadores.service';
import {
    JugadorInformacionBasica,
    EstadisticasJugador,
    HistorialEquiposJugador,
    HistorialPartidosJugadorResponse,
    HistorialDisciplinarioJugador,
    DestacadosJugador,
    SolicitudesJugador,
    EstadoSolicitud,
} from '@/app/types/legajos';

export const jugadoresLegajosKeys = {
    all: ['legajos-jugadores'] as const,
    detalle: (id: number) => [...jugadoresLegajosKeys.all, 'detalle', id] as const,
    equipos: (id: number) => [...jugadoresLegajosKeys.all, 'equipos', id] as const,
    estadisticas: (id: number, idCategoria?: number) => [...jugadoresLegajosKeys.all, 'estadisticas', id, idCategoria] as const,
    partidos: (id: number, params?: any) => [...jugadoresLegajosKeys.all, 'partidos', id, params] as const,
    disciplina: (id: number, idCategoria?: number) => [...jugadoresLegajosKeys.all, 'disciplina', id, idCategoria] as const,
    destacados: (id: number) => [...jugadoresLegajosKeys.all, 'destacados', id] as const,
    solicitudes: (id: number, estado?: EstadoSolicitud) => [...jugadoresLegajosKeys.all, 'solicitudes', id, estado] as const,
};

/**
 * Hook para obtener información básica de un jugador
 */
export const useJugadorDetalle = (
    id_jugador: number,
    options?: Omit<UseQueryOptions<JugadorInformacionBasica, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: jugadoresLegajosKeys.detalle(id_jugador),
        queryFn: () => jugadoresLegajosService.obtenerJugadorDetalle(id_jugador),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_jugador,
        ...options,
    });
};

/**
 * Hook para obtener historial de equipos de un jugador
 */
export const useJugadorEquipos = (
    id_jugador: number,
    options?: Omit<UseQueryOptions<HistorialEquiposJugador[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: jugadoresLegajosKeys.equipos(id_jugador),
        queryFn: () => jugadoresLegajosService.obtenerJugadorEquipos(id_jugador),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_jugador,
        ...options,
    });
};

/**
 * Hook para obtener estadísticas de un jugador
 */
export const useJugadorEstadisticas = (
    id_jugador: number,
    id_categoria_edicion?: number,
    options?: Omit<UseQueryOptions<EstadisticasJugador, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: jugadoresLegajosKeys.estadisticas(id_jugador, id_categoria_edicion),
        queryFn: () => jugadoresLegajosService.obtenerJugadorEstadisticas(id_jugador, id_categoria_edicion),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_jugador,
        ...options,
    });
};

/**
 * Hook para obtener historial de partidos de un jugador
 */
export const useJugadorPartidos = (
    id_jugador: number,
    params?: {
        page?: number;
        limit?: number;
        id_categoria_edicion?: number;
        id_equipo?: number;
        resultado?: 'G' | 'E' | 'P';
    },
    options?: Omit<UseQueryOptions<HistorialPartidosJugadorResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: jugadoresLegajosKeys.partidos(id_jugador, params),
        queryFn: () => jugadoresLegajosService.obtenerJugadorPartidos(id_jugador, params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_jugador,
        ...options,
    });
};

/**
 * Hook para obtener historial disciplinario de un jugador
 */
export const useJugadorDisciplina = (
    id_jugador: number,
    id_categoria_edicion?: number,
    options?: Omit<UseQueryOptions<HistorialDisciplinarioJugador, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: jugadoresLegajosKeys.disciplina(id_jugador, id_categoria_edicion),
        queryFn: () => jugadoresLegajosService.obtenerJugadorDisciplina(id_jugador, id_categoria_edicion),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_jugador,
        ...options,
    });
};

/**
 * Hook para obtener destacados de un jugador
 */
export const useJugadorDestacados = (
    id_jugador: number,
    options?: Omit<UseQueryOptions<DestacadosJugador, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: jugadoresLegajosKeys.destacados(id_jugador),
        queryFn: () => jugadoresLegajosService.obtenerJugadorDestacados(id_jugador),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_jugador,
        ...options,
    });
};

/**
 * Hook para obtener solicitudes de un jugador
 */
export const useJugadorSolicitudes = (
    id_jugador: number,
    estado?: EstadoSolicitud,
    options?: Omit<UseQueryOptions<SolicitudesJugador, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: jugadoresLegajosKeys.solicitudes(id_jugador, estado),
        queryFn: () => jugadoresLegajosService.obtenerJugadorSolicitudes(id_jugador, estado),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id_jugador,
        ...options,
    });
};

