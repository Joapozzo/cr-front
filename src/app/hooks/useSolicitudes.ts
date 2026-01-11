import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { EnviarSolicitudData, SolicitudResponse, SolicitudesJugadorResponse } from '../types/solicitudes';
import { jugadorService } from '../services/jugador.services';
import { equiposService } from '../services/equipos.services';

interface EnviarInvitacionParams {
    id_equipo: number;
    id_jugador_invitado: number;
    id_categoria_edicion: number;
    id_jugador_capitan: number;
    mensaje_capitan?: string;
}

interface CancelarInvitacionParams {
    id_solicitud: number;
    id_equipo: number;
    id_jugador: number;
    id_categoria_edicion: number;
}

// Query Keys
export const solicitudesKeys = {
    all: ['solicitudes'] as const,
    jugador: (id: number) => [...solicitudesKeys.all, 'jugador', id] as const,
};


// Hook para obtener solicitudes de un jugador
export const useObtenerSolicitudesJugador = (
    id_jugador: number,
    options?: Omit<UseQueryOptions<SolicitudesJugadorResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: solicitudesKeys.jugador(id_jugador),
        queryFn: async () => {
            const response = await jugadorService.obtenerSolicitudesJugador(id_jugador);
            // response ya es { message, data, total }
            return response;
        },
        enabled: !!id_jugador && id_jugador > 0,
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Usar cache si los datos están frescos
        ...options,
    });
};

// Hook para enviar solicitud
export const useEnviarSolicitudJugador = (
    options?: UseMutationOptions<SolicitudResponse, Error, EnviarSolicitudData>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: EnviarSolicitudData) => {
            try {
                const response = await jugadorService.enviarSolicitudJugador(data);
                // La respuesta puede tener 'data' o ser directamente el objeto
                // Si tiene 'data', usarlo; si no, usar la respuesta completa
                return response.data || response;
            } catch (error: unknown) {
                // Asegurar que el error tenga el mensaje correcto
                const errorMessage = 
                    (error instanceof Error && error.message) ||
                    (typeof error === 'object' && error !== null && 'response' in error && 
                     typeof (error as { response?: { data?: { error?: string } } }).response?.data?.error === 'string' 
                     ? (error as { response: { data: { error: string } } }).response.data.error : null) ||
                    (typeof error === 'object' && error !== null && 'error' in error && 
                     typeof (error as { error?: string }).error === 'string' 
                     ? (error as { error: string }).error : null) ||
                    'Error al enviar la solicitud';
                const enhancedError = new Error(errorMessage);
                if (typeof error === 'object' && error !== null && 'response' in error) {
                    (enhancedError as any).response = (error as { response?: unknown }).response;
                }
                throw enhancedError;
            }
        },
        onSuccess: (data, variables, context) => {
            // Invalidar queries primero
            queryClient.invalidateQueries({
                queryKey: solicitudesKeys.jugador(variables.id_jugador)
            });
            // Ejecutar onSuccess personalizado si existe
            options?.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            // Ejecutar onError personalizado si existe
            options?.onError?.(error, variables, context);
        },
        // Pasar el resto de opciones pero sin onSuccess/onError para evitar duplicados
        ...(options ? Object.fromEntries(
            Object.entries(options).filter(([key]) => key !== 'onSuccess' && key !== 'onError')
        ) : {}),
    });
};

// Hook para enviar invitación (requiere ser capitán)
export const useEnviarInvitacion = (
    options?: UseMutationOptions<SolicitudResponse, Error, EnviarInvitacionParams>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: EnviarInvitacionParams) => {
            const response = await equiposService.enviarInvitacion({
                id_equipo: params.id_equipo,
                id_jugador_invitado: params.id_jugador_invitado,
                id_jugador_capitan: params.id_jugador_capitan,
                id_categoria_edicion: params.id_categoria_edicion,
                mensaje_capitan: params.mensaje_capitan
            });
            return response;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: solicitudesKeys.jugador(variables.id_jugador_capitan)
            });
            queryClient.invalidateQueries({
                queryKey: solicitudesKeys.all
            });
        },
        ...options,
    });
};

// Hook para confirmar solicitud (capitán acepta solicitud de jugador)
// export const useConfirmarSolicitud = (
//     id_jugador_actual?: number,
//     options?: UseMutationOptions<SolicitudResponse, Error, ConfirmarSolicitudParams>
// ) => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async (params: ConfirmarSolicitudParams) => {
//             const response = await equiposService.confirmarSolicitud(params);
//             return response;
//         },
//         onSuccess: () => {
//             if (id_jugador_actual) {
//                 queryClient.invalidateQueries({
//                     queryKey: solicitudesKeys.jugador(id_jugador_actual)
//                 });
//             }
//             queryClient.invalidateQueries({
//                 queryKey: solicitudesKeys.all
//             });
//         },
//         ...options,
//     });
// };

export const useConfirmarInvitacion = (
    id_jugador: number,
    options?: UseMutationOptions<SolicitudResponse, Error, number>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id_solicitud: number) => {
            if (!id_jugador || id_jugador <= 0) {
                throw new Error('ID de jugador inválido');
            }
            const response = await jugadorService.confirmarInvitacion(id_solicitud, id_jugador);
            return response;
        },
        onSuccess: (data, variables, context) => {
            if (id_jugador && id_jugador > 0) {
                queryClient.invalidateQueries({
                    queryKey: solicitudesKeys.jugador(id_jugador)
                });
            }
            queryClient.invalidateQueries({
                queryKey: solicitudesKeys.all
            });
            
            options?.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            options?.onError?.(error, variables, context);
        },
        ...options,
    });
};

// Hook para rechazar solicitud (capitán rechaza solicitud de jugador)
// export const useRechazarSolicitud = (
//     id_jugador_actual?: number,
//     options?: UseMutationOptions<SolicitudResponse, Error, RechazarSolicitudParams>
// ) => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async (params: RechazarSolicitudParams) => {
//             const response = await jugadorService.rechazarSolicitud(params);
//             return response.data;
//         },
//         onSuccess: () => {
//             if (id_jugador_actual) {
//                 queryClient.invalidateQueries({
//                     queryKey: solicitudesKeys.jugador(id_jugador_actual)
//                 });
//             }
//             queryClient.invalidateQueries({
//                 queryKey: solicitudesKeys.all
//             });
//         },
//         ...options,
//     });
// };

export const useRechazarInvitacion = (
    id_jugador: number,
    options?: UseMutationOptions<SolicitudResponse, Error, number>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id_solicitud: number) => {
            const response = await jugadorService.rechazarInvitacion(id_solicitud);
            return response;
        },
        onSuccess: (data, variables, context) => {
            if (id_jugador && id_jugador > 0) {
                queryClient.invalidateQueries({
                    queryKey: solicitudesKeys.jugador(id_jugador)
                });
            }
            queryClient.invalidateQueries({
                queryKey: solicitudesKeys.all
            });
            
            options?.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            options?.onError?.(error, variables, context);
        },
        ...options,
    });
};

// Hook para cancelar solicitud (jugador cancela su propia solicitud)
export const useCancelarSolicitud = (
    id_jugador?: number,
    options?: UseMutationOptions<SolicitudResponse, Error, number>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id_solicitud: number) => {
            const response = await jugadorService.cancelarSolicitud(id_solicitud);
            return response.data;
        },
        onSuccess: () => {
            if (id_jugador) {
                queryClient.invalidateQueries({
                    queryKey: solicitudesKeys.jugador(id_jugador)
                });
            }
            queryClient.invalidateQueries({
                queryKey: solicitudesKeys.all
            });
        },
        ...options,
    });
};

// Hook para cancelar invitación (capitán cancela invitación enviada)
export const useCancelarInvitacion = (
    id_jugador_actual?: number,
    options?: UseMutationOptions<SolicitudResponse, Error, CancelarInvitacionParams>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: CancelarInvitacionParams) => {
            const response = await equiposService.cancelarInvitacion({
                id_solicitud: params.id_solicitud,
                id_equipo: params.id_equipo,
                id_jugador_capitan: params.id_jugador,
                id_categoria_edicion: params.id_categoria_edicion
            });
            return response.data;
        },
        onSuccess: () => {
            if (id_jugador_actual) {
                queryClient.invalidateQueries({
                    queryKey: solicitudesKeys.jugador(id_jugador_actual)
                });
            }
            queryClient.invalidateQueries({
                queryKey: solicitudesKeys.all
            });
        },
        ...options,
    });
};

// Hook combinado con helpers
export const useSolicitudes = (id_jugador?: number) => {
    const solicitudesQuery = useObtenerSolicitudesJugador(
        id_jugador || 0,
        { enabled: !!id_jugador }
    );

    const enviarSolicitudMutation = useEnviarSolicitudJugador();
    const enviarInvitacionMutation = useEnviarInvitacion();
    const confirmarInvitacionMutation = useConfirmarInvitacion(id_jugador || 0);
    const rechazarInvitacionMutation = useRechazarInvitacion(id_jugador || 0);
    const cancelarSolicitudMutation = useCancelarSolicitud(id_jugador);
    const cancelarInvitacionMutation = useCancelarInvitacion(id_jugador);

    return {
        // Queries
        solicitudes: solicitudesQuery.data?.data || [],
        totalSolicitudes: solicitudesQuery.data?.total || 0,
        isLoadingSolicitudes: solicitudesQuery.isLoading,
        isErrorSolicitudes: solicitudesQuery.isError,
        errorSolicitudes: solicitudesQuery.error,
        refetchSolicitudes: solicitudesQuery.refetch,

        // Enviar solicitud
        enviarSolicitud: enviarSolicitudMutation.mutate,
        enviarSolicitudAsync: enviarSolicitudMutation.mutateAsync,
        isEnviandoSolicitud: enviarSolicitudMutation.isPending,

        // Enviar invitación (capitán)
        enviarInvitacion: enviarInvitacionMutation.mutate,
        enviarInvitacionAsync: enviarInvitacionMutation.mutateAsync,
        isEnviandoInvitacion: enviarInvitacionMutation.isPending,

        // Confirmar invitación (jugador)
        confirmarInvitacion: confirmarInvitacionMutation.mutate,
        confirmarInvitacionAsync: confirmarInvitacionMutation.mutateAsync,
        isConfirmandoInvitacion: confirmarInvitacionMutation.isPending,

        // Rechazar invitación (jugador)
        rechazarInvitacion: rechazarInvitacionMutation.mutate,
        rechazarInvitacionAsync: rechazarInvitacionMutation.mutateAsync,
        isRechazandoInvitacion: rechazarInvitacionMutation.isPending,

        // Cancelar solicitud (jugador)
        cancelarSolicitud: cancelarSolicitudMutation.mutate,
        cancelarSolicitudAsync: cancelarSolicitudMutation.mutateAsync,
        isCancelandoSolicitud: cancelarSolicitudMutation.isPending,

        // Cancelar invitación (capitán)
        cancelarInvitacion: cancelarInvitacionMutation.mutate,
        cancelarInvitacionAsync: cancelarInvitacionMutation.mutateAsync,
        isCancelandoInvitacion: cancelarInvitacionMutation.isPending,
    };
};