import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { ConfirmarSolicitudParams, EnviarInvitacionParams, ObtenerSolicitudesEquipoResponse, RechazarSolicitudParams, SolicitudResponse, CancelarInvitacionParams } from '../types/solicitudes';
import { equiposService as equipoService } from '../services/equipos.services';
import { useCapitanData } from '../utils/capitanHelpers';

// Query Keys
export const solicitudesCapitanKeys = {
    all: ['solicitudes-capitan'] as const,
    equipo: (id: number, id_categoria?: number) => [...solicitudesCapitanKeys.all, 'equipo', id, id_categoria] as const,
    invitaciones: (id: number, id_categoria?: number) => [...solicitudesCapitanKeys.all, 'invitaciones', id, id_categoria] as const,
};

export const useObtenerSolicitudesEquipo = (
    id_equipo: number,
    id_categoria_edicion?: number,
    options?: Omit<UseQueryOptions<ObtenerSolicitudesEquipoResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    const capitanData = useCapitanData();
    
    return useQuery({
        queryKey: solicitudesCapitanKeys.equipo(id_equipo, id_categoria_edicion),
        queryFn: async () => {
            if (!capitanData) {
                throw new Error('No tienes permisos de capitán para esta acción');
            }

            const response = await equipoService.obtenerSolicitudesEquipo(
                id_equipo,
                capitanData.id_jugador,
                id_categoria_edicion!
            );
            return response;
        },
        enabled: !!id_equipo && id_equipo > 0 && !!id_categoria_edicion && id_categoria_edicion > 0 && !!capitanData,
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        ...options,
    });
};

export const useObtenerInvitacionesEnviadas = (
    id_equipo: number,
    id_categoria_edicion?: number,
    options?: Omit<UseQueryOptions<ObtenerSolicitudesEquipoResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    const capitanData = useCapitanData();

    return useQuery({
        queryKey: solicitudesCapitanKeys.invitaciones(id_equipo, id_categoria_edicion),
        queryFn: async () => {
            if (!capitanData) {
                throw new Error('No tienes permisos de capitán para esta acción');
            }
            const response = await equipoService.obtenerInvitacionesEnviadas(
                id_equipo,
                capitanData.id_jugador,
                id_categoria_edicion!
            );
            return response;
        },
        enabled: !!id_equipo && id_equipo > 0 && !!id_categoria_edicion && id_categoria_edicion > 0 && !!capitanData,
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        ...options,
    });
};

export const useConfirmarSolicitud = (
    id_equipo?: number,
    options?: UseMutationOptions<SolicitudResponse, Error, Omit<ConfirmarSolicitudParams, 'id_equipo' | 'id_categoria_edicion'>>
) => {
    const queryClient = useQueryClient();
    const capitanData = useCapitanData();

    return useMutation({
        mutationFn: async (params: Omit<ConfirmarSolicitudParams, 'id_equipo' | 'id_categoria_edicion'>) => {
            if (!capitanData) {
                throw new Error('No tienes permisos de capitán para esta acción');
            }
            const response = await equipoService.confirmarSolicitud({
                ...params,
                id_equipo: capitanData.id_equipo,
                id_categoria_edicion: capitanData.id_categoria_edicion,
                id_jugador_capitan: capitanData.id_jugador,
            });
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

            options?.onSuccess?.(data, variables, undefined);
        },
        onError: (error, variables, context) => {
            options?.onError?.(error, variables, context);
        },
        ...options,
    });
};

export const useRechazarSolicitud = (
    id_equipo?: number,
    options?: UseMutationOptions<SolicitudResponse, Error, Omit<RechazarSolicitudParams, 'id_equipo' | 'id_categoria_edicion'>>
) => {
    const queryClient = useQueryClient();
    const capitanData = useCapitanData();

    return useMutation({
        mutationFn: async (params: Omit<RechazarSolicitudParams, 'id_equipo' | 'id_categoria_edicion'>) => {
            if (!capitanData) {
                throw new Error('No tienes permisos de capitán para esta acción');
            }
            const response = await equipoService.rechazarSolicitud({
                ...params,
                id_equipo: capitanData.id_equipo,
                id_categoria_edicion: capitanData.id_categoria_edicion,
                id_jugador_capitan: capitanData.id_jugador,
            });
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

            options?.onSuccess?.(data, variables, undefined);
        },
        onError: (error, variables, context) => {
            options?.onError?.(error, variables, context);
        },
        ...options,
    });
};

export const useEnviarInvitacion = (
    options?: UseMutationOptions<SolicitudResponse, Error, Omit<EnviarInvitacionParams, 'id_equipo'>>
) => {
    const queryClient = useQueryClient();
    const capitanData = useCapitanData();

    return useMutation({
        mutationFn: async (params: Omit<EnviarInvitacionParams, 'id_equipo'>) => {
            if (!capitanData) {
                throw new Error('No tienes permisos de capitán para esta acción');
            }
            const response = await equipoService.enviarInvitacion({
                ...params,
                id_equipo: capitanData.id_equipo,
                id_jugador_capitan: capitanData.id_jugador,
                id_categoria_edicion: capitanData.id_categoria_edicion,
            });
            return response;
        },
        onSuccess: (data, variables) => {
            if (capitanData) {
                queryClient.invalidateQueries({
                    queryKey: solicitudesCapitanKeys.invitaciones(capitanData.id_equipo)
                });
            }
            queryClient.invalidateQueries({
                queryKey: solicitudesCapitanKeys.all
            });

            options?.onSuccess?.(data, variables, undefined);
        },
        onError: (error, variables, context) => {
            options?.onError?.(error, variables, context);
        },
        ...options,
    });
};

export const useCancelarInvitacion = (
    id_equipo?: number,
    options?: UseMutationOptions<SolicitudResponse, Error, Pick<CancelarInvitacionParams, 'id_solicitud'>>
) => {
    const queryClient = useQueryClient();
    const capitanData = useCapitanData();

    return useMutation({
        mutationFn: async (params: Pick<CancelarInvitacionParams, 'id_solicitud'>) => {
            if (!capitanData) {
                throw new Error('No tienes permisos de capitán para esta acción');
            }
            const response = await equipoService.cancelarInvitacion({
                ...params,
                id_equipo: capitanData.id_equipo,
                id_jugador_capitan: capitanData.id_jugador,
                id_categoria_edicion: capitanData.id_categoria_edicion,
            });
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

            options?.onSuccess?.(data, variables, undefined);
        },
        onError: (error, variables, context) => {
            options?.onError?.(error, variables, context);
        },
        ...options,
    });
};

export const useSolicitudesCapitan = (id_equipo?: number, id_categoria_edicion?: number) => {
    const capitanData = useCapitanData();

    const solicitudesQuery = useObtenerSolicitudesEquipo(
        id_equipo || 0,
        id_categoria_edicion,
        { enabled: !!id_equipo && !!id_categoria_edicion && !!capitanData }
    );

    const invitacionesQuery = useObtenerInvitacionesEnviadas(
        id_equipo || 0,
        id_categoria_edicion,
        { enabled: !!id_equipo && !!id_categoria_edicion && !!capitanData }
    );

    const confirmarSolicitudMutation = useConfirmarSolicitud(id_equipo);
    const rechazarSolicitudMutation = useRechazarSolicitud(id_equipo);
    const enviarInvitacionMutation = useEnviarInvitacion();
    const cancelarInvitacionMutation = useCancelarInvitacion(id_equipo);

    return {
        // Datos del capitán
        capitanData,

        // Solicitudes recibidas
        solicitudes: solicitudesQuery.data || null,
        isLoadingSolicitudes: solicitudesQuery.isLoading,
        isErrorSolicitudes: solicitudesQuery.isError,
        errorSolicitudes: solicitudesQuery.error,
        refetchSolicitudes: solicitudesQuery.refetch,

        // Invitaciones enviadas
        invitaciones: invitacionesQuery.data || null,
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
