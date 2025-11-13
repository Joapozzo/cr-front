import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { CancelarInvitacionParams, ConfirmarSolicitudParams, EnviarInvitacionParams, ObtenerSolicitudesEquipoResponse, RechazarSolicitudParams, SolicitudResponse, } from '../types/solicitudes';
import { equiposService as equipoService } from '../services/equipos.services';

// Query Keys
export const solicitudesCapitanKeys = {
    all: ['solicitudes-capitan'] as const,
    equipo: (id: number) => [...solicitudesCapitanKeys.all, 'equipo', id] as const,
    invitaciones: (id: number) => [...solicitudesCapitanKeys.all, 'invitaciones', id] as const,
};

export const useObtenerSolicitudesEquipo = (
    id_equipo: number,
    options?: Omit<UseQueryOptions<ObtenerSolicitudesEquipoResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: solicitudesCapitanKeys.equipo(id_equipo),
        queryFn: async () => {
            const response = await equipoService.obtenerSolicitudesEquipo();
            return response;
        },
        enabled: !!id_equipo && id_equipo > 0,
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        ...options,
    });
};

export const useObtenerInvitacionesEnviadas = (
    id_equipo: number,
    options?: Omit<UseQueryOptions<ObtenerSolicitudesEquipoResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: solicitudesCapitanKeys.invitaciones(id_equipo),
        queryFn: async () => {
            const response = await equipoService.obtenerInvitacionesEnviadas();
            return response;
        },
        enabled: !!id_equipo && id_equipo > 0,
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        ...options,
    });
};

export const useConfirmarSolicitud = (
    id_equipo?: number,
    options?: UseMutationOptions<SolicitudResponse, Error, ConfirmarSolicitudParams>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: ConfirmarSolicitudParams) => {
            const response = await equipoService.confirmarSolicitud(params);
            return response;
        },
        onSuccess: (data, variables) => {
            if (id_equipo) {
                queryClient.invalidateQueries({
                    queryKey: solicitudesCapitanKeys.equipo(id_equipo)
                });

            }
            queryClient.invalidateQueries({
                queryKey: solicitudesCapitanKeys.all
            });

            options?.onSuccess?.(data, variables, undefined as any);
        },
        onError: (error, variables, context) => {
            options?.onError?.(error, variables, context);
        },
        ...options,
    });
};

export const useRechazarSolicitud = (
    id_equipo?: number,
    options?: UseMutationOptions<SolicitudResponse, Error, RechazarSolicitudParams>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: RechazarSolicitudParams) => {
            const response = await equipoService.rechazarSolicitud(params);
            return response;
        },
        onSuccess: (data, variables) => {
            if (id_equipo) {
                queryClient.invalidateQueries({
                    queryKey: solicitudesCapitanKeys.equipo(id_equipo)
                });
            }
            queryClient.invalidateQueries({
                queryKey: solicitudesCapitanKeys.all
            });

            options?.onSuccess?.(data, variables, undefined as any);
        },
        onError: (error, variables, context) => {
            options?.onError?.(error, variables, context);
        },
        ...options,
    });
};

export const useEnviarInvitacion = (
    options?: UseMutationOptions<SolicitudResponse, Error, EnviarInvitacionParams>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: EnviarInvitacionParams) => {
            const response = await equipoService.enviarInvitacion(params);
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: solicitudesCapitanKeys.invitaciones(variables.id_equipo)
            });
            queryClient.invalidateQueries({
                queryKey: solicitudesCapitanKeys.all
            });

            options?.onSuccess?.(data, variables, undefined as any);
        },
        onError: (error, variables, context) => {
            options?.onError?.(error, variables, context);
        },
        ...options,
    });
};

export const useCancelarInvitacion = (
    id_equipo?: number,
    options?: UseMutationOptions<SolicitudResponse, Error, CancelarInvitacionParams>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: CancelarInvitacionParams) => {
            const response = await equipoService.cancelarInvitacion(params);
            return response.data;
        },
        onSuccess: (data, variables) => {
            if (id_equipo) {
                queryClient.invalidateQueries({
                    queryKey: solicitudesCapitanKeys.invitaciones(id_equipo)
                });
            }
            queryClient.invalidateQueries({
                queryKey: solicitudesCapitanKeys.all
            });

            options?.onSuccess?.(data, variables, undefined as any);
        },
        onError: (error, variables, context) => {
            options?.onError?.(error, variables, context);
        },
        ...options,
    });
};

export const useSolicitudesCapitan = (id_equipo?: number) => {
    const solicitudesQuery = useObtenerSolicitudesEquipo(
        id_equipo || 0,
        { enabled: !!id_equipo }
    );

    const invitacionesQuery = useObtenerInvitacionesEnviadas(
        id_equipo || 0,
        { enabled: !!id_equipo }
    );

    const confirmarSolicitudMutation = useConfirmarSolicitud(id_equipo);
    const rechazarSolicitudMutation = useRechazarSolicitud(id_equipo);
    const enviarInvitacionMutation = useEnviarInvitacion();
    const cancelarInvitacionMutation = useCancelarInvitacion(id_equipo);

    return {
        // Solicitudes recibidas
        solicitudes: solicitudesQuery.data || [],
        isLoadingSolicitudes: solicitudesQuery.isLoading,
        isErrorSolicitudes: solicitudesQuery.isError,
        errorSolicitudes: solicitudesQuery.error,
        refetchSolicitudes: solicitudesQuery.refetch,

        // Invitaciones enviadas
        invitaciones: invitacionesQuery.data || [],
        isLoadingInvitaciones: invitacionesQuery.isLoading,
        isErrorInvitaciones: invitacionesQuery.isError,
        errorInvitaciones: invitacionesQuery.error,
        refetchInvitaciones: invitacionesQuery.refetch,

        // Confirmar solicitud (aceptar jugador)
        confirmarSolicitud: confirmarSolicitudMutation.mutate,
        confirmarSolicitudAsync: confirmarSolicitudMutation.mutateAsync,
        isConfirmandoSolicitud: confirmarSolicitudMutation.isPending,

        // Rechazar solicitud
        rechazarSolicitud: rechazarSolicitudMutation.mutate,
        rechazarSolicitudAsync: rechazarSolicitudMutation.mutateAsync,
        isRechazandoSolicitud: rechazarSolicitudMutation.isPending,

        // Enviar invitación
        enviarInvitacion: enviarInvitacionMutation.mutate,
        enviarInvitacionAsync: enviarInvitacionMutation.mutateAsync,
        isEnviandoInvitacion: enviarInvitacionMutation.isPending,

        // Cancelar invitación
        cancelarInvitacion: cancelarInvitacionMutation.mutate,
        cancelarInvitacionAsync: cancelarInvitacionMutation.mutateAsync,
        isCancelandoInvitacion: cancelarInvitacionMutation.isPending,
    };
};