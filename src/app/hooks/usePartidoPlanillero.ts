import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { planilleroService, PlanilleroPartidosResponse } from '../services/planillero.services';
import { DatosCompletosPlanillero } from '../types/partido'; 

export const planilleroKeys = {
    all: ['planillero'] as const,
    partidosPendientes: () => [...planilleroKeys.all, 'partidos-pendientes'] as const,
    partidosPlanillados: () => [...planilleroKeys.all, 'partidos-planillados'] as const,
    datosCompletos: (idPartido: number) => [...planilleroKeys.all, 'datos-completos', idPartido] as const,
};

export const usePartidosPendientesPlanillero = (
    options?: Omit<UseQueryOptions<PlanilleroPartidosResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: planilleroKeys.partidosPendientes(),
        queryFn: () => planilleroService.partidosPendientesPlanillero(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const usePartidosPlanilladosPlanillero = (
    options?: Omit<UseQueryOptions<PlanilleroPartidosResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: planilleroKeys.partidosPlanillados(),
        queryFn: () => planilleroService.partidosPlanilladosPlanillero(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const useDatosCompletosPlanillero = (
    idPartido: number,
    options?: Omit<UseQueryOptions<DatosCompletosPlanillero, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: planilleroKeys.datosCompletos(idPartido),
        queryFn: () => planilleroService.obtenerDatosCompletosPlanillero(idPartido),
        staleTime: 2 * 60 * 1000, // 2 minutos - más agresivo porque es data en tiempo real
        gcTime: 5 * 60 * 1000,   // 5 minutos
        retry: 2,
        refetchOnWindowFocus: true, // Refrescar cuando vuelva a la ventana
        enabled: !!idPartido && idPartido > 0, // Solo ejecutar si hay un ID válido
        ...options,
    });
};