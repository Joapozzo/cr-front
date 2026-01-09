    import { useMutation, useQueryClient } from '@tanstack/react-query';
    import { planilleroService } from '../services/planillero.services';
    import { useAuthStore } from '../stores/authStore';
    import { planilleroKeys } from './usePartidosPlanillero';
    import { JugadorPlantel, DatosCompletosPlanillero } from '../types/partido';

    // Hook para marcar jugador como destacado
    interface MarcarJugadorDestacadoData {
        idPartido: number;
        jugadorData: {
            id_categoria_edicion: number;
            id_equipo: number;
            id_jugador: number;
        };
    }

    export const useMarcarJugadorDestacado = () => {
        const queryClient = useQueryClient();
        const usuario = useAuthStore((state) => state.usuario);

        return useMutation({
            mutationFn: async ({ idPartido, jugadorData }: MarcarJugadorDestacadoData) => {
                if (!usuario?.uid) {
                    throw new Error('Usuario no autenticado');
                }
                return await planilleroService.marcarJugadorDestacado(idPartido, jugadorData);
            },
            onMutate: async ({ idPartido, jugadorData }) => {
                // Cancelar queries en progreso
                await queryClient.cancelQueries({
                    queryKey: planilleroKeys.plantel(idPartido, jugadorData.id_equipo)
                });
                await queryClient.cancelQueries({
                    queryKey: planilleroKeys.datosCompletos(idPartido)
                });

                // Snapshot del valor anterior
                const previousPlantel = queryClient.getQueryData<JugadorPlantel[]>(
                    planilleroKeys.plantel(idPartido, jugadorData.id_equipo)
                );
                const previousData = queryClient.getQueryData<DatosCompletosPlanillero>(
                    planilleroKeys.datosCompletos(idPartido)
                );

                // Actualizar optimísticamente el plantel
                if (previousPlantel) {
                    const updatedPlantel = previousPlantel.map(jugador =>
                        jugador.id_jugador === jugadorData.id_jugador
                            ? { ...jugador, destacado: true }
                            : jugador
                    );
                    queryClient.setQueryData<JugadorPlantel[]>(
                        planilleroKeys.plantel(idPartido, jugadorData.id_equipo),
                        updatedPlantel
                    );
                }

                // Actualizar optimísticamente datos completos
                if (previousData) {
                    const equipoKey = jugadorData.id_equipo === previousData.partido.equipoLocal?.id_equipo
                        ? 'plantel_local'
                        : 'plantel_visita';
                    const plantel = previousData[equipoKey] || [];
                    const updatedPlantel = plantel.map(jugador =>
                        jugador.id_jugador === jugadorData.id_jugador
                            ? { ...jugador, destacado: true }
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
                        planilleroKeys.plantel(variables.idPartido, variables.jugadorData.id_equipo),
                        ctx.previousPlantel
                    );
                }
                if (ctx?.previousData) {
                    queryClient.setQueryData(
                        planilleroKeys.datosCompletos(variables.idPartido),
                        ctx.previousData
                    );
                }
            },
            onSuccess: (data, variables) => {
                // Invalidar datos básicos porque cambió el jugador destacado
                queryClient.invalidateQueries({
                    queryKey: planilleroKeys.datosBasicos(variables.idPartido)
                });
                // Invalidar plantel del equipo porque cambió el campo destacado en Formacion
                queryClient.invalidateQueries({
                    queryKey: planilleroKeys.plantel(variables.idPartido, variables.jugadorData.id_equipo)
                });
                // También invalidar datos completos por compatibilidad
                queryClient.invalidateQueries({
                    queryKey: planilleroKeys.datosCompletos(variables.idPartido)
                });
            }
        });
    };

    // Hook para desmarcar jugador destacado
    interface DesmarcarJugadorDestacadoData {
        idPartido: number;
        jugadorData: {
            id_categoria_edicion: number;
            id_equipo: number;
            id_jugador: number;
        };
    }

    export const useDesmarcarJugadorDestacado = () => {
        const queryClient = useQueryClient();
        const usuario = useAuthStore((state) => state.usuario);

        return useMutation({
            mutationFn: async ({ idPartido, jugadorData }: DesmarcarJugadorDestacadoData) => {
                if (!usuario?.uid) {
                    throw new Error('Usuario no autenticado');
                }
                return await planilleroService.desmarcarJugadorDestacado(idPartido, jugadorData);
            },
            onMutate: async ({ idPartido, jugadorData }) => {
                // Cancelar queries en progreso
                await queryClient.cancelQueries({
                    queryKey: planilleroKeys.plantel(idPartido, jugadorData.id_equipo)
                });
                await queryClient.cancelQueries({
                    queryKey: planilleroKeys.datosCompletos(idPartido)
                });

                // Snapshot del valor anterior
                const previousPlantel = queryClient.getQueryData<JugadorPlantel[]>(
                    planilleroKeys.plantel(idPartido, jugadorData.id_equipo)
                );
                const previousData = queryClient.getQueryData<DatosCompletosPlanillero>(
                    planilleroKeys.datosCompletos(idPartido)
                );

                // Actualizar optimísticamente el plantel
                if (previousPlantel) {
                    const updatedPlantel = previousPlantel.map(jugador =>
                        jugador.id_jugador === jugadorData.id_jugador
                            ? { ...jugador, destacado: false }
                            : jugador
                    );
                    queryClient.setQueryData<JugadorPlantel[]>(
                        planilleroKeys.plantel(idPartido, jugadorData.id_equipo),
                        updatedPlantel
                    );
                }

                // Actualizar optimísticamente datos completos
                if (previousData) {
                    const equipoKey = jugadorData.id_equipo === previousData.partido.equipoLocal?.id_equipo
                        ? 'plantel_local'
                        : 'plantel_visita';
                    const plantel = previousData[equipoKey] || [];
                    const updatedPlantel = plantel.map(jugador =>
                        jugador.id_jugador === jugadorData.id_jugador
                            ? { ...jugador, destacado: false }
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
                        planilleroKeys.plantel(variables.idPartido, variables.jugadorData.id_equipo),
                        ctx.previousPlantel
                    );
                }
                if (ctx?.previousData) {
                    queryClient.setQueryData(
                        planilleroKeys.datosCompletos(variables.idPartido),
                        ctx.previousData
                    );
                }
            },
            onSuccess: (data, variables) => {
                // Invalidar datos básicos porque cambió el jugador destacado
                queryClient.invalidateQueries({
                    queryKey: planilleroKeys.datosBasicos(variables.idPartido)
                });
                // Invalidar plantel del equipo porque cambió el campo destacado en Formacion
                queryClient.invalidateQueries({
                    queryKey: planilleroKeys.plantel(variables.idPartido, variables.jugadorData.id_equipo)
                });
                // También invalidar datos completos por compatibilidad
                queryClient.invalidateQueries({
                    queryKey: planilleroKeys.datosCompletos(variables.idPartido)
                });
            }
        });
    };

    // Hook para seleccionar MVP
    interface SeleccionarMVPData {
        idPartido: number;
        mvpData: {
            id_categoria_edicion: number;
            id_equipo: number;
            id_jugador: number;
        };
    }

    export const useSeleccionarMVP = () => {
        const queryClient = useQueryClient();
        const usuario = useAuthStore((state) => state.usuario);

        return useMutation({
            mutationFn: async ({ idPartido, mvpData }: SeleccionarMVPData) => {
                if (!usuario?.uid) {
                    throw new Error('Usuario no autenticado');
                }
                return await planilleroService.seleccionarMVP(idPartido, mvpData);
            },
            onSuccess: (data, variables) => {
                // Invalidar datos básicos porque cambió el MVP
                queryClient.invalidateQueries({
                    queryKey: planilleroKeys.datosBasicos(variables.idPartido)
                });
                // Invalidar plantel del equipo porque cambió el campo destacado en Formacion
                queryClient.invalidateQueries({
                    queryKey: planilleroKeys.plantel(variables.idPartido, variables.mvpData.id_equipo)
                });
                // También invalidar datos completos por compatibilidad
                queryClient.invalidateQueries({
                    queryKey: planilleroKeys.datosCompletos(variables.idPartido)
                });
            },
            onError: (error) => {
                console.error('Error al seleccionar MVP:', error);
            }
        });
    };

    // Hook combinado para gestionar jugadores destacados (marcar/desmarcar)
    export const useGestionarJugadorDestacado = () => {
        const marcarMutation = useMarcarJugadorDestacado();
        const desmarcarMutation = useDesmarcarJugadorDestacado();

        return {
            marcar: marcarMutation.mutateAsync,
            desmarcar: desmarcarMutation.mutateAsync,
            isLoadingMarcar: marcarMutation.isPending,
            isLoadingDesmarcar: desmarcarMutation.isPending,
            isLoading: marcarMutation.isPending || desmarcarMutation.isPending,
            error: marcarMutation.error || desmarcarMutation.error
        };
    };

    