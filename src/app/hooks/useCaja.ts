import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { cajaService, CajaDiaria, AbrirCajaInput, CerrarCajaInput, ResumenDia } from '../services/caja.service';

// ============================================
// QUERY KEYS
// ============================================

export const cajaKeys = {
    all: ['caja'] as const,
    actual: () => ['caja', 'actual'] as const,
    resumen: (fecha?: Date) => ['caja', 'resumen', fecha] as const,
    historial: (fechaDesde?: Date, fechaHasta?: Date) => ['caja', 'historial', fechaDesde, fechaHasta] as const,
    porId: (id: number) => ['caja', 'id', id] as const,
};

// ============================================
// QUERIES
// ============================================

/**
 * Hook para obtener la caja actual del cajero
 */
export const useCajaActual = (
    options?: Omit<UseQueryOptions<CajaDiaria | null, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: cajaKeys.actual(),
        queryFn: () => cajaService.obtenerCajaActual(),
        staleTime: 10 * 1000, // 10 segundos
        gcTime: 2 * 60 * 1000, // 2 minutos
        refetchOnWindowFocus: true,
        retry: 1,
        ...options,
    });
};

/**
 * Hook para obtener historial de cajas
 */
export const useHistorialCajas = (
    fechaDesde?: Date,
    fechaHasta?: Date,
    limit?: number,
    offset?: number,
    options?: Omit<UseQueryOptions<{ cajas: CajaDiaria[]; pagination: any }, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: cajaKeys.historial(fechaDesde, fechaHasta),
        queryFn: () => cajaService.obtenerHistorial(fechaDesde, fechaHasta, limit, offset),
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        ...options,
    });
};

/**
 * Hook para obtener resumen del día
 */
export const useResumenDia = (
    fecha?: Date,
    options?: Omit<UseQueryOptions<ResumenDia, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: cajaKeys.resumen(fecha),
        queryFn: () => cajaService.obtenerResumenDia(fecha),
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        ...options,
    });
};

/**
 * Hook para obtener caja por ID
 */
export const useCajaPorId = (
    id_caja: number,
    options?: Omit<UseQueryOptions<CajaDiaria, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: cajaKeys.porId(id_caja),
        queryFn: () => cajaService.obtenerCajaPorId(id_caja),
        enabled: !!id_caja,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        ...options,
    });
};

// ============================================
// MUTATIONS
// ============================================

/**
 * Hook para abrir una nueva caja
 */
export const useAbrirCaja = (
    options?: UseMutationOptions<CajaDiaria, Error, AbrirCajaInput>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AbrirCajaInput) => cajaService.abrirCaja(data),
        onSuccess: () => {
            // Invalidar queries de caja
            queryClient.invalidateQueries({ queryKey: cajaKeys.all });
            queryClient.invalidateQueries({ queryKey: cajaKeys.actual() });
            queryClient.invalidateQueries({ queryKey: cajaKeys.resumen() });
        },
        ...options,
    });
};

/**
 * Hook para cerrar una caja
 */
export const useCerrarCaja = (
    options?: UseMutationOptions<any, Error, { id_caja: number; data: CerrarCajaInput }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_caja, data }: { id_caja: number; data: CerrarCajaInput }) =>
            cajaService.cerrarCaja(id_caja, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cajaKeys.all });
            queryClient.invalidateQueries({ queryKey: cajaKeys.actual() });
        },
        ...options,
    });
};

