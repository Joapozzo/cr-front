import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { equipoPlantelService } from '../services/equipoPlantel.services';
import { PlantelEquipo } from '../types/plantelEquipo';

export const equipoPlantelKeys = {
    all: ['equipoPlantel'] as const,
    plantel: (id_equipo: number, id_categoria_edicion?: number | null) => 
        [...equipoPlantelKeys.all, 'plantel', id_equipo, id_categoria_edicion ?? 'auto'] as const,
};

/**
 * Hook para obtener plantel del equipo
 * @param id_equipo - ID del equipo (requerido)
 * @param id_categoria_edicion - ID de la categoría edición (opcional). Si no se pasa, se usará la última categoría activa donde participa el equipo
 */
export const useEquipoPlantel = (
    id_equipo: number | null,
    id_categoria_edicion?: number | null,
    options?: Omit<UseQueryOptions<PlantelEquipo, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equipoPlantelKeys.plantel(id_equipo || 0, id_categoria_edicion),
        queryFn: () => equipoPlantelService.obtenerPlantelEquipo(id_equipo!, id_categoria_edicion ?? undefined),
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo, // Solo requiere id_equipo, id_categoria_edicion es opcional
        ...options,
    });
};

