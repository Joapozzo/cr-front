import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { canchasService } from '../services/canchas.services';
import { DisponibilidadCancha, CanchaDisponible, ConsultarDisponibilidadParams } from '../types/canchas';

// Query Keys para canchas
export const canchasKeys = {
    all: ['canchas'] as const,
    disponibilidad: (params: ConsultarDisponibilidadParams) => 
        [...canchasKeys.all, 'disponibilidad', params] as const,
    partidosPorCancha: (id_cancha: number, fecha: string) => 
        [...canchasKeys.all, 'partidos', id_cancha, fecha] as const,
};

/**
 * Hook para verificar disponibilidad de una cancha específica
 * @param fecha - Fecha en formato YYYY-MM-DD
 * @param hora_inicio - Hora en formato HH:MM
 * @param id_categoria_edicion - ID de la categoría edición
 * @param id_cancha - ID de la cancha
 * @param id_partido_excluir - ID del partido a excluir (opcional, útil al editar)
 * @param options - Opciones adicionales de useQuery
 */
export const useVerificarDisponibilidadCancha = (
    fecha: string | null,
    hora_inicio: string | null,
    id_categoria_edicion: number | null,
    id_cancha: number | null,
    id_partido_excluir?: number,
    options?: Omit<UseQueryOptions<DisponibilidadCancha, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: fecha && hora_inicio && id_categoria_edicion && id_cancha
            ? canchasKeys.disponibilidad({
                fecha,
                hora_inicio,
                id_categoria_edicion,
                id_cancha,
                ...(id_partido_excluir && { id_partido_excluir }),
            })
            : ['canchas', 'disponibilidad', 'disabled'],
        queryFn: () => canchasService.verificarDisponibilidadCancha(
            fecha!,
            hora_inicio!,
            id_categoria_edicion!,
            id_cancha!,
            id_partido_excluir
        ),
        enabled: !!fecha && !!hora_inicio && !!id_categoria_edicion && !!id_cancha,
        staleTime: 30 * 1000, // 30 segundos - los datos cambian frecuentemente
        gcTime: 60 * 1000, // 1 minuto
        retry: 1,
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook para obtener partidos por cancha y fecha
 * @param id_cancha - ID de la cancha
 * @param fecha - Fecha en formato YYYY-MM-DD
 * @param incluirPasados - Si incluir partidos pasados
 * @param options - Opciones adicionales de useQuery
 */
export const usePartidosPorCanchaYFecha = (
    id_cancha: number | null,
    fecha: string | null,
    incluirPasados: boolean = false,
    options?: Omit<UseQueryOptions<any[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: id_cancha && fecha
            ? canchasKeys.partidosPorCancha(id_cancha, fecha)
            : ['canchas', 'partidos', 'disabled'],
        queryFn: () => canchasService.obtenerPartidosPorCanchaYFecha(
            id_cancha!,
            fecha!,
            incluirPasados
        ),
        enabled: !!id_cancha && !!fecha,
        staleTime: 30 * 1000, // 30 segundos
        gcTime: 60 * 1000, // 1 minuto
        retry: 1,
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook para obtener canchas disponibles
 * @param fecha - Fecha en formato YYYY-MM-DD
 * @param hora_inicio - Hora en formato HH:MM
 * @param id_categoria_edicion - ID de la categoría edición
 * @param id_predio - ID del predio (opcional)
 * @param options - Opciones adicionales de useQuery
 */
export const useCanchasDisponibles = (
    fecha: string | null,
    hora_inicio: string | null,
    id_categoria_edicion: number | null,
    id_predio?: number | null,
    options?: Omit<UseQueryOptions<CanchaDisponible[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: fecha && hora_inicio && id_categoria_edicion
            ? canchasKeys.disponibilidad({
                fecha,
                hora_inicio,
                id_categoria_edicion,
                ...(id_predio && { id_predio }),
            })
            : ['canchas', 'disponibles', 'disabled'],
        queryFn: () => canchasService.obtenerCanchasDisponibles(
            fecha!,
            hora_inicio!,
            id_categoria_edicion!,
            id_predio || undefined
        ),
        enabled: !!fecha && !!hora_inicio && !!id_categoria_edicion,
        staleTime: 30 * 1000, // 30 segundos
        gcTime: 60 * 1000, // 1 minuto
        retry: 1,
        refetchOnWindowFocus: false,
        ...options,
    });
};
