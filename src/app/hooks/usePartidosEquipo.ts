import { useQuery } from '@tanstack/react-query';
import { equiposService } from '../services/equipos.services'; 

export const useUltimoYProximoPartido = (
    id_equipo: number,
    id_categoria_edicion: number
) => {
    return useQuery({
        queryKey: ['ultimo-proximo-partido', id_equipo, id_categoria_edicion],
        queryFn: () => equiposService.obtenerUltimoyProximoPartido(id_equipo, id_categoria_edicion),
        staleTime: 1000 * 60 * 5,
    });
};