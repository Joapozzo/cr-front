import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { tablasService, TablaZona } from '../services/posiciones.services';
import { EquipoPosicion } from '../types/posiciones';

export const tablasKeys = {
    all: ['tablas'] as const,
    tabla: (id_categoria_edicion: number, id_zona: number) =>
        [...tablasKeys.all, 'tabla', id_categoria_edicion, id_zona] as const,
    todasZonas: (id_categoria_edicion: number) =>
        [...tablasKeys.all, 'todas-zonas', id_categoria_edicion] as const,
};

/**
 * Hook para obtener tabla de posiciones de una zona específica
 */
export const useTablaPosiciones = (
    id_categoria_edicion: number,
    id_zona: number,
    options?: Omit<UseQueryOptions<EquipoPosicion[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: tablasKeys.tabla(id_categoria_edicion, id_zona),
        queryFn: () => tablasService.obtenerTablaPosiciones(id_categoria_edicion, id_zona),
        enabled: !!id_categoria_edicion && !!id_zona,
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Usar cache si los datos están frescos
        ...options,
    });
};

/**
 * Hook para obtener tablas de todas las zonas de una categoría-edición
 */
export const useTablasTodasLasZonas = (
    id_categoria_edicion: number,
    options?: Omit<UseQueryOptions<{ [zona_id: string]: TablaZona }, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: tablasKeys.todasZonas(id_categoria_edicion),
        queryFn: () => tablasService.obtenerTablasTodasLasZonas(id_categoria_edicion),
        enabled: !!id_categoria_edicion,
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Usar cache si los datos están frescos
        ...options,
    });
};

/**
 * Hook unificado para tablas
 */
type TablasType = 'zona-especifica' | 'todas-zonas';

export const useTablas = <T extends TablasType>(
    type: T,
    id_categoria_edicion: number,
    id_zona?: number,
    options?: Omit<
        UseQueryOptions<
            T extends 'zona-especifica' ? EquipoPosicion[] : { [zona_id: string]: TablaZona },
            Error
        >,
        'queryKey' | 'queryFn'
    >
) => {
    const queryConfig = {
        'zona-especifica': {
            queryKey: tablasKeys.tabla(id_categoria_edicion, id_zona!),
            queryFn: () => tablasService.obtenerTablaPosiciones(id_categoria_edicion, id_zona!),
            enabled: !!id_categoria_edicion && !!id_zona,
        },
        'todas-zonas': {
            queryKey: tablasKeys.todasZonas(id_categoria_edicion),
            queryFn: () => tablasService.obtenerTablasTodasLasZonas(id_categoria_edicion),
            enabled: !!id_categoria_edicion,
        },
    };

    return useQuery({
        ...queryConfig[type],
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Usar cache si los datos están frescos
        ...options,
    } as any);
};