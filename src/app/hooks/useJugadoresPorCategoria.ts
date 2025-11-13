import { useQuery } from '@tanstack/react-query';
import { jugadorService } from '../services/jugador.services';

export const jugadoresCategoriaKeys = {
    all: ['jugadores', 'categoria'] as const,
    buscar: (id_categoria_edicion: number, query: string) =>
        [...jugadoresCategoriaKeys.all, 'buscar', id_categoria_edicion, query] as const,
};

interface UseJugadoresPorCategoriaOptions {
    id_categoria_edicion: number;
    query: string;
    limit?: number;
    enabled?: boolean;
}

export const useJugadoresPorCategoria = ({
    id_categoria_edicion,
    query,
    limit = 10,
    enabled = true,
}: UseJugadoresPorCategoriaOptions) => {
    return useQuery({
        queryKey: jugadoresCategoriaKeys.buscar(id_categoria_edicion, query),
        queryFn: () =>
            jugadorService.buscarJugadoresPorNombreEnCategoria(
                query,
                id_categoria_edicion,
                limit
            ),
        enabled: enabled && !!id_categoria_edicion && query.length >= 2,
        staleTime: 30 * 1000, // 30 segundos
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 1,
    });
};
