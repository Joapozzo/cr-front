import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { sancionesService } from '../services/sanciones.services';

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
        refetchOnMount: true,
        refetchOnReconnect: true,
        ...options,
    });
};
