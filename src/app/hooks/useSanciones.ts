import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { sancionesService } from '../services/sanciones.services';
import { Sancion, SancionesResponse, SancionResponse, CrearSancionInput, EditarSancionInput } from '../types/sancion';

// Tipos para sanciones
export interface ISancion {
    id: number;
    id_jugador: number;
    nombre_jugador: string;
    apellido_jugador: string;
    foto_jugador?: string | null;
    uid_jugador?: string | null; // Para identificar si es el usuario actual
    id_equipo: number;
    nombre_equipo: string;
    categoria_edicion: string;
    articulo: string;
    fechas_cumplidas: number;
    fechas_totales: number;
    tipo_falta: 'AMARILLA' | 'ROJA' | 'SUSPENSION';
}

export interface SancionesActivasResponse {
    sanciones: ISancion[];
    total: number;
    limit: number | null;
    offset: number;
}

// Query Keys para sanciones
export const sancionesKeys = {
    all: ['sanciones'] as const,
    activas: () => [...sancionesKeys.all, 'activas'] as const,
    activasHome: (limit?: number) => [...sancionesKeys.activas(), 'home', limit] as const,
    activasCompleta: (id_categoria_edicion?: number, page?: number) => 
        [...sancionesKeys.activas(), 'completa', id_categoria_edicion, page] as const,
    // Admin keys
    admin: () => [...sancionesKeys.all, 'admin'] as const,
    adminPorCategoria: (id_categoria_edicion: number, estado?: string) => 
        [...sancionesKeys.admin(), 'categoria', id_categoria_edicion, estado] as const,
    adminDetail: (id_expulsion: number) => [...sancionesKeys.admin(), 'detail', id_expulsion] as const,
    adminJugador: (id_jugador: number, id_categoria_edicion: number) => 
        [...sancionesKeys.admin(), 'jugador', id_jugador, id_categoria_edicion] as const,
};

/**
 * Hook para obtener sanciones activas del usuario
 * @param id_categoria_edicion - Opcional, filtrar por categoría edición
 * @param limit - Cantidad máxima de sanciones (para home: 5)
 * @param page - Número de página para paginación
 * @param options - Opciones adicionales de useQuery
 */
export const useSancionesActivasUsuario = (
    id_categoria_edicion?: number,
    limit?: number,
    page?: number,
    options?: Omit<UseQueryOptions<SancionesActivasResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: limit === 5 
            ? sancionesKeys.activasHome(limit)
            : sancionesKeys.activasCompleta(id_categoria_edicion, page),
        queryFn: () => sancionesService.obtenerSancionesActivasUsuario(
            id_categoria_edicion,
            limit,
            page
        ),
        staleTime: 3 * 60 * 1000, // 3 minutos - las sanciones cambian menos frecuentemente
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Usar cache si los datos están frescos (dentro de staleTime)
        refetchOnReconnect: true,
        ...options,
    });
};

// ==================== HOOKS DE ADMINISTRACIÓN ====================

/**
 * Hook para obtener sanciones por categoría (admin)
 */
export const useSancionesPorCategoria = (
    id_categoria_edicion: number,
    estado?: string,
    options?: Omit<UseQueryOptions<SancionesResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: sancionesKeys.adminPorCategoria(id_categoria_edicion, estado),
        queryFn: () => sancionesService.obtenerSancionesPorCategoria(id_categoria_edicion, estado),
        enabled: id_categoria_edicion > 0, // Solo hacer fetch si hay categoría seleccionada
        staleTime: 1 * 60 * 1000, // 1 minuto - las sanciones admin cambian frecuentemente
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        ...options,
    });
};

/**
 * Hook para obtener una sanción por ID (admin)
 */
export const useSancionPorId = (
    id_expulsion: number,
    options?: Omit<UseQueryOptions<SancionResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: sancionesKeys.adminDetail(id_expulsion),
        queryFn: () => sancionesService.obtenerSancionPorId(id_expulsion),
        enabled: id_expulsion > 0,
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook para crear una sanción
 */
export const useCrearSancion = (
    options?: UseMutationOptions<SancionResponse, Error, CrearSancionInput>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CrearSancionInput) => sancionesService.crearSancion(data),
        onSuccess: (data, variables) => {
            // Invalidar queries de sanciones por categoría
            queryClient.invalidateQueries({
                queryKey: sancionesKeys.adminPorCategoria(variables.id_categoria_edicion),
                exact: false,
            });
            // Invalidar todas las queries de admin
            queryClient.invalidateQueries({
                queryKey: sancionesKeys.admin(),
                exact: false,
            });
            // Invalidar queries de sanciones activas del usuario
            queryClient.invalidateQueries({
                queryKey: sancionesKeys.activas(),
                exact: false,
            });
            // Invalidar queries del jugador específico
            if (variables.id_jugador) {
                queryClient.invalidateQueries({
                    queryKey: sancionesKeys.adminJugador(variables.id_jugador, variables.id_categoria_edicion),
                });
            }
        },
        ...options,
    });
};

/**
 * Hook para editar una sanción
 */
export const useEditarSancion = (
    options?: UseMutationOptions<SancionResponse, Error, { id_expulsion: number; data: EditarSancionInput }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_expulsion, data }: { id_expulsion: number; data: EditarSancionInput }) =>
            sancionesService.editarSancion(id_expulsion, data),
        onSuccess: (data, variables) => {
            // Invalidar la query específica de la sanción
            queryClient.invalidateQueries({
                queryKey: sancionesKeys.adminDetail(variables.id_expulsion),
            });
            // Invalidar todas las queries de admin (por si cambió la categoría)
            queryClient.invalidateQueries({
                queryKey: sancionesKeys.admin(),
                exact: false,
            });
            // Invalidar queries de sanciones activas del usuario
            queryClient.invalidateQueries({
                queryKey: sancionesKeys.activas(),
                exact: false,
            });
            // Si la sanción tiene jugador, invalidar sus queries
            if (data.data.id_jugador) {
                queryClient.invalidateQueries({
                    queryKey: sancionesKeys.adminJugador(data.data.id_jugador, 0),
                    exact: false,
                });
            }
        },
        ...options,
    });
};

/**
 * Hook para eliminar (revocar) una sanción
 */
export const useEliminarSancion = (
    options?: UseMutationOptions<SancionResponse, Error, number>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id_expulsion: number) => sancionesService.eliminarSancion(id_expulsion),
        onSuccess: (data, id_expulsion) => {
            // Invalidar todas las queries de admin
            queryClient.invalidateQueries({
                queryKey: sancionesKeys.admin(),
                exact: false,
            });
            // Invalidar queries de sanciones activas del usuario
            queryClient.invalidateQueries({
                queryKey: sancionesKeys.activas(),
                exact: false,
            });
            // Remover la query específica de la sanción del cache
            queryClient.removeQueries({
                queryKey: sancionesKeys.adminDetail(id_expulsion),
            });
            // Si la sanción tiene jugador, invalidar sus queries
            if (data.data.id_jugador) {
                queryClient.invalidateQueries({
                    queryKey: sancionesKeys.adminJugador(data.data.id_jugador, 0),
                    exact: false,
                });
            }
        },
        ...options,
    });
};

/**
 * Hook para verificar si un jugador está sancionado
 */
export const useVerificarJugadorSancionado = (
    id_jugador: number,
    id_categoria_edicion: number,
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: [...sancionesKeys.admin(), 'verificar', id_jugador, id_categoria_edicion],
        queryFn: () => sancionesService.verificarJugadorSancionado(id_jugador, id_categoria_edicion),
        enabled: id_jugador > 0 && id_categoria_edicion > 0,
        staleTime: 1 * 60 * 1000, // 1 minuto
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook para obtener sanciones activas de un jugador
 */
export const useSancionesActivasJugador = (
    id_jugador: number,
    id_categoria_edicion: number,
    options?: Omit<UseQueryOptions<SancionesResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: sancionesKeys.adminJugador(id_jugador, id_categoria_edicion),
        queryFn: () => sancionesService.obtenerSancionesActivasJugador(id_jugador, id_categoria_edicion),
        enabled: id_jugador > 0 && id_categoria_edicion > 0,
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};
