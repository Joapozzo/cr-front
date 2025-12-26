import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { pagoCanchaService } from '../services/pagoCancha.service';
import {
    PagoCancha,
    CrearPagoEfectivoInput,
    CrearPagoTransferenciaInput,
    QRResponse,
    PerdonarDeudaInput,
    PagosPendientesResponse
} from '../types/pagoCancha';

// ============================================
// QUERY KEYS
// ============================================

export const pagosCanchaKeys = {
    all: ['pagos-cancha'] as const,
    pendientes: (filters?: { id_categoria_edicion?: number; fecha?: Date; estado_pago?: string }) =>
        ['pagos-cancha', 'pendientes', filters] as const,
    porPartido: (id_partido: number) =>
        ['pagos-cancha', 'partido', id_partido] as const,
};

// ============================================
// QUERIES
// ============================================

/**
 * Hook para obtener pagos pendientes
 */
export const usePagosPendientes = (
    id_categoria_edicion?: number,
    fecha?: Date,
    limit?: number,
    offset?: number,
    estado_pago?: 'PENDIENTE' | 'PARCIAL' | 'PAGADO' | 'VENCIDO' | 'TODOS',
    options?: Omit<UseQueryOptions<PagosPendientesResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: pagosCanchaKeys.pendientes({ id_categoria_edicion, fecha, estado_pago }),
        queryFn: () => pagoCanchaService.obtenerPagosPendientes(id_categoria_edicion, fecha, limit, offset, estado_pago),
        staleTime: 0, // Siempre considerar obsoleto para forzar refetch
        gcTime: 5 * 60 * 1000, // 5 minutos
        refetchOnWindowFocus: true,
        retry: 2,
        ...options,
    });
};

/**
 * Hook para obtener pagos por partido
 */
export const usePagosPorPartido = (
    id_partido: number,
    options?: Omit<UseQueryOptions<PagoCancha[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: pagosCanchaKeys.porPartido(id_partido),
        queryFn: () => pagoCanchaService.obtenerPagosPorPartido(id_partido),
        enabled: !!id_partido,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        ...options,
    });
};

// ============================================
// MUTATIONS
// ============================================

/**
 * Hook para registrar pago en efectivo
 */
export const useRegistrarPagoEfectivo = (
    options?: UseMutationOptions<{ pago: PagoCancha; transaccion: any }, Error, CrearPagoEfectivoInput>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CrearPagoEfectivoInput) => pagoCanchaService.registrarPagoEfectivo(data),
        onSuccess: () => {
            // Invalidar todas las queries de pagos
            queryClient.invalidateQueries({ queryKey: pagosCanchaKeys.all });
            // Invalidar caja y movimientos
            queryClient.invalidateQueries({ queryKey: ['caja', 'actual'] });
            queryClient.invalidateQueries({ queryKey: ['caja', 'resumen'] });
            queryClient.invalidateQueries({ queryKey: ['movimientos-caja'] });
        },
        ...options,
    });
};

/**
 * Hook para registrar pago por transferencia
 */
export const useRegistrarPagoTransferencia = (
    options?: UseMutationOptions<{ pago: PagoCancha; transaccion: any }, Error, CrearPagoTransferenciaInput>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CrearPagoTransferenciaInput) => pagoCanchaService.registrarPagoTransferencia(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pagosCanchaKeys.all });
            // Invalidar caja y movimientos
            queryClient.invalidateQueries({ queryKey: ['caja', 'actual'] });
            queryClient.invalidateQueries({ queryKey: ['caja', 'resumen'] });
            queryClient.invalidateQueries({ queryKey: ['movimientos-caja'] });
        },
        ...options,
    });
};

/**
 * Hook para generar QR de MercadoPago
 */
export const useGenerarQR = (
    options?: UseMutationOptions<QRResponse, Error, number>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id_pago: number) => pagoCanchaService.generarQR(id_pago),
        onSuccess: (_, id_pago) => {
            queryClient.invalidateQueries({ queryKey: pagosCanchaKeys.all });
            queryClient.invalidateQueries({ queryKey: pagosCanchaKeys.porPartido(id_pago) });
        },
        ...options,
    });
};

/**
 * Hook para perdonar deuda (solo Admin)
 */
export const usePerdonarDeuda = (
    options?: UseMutationOptions<PagoCancha, Error, { id_pago: number; data: PerdonarDeudaInput }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_pago, data }: { id_pago: number; data: PerdonarDeudaInput }) =>
            pagoCanchaService.perdonarDeuda(id_pago, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pagosCanchaKeys.all });
        },
        ...options,
    });
};

/**
 * Hook para anular pago de cancha (revierte todo)
 */
export const useAnularPagoCancha = (
    options?: UseMutationOptions<PagoCancha, Error, { id_pago: number; motivo: string }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_pago, motivo }: { id_pago: number; motivo: string }) =>
            pagoCanchaService.anularPago(id_pago, motivo),
        onSuccess: () => {
            // Invalidar todas las queries de pagos
            queryClient.invalidateQueries({ queryKey: pagosCanchaKeys.all });
            // Invalidar caja y movimientos (porque se revierte el movimiento)
            queryClient.invalidateQueries({ queryKey: ['caja', 'actual'] });
            queryClient.invalidateQueries({ queryKey: ['caja', 'resumen'] });
            queryClient.invalidateQueries({ queryKey: ['movimientos-caja'] });
        },
        ...options,
    });
};

