import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { prediosService } from '../services/predios.services';
import {
    PredioConCanchas,
    PredioDetalle,
    CanchaConPredio,
    CanchaDetalle,
    CrearPredioInput,
    ActualizarPredioInput,
    CrearCanchaInput,
    ActualizarCanchaInput,
    ObtenerCanchasParams
} from '../types/predios';

// ============ QUERY KEYS ============

export const prediosKeys = {
    all: ['predios'] as const,
    list: (incluirInactivos?: boolean) => [...prediosKeys.all, 'list', incluirInactivos] as const,
    detail: (id_predio: number) => [...prediosKeys.all, 'detail', id_predio] as const,
    canchas: {
        all: ['canchas'] as const,
        list: (params?: ObtenerCanchasParams) => [
            ...prediosKeys.canchas.all,
            'list',
            params?.id_predio,
            params?.incluir_inactivas
        ] as const,
        detail: (id_cancha: number) => [...prediosKeys.canchas.all, 'detail', id_cancha] as const,
        porPredio: (id_predio: number) => [...prediosKeys.canchas.all, 'predio', id_predio] as const,
    },
};

// ============ HOOKS PARA PREDIOS ============

/**
 * Hook para obtener todos los predios
 */
export const usePredios = (
    incluirInactivos: boolean = false,
    options?: Omit<UseQueryOptions<PredioConCanchas[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: prediosKeys.list(incluirInactivos),
        queryFn: () => prediosService.obtenerPredios(incluirInactivos),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook para obtener un predio por ID
 */
export const usePredioPorId = (
    id_predio: number,
    options?: Omit<UseQueryOptions<PredioDetalle, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: prediosKeys.detail(id_predio),
        queryFn: () => prediosService.obtenerPredioPorId(id_predio),
        enabled: !!id_predio,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook para crear un predio
 */
export const useCrearPredio = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CrearPredioInput) => prediosService.crearPredio(data),
        onSuccess: () => {
            // Invalidar todas las queries de predios para refrescar la lista
            queryClient.invalidateQueries({ queryKey: prediosKeys.all });
        },
        onError: (error) => {
            console.error('❌ Error al crear predio:', error);
        },
    });
};

/**
 * Hook para actualizar un predio
 */
export const useActualizarPredio = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_predio, data }: { id_predio: number; data: ActualizarPredioInput }) =>
            prediosService.actualizarPredio(id_predio, data),
        onSuccess: (_, variables) => {
            // Invalidar queries relacionadas con el predio
            queryClient.invalidateQueries({ queryKey: prediosKeys.detail(variables.id_predio) });
            queryClient.invalidateQueries({ queryKey: prediosKeys.all });
        },
        onError: (error) => {
            console.error('❌ Error al actualizar predio:', error);
        },
    });
};

/**
 * Hook para eliminar un predio
 */
export const useEliminarPredio = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id_predio: number) => prediosService.eliminarPredio(id_predio),
        onSuccess: () => {
            // Invalidar todas las queries de predios
            queryClient.invalidateQueries({ queryKey: prediosKeys.all });
            // También invalidar queries de canchas ya que se desactivan las canchas del predio
            queryClient.invalidateQueries({ queryKey: prediosKeys.canchas.all });
        },
        onError: (error) => {
            console.error('❌ Error al eliminar predio:', error);
        },
    });
};

// ============ HOOKS PARA CANCHAS ============

/**
 * Hook para obtener todas las canchas
 */
export const useCanchas = (
    params?: ObtenerCanchasParams,
    options?: Omit<UseQueryOptions<CanchaConPredio[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: prediosKeys.canchas.list(params),
        queryFn: () => prediosService.obtenerCanchas(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook para obtener canchas por predio
 */
export const useCanchasPorPredio = (
    id_predio: number,
    incluirInactivas: boolean = false,
    options?: Omit<UseQueryOptions<CanchaConPredio[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: prediosKeys.canchas.porPredio(id_predio),
        queryFn: () => prediosService.obtenerCanchas({ 
            id_predio, 
            incluir_inactivas: incluirInactivas 
        }),
        enabled: !!id_predio,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook para obtener una cancha por ID
 */
export const useCanchaPorId = (
    id_cancha: number,
    options?: Omit<UseQueryOptions<CanchaDetalle, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: prediosKeys.canchas.detail(id_cancha),
        queryFn: () => prediosService.obtenerCanchaPorId(id_cancha),
        enabled: !!id_cancha,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook para crear una cancha
 */
export const useCrearCancha = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CrearCanchaInput) => prediosService.crearCancha(data),
        onSuccess: (response) => {
            // Invalidar queries de canchas
            queryClient.invalidateQueries({ queryKey: prediosKeys.canchas.all });
            // Invalidar queries del predio para actualizar la lista de canchas
            queryClient.invalidateQueries({ 
                queryKey: prediosKeys.detail(response.cancha.id_predio) 
            });
            queryClient.invalidateQueries({ queryKey: prediosKeys.all });
        },
        onError: (error) => {
            console.error('❌ Error al crear cancha:', error);
        },
    });
};

/**
 * Hook para actualizar una cancha
 */
export const useActualizarCancha = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_cancha, data }: { id_cancha: number; data: ActualizarCanchaInput }) =>
            prediosService.actualizarCancha(id_cancha, data),
        onSuccess: (response, variables) => {
            // Invalidar queries relacionadas con la cancha
            queryClient.invalidateQueries({ 
                queryKey: prediosKeys.canchas.detail(variables.id_cancha) 
            });
            queryClient.invalidateQueries({ queryKey: prediosKeys.canchas.all });
            
            // Si cambió el predio, invalidar ambos predios
            if (variables.data.id_predio) {
                queryClient.invalidateQueries({ 
                    queryKey: prediosKeys.detail(variables.data.id_predio) 
                });
                // Si había un predio anterior, también invalidarlo
                queryClient.invalidateQueries({ queryKey: prediosKeys.all });
            } else {
                // Solo invalidar el predio actual si no cambió
                const canchaActual = queryClient.getQueryData<CanchaDetalle>(
                    prediosKeys.canchas.detail(variables.id_cancha)
                );
                if (canchaActual) {
                    queryClient.invalidateQueries({ 
                        queryKey: prediosKeys.detail(canchaActual.id_predio) 
                    });
                }
            }
        },
        onError: (error) => {
            console.error('❌ Error al actualizar cancha:', error);
        },
    });
};

/**
 * Hook para eliminar una cancha
 */
export const useEliminarCancha = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id_cancha: number) => prediosService.eliminarCancha(id_cancha),
        onSuccess: (_, id_cancha) => {
            // Invalidar queries de canchas
            queryClient.invalidateQueries({ queryKey: prediosKeys.canchas.all });
            queryClient.invalidateQueries({ 
                queryKey: prediosKeys.canchas.detail(id_cancha) 
            });
            
            // Invalidar predios para actualizar la lista de canchas
            queryClient.invalidateQueries({ queryKey: prediosKeys.all });
        },
        onError: (error) => {
            console.error('❌ Error al eliminar cancha:', error);
        },
    });
};

