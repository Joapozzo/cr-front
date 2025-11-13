    import { useQuery } from '@tanstack/react-query';
import { jugadorService } from '../services/jugador.services';
import { SearchJugadoresResponse } from '@/app/types/jugador';

interface UseSearchJugadoresJornadaParams {
    query: string;
    id_categoria_edicion: number;
    jornada: number;
    limit?: number;
    enabled?: boolean;
}

export const useSearchJugadoresJornada = ({
    query,
    id_categoria_edicion,
    jornada,
    limit = 10,
    enabled = true
}: UseSearchJugadoresJornadaParams) => {
    return useQuery<SearchJugadoresResponse, Error>({
        queryKey: [
            'searchJugadoresJornada',
            id_categoria_edicion,
            jornada,
            query,
            limit
        ],
        queryFn: () =>
            jugadorService.buscarJugadoresPorNombreEnJornada(
                query,
                id_categoria_edicion,
                jornada,
                limit
            ),
        enabled:
            enabled &&
            !!query &&
            query.trim().length > 0 &&
            !!id_categoria_edicion &&
            !!jornada,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        // Debounce implícito: solo ejecuta cuando enabled es true y hay query válido
    });
};