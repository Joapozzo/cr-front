import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { cambiosJugadorService } from '../services/cambiosJugador.services';
import {
    CambioJugador,
    CambiosJugadorResponse,
    CambioJugadorResponse,
    CambioCompletoResponse,
    CrearCambioJugadorData,
    CrearCambioCompletoData,
    EditarCambioJugadorData
} from '../services/cambiosJugador.services';
import { useAuthStore } from '../stores/authStore';
import { planilleroKeys } from './usePartidosPlanillero';

// ====================================================================
// QUERY KEYS
// ====================================================================

export const cambiosJugadorKeys = {
    all: ['cambios-jugador'] as const,
    partido: (idPartido: number) => [...cambiosJugadorKeys.all, 'partido', idPartido] as const,
    cambio: (idCambio: number, idPartido: number) => [...cambiosJugadorKeys.all, 'cambio', idCambio, idPartido] as const,
};

// ====================================================================
// QUERIES
// ====================================================================

/**
 * Hook para obtener todos los cambios de un partido
 */
export const useCambiosPorPartido = (
    idPartido: number,
    options?: Omit<UseQueryOptions<CambiosJugadorResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<CambiosJugadorResponse, Error>({
        queryKey: cambiosJugadorKeys.partido(idPartido),
        queryFn: async () => {
            return await cambiosJugadorService.obtenerCambiosPorPartido(idPartido);
        },
        staleTime: 30 * 1000, // 30 segundos
        gcTime: 5 * 60 * 1000, // 5 minutos
        refetchOnWindowFocus: true,
        retry: 2,
        enabled: !!idPartido && (options?.enabled !== false),
        ...options,
    });
};

/**
 * Hook para obtener un cambio por su ID
 */
export const useCambioPorId = (
    idCambio: number,
    idPartido: number,
    options?: Omit<UseQueryOptions<CambioJugadorResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    const usuario = useAuthStore((state) => state.usuario);

    return useQuery<CambioJugadorResponse, Error>({
        queryKey: cambiosJugadorKeys.cambio(idCambio, idPartido),
        queryFn: async () => {
            return await cambiosJugadorService.obtenerCambioPorId(idCambio, idPartido);
        },
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
        retry: 2,
        enabled: !!idCambio && !!idPartido && (options?.enabled !== false),
        ...options,
    });
};

// ====================================================================
// MUTATIONS
// ====================================================================

/**
 * Hook para crear un cambio de jugador
 */
export const useCrearCambioJugador = (
    options?: UseMutationOptions<CambioJugadorResponse, Error, { idPartido: number; cambioData: CrearCambioJugadorData }>
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation<CambioJugadorResponse, Error, { idPartido: number; cambioData: CrearCambioJugadorData }>({
        mutationFn: async ({ idPartido, cambioData }) => {
            return await cambiosJugadorService.crearCambio(idPartido, cambioData);
        },
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({
                queryKey: cambiosJugadorKeys.partido(variables.idPartido)
            });
            // Invalidar plantel del equipo afectado
            const idEquipo = variables.cambioData.id_equipo;
            if (idEquipo) {
                queryClient.invalidateQueries({
                    queryKey: planilleroKeys.plantel(variables.idPartido, idEquipo)
                });
            }
            queryClient.invalidateQueries({
                queryKey: ['formaciones', 'partido', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosCompletos(variables.idPartido)
            });
            options?.onSuccess?.(data, variables, undefined);
        },
        onError: (error, variables, context) => {
            options?.onError?.(error, variables, context);
        },
        ...options,
    });
};

/**
 * Hook para crear un cambio completo (SALIDA + ENTRADA) en una sola transacción
 */
export const useCrearCambioCompleto = (
    options?: UseMutationOptions<CambioCompletoResponse, Error, { idPartido: number; cambioData: CrearCambioCompletoData }>
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation<CambioCompletoResponse, Error, { idPartido: number; cambioData: CrearCambioCompletoData }>({
        mutationFn: async ({ idPartido, cambioData }) => {
            return await cambiosJugadorService.crearCambioCompleto(idPartido, cambioData);
        },
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({
                queryKey: cambiosJugadorKeys.partido(variables.idPartido)
            });
            // Invalidar plantel del equipo afectado
            const idEquipo = variables.cambioData.id_equipo;
            if (idEquipo) {
                queryClient.invalidateQueries({
                    queryKey: planilleroKeys.plantel(variables.idPartido, idEquipo)
                });
            }
            queryClient.invalidateQueries({
                queryKey: ['formaciones', 'partido', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosCompletos(variables.idPartido)
            });
            options?.onSuccess?.(data, variables, undefined);
        },
        onError: (error, variables, context) => {
            options?.onError?.(error, variables, context);
        },
        ...options,
    });
};

/**
 * Hook para editar un cambio de jugador
 */
export const useEditarCambioJugador = (
    options?: UseMutationOptions<
        CambioJugadorResponse,
        Error,
        { idCambio: number; idPartido: number; cambioData: EditarCambioJugadorData }
    >
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation<
        CambioJugadorResponse,
        Error,
        { idCambio: number; idPartido: number; cambioData: EditarCambioJugadorData }
    >({
        mutationFn: async ({ idCambio, idPartido, cambioData }) => {
            return await cambiosJugadorService.editarCambio(idCambio, idPartido, cambioData);
        },
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({
                queryKey: cambiosJugadorKeys.partido(variables.idPartido)
            });
            queryClient.invalidateQueries({
                queryKey: cambiosJugadorKeys.cambio(variables.idCambio, variables.idPartido)
            });
            // Invalidar todos los planteles porque no sabemos qué equipo se afectó
            // (EditarCambioJugadorData no incluye id_equipo)
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'plantel', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: ['formaciones', 'partido', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosCompletos(variables.idPartido)
            });
            options?.onSuccess?.(data, variables, undefined);
        },
        onError: (error, variables, context) => {
            options?.onError?.(error, variables, context);
        },
        ...options,
    });
};

/**
 * Hook para eliminar un cambio de jugador
 */
export const useEliminarCambioJugador = (
    options?: UseMutationOptions<{ message: string }, Error, { idCambio: number; idPartido: number }>
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation<{ message: string }, Error, { idCambio: number; idPartido: number }>({
        mutationFn: async ({ idCambio, idPartido }) => {
            return await cambiosJugadorService.eliminarCambio(idCambio, idPartido);
        },
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({
                queryKey: cambiosJugadorKeys.partido(variables.idPartido)
            });
            queryClient.removeQueries({
                queryKey: cambiosJugadorKeys.cambio(variables.idCambio, variables.idPartido)
            });
            // Invalidar todos los planteles porque no sabemos qué equipo se afectó
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'plantel', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: ['formaciones', 'partido', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosCompletos(variables.idPartido)
            });
            options?.onSuccess?.(data, variables, undefined);
        },
        onError: (error, variables, context) => {
            options?.onError?.(error, variables, context);
        },
        ...options,
    });
};

// ====================================================================
// HOOK COMBINADO
// ====================================================================

/**
 * Hook combinado para gestionar cambios de jugadores
 */
export const useCambiosJugador = (idPartido?: number) => {
    const cambiosQuery = useCambiosPorPartido(idPartido || 0, {
        enabled: !!idPartido
    });

    const crearCambioMutation = useCrearCambioJugador();
    const editarCambioMutation = useEditarCambioJugador();
    const eliminarCambioMutation = useEliminarCambioJugador();

    return {
        // Queries
        cambios: cambiosQuery.data?.cambios || [],
        isLoadingCambios: cambiosQuery.isLoading,
        isErrorCambios: cambiosQuery.isError,
        errorCambios: cambiosQuery.error,
        refetchCambios: cambiosQuery.refetch,

        // Mutations
        crearCambio: crearCambioMutation.mutate,
        crearCambioAsync: crearCambioMutation.mutateAsync,
        isCreandoCambio: crearCambioMutation.isPending,

        editarCambio: editarCambioMutation.mutate,
        editarCambioAsync: editarCambioMutation.mutateAsync,
        isEditandoCambio: editarCambioMutation.isPending,

        eliminarCambio: eliminarCambioMutation.mutate,
        eliminarCambioAsync: eliminarCambioMutation.mutateAsync,
        isEliminandoCambio: eliminarCambioMutation.isPending,
    };
};


