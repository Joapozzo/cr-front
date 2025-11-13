import { useQuery } from '@tanstack/react-query';
import { equiposService } from '../services/equipos.services';

export const useEstadisticasJugadoresPlantel = (
    id_equipo: number,
    id_categoria_edicion: number,
    enabled: boolean = true
) => {
    return useQuery({
        queryKey: ['estadisticas-plantel', id_equipo, id_categoria_edicion],
        queryFn: () => equiposService.obtenerEstadisticasJugadoresPlantel(id_equipo, id_categoria_edicion),
        enabled: enabled && !!id_equipo && !!id_categoria_edicion,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
        retry: 2,
        refetchOnWindowFocus: false,
    });
};