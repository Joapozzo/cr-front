import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { formacionesService } from '../services/formaciones.services';
import {
    FormacionResponse,
    MarcarEnCanchaData,
    DesmarcarEnCanchaData,
    ActualizarFormacionData
} from '../services/formaciones.services';
import { useAuthStore } from '../stores/authStore';

// ====================================================================
// QUERY KEYS
// ====================================================================

export const formacionesKeys = {
    all: ['formaciones'] as const,
    partido: (idPartido: number) => [...formacionesKeys.all, 'partido', idPartido] as const,
    jugador: (idPartido: number, idJugador: number) => [...formacionesKeys.all, 'jugador', idPartido, idJugador] as const,
};

// ====================================================================
// MUTATIONS
// ====================================================================

/**
 * Hook para marcar un jugador como en cancha (titular)
 */
export const useMarcarEnCancha = (
    options?: UseMutationOptions<FormacionResponse, Error, { idPartido: number; enCanchaData: MarcarEnCanchaData }>
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation<FormacionResponse, Error, { idPartido: number; enCanchaData: MarcarEnCanchaData }>({
        mutationFn: async ({ idPartido, enCanchaData }) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return await formacionesService.marcarEnCancha(idPartido, enCanchaData, usuario.uid);
        },
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({
                queryKey: formacionesKeys.partido(variables.idPartido)
            });
            queryClient.invalidateQueries({
                queryKey: formacionesKeys.jugador(variables.idPartido, variables.enCanchaData.id_jugador)
            });
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: ['cambios-jugador', 'partido', variables.idPartido]
            });
            // Refetch inmediato para actualizar UI
            queryClient.refetchQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
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
 * Hook para desmarcar un jugador de cancha
 */
export const useDesmarcarEnCancha = (
    options?: UseMutationOptions<
        FormacionResponse,
        Error,
        { idPartido: number; idJugador: number; desmarcarData: DesmarcarEnCanchaData }
    >
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation<
        FormacionResponse,
        Error,
        { idPartido: number; idJugador: number; desmarcarData: DesmarcarEnCanchaData }
    >({
        mutationFn: async ({ idPartido, idJugador, desmarcarData }) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return await formacionesService.desmarcarEnCancha(idPartido, idJugador, desmarcarData, usuario.uid);
        },
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({
                queryKey: formacionesKeys.partido(variables.idPartido)
            });
            queryClient.invalidateQueries({
                queryKey: formacionesKeys.jugador(variables.idPartido, variables.idJugador)
            });
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: ['cambios-jugador', 'partido', variables.idPartido]
            });
            // Refetch inmediato para actualizar UI
            queryClient.refetchQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
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
 * Hook para actualizar una formación (PUT genérico)
 */
export const useActualizarFormacion = (
    options?: UseMutationOptions<
        FormacionResponse,
        Error,
        { idPartido: number; idJugador: number; formacionData: ActualizarFormacionData }
    >
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation<
        FormacionResponse,
        Error,
        { idPartido: number; idJugador: number; formacionData: ActualizarFormacionData }
    >({
        mutationFn: async ({ idPartido, idJugador, formacionData }) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return await formacionesService.actualizarFormacion(idPartido, idJugador, formacionData, usuario.uid);
        },
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({
                queryKey: formacionesKeys.partido(variables.idPartido)
            });
            queryClient.invalidateQueries({
                queryKey: formacionesKeys.jugador(variables.idPartido, variables.idJugador)
            });
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
            });
            
            // Si se actualizó el estado en_cancha, invalidar también cambios
            if (variables.formacionData.en_cancha !== undefined) {
                queryClient.invalidateQueries({
                    queryKey: ['cambios-jugador', 'partido', variables.idPartido]
                });
            }
            
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
 * Hook combinado para gestionar formaciones
 */
export const useFormaciones = () => {
    const marcarEnCanchaMutation = useMarcarEnCancha();
    const desmarcarEnCanchaMutation = useDesmarcarEnCancha();
    const actualizarFormacionMutation = useActualizarFormacion();

    return {
        // Marcar en cancha (titular)
        marcarEnCancha: marcarEnCanchaMutation.mutate,
        marcarEnCanchaAsync: marcarEnCanchaMutation.mutateAsync,
        isMarcandoEnCancha: marcarEnCanchaMutation.isPending,

        // Desmarcar de cancha
        desmarcarEnCancha: desmarcarEnCanchaMutation.mutate,
        desmarcarEnCanchaAsync: desmarcarEnCanchaMutation.mutateAsync,
        isDesmarcandoEnCancha: desmarcarEnCanchaMutation.isPending,

        // Actualizar formación
        actualizarFormacion: actualizarFormacionMutation.mutate,
        actualizarFormacionAsync: actualizarFormacionMutation.mutateAsync,
        isActualizandoFormacion: actualizarFormacionMutation.isPending,
    };
};


