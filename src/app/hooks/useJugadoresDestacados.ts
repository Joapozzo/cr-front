    import { useMutation, useQueryClient } from '@tanstack/react-query';
    import { planilleroService } from '../services/planillero.services';

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

        return useMutation({
            mutationFn: async ({ idPartido, jugadorData }: MarcarJugadorDestacadoData) => {
                return await planilleroService.marcarJugadorDestacado(idPartido, jugadorData);
            },
            onSuccess: (data, variables) => {
                // Invalidar las queries relacionadas con el partido
                queryClient.invalidateQueries({
                    queryKey: ['planillero', 'datos-completos', variables.idPartido]
                });
                queryClient.refetchQueries({
                    queryKey: ['planillero', 'datos-completos', variables.idPartido]
                });
            },
            onError: (error) => {
                console.error('Error al marcar jugador destacado:', error);
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

        return useMutation({
            mutationFn: async ({ idPartido, jugadorData }: DesmarcarJugadorDestacadoData) => {
                return await planilleroService.desmarcarJugadorDestacado(idPartido, jugadorData);
            },
            onSuccess: (data, variables) => {
                // Invalidar las queries relacionadas con el partido
                queryClient.invalidateQueries({
                    queryKey: ['planillero', 'datos-completos', variables.idPartido]
                });
                queryClient.refetchQueries({
                    queryKey: ['planillero', 'datos-completos', variables.idPartido]
                });
            },
            onError: (error) => {
                console.error('Error al desmarcar jugador destacado:', error);
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

        return useMutation({
            mutationFn: async ({ idPartido, mvpData }: SeleccionarMVPData) => {
                return await planilleroService.seleccionarMVP(idPartido, mvpData);
            },
            onSuccess: (data, variables) => {
                // Invalidar las queries relacionadas con el partido
                queryClient.invalidateQueries({
                    queryKey: ['planillero', 'datos-completos', variables.idPartido]
                });
                queryClient.refetchQueries({
                    queryKey: ['planillero', 'datos-completos', variables.idPartido]
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

    