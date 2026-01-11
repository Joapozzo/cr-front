import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fasesService } from '../services/fases.services';
import { FaseResponse } from '../types/fase';
import { zonasKeys } from './useZonas';

// Query keys
export const FASES_KEYS = {
    all: ['fases'] as const,
    byCategoria: (id_categoria_edicion: number) =>
        [...FASES_KEYS.all, 'categoria', id_categoria_edicion] as const,
};

export const useFasesPorCategoria = (id_categoria_edicion: number) => {
    return useQuery({
        queryKey: FASES_KEYS.byCategoria(id_categoria_edicion),
        queryFn: () => fasesService.obtenerFases(id_categoria_edicion),
        enabled: !!id_categoria_edicion && id_categoria_edicion > 0,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Usar cache si los datos están frescos
        retry: (failureCount, error: any) => {
            // No reintentar si es error 404 (categoría no encontrada)
            if (error?.response?.status === 404) {
                return false;
            }
            return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

export const useCrearFase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id_categoria_edicion: number) =>
            fasesService.crearFase(id_categoria_edicion),
        onSuccess: (data, id_categoria_edicion) => {
            // Invalidar y refrescar las fases de esta categoría
            queryClient.invalidateQueries({
                queryKey: FASES_KEYS.byCategoria(id_categoria_edicion)
            });

            // Actualizar caché optimísticamente si tenemos los datos
            queryClient.setQueryData<FaseResponse>(
                FASES_KEYS.byCategoria(id_categoria_edicion),
                (oldData) => {
                    if (!oldData) return oldData;

                    return [
                        ...oldData,
                        {
                            numero_fase: data.data?.numero_fase || (oldData.length + 1),
                            id_categoria_edicion: id_categoria_edicion
                        }
                    ];
                }
            );
        },
        onError: (error: any) => {
            console.error('Error al crear fase:', error);
        }
    });
};

export const useEliminarFase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_categoria_edicion, numero_fase }: {
            id_categoria_edicion: number;
            numero_fase: number;
        }) => fasesService.eliminarFase(id_categoria_edicion, numero_fase),
        onSuccess: (data, { id_categoria_edicion, numero_fase }) => {
            // Invalidar y refrescar las fases de esta categoría
            queryClient.invalidateQueries({
                queryKey: FASES_KEYS.byCategoria(id_categoria_edicion)
            });

            // Actualizar caché optimísticamente removiendo la fase eliminada
            queryClient.setQueryData<FaseResponse>(
                FASES_KEYS.byCategoria(id_categoria_edicion),
                (oldData) => {
                    if (!oldData) return oldData;

                    return oldData.filter(fase => fase.numero_fase !== numero_fase);
                }
            );
        },
        onError: (error: any) => {
            console.error('Error al eliminar fase:', error);
        }
    });
};

export const useFases = (id_categoria_edicion: number) => {
    const queryClient = useQueryClient();
    const fasesQuery = useFasesPorCategoria(id_categoria_edicion);
    const crearFaseMutation = useCrearFase();
    const eliminarFaseMutation = useEliminarFase();

    return {
        // Datos de las fases
        fases: fasesQuery.data,
        isLoading: fasesQuery.isLoading,
        isFetching: fasesQuery.isFetching,
        isError: fasesQuery.isError,
        error: fasesQuery.error,

        // Estados de las mutaciones
        isCreating: crearFaseMutation.isPending,
        createError: crearFaseMutation.error,
        isDeleting: eliminarFaseMutation.isPending,
        deleteError: eliminarFaseMutation.error,

        // Funciones que propagan errores
        crearFase: (id?: number) => {
            return new Promise((resolve, reject) => {
                crearFaseMutation.mutate(id || id_categoria_edicion, {
                    onSuccess: (data) => resolve(data),
                    onError: (error) => reject(error)
                });
            });
        },
        
        eliminarFase: (numero_fase: number) => {
            return new Promise((resolve, reject) => {
                eliminarFaseMutation.mutate({ id_categoria_edicion, numero_fase }, {
                    onSuccess: (data) => resolve(data),
                    onError: (error) => reject(error)
                });
            });
        },
        
        refetch: async () => {
            // Invalidar también las zonas para que se actualicen
            queryClient.invalidateQueries({ queryKey: zonasKeys.all });
            return fasesQuery.refetch();
        },

        // Estados computados
        isEmpty: fasesQuery.data?.length === 0,
        totalFases: fasesQuery.data?.length || 0,

        // Estado general
        isReady: !fasesQuery.isLoading && !fasesQuery.isError,
        isMutating: crearFaseMutation.isPending || eliminarFaseMutation.isPending,
    };
};