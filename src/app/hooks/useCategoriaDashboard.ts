import { useQuery } from '@tanstack/react-query';
import { categoriasService } from '../services/categorias.services';

// 1. Hook para stats generales de la categoría
export const useStatsCategoria = (id_categoria_edicion: number) => {
    return useQuery({
        queryKey: ['categoria-stats', id_categoria_edicion],
        queryFn: () => categoriasService.obtenerStatsCategoria(id_categoria_edicion),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        enabled: !!id_categoria_edicion,
    });
};

// 2. Hook para tabla de posiciones por zona
export const usePosicionesZonaCategoria = (id_zona: number, id_categoria_edicion: number) => {
    return useQuery({
        queryKey: ['categoria-posiciones', id_zona, id_categoria_edicion],
        queryFn: () => categoriasService.obtenerPosicionesZonaCategoria(id_zona, id_categoria_edicion),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 10 * 60 * 1000,
        enabled: !!id_zona && !!id_categoria_edicion,
    });
};

// 3. Hook para goleadores de la categoría
export const useGoleadoresCategoria = (
    id_categoria_edicion: number,
    page = 1,
    limit = 5
) => {
    return useQuery({
        queryKey: ['categoria-goleadores', id_categoria_edicion, page, limit],
        queryFn: () => categoriasService.obtenerGoleadoresCategoria(
            id_categoria_edicion,
            page,
            limit
        ),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000,
        enabled: !!id_categoria_edicion,
    });
};

// 4. Hook para expulsados de la categoría
export const useExpulsadosCategoria = (
    id_categoria_edicion: number,
    page = 1,
    limit = 5
) => {
    return useQuery({
        queryKey: ['categoria-expulsados', id_categoria_edicion, page, limit],
        queryFn: () => categoriasService.obtenerExpulsadosCategoria(
            id_categoria_edicion,
            page,
            limit
        ),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000,
        enabled: !!id_categoria_edicion,
    });
};

export const useZonasPlayoffCategoria = (id_categoria_edicion: number) => {
    return useQuery({
        queryKey: ['categoria-zonas-playoff', id_categoria_edicion],
        queryFn: () => categoriasService.obtenerZonasPlayoffCategoria(id_categoria_edicion),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000,
        enabled: !!id_categoria_edicion,
    });
};

export const useEstadisticasCategoriaEdicion = (id_categoria_edicion: number) => {
    return useQuery({
        queryKey: ['categoria-estadisticas', id_categoria_edicion],
        queryFn: () => categoriasService.obtenerEstadisticasCategoriaEdicion(id_categoria_edicion),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000,
        enabled: !!id_categoria_edicion,
    });
};

export const useProximosPartidos = (id_categoria_edicion: number) => {
    return useQuery({
        queryKey: ['categoria-proximos-partidos', id_categoria_edicion],
        queryFn: () => categoriasService.obtenerProximosPartidos(id_categoria_edicion),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000,
        enabled: !!id_categoria_edicion,
    });
};

export const useUltimosPartidosJugados = (id_categoria_edicion: number) => {
    return useQuery({
        queryKey: ['categoria-ultimos-partidos', id_categoria_edicion],
        queryFn: () => categoriasService.obtenerUltimosPartidosJugados(id_categoria_edicion),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000,
        enabled: !!id_categoria_edicion,
    });
};
