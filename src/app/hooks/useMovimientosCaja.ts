import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { movimientoCajaService, MovimientoCaja, CrearMovimientoInput, AnularMovimientoInput, TipoMovimiento } from '../services/movimientoCaja.service';

// ============================================
// QUERY KEYS
// ============================================

export const movimientosCajaKeys = {
    all: ['movimientos-caja'] as const,
    porCaja: (id_caja: number, categoria?: 'INGRESO' | 'EGRESO') => 
        ['movimientos-caja', 'caja', id_caja, categoria] as const,
    tipos: (categoria?: 'INGRESO' | 'EGRESO') => 
        ['movimientos-caja', 'tipos', categoria] as const,
};

// ============================================
// QUERIES
// ============================================

/**
 * Hook para obtener movimientos de una caja
 */
export const useMovimientosCaja = (
    id_caja: number | null,
    categoria?: 'INGRESO' | 'EGRESO',
    limit?: number,
    offset?: number,
    options?: Omit<UseQueryOptions<{ movimientos: MovimientoCaja[]; pagination: any }, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: movimientosCajaKeys.porCaja(id_caja || 0, categoria),
        queryFn: () => movimientoCajaService.obtenerMovimientos(id_caja!, categoria, limit, offset),
        enabled: !!id_caja,
        staleTime: 10 * 1000, // 10 segundos
        gcTime: 2 * 60 * 1000, // 2 minutos
        refetchOnWindowFocus: true,
        ...options,
    });
};

/**
 * Hook para obtener tipos de movimiento
 */
export const useTiposMovimiento = (
    categoria?: 'INGRESO' | 'EGRESO',
    options?: Omit<UseQueryOptions<TipoMovimiento[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: movimientosCajaKeys.tipos(categoria),
        queryFn: () => movimientoCajaService.obtenerTiposMovimiento(categoria),
        staleTime: 5 * 60 * 1000, // 5 minutos (cambian poco)
        gcTime: 10 * 60 * 1000, // 10 minutos
        ...options,
    });
};

// ============================================
// MUTATIONS
// ============================================

/**
 * Hook para crear un movimiento de caja
 */
export const useCrearMovimiento = (
    options?: UseMutationOptions<MovimientoCaja, Error, CrearMovimientoInput>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CrearMovimientoInput) => movimientoCajaService.crearMovimiento(data),
        onSuccess: (_, variables) => {
            // Invalidar queries de movimientos de la caja
            queryClient.invalidateQueries({ queryKey: movimientosCajaKeys.porCaja(variables.id_caja) });
            queryClient.invalidateQueries({ queryKey: ['caja', 'actual'] });
            queryClient.invalidateQueries({ queryKey: ['caja', 'resumen'] });
        },
        ...options,
    });
};

/**
 * Hook para anular un movimiento
 */
export const useAnularMovimiento = (
    options?: UseMutationOptions<MovimientoCaja, Error, { id_movimiento: number; data: AnularMovimientoInput }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_movimiento, data }: { id_movimiento: number; data: AnularMovimientoInput }) =>
            movimientoCajaService.anularMovimiento(id_movimiento, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: movimientosCajaKeys.all });
            queryClient.invalidateQueries({ queryKey: ['caja', 'actual'] });
            queryClient.invalidateQueries({ queryKey: ['caja', 'resumen'] });
        },
        ...options,
    });
};

