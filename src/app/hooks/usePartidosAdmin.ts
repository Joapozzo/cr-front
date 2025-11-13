import { useMutation, useQuery, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { partidosService } from '../services/partidos.services';
import {
    PostPartido,
    UpdatePartido,
    PartidosPorJornadaResponse,
    CrearPartidoResponse,
    ActualizarPartidoResponse,
    EliminarPartidoResponse
} from '../schemas/partidos.schema';

export const partidosAdminKeys = {
    all: ['partidos-admin'] as const,
    jornadaCategoria: (jornada: number, id_categoria_edicion: number) =>
        [...partidosAdminKeys.all, 'jornada', jornada, 'categoria', id_categoria_edicion] as const,
    mutations: () => [...partidosAdminKeys.all, 'mutations'] as const,
};

// ==================== HOOKS DE CONSULTA ====================

/**
 * Hook para obtener partidos por jornada y categoría
 */
export const usePartidosPorJornadaYCategoria = (
    jornada: number,
    id_categoria_edicion: number,
    options?: Omit<UseQueryOptions<PartidosPorJornadaResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: partidosAdminKeys.jornadaCategoria(jornada, id_categoria_edicion),
        queryFn: () => partidosService.obtenerPartidosPorJornadaYCategoria(jornada, id_categoria_edicion),
        enabled: !!(jornada && id_categoria_edicion && jornada > 0 && id_categoria_edicion > 0),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

// ==================== HOOKS DE MUTACIÓN ====================

/**
 * Hook para crear un partido
 */
export const useCrearPartido = (
    options?: UseMutationOptions<
        CrearPartidoResponse,
        Error,
        { id_categoria_edicion: number; partidoData: PostPartido }
    >
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_categoria_edicion, partidoData }) =>
            partidosService.crearPartido(id_categoria_edicion, partidoData),
        onSuccess: (data, variables) => {
            // Invalidar partidos por jornada y categoría
            queryClient.invalidateQueries({
                queryKey: partidosAdminKeys.jornadaCategoria(
                    variables.partidoData.jornada,
                    variables.id_categoria_edicion
                )
            });

            // Invalidar partidos generales que podrían verse afectados
            queryClient.invalidateQueries({
                queryKey: ['partidos', 'generales']
            });

            // Si tiene equipos, invalidar sus consultas
            if (variables.partidoData.id_equipolocal) {
                queryClient.invalidateQueries({
                    queryKey: ['partidos', 'equipos', variables.partidoData.id_equipolocal]
                });
            }
            if (variables.partidoData.id_equipovisita) {
                queryClient.invalidateQueries({
                    queryKey: ['partidos', 'equipos', variables.partidoData.id_equipovisita]
                });
            }
        },
        // Remover el onError que estaba interfiriendo con el error original
        ...options,
    });
};

/**
 * Hook para actualizar un partido
 */
export const useActualizarPartido = (
    options?: UseMutationOptions<
        ActualizarPartidoResponse,
        Error,
        { id_categoria_edicion: number; id_partido: number; partidoData: UpdatePartido }
    >
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_categoria_edicion, id_partido, partidoData }) =>
            partidosService.actualizarPartido(id_categoria_edicion, id_partido, partidoData),
        onSuccess: (data, variables) => {
            // Invalidar consultas específicas por jornada y categoría
            if (variables.partidoData.jornada) {
                queryClient.invalidateQueries({
                    queryKey: partidosAdminKeys.jornadaCategoria(
                        variables.partidoData.jornada,
                        variables.id_categoria_edicion
                    )
                });
            }

            // Invalidar todas las consultas de esta categoría por si cambió la jornada
            queryClient.invalidateQueries({
                queryKey: [...partidosAdminKeys.all, 'categoria', variables.id_categoria_edicion]
            });

            // Invalidar partidos generales
            queryClient.invalidateQueries({
                queryKey: ['partidos', 'generales']
            });

            // Invalidar equipos afectados
            if (variables.partidoData.id_equipolocal) {
                queryClient.invalidateQueries({
                    queryKey: ['partidos', 'equipos', variables.partidoData.id_equipolocal]
                });
            }
            if (variables.partidoData.id_equipovisita) {
                queryClient.invalidateQueries({
                    queryKey: ['partidos', 'equipos', variables.partidoData.id_equipovisita]
                });
            }

            // Invalidar el equipo anterior si cambió
            const partidoOriginal = data.partido;
            if (partidoOriginal.equipoLocal?.id_equipo &&
                partidoOriginal.equipoLocal.id_equipo !== variables.partidoData.id_equipolocal) {
                queryClient.invalidateQueries({
                    queryKey: ['partidos', 'equipos', partidoOriginal.equipoLocal.id_equipo]
                });
            }
            if (partidoOriginal.equipoVisita?.id_equipo &&
                partidoOriginal.equipoVisita.id_equipo !== variables.partidoData.id_equipovisita) {
                queryClient.invalidateQueries({
                    queryKey: ['partidos', 'equipos', partidoOriginal.equipoVisita.id_equipo]
                });
            }
        },
        ...options,
    });
};

/**
 * Hook para eliminar un partido (soft delete)
 */
export const useEliminarPartido = (
    options?: UseMutationOptions<EliminarPartidoResponse, Error, number>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id_partido: number) => partidosService.eliminarPartido(id_partido),
        onSuccess: (data) => {
            // Invalidar consultas por jornada y categoría del partido eliminado
            // if (data.partido.jornada && data.partido.id_categoria_edicion) {
            //     queryClient.invalidateQueries({
            //         queryKey: partidosAdminKeys.jornadaCategoria(
            //             data.partido.jornada,
            //             data.partido.id_categoria_edicion
            //         )
            //     });
            // }

            // Invalidar todas las consultas de partidos admin
            queryClient.invalidateQueries({
                queryKey: partidosAdminKeys.all
            });

            // Invalidar partidos generales
            queryClient.invalidateQueries({
                queryKey: ['partidos', 'generales']
            });

            // Invalidar equipos afectados
            // if (data.partido.equipoLocal?.id_equipo) {
            //     queryClient.invalidateQueries({
            //         queryKey: ['partidos', 'equipos', data.partido.equipoLocal.id_equipo]
            //     });
            // }
            // if (data.partido.equipoVisita?.id_equipo) {
            //     queryClient.invalidateQueries({
            //         queryKey: ['partidos', 'equipos', data.partido.equipoVisita.id_equipo]
            //     });
            // }
        },
        ...options,
    });
};

// ==================== HOOK UNIFICADO PARA ADMINISTRACIÓN ====================

export const usePartidosAdmin = () => {
    const crearPartido = useCrearPartido();
    const actualizarPartido = useActualizarPartido();
    const eliminarPartido = useEliminarPartido();

    return {
        // Mutaciones
        crear: {
            mutate: crearPartido.mutate,
            mutateAsync: crearPartido.mutateAsync,
            isPending: crearPartido.isPending,
            isError: crearPartido.isError,
            isSuccess: crearPartido.isSuccess,
            error: crearPartido.error,
            data: crearPartido.data,
            reset: crearPartido.reset,
        },
        actualizar: {
            mutate: actualizarPartido.mutate,
            mutateAsync: actualizarPartido.mutateAsync,
            isPending: actualizarPartido.isPending,
            isError: actualizarPartido.isError,
            isSuccess: actualizarPartido.isSuccess,
            error: actualizarPartido.error,
            data: actualizarPartido.data,
            reset: actualizarPartido.reset,
        },
        eliminar: {
            mutate: eliminarPartido.mutate,
            mutateAsync: eliminarPartido.mutateAsync,
            isPending: eliminarPartido.isPending,
            isError: eliminarPartido.isError,
            isSuccess: eliminarPartido.isSuccess,
            error: eliminarPartido.error,
            data: eliminarPartido.data,
            reset: eliminarPartido.reset,
        },
        // Estados generales
        isLoading: crearPartido.isPending || actualizarPartido.isPending || eliminarPartido.isPending,
        hasErrors: crearPartido.isError || actualizarPartido.isError || eliminarPartido.isError,
    };
};

// ==================== HOOKS AUXILIARES ====================

/**
 * Hook auxiliar para invalidar consultas relacionadas con partidos
 */
export const useInvalidatePartidos = () => {
    const queryClient = useQueryClient();

    return {
        invalidateAll: () => {
            queryClient.invalidateQueries({ queryKey: ['partidos'] });
            queryClient.invalidateQueries({ queryKey: partidosAdminKeys.all });
        },
        invalidateGenerales: () => {
            queryClient.invalidateQueries({ queryKey: ['partidos', 'generales'] });
        },
        invalidateEquipo: (id_equipo: number) => {
            queryClient.invalidateQueries({ queryKey: ['partidos', 'equipos', id_equipo] });
        },
        invalidateJornadaCategoria: (jornada: number, id_categoria_edicion: number) => {
            queryClient.invalidateQueries({
                queryKey: partidosAdminKeys.jornadaCategoria(jornada, id_categoria_edicion)
            });
        },
    };
};

/**
 * Hook para resetear todos los estados de mutación
 */
export const useResetPartidosAdmin = () => {
    const queryClient = useQueryClient();

    return () => {
        queryClient.resetQueries({ queryKey: partidosAdminKeys.mutations() });
    };
};