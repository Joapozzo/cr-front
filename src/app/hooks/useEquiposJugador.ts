import { useQuery } from '@tanstack/react-query';
import { jugadorService } from '../services/jugador.services';

export const useEquiposJugador = (id_jugador: number) => { 
    return useQuery({
        queryKey: ['equipos-jugador', id_jugador],
        queryFn: () => jugadorService.obtenerEquiposJugador(id_jugador),
        enabled: !!id_jugador,
    })
}

