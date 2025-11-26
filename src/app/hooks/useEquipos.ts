import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { equiposService } from '../services/equipos.services';
import { EquipoActual, Equipo, EquiposPorCategoriaResponse, EquipoExpulsadoResponse, ActualizarEquipoInput, EquipoDisponible } from '../types/equipo';

export const equiposKeys = {
    all: ['equipos'] as const,
    actuales: () => [...equiposKeys.all, 'actuales'] as const,
    todos: () => [...equiposKeys.all, 'todos'] as const,
    details: () => [...equiposKeys.all, 'detail'] as const,
    detail: (id: number) => [...equiposKeys.details(), id] as const,
    plantel: (id_equipo: number, id_categoria_edicion: number) => [...equiposKeys.detail(id_equipo), 'plantel', id_categoria_edicion] as const, // Nueva key
    porCategoriaEdicion: (id_categoria_edicion: number) => [...equiposKeys.all, 'categoria-edicion', id_categoria_edicion] as const,
    buscarDisponibles: (query: string, id_edicion: number) => [...equiposKeys.all, 'buscar', query, id_edicion] as const,
    buscarJugadores: (query: string) => ['jugadores', 'buscar', query] as const,
    equiposInactivosPorCategoria: (id_categoria_edicion: number) => [...equiposKeys.all, 'inactivos', 'categoria-edicion', id_categoria_edicion] as const,
};

export const useEquiposActuales = (
    options?: Omit<UseQueryOptions<EquipoActual[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposKeys.actuales(),
        queryFn: equiposService.obtenerEquiposActuales,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const useTodosLosEquipos = (
    options?: Omit<UseQueryOptions<Equipo[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposKeys.todos(),
        queryFn: equiposService.obtenerTodosLosEquipos,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const useEquipoPorId = (
    id: number,
    options?: Omit<UseQueryOptions<Equipo, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposKeys.detail(id),
        queryFn: () => equiposService.obtenerEquipoPorId(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const useEquiposPorCategoriaEdicion = (
    id_categoria_edicion: number,
    options?: Omit<UseQueryOptions<EquiposPorCategoriaResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposKeys.porCategoriaEdicion(id_categoria_edicion),
        queryFn: () => equiposService.obtenerEquiposPorCategoriaEdicion(id_categoria_edicion),
        enabled: !!id_categoria_edicion,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

type EquiposType = 'actuales' | 'todos';

export const useEquipos = <T extends EquiposType>(
    type: T,
    options?: Omit<
        UseQueryOptions<
            T extends 'actuales' ? EquipoActual[] : Equipo[],
            Error
        >,
        'queryKey' | 'queryFn'
    >
) => {
    const queryConfig = {
        actuales: {
            queryKey: equiposKeys.actuales(),
            queryFn: equiposService.obtenerEquiposActuales,
        },
        todos: {
            queryKey: equiposKeys.todos(),
            queryFn: equiposService.obtenerTodosLosEquipos,
        },
    };

    return useQuery({
        ...queryConfig[type],
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    } as any);
};

export const useCrearEquipo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { nombre: string; id_categoria_edicion: number; }) =>
            equiposService.crearEquipo(data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: equiposKeys.all });
        },
        onError: (error) => {
            console.error('❌ Error al crear equipo:', error);
        },
    });
};

export const useActualizarEquipo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_equipo, data }: { id_equipo: number; data: ActualizarEquipoInput }) =>
            equiposService.actualizarEquipo(id_equipo, data),
        onSuccess: (response, variables) => {
            // Invalidar queries relacionadas con el equipo
            queryClient.invalidateQueries({ queryKey: equiposKeys.detail(variables.id_equipo) });
            queryClient.invalidateQueries({ queryKey: equiposKeys.all });
        },
        onError: (error) => {
            console.error('❌ Error al actualizar equipo:', error);
        },
    });
};

export const useBuscarEquiposDisponibles = (
    query: string,
    id_edicion: number,
    limit: number = 10,
    options?: Omit<UseQueryOptions<{ equipos: EquipoDisponible[]; total: number }, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposKeys.buscarDisponibles(query, id_edicion),
        queryFn: () => equiposService.buscarEquiposDisponibles(query, id_edicion, limit),
        enabled: !!query && query.trim().length >= 2 && !!id_edicion,
        staleTime: 30 * 1000, // 30 segundos (más corto para búsquedas)
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 1, // Solo 1 retry para búsquedas
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const useBuscarEquiposEdicionDisponibles = (
    query: string,
    id_edicion: number,
    limit: number = 10,
    options?: Omit<UseQueryOptions<{ equipos: Equipo[]; total: number }, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposKeys.buscarDisponibles(query, id_edicion),
        queryFn: () => equiposService.buscarEquiposEdicionDisponibles(query, id_edicion, limit),
        enabled: !!query && query.trim().length >= 2 && !!id_edicion,
        staleTime: 30 * 1000, // 30 segundos (más corto para búsquedas)
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 1, // Solo 1 retry para búsquedas
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const useEquipoConPlantel = (
    id_equipo: number,
    id_categoria_edicion: number,
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: [...equiposKeys.detail(id_equipo), 'plantel', id_categoria_edicion],
        queryFn: () => equiposService.obtenerEquipoConPlantel(id_equipo, id_categoria_edicion),
        enabled: !!id_equipo && !!id_categoria_edicion,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const useAgregarJugadorAlPlantel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_equipo, id_categoria_edicion, id_jugador }: {
            id_equipo: number;
            id_categoria_edicion: number;
            id_jugador: number;
        }) => equiposService.agregarJugadorAlPlantel(id_equipo, id_categoria_edicion, id_jugador),
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas con el plantel
            queryClient.invalidateQueries({
                queryKey: equiposKeys.plantel(variables.id_equipo, variables.id_categoria_edicion)
            });
            queryClient.invalidateQueries({
                queryKey: equiposKeys.porCategoriaEdicion(variables.id_categoria_edicion)
            });
        },
        onError: (error) => {
            console.error('Error al agregar jugador al plantel:', error);
        },
    });
};

export const useAgregarJugadorYAsignarCapitan = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_equipo, id_categoria_edicion, id_jugador }: {
            id_equipo: number;
            id_categoria_edicion: number;
            id_jugador: number;
        }) => equiposService.agregarJugadorYAsignarCapitan(id_equipo, id_categoria_edicion, id_jugador),
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas con el plantel y capitanes
            queryClient.invalidateQueries({
                queryKey: equiposKeys.plantel(variables.id_equipo, variables.id_categoria_edicion)
            });
            queryClient.invalidateQueries({
                queryKey: equiposKeys.porCategoriaEdicion(variables.id_categoria_edicion)
            });
        },
        onError: (error) => {
            console.error('Error al agregar jugador y asignar como capitán:', error);
        },
    });
};

export const useAsignarCapitan = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_equipo, id_categoria_edicion, id_jugador }: {
            id_equipo: number;
            id_categoria_edicion: number;
            id_jugador: number;
        }) => equiposService.asignarCapitan(id_equipo, id_categoria_edicion, id_jugador),
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas con el plantel
            queryClient.invalidateQueries({
                queryKey: equiposKeys.plantel(variables.id_equipo, variables.id_categoria_edicion)
            });
        },
        onError: (error) => {
            console.error('Error al asignar capitán:', error);
        },
    });
};

export const useDesactivarCapitan = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_equipo, id_categoria_edicion, id_jugador }: {
            id_equipo: number;
            id_categoria_edicion: number;
            id_jugador: number;
        }) => equiposService.desactivarCapitan(id_equipo, id_categoria_edicion, id_jugador),
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas con el plantel
            queryClient.invalidateQueries({
                queryKey: equiposKeys.plantel(variables.id_equipo, variables.id_categoria_edicion)
            });
        },
        onError: (error) => {
            console.error('Error al desactivar capitán:', error);
        },
    });
};

export const useBuscarJugadores = (
    query: string,
    limit: number = 10,
    options?: Omit<UseQueryOptions<{ jugadores: any[]; total: number }, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposKeys.buscarJugadores(query),
        queryFn: () => equiposService.buscarJugadores(query, limit),
        enabled: !!query && query.trim().length >= 2,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const useExpulsarEquipo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ 
            id_equipo, 
            id_categoria_edicion, 
            motivo 
        }: {
            id_equipo: number;
            id_categoria_edicion: number;
            motivo?: string;
        }) => equiposService.expulsarEquipo(id_equipo, id_categoria_edicion, motivo),
        onSuccess: (_data, variables) => {
            // Invalidar queries relacionadas para refrescar los datos
            queryClient.invalidateQueries({
                queryKey: equiposKeys.porCategoriaEdicion(variables.id_categoria_edicion)
            });
            queryClient.invalidateQueries({
                queryKey: equiposKeys.equiposInactivosPorCategoria(variables.id_categoria_edicion) // AGREGAR ESTA LÍNEA
            });
            queryClient.invalidateQueries({
                queryKey: equiposKeys.actuales()
            });
            queryClient.invalidateQueries({
                queryKey: equiposKeys.todos()
            });
        },
        onError: (error) => {
            console.error('Error al expulsar equipo:', error);
        },
    });
};

export const useReactivarEquipo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ 
            id_equipo, 
            id_categoria_edicion 
        }: {
            id_equipo: number;
            id_categoria_edicion: number;
        }) => equiposService.reactivarEquipo(id_equipo, id_categoria_edicion),
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas para refrescar los datos
            queryClient.invalidateQueries({
                queryKey: equiposKeys.porCategoriaEdicion(variables.id_categoria_edicion)
            });
            queryClient.invalidateQueries({
                queryKey: equiposKeys.equiposInactivosPorCategoria(variables.id_categoria_edicion) // AGREGAR ESTA LÍNEA
            });
            queryClient.invalidateQueries({
                queryKey: equiposKeys.actuales()
            });
            queryClient.invalidateQueries({
                queryKey: equiposKeys.todos()
            });
        },
        onError: (error) => {
            console.error('Error al reactivar equipo:', error);
        },
    });
};

export const useEquiposInactivosPorCategoriaEdicion = (
    id_categoria_edicion: number,
    options?: Omit<UseQueryOptions<EquipoExpulsadoResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equiposKeys.equiposInactivosPorCategoria(id_categoria_edicion),
        queryFn: () => equiposService.obtenerEquiposInactivosPorCategoriaEdicion(id_categoria_edicion),
        enabled: !!id_categoria_edicion,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};