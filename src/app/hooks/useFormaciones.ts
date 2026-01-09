import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { formacionesService } from '../services/formaciones.services';
import {
    FormacionResponse,
    MarcarEnCanchaData,
    DesmarcarEnCanchaData,
    ActualizarFormacionData
} from '../services/formaciones.services';
import { useAuthStore } from '../stores/authStore';
import { planilleroKeys } from './usePartidosPlanillero';
import { JugadorPlantel, DatosCompletosPlanillero } from '../types/partido';

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
        onMutate: async ({ idPartido, enCanchaData }) => {
            // Cancelar queries en progreso
            await queryClient.cancelQueries({
                queryKey: planilleroKeys.plantel(idPartido, enCanchaData.id_equipo)
            });
            await queryClient.cancelQueries({
                queryKey: planilleroKeys.datosCompletos(idPartido)
            });

            // Snapshot del valor anterior
            const previousPlantel = queryClient.getQueryData<JugadorPlantel[]>(
                planilleroKeys.plantel(idPartido, enCanchaData.id_equipo)
            );
            const previousData = queryClient.getQueryData<DatosCompletosPlanillero>(
                planilleroKeys.datosCompletos(idPartido)
            );

            // Actualizar optimísticamente el plantel
            if (previousPlantel) {
                const updatedPlantel = previousPlantel.map(jugador =>
                    jugador.id_jugador === enCanchaData.id_jugador
                        ? { ...jugador, en_cancha: true }
                        : jugador
                );
                queryClient.setQueryData<JugadorPlantel[]>(
                    planilleroKeys.plantel(idPartido, enCanchaData.id_equipo),
                    updatedPlantel
                );
            }

            // Actualizar optimísticamente datos completos
            if (previousData) {
                const equipoKey = enCanchaData.id_equipo === previousData.partido.equipoLocal?.id_equipo
                    ? 'plantel_local'
                    : 'plantel_visita';
                const plantel = previousData[equipoKey] || [];
                const updatedPlantel = plantel.map(jugador =>
                    jugador.id_jugador === enCanchaData.id_jugador
                        ? { ...jugador, en_cancha: true }
                        : jugador
                );
                queryClient.setQueryData<DatosCompletosPlanillero>(
                    planilleroKeys.datosCompletos(idPartido),
                    {
                        ...previousData,
                        [equipoKey]: updatedPlantel
                    }
                );
            }

            return { previousPlantel, previousData };
        },
        onError: (error, variables, context) => {
            // Revertir en caso de error
            const ctx = context as { previousPlantel?: JugadorPlantel[]; previousData?: DatosCompletosPlanillero } | undefined;
            if (ctx?.previousPlantel) {
                queryClient.setQueryData(
                    planilleroKeys.plantel(variables.idPartido, variables.enCanchaData.id_equipo),
                    ctx.previousPlantel
                );
            }
            if (ctx?.previousData) {
                queryClient.setQueryData(
                    planilleroKeys.datosCompletos(variables.idPartido),
                    ctx.previousData
                );
            }
            options?.onError?.(error, variables, context);
        },
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({
                queryKey: formacionesKeys.partido(variables.idPartido)
            });
            queryClient.invalidateQueries({
                queryKey: formacionesKeys.jugador(variables.idPartido, variables.enCanchaData.id_jugador)
            });
            // Invalidar plantel del equipo afectado
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.plantel(variables.idPartido, variables.enCanchaData.id_equipo)
            });
            queryClient.invalidateQueries({
                queryKey: ['cambios-jugador', 'partido', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosCompletos(variables.idPartido)
            });
            options?.onSuccess?.(data, variables, undefined);
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
        onMutate: async ({ idPartido, idJugador, desmarcarData }) => {
            // Cancelar queries en progreso
            await queryClient.cancelQueries({
                queryKey: planilleroKeys.plantel(idPartido, desmarcarData.id_equipo)
            });
            await queryClient.cancelQueries({
                queryKey: planilleroKeys.datosCompletos(idPartido)
            });

            // Snapshot del valor anterior
            const previousPlantel = queryClient.getQueryData<JugadorPlantel[]>(
                planilleroKeys.plantel(idPartido, desmarcarData.id_equipo)
            );
            const previousData = queryClient.getQueryData<DatosCompletosPlanillero>(
                planilleroKeys.datosCompletos(idPartido)
            );

            // Actualizar optimísticamente el plantel
            if (previousPlantel) {
                const updatedPlantel = previousPlantel.map(jugador =>
                    jugador.id_jugador === idJugador
                        ? { ...jugador, en_cancha: false }
                        : jugador
                );
                queryClient.setQueryData<JugadorPlantel[]>(
                    planilleroKeys.plantel(idPartido, desmarcarData.id_equipo),
                    updatedPlantel
                );
            }

            // Actualizar optimísticamente datos completos
            if (previousData) {
                const equipoKey = desmarcarData.id_equipo === previousData.partido.equipoLocal?.id_equipo
                    ? 'plantel_local'
                    : 'plantel_visita';
                const plantel = previousData[equipoKey] || [];
                const updatedPlantel = plantel.map(jugador =>
                    jugador.id_jugador === idJugador
                        ? { ...jugador, en_cancha: false }
                        : jugador
                );
                queryClient.setQueryData<DatosCompletosPlanillero>(
                    planilleroKeys.datosCompletos(idPartido),
                    {
                        ...previousData,
                        [equipoKey]: updatedPlantel
                    }
                );
            }

            return { previousPlantel, previousData };
        },
        onError: (error, variables, context) => {
            // Revertir en caso de error
            const ctx = context as { previousPlantel?: JugadorPlantel[]; previousData?: DatosCompletosPlanillero } | undefined;
            if (ctx?.previousPlantel) {
                queryClient.setQueryData(
                    planilleroKeys.plantel(variables.idPartido, variables.desmarcarData.id_equipo),
                    ctx.previousPlantel
                );
            }
            if (ctx?.previousData) {
                queryClient.setQueryData(
                    planilleroKeys.datosCompletos(variables.idPartido),
                    ctx.previousData
                );
            }
            options?.onError?.(error, variables, context);
        },
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({
                queryKey: formacionesKeys.partido(variables.idPartido)
            });
            queryClient.invalidateQueries({
                queryKey: formacionesKeys.jugador(variables.idPartido, variables.idJugador)
            });
            // Invalidar plantel del equipo afectado
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.plantel(variables.idPartido, variables.desmarcarData.id_equipo)
            });
            queryClient.invalidateQueries({
                queryKey: ['cambios-jugador', 'partido', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosCompletos(variables.idPartido)
            });
            options?.onSuccess?.(data, variables, undefined);
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
            // Invalidar plantel del equipo afectado (necesitamos obtener id_equipo desde el cache o invalidar todos)
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'plantel', variables.idPartido]
            });
            
            // Si se actualizó el estado en_cancha, invalidar también cambios
            if (variables.formacionData.en_cancha !== undefined) {
                queryClient.invalidateQueries({
                    queryKey: ['cambios-jugador', 'partido', variables.idPartido]
                });
            }
            
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


