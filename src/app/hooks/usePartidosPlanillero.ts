import { useInfiniteQuery, UseInfiniteQueryOptions, InfiniteData, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { planilleroService, PlanilleroPartidosResponse } from '../services/planillero.services';
import { useAuthStore } from '../stores/authStore';
import { Partido, JugadorPlantel, PartidoCompleto, IncidenciaPartido, DatosCompletosPlanillero } from '../types/partido';

export const planilleroKeys = {
    all: ['planillero'] as const,
    partidosPendientes: (limit?: number) => [...planilleroKeys.all, 'partidos-pendientes', limit] as const,
    partidosPlanillados: (limit?: number) => [...planilleroKeys.all, 'partidos-planillados', limit] as const,
    // Nuevas keys granulares
    datosCompletos: (idPartido: number) => [...planilleroKeys.all, 'datos-completos', idPartido] as const,
    datosBasicos: (idPartido: number) => [...planilleroKeys.all, 'partido-basicos', idPartido] as const,
    plantel: (idPartido: number, idEquipo: number) => [...planilleroKeys.all, 'plantel', idPartido, idEquipo] as const,
    incidencias: (idPartido: number) => [...planilleroKeys.all, 'incidencias', idPartido] as const,
};

type TipoPartido = 'pendientes' | 'planillados';

interface UsePartidosPlanilleroPaginadosResult {
    items: Partido[];
    total: number;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
}

export const usePartidosPlanilleroPaginados = (
    tipo: TipoPartido,
    limit: number = 5,
    options?: Omit<UseInfiniteQueryOptions<PlanilleroPartidosResponse, Error>, 'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'>
): UsePartidosPlanilleroPaginadosResult => {
    const usuario = useAuthStore((state) => state.usuario);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: tipo === 'pendientes' 
            ? planilleroKeys.partidosPendientes(limit)
            : planilleroKeys.partidosPlanillados(limit),
        queryFn: ({ pageParam = 1 }) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return tipo === 'pendientes'
                ? planilleroService.partidosPendientesPlanillero(pageParam as number, limit)
                : planilleroService.partidosPlanilladosPlanillero(pageParam as number, limit);
        },
        getNextPageParam: (lastPage, allPages) => {
            const totalCargado = allPages.reduce((acc, page) => acc + page.partidos.length, 0);
            return totalCargado < lastPage.total ? (lastPage.page + 1) : undefined;
        },
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!usuario?.uid,
        ...options,
    });

    // Aplanar todos los partidos de todas las páginas
    const infiniteData = data as InfiniteData<PlanilleroPartidosResponse, number> | undefined;
    const items = infiniteData?.pages.flatMap((page: PlanilleroPartidosResponse) => page.partidos) ?? [];
    
    // Obtener el total de la última página (o 0 si no hay datos)
    const total = infiniteData?.pages[infiniteData.pages.length - 1]?.total ?? 0;

    return {
        items,
        total,
        hasNextPage: hasNextPage ?? false,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error: error as Error | null,
    };
};

// Hooks legacy para compatibilidad (deprecados, usar usePartidosPlanilleroPaginados)
export const usePartidosPendientesPlanillero = (
    page: number = 1,
    limit: number = 5,
    options?: Omit<UseInfiniteQueryOptions<PlanilleroPartidosResponse, Error>, 'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'>
) => {
    const result = usePartidosPlanilleroPaginados('pendientes', limit, options);
    
    // Para compatibilidad, devolver solo la página solicitada
    const pageIndex = page - 1;
    const pageData = result.items.slice(pageIndex * limit, (pageIndex + 1) * limit);
    
    return {
        ...result,
        data: {
            partidos: pageData,
            total: result.total,
            limit,
            offset: (page - 1) * limit,
            page,
        },
    };
};

export const usePartidosPlanilladosPlanillero = (
    page: number = 1,
    limit: number = 5,
    options?: Omit<UseInfiniteQueryOptions<PlanilleroPartidosResponse, Error>, 'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'>
) => {
    const result = usePartidosPlanilleroPaginados('planillados', limit, options);
    
    // Para compatibilidad, devolver solo la página solicitada
    const pageIndex = page - 1;
    const pageData = result.items.slice(pageIndex * limit, (pageIndex + 1) * limit);
    
    return {
        ...result,
        data: {
            partidos: pageData,
            total: result.total,
            limit,
            offset: (page - 1) * limit,
            page,
        },
    };
};

// Hook para obtener datos completos del partido (compatibilidad)
export const useDatosCompletosPlanillero = (
    idPartido: number,
    options?: Omit<UseQueryOptions<DatosCompletosPlanillero, Error>, 'queryKey' | 'queryFn'>
) => {
    const usuario = useAuthStore((state) => state.usuario);

    return useQuery({
        queryKey: planilleroKeys.datosCompletos(idPartido),
        queryFn: () => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.obtenerDatosCompletosPlanillero(idPartido);
        },
        staleTime: 60 * 1000, // 1 minuto
        gcTime: 5 * 60 * 1000,
        enabled: !!idPartido && !!usuario?.uid,
        ...options,
    });
};

// Hook para obtener solo datos básicos del partido (marcador, estado, etc.)
export const useDatosBasicosPartido = (
    idPartido: number,
    options?: Omit<UseQueryOptions<PartidoCompleto, Error>, 'queryKey' | 'queryFn'>
) => {
    const usuario = useAuthStore((state) => state.usuario);

    return useQuery({
        queryKey: planilleroKeys.datosBasicos(idPartido),
        queryFn: () => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.obtenerDatosBasicosPartido(idPartido);
        },
        staleTime: 60 * 1000, // 1 minuto
        gcTime: 5 * 60 * 1000,
        enabled: !!idPartido && !!usuario?.uid,
        ...options,
    });
};

// Hook para obtener solo el plantel de un equipo específico
export const usePlantelEquipo = (
    idPartido: number,
    idEquipo: number,
    idCategoriaEdicion: number,
    options?: Omit<UseQueryOptions<JugadorPlantel[], Error>, 'queryKey' | 'queryFn'>
) => {
    const usuario = useAuthStore((state) => state.usuario);

    return useQuery({
        queryKey: planilleroKeys.plantel(idPartido, idEquipo),
        queryFn: () => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.obtenerPlantelEquipo(idPartido, idEquipo, idCategoriaEdicion);
        },
        staleTime: 30 * 1000, // 30 segundos
        gcTime: 5 * 60 * 1000,
        enabled: !!idPartido && !!idEquipo && !!idCategoriaEdicion && !!usuario?.uid,
        ...options,
    });
};

// Hook para obtener solo las incidencias del partido
export const useIncidenciasPartido = (
    idPartido: number,
    options?: Omit<UseQueryOptions<IncidenciaPartido[], Error>, 'queryKey' | 'queryFn'>
) => {
    const usuario = useAuthStore((state) => state.usuario);

    return useQuery({
        queryKey: planilleroKeys.incidencias(idPartido),
        queryFn: () => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.obtenerIncidenciasPartido(idPartido);
        },
        staleTime: 10 * 1000, // 10 segundos
        gcTime: 5 * 60 * 1000,
        enabled: !!idPartido && !!usuario?.uid,
        ...options,
    });
};