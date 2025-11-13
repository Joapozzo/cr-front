import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { EnviarSolicitudData, SolicitudResponse, SolicitudesJugadorResponse } from '../types/solicitudes';
import { jugadorService } from '../services/jugador.services';
import { equiposService } from '../services/equipos.services';

// Query Keys
export const solicitudesKeys = {
    all: ['solicitudes'] as const,
    jugador: (id: number) => [...solicitudesKeys.all, 'jugador', id] as const,
};

// Tipos para los parámetros
interface ConfirmarSolicitudParams {
    id_solicitud: number;
    id_jugador: number;
}

interface RechazarSolicitudParams {
    id_solicitud: number;
    id_equipo: number;
    id_jugador: number;
    id_categoria_edicion: number;
}

interface CancelarInvitacionParams {
    id_solicitud: number;
    id_equipo: number;
    id_jugador: number;
    id_categoria_edicion: number;
}

interface EnviarInvitacionParams {
    id_equipo: number;
    id_jugador_invitado: number;
    id_categoria_edicion: number;
    id_jugador_capitan: number;
}

// Hook para obtener solicitudes de un jugador
export const useObtenerSolicitudesJugador = (
    id_jugador: number,
    options?: Omit<UseQueryOptions<SolicitudesJugadorResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: solicitudesKeys.jugador(id_jugador),
        queryFn: async () => {
            const response = await jugadorService.obtenerSolicitudesJugador(id_jugador);
            return response.data;
        },
        enabled: !!id_jugador && id_jugador > 0,
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
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
            const response = await jugadorService.enviarSolicitudJugador(data);
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: solicitudesKeys.jugador(variables.id_jugador)
            });
        },
        ...options,
    });
};

// Hook para enviar invitación (requiere ser capitán)
export const useEnviarInvitacion = (
    options?: UseMutationOptions<SolicitudResponse, Error, EnviarInvitacionParams>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: EnviarInvitacionParams) => {
            const response = await jugadorService.enviarInvitacion(params);
            return response.data;
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
            const response = await jugadorService.confirmarInvitacion(id_solicitud, id_jugador);
            return response;
        },
        onSuccess: (data, variables, context) => {
            if (id_jugador) {
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
            if (id_jugador) {
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
            const response = await jugadorService.cancelarInvitacion(params);
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
    const confirmarSolicitudMutation = useConfirmarSolicitud(id_jugador);
    const confirmarInvitacionMutation = useConfirmarInvitacion(id_jugador);
    const rechazarSolicitudMutation = useRechazarSolicitud(id_jugador);
    const rechazarInvitacionMutation = useRechazarInvitacion(id_jugador);
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

        // Confirmar solicitud (capitán)
        confirmarSolicitud: confirmarSolicitudMutation.mutate,
        confirmarSolicitudAsync: confirmarSolicitudMutation.mutateAsync,
        isConfirmandoSolicitud: confirmarSolicitudMutation.isPending,

        // Confirmar invitación (jugador)
        confirmarInvitacion: confirmarInvitacionMutation.mutate,
        confirmarInvitacionAsync: confirmarInvitacionMutation.mutateAsync,
        isConfirmandoInvitacion: confirmarInvitacionMutation.isPending,

        // Rechazar solicitud (capitán)
        rechazarSolicitud: rechazarSolicitudMutation.mutate,
        rechazarSolicitudAsync: rechazarSolicitudMutation.mutateAsync,
        isRechazandoSolicitud: rechazarSolicitudMutation.isPending,

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