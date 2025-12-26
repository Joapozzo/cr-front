import { useQuery, UseQueryOptions, useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import {
    SolicitudResponse,
    InvitacionEnviadaResponse,
    RechazarResponse,
    ConfirmarSolicitudResponse,
    ConfirmarInvitacionResponse,
    solicitudesService
} from '../services/solicitudes.services';
import { equiposService } from '../services/equipos.services';
import { equiposKeys } from './useEquipos';

// ====================================================================
// QUERY KEYS
// ====================================================================

export const mercadopasesKeys = {
    // Key base para todas las operaciones de mercado de pases
    all: ['mercadopases'] as const,

    // Lista de solicitudes pendientes para un equipo y categoría
    solicitudesEquipo: (id_equipo: number, id_categoria_edicion: number) =>
        [...mercadopasesKeys.all, 'solicitudes-equipo', id_equipo, id_categoria_edicion] as const,

    // Lista de invitaciones enviadas por un equipo y categoría
    invitacionesEnviadas: (id_equipo: number, id_categoria_edicion: number) =>
        [...mercadopasesKeys.all, 'invitaciones-enviadas', id_equipo, id_categoria_edicion] as const,

    // Lista de solicitudes de baja para un equipo y categoría
    solicitudesBaja: (id_equipo: number, id_categoria_edicion: number) =>
        [...mercadopasesKeys.all, 'solicitudes-baja', id_equipo, id_categoria_edicion] as const,
};

// ====================================================================
// QUERIES (OBTENER DATOS)
// ====================================================================

/**
 * Hook para obtener las solicitudes de jugadores que quieren unirse a un equipo/categoría.
 */
export const useSolicitudesEquipo = (
    id_equipo: number,
    id_categoria_edicion: number,
    options?: Omit<UseQueryOptions<SolicitudResponse[], Error>, 'queryKey' | 'queryFn'>
) => {
    // La query se deshabilita si falta alguno de los IDs
    const enabled = !!id_equipo && !!id_categoria_edicion;

    return useQuery<SolicitudResponse[]>({
        queryKey: mercadopasesKeys.solicitudesEquipo(id_equipo, id_categoria_edicion),
        queryFn: () => solicitudesService.obtenerSolicitudesEquipo(id_equipo, id_categoria_edicion),
        staleTime: 60 * 1000, // 1 minuto
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 1,
        refetchOnWindowFocus: false,
        enabled,
        ...options,
    });
};

/**
 * Hook para obtener las invitaciones que el equipo ha enviado a jugadores.
 */
export const useInvitacionesEnviadas = (
    id_equipo: number,
    id_categoria_edicion: number,
    options?: Omit<UseQueryOptions<InvitacionEnviadaResponse[], Error>, 'queryKey' | 'queryFn'>
) => {
    const enabled = !!id_equipo && !!id_categoria_edicion;

    return useQuery<InvitacionEnviadaResponse[]>({
        queryKey: mercadopasesKeys.invitacionesEnviadas(id_equipo, id_categoria_edicion),
        queryFn: () => solicitudesService.obtenerInvitacionesEnviadas(id_equipo, id_categoria_edicion),
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled,
        ...options,
    });
};

// ====================================================================
// MUTATIONS (ACCIONES: CONFIRMAR/RECHAZAR)
// ====================================================================

// Función de utilidad para manejar la invalidación de queries después de una mutación.
const useMercadoPasesMutation = () => {
    const queryClient = useQueryClient();

    // La función que se llama en onSuccess/onError para invalidar las queries relacionadas.
    const onSettled = () => {
        // Invalida TODAS las queries de mercadopases para refrescar ambas listas
        queryClient.invalidateQueries({ queryKey: mercadopasesKeys.all });
        // Invalida también las queries de equipos para actualizar el plantel
        queryClient.invalidateQueries({ queryKey: equiposKeys.all });
    };

    return { queryClient, onSettled };
};

/**
 * Hook para CONFIRMAR (aceptar) una solicitud de jugador.
 */
export const useConfirmarSolicitud = (
    options?: Omit<UseMutationOptions<ConfirmarSolicitudResponse, Error, { id_solicitud: number; id_jugador: number }>, 'mutationFn'>
) => {
    const { onSettled } = useMercadoPasesMutation();

    return useMutation<ConfirmarSolicitudResponse, Error, { id_solicitud: number; id_jugador: number }>({
        mutationFn: ({ id_solicitud, id_jugador }) => solicitudesService.confirmarSolicitud(id_solicitud, id_jugador),
        onSuccess: (data, variables) => {
            (`Solicitud ${variables.id_solicitud} confirmada con éxito.`, data);
        },
        onSettled: onSettled, // Invalida las queries tras el éxito o error
        onError: (error) => {
            console.error('Error al confirmar solicitud:', error.message);
        },
        ...options,
    });
};

/**
 * Hook para RECHAZAR una solicitud de jugador.
 */
export const useRechazarSolicitud = (
    options?: Omit<UseMutationOptions<RechazarResponse, Error, number>, 'mutationFn'>
) => {
    const { onSettled } = useMercadoPasesMutation();

    return useMutation<RechazarResponse, Error, number>({
        mutationFn: (id_solicitud) => solicitudesService.rechazarSolicitud(id_solicitud),
        onSuccess: (data, variables) => {
            (`Solicitud ${variables} rechazada con éxito.`, data);
        },
        onSettled: onSettled,
        onError: (error) => {
            console.error('Error al rechazar solicitud:', error.message);
        },
        ...options,
    });
};


/**
 * Hook para CONFIRMAR (aceptar) una invitación enviada por el equipo.
 */
export const useConfirmarInvitacion = (
    options?: Omit<UseMutationOptions<ConfirmarInvitacionResponse, Error, { id_solicitud: number; id_jugador: number }>, 'mutationFn'>
) => {
    const { onSettled } = useMercadoPasesMutation();

    return useMutation<ConfirmarInvitacionResponse, Error, { id_solicitud: number; id_jugador: number }>({
        mutationFn: ({ id_solicitud, id_jugador }) => solicitudesService.confirmarInvitacion(id_solicitud, id_jugador),
        onSuccess: (data, variables) => {
            (`Invitación ${variables.id_solicitud} confirmada con éxito.`, data);
        },
        onSettled: onSettled,
        onError: (error) => {
            console.error('Error al confirmar invitación:', error.message);
        },
        ...options,
    });
};

/**
 * Hook para RECHAZAR una invitación enviada por el equipo.
 */
export const useRechazarInvitacion = (
    options?: Omit<UseMutationOptions<RechazarResponse, Error, number>, 'mutationFn'>
) => {
    const { onSettled } = useMercadoPasesMutation();

    return useMutation<RechazarResponse, Error, number>({
        mutationFn: (id_solicitud) => solicitudesService.rechazarInvitacion(id_solicitud),
        onSuccess: (data, variables) => {
            (`Invitación ${variables} rechazada con éxito.`, data);
        },
        onSettled: onSettled,
        onError: (error) => {
            console.error('Error al rechazar invitación:', error.message);
        },
        ...options,
    });
};

/**
 * Hook para obtener las solicitudes de baja de un equipo/categoría.
 */
export const useSolicitudesBajaEquipo = (
    id_equipo: number,
    id_categoria_edicion: number,
    options?: Omit<UseQueryOptions<SolicitudResponse[], Error>, 'queryKey' | 'queryFn'>
) => {
    const enabled = !!id_equipo && !!id_categoria_edicion;

    return useQuery<SolicitudResponse[]>({
        queryKey: mercadopasesKeys.solicitudesBaja(id_equipo, id_categoria_edicion),
        queryFn: async () => {
            const response = await equiposService.obtenerSolicitudesBajaAdmin(id_equipo, id_categoria_edicion);
            return response.solicitudes;
        },
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled,
        ...options,
    });
};

/**
 * Hook para CONFIRMAR (aceptar) una solicitud de baja.
 */
export const useConfirmarBajaJugador = (
    options?: Omit<UseMutationOptions<{ message: string }, Error, number>, 'mutationFn'>
) => {
    const { onSettled } = useMercadoPasesMutation();

    return useMutation<{ message: string }, Error, number>({
        mutationFn: (id_solicitud) => equiposService.confirmarBajaJugador(id_solicitud),
        onSuccess: (data, variables) => {
            (`Solicitud de baja ${variables} confirmada con éxito.`, data);
        },
        onSettled: onSettled,
        onError: (error) => {
            console.error('Error al confirmar solicitud de baja:', error.message);
        },
        ...options,
    });
};

/**
 * Hook para RECHAZAR una solicitud de baja.
 */
export const useRechazarBajaJugador = (
    options?: Omit<UseMutationOptions<{ message: string }, Error, { id_solicitud: number; motivo_rechazo?: string }>, 'mutationFn'>
) => {
    const { onSettled } = useMercadoPasesMutation();

    return useMutation<{ message: string }, Error, { id_solicitud: number; motivo_rechazo?: string }>({
        mutationFn: ({ id_solicitud, motivo_rechazo }) => equiposService.rechazarBajaJugador(id_solicitud, motivo_rechazo),
        onSuccess: (data, variables) => {
            (`Solicitud de baja ${variables.id_solicitud} rechazada con éxito.`, data);
        },
        onSettled: onSettled,
        onError: (error) => {
            console.error('Error al rechazar solicitud de baja:', error.message);
        },
        ...options,
    });
};