import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { jugadorService } from '../services/jugador.services';
import { JugadorDestacadoDt } from '../types/jugador';

export const jugadoresKeys = {
    all: ['jugadores'] as const,
    destacados: (id_categoria_edicion: number, jornada: number) =>
        [...jugadoresKeys.all, 'destacados', id_categoria_edicion, jornada] as const,
    destacadosPorPosicion: (id_categoria_edicion: number, jornada: number, id_posicion: number) =>
        [...jugadoresKeys.destacados(id_categoria_edicion, jornada), 'posicion', id_posicion] as const,
};

interface UseJugadoresDestacadosOptions {
    id_categoria_edicion: number;
    jornada: number;
    id_posicion?: number;
    enabled?: boolean;
}

export const useJugadoresDestacados = (
    options: UseJugadoresDestacadosOptions,
    queryOptions?: Omit<UseQueryOptions<JugadorDestacadoDt[], Error>, 'queryKey' | 'queryFn'>
) => {
    const { id_categoria_edicion, jornada, id_posicion, enabled = true } = options;

    const queryKey = id_posicion
        ? jugadoresKeys.destacadosPorPosicion(id_categoria_edicion, jornada, id_posicion)
        : jugadoresKeys.destacados(id_categoria_edicion, jornada);

    return useQuery({
        queryKey,
        queryFn: () => jugadorService.obtenerDestacadosJornada(
            id_categoria_edicion,
            jornada,
            id_posicion
        ),
        enabled: enabled && !!id_categoria_edicion && !!jornada,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...queryOptions,
    });
};