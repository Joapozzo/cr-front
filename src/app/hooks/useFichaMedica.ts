import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import fichaMedicaService, { FichaMedica, SubirFichaMedicaInput, CambiarEstadoFichaMedicaInput } from '../services/fichaMedica.service';
import toast from 'react-hot-toast';

export const fichaMedicaKeys = {
    all: ['fichas-medicas'] as const,
    jugador: (id_jugador: number) => [...fichaMedicaKeys.all, 'jugador', id_jugador] as const,
};

/**
 * Hook para obtener ficha médica de un jugador
 */
export const useFichaMedicaJugador = (
    id_jugador: number,
    options?: Omit<UseQueryOptions<FichaMedica | null, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: fichaMedicaKeys.jugador(id_jugador),
        queryFn: () => fichaMedicaService.obtenerFichaMedicaJugador(id_jugador),
        enabled: !!id_jugador,
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook para subir/actualizar ficha médica
 */
export const useSubirFichaMedica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: SubirFichaMedicaInput) => fichaMedicaService.subirFichaMedica(input),
        onSuccess: (data, variables) => {
            // Invalidar cache de la ficha médica del jugador
            queryClient.invalidateQueries({
                queryKey: fichaMedicaKeys.jugador(variables.id_jugador),
            });
            // Invalidar cache del plantel si existe
            queryClient.invalidateQueries({
                queryKey: ['equipos', 'detail'],
            });
            // Invalidar cache de legajos
            queryClient.invalidateQueries({
                queryKey: ['legajos', 'jugador', variables.id_jugador],
            });
            toast.success('Ficha médica subida exitosamente');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al subir la ficha médica');
        },
    });
};

/**
 * Hook para cambiar estado de ficha médica (admin)
 */
export const useCambiarEstadoFichaMedica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CambiarEstadoFichaMedicaInput) => 
            fichaMedicaService.cambiarEstadoFichaMedica(input),
        onSuccess: async (data) => {
            // Invalidar cache de la ficha médica del jugador
            queryClient.invalidateQueries({
                queryKey: fichaMedicaKeys.jugador(data.id_jugador),
            });
            // Invalidar cache del plantel si existe
            queryClient.invalidateQueries({
                queryKey: ['equipos', 'detail'],
            });
            // Invalidar cache de legajos
            queryClient.invalidateQueries({
                queryKey: ['legajos', 'jugador', data.id_jugador],
            });
            toast.success('Estado de ficha médica actualizado exitosamente');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al cambiar el estado de la ficha médica');
        },
    });
};

/**
 * Hook para subir ficha médica manualmente (admin)
 */
export const useSubirFichaMedicaAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: SubirFichaMedicaInput) => fichaMedicaService.subirFichaMedicaAdmin(input),
        onSuccess: (data, variables) => {
            // Invalidar cache de la ficha médica del jugador
            queryClient.invalidateQueries({
                queryKey: fichaMedicaKeys.jugador(variables.id_jugador),
            });
            // Invalidar cache del plantel si existe
            queryClient.invalidateQueries({
                queryKey: ['equipos', 'detail'],
            });
            // Invalidar cache de legajos
            queryClient.invalidateQueries({
                queryKey: ['legajos', 'jugador', variables.id_jugador],
            });
            toast.success('Ficha médica subida exitosamente');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al subir la ficha médica');
        },
    });
};

