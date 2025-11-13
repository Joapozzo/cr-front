import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sancionesService } from '../services/sanciones.services';
import { CrearSancionInput, EditarSancionInput } from '../types/sancion';

/**
 * Hook para obtener sanciones por categoría edición
 */
export const useSancionesPorCategoria = (id_categoria_edicion: number, estado?: string) => {
    return useQuery({
        queryKey: ['sanciones', id_categoria_edicion, estado],
        queryFn: () => sancionesService.obtenerSancionesPorCategoria(id_categoria_edicion, estado),
        enabled: !!id_categoria_edicion,
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 5 * 60 * 1000, // 5 minutos
    });
};

/**
 * Hook para obtener una sanción por ID
 */
export const useSancionPorId = (id_expulsion: number) => {
    return useQuery({
        queryKey: ['sancion', id_expulsion],
        queryFn: () => sancionesService.obtenerSancionPorId(id_expulsion),
        enabled: !!id_expulsion,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
};

/**
 * Hook para verificar si un jugador está sancionado
 */
export const useVerificarJugadorSancionado = (
    id_jugador: number,
    id_categoria_edicion: number
) => {
    return useQuery({
        queryKey: ['verificar-sancion', id_jugador, id_categoria_edicion],
        queryFn: () => sancionesService.verificarJugadorSancionado(id_jugador, id_categoria_edicion),
        enabled: !!id_jugador && !!id_categoria_edicion,
        staleTime: 1 * 60 * 1000,
        gcTime: 3 * 60 * 1000,
    });
};

/**
 * Hook para obtener sanciones activas de un jugador
 */
export const useSancionesActivasJugador = (
    id_jugador: number,
    id_categoria_edicion: number
) => {
    return useQuery({
        queryKey: ['sanciones-activas', id_jugador, id_categoria_edicion],
        queryFn: () => sancionesService.obtenerSancionesActivasJugador(id_jugador, id_categoria_edicion),
        enabled: !!id_jugador && !!id_categoria_edicion,
        staleTime: 1 * 60 * 1000,
        gcTime: 3 * 60 * 1000,
    });
};

/**
 * Hook para crear una sanción
 */
export const useCrearSancion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CrearSancionInput) => sancionesService.crearSancion(data),
        onSuccess: () => {
            // Invalidar todas las queries de sanciones para refrescar los datos
            queryClient.invalidateQueries({ queryKey: ['sanciones'] });
            queryClient.invalidateQueries({ queryKey: ['verificar-sancion'] });
            queryClient.invalidateQueries({ queryKey: ['sanciones-activas'] });
        },
    });
};

/**
 * Hook para editar una sanción
 */
export const useEditarSancion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_expulsion, data }: { id_expulsion: number; data: EditarSancionInput }) =>
            sancionesService.editarSancion(id_expulsion, data),
        onSuccess: (_, variables) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ['sanciones'] });
            queryClient.invalidateQueries({ queryKey: ['sancion', variables.id_expulsion] });
            queryClient.invalidateQueries({ queryKey: ['verificar-sancion'] });
            queryClient.invalidateQueries({ queryKey: ['sanciones-activas'] });
        },
    });
};

/**
 * Hook para eliminar (revocar) una sanción
 */
export const useEliminarSancion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id_expulsion: number) => sancionesService.eliminarSancion(id_expulsion),
        onSuccess: () => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ['sanciones'] });
            queryClient.invalidateQueries({ queryKey: ['verificar-sancion'] });
            queryClient.invalidateQueries({ queryKey: ['sanciones-activas'] });
        },
    });
};
