import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { equipoResumenService } from '../services/equipoResumen.services';
import { EquipoResumen } from '../types/equipoResumen';

export const equipoResumenKeys = {
    all: ['equipoResumen'] as const,
    resumen: (id_equipo: number, id_categoria_edicion?: number | null) => 
        [...equipoResumenKeys.all, 'resumen', id_equipo, id_categoria_edicion ?? 'auto'] as const,
};

/**
 * Hook para obtener resumen del equipo
 * @param id_equipo - ID del equipo (requerido)
 * @param id_categoria_edicion - ID de la categoría edición (opcional). Si no se pasa, se usará la última categoría activa donde participa el equipo
 */
export const useEquipoResumen = (
    id_equipo: number | null,
    id_categoria_edicion?: number | null,
    options?: Omit<UseQueryOptions<EquipoResumen, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equipoResumenKeys.resumen(id_equipo || 0, id_categoria_edicion),
        queryFn: () => equipoResumenService.obtenerResumenEquipo(id_equipo!, id_categoria_edicion ?? undefined),
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo, // Solo requiere id_equipo, id_categoria_edicion es opcional
        ...options,
    });
};

