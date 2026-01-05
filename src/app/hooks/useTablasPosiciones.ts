import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { tablasService, TablasPosicionesPorEquiposResponse } from '../services/posiciones.services';

// Query Keys para tablas de posiciones (rankings de equipos)
export const tablasPosicionesKeys = {
    all: ['tablas-posiciones'] as const,
    tablas: () => [...tablasPosicionesKeys.all, 'tablas'] as const,
    tablasPorEquipos: () => [...tablasPosicionesKeys.tablas(), 'por-equipos'] as const,
    tablasPorEquiposHome: (limitPosiciones?: number) => 
        [...tablasPosicionesKeys.tablasPorEquipos(), 'home', limitPosiciones] as const,
    tablasPorEquiposCompleta: (page?: number) => 
        [...tablasPosicionesKeys.tablasPorEquipos(), 'completa', page] as const,
};

// Mantener compatibilidad con código existente (exportar también como posicionesKeys)
export const posicionesKeys = tablasPosicionesKeys;

/**
 * Hook para obtener tablas de posiciones por equipos del usuario
 * (Rankings de equipos en las zonas)
 * @param limitPosiciones - Cantidad máxima de posiciones por tabla (para home: 6)
 * @param limitTablas - Cantidad máxima de tablas a retornar
 * @param page - Número de página para paginación
 * @param equiposIds - Array de IDs de equipos (opcional)
 * @param options - Opciones adicionales de useQuery
 */
export const useTablasPosicionesPorEquipos = (
    limitPosiciones?: number,
    limitTablas?: number,
    page?: number,
    equiposIds?: number[],
    options?: Omit<UseQueryOptions<TablasPosicionesPorEquiposResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: limitPosiciones === 6 
            ? tablasPosicionesKeys.tablasPorEquiposHome(limitPosiciones)
            : tablasPosicionesKeys.tablasPorEquiposCompleta(page),
        queryFn: () => tablasService.obtenerTablasPosicionesPorEquipos(
            limitPosiciones,
            limitTablas,
            page,
            equiposIds
        ),
        staleTime: 3 * 60 * 1000, // 3 minutos - las posiciones cambian menos frecuentemente
        gcTime: 10 * 60 * 1000, // 10 minutos - mantener en cache más tiempo
        retry: 2,
        refetchOnWindowFocus: false, // No refetch automático al volver a la ventana
        refetchOnMount: false, // Usar cache si los datos están frescos (dentro de staleTime)
        refetchOnReconnect: true, // Refetch al reconectar
        ...options,
    });
};

