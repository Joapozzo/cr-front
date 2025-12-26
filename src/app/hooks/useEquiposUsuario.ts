import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useEffect } from 'react';
import { jugadorService } from '../services/jugador.services';
import { ObtenerEquiposActualesDelJugadorResponse } from '../types/jugador';
import { useAuthStore } from '../stores/authStore';
import { usePlayerStore } from '../stores/playerStore';

export const equiposUsuarioKeys = {
    all: ['equiposUsuario'] as const,
    equipos: () => [...equiposUsuarioKeys.all, 'equipos'] as const,
    equiposCompletos: () => [...equiposUsuarioKeys.all, 'equipos-completos'] as const,
};

/**
 * Hook para obtener equipos del usuario autenticado con información completa
 * Usa el endpoint /user/partidos/equipos-completos que devuelve toda la información necesaria
 * Automáticamente setea los equipos en el playerStore cuando se cargan
 */
export const useEquiposUsuario = (
    options?: Omit<UseQueryOptions<ObtenerEquiposActualesDelJugadorResponse[], Error>, 'queryKey' | 'queryFn'>
) => {
    const usuario = useAuthStore((state) => state.usuario);
    const { setEquipos } = usePlayerStore();
    
    const query = useQuery({
        queryKey: equiposUsuarioKeys.equiposCompletos(),
        queryFn: () => jugadorService.obtenerEquiposUsuarioCompletos(),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!usuario,
        ...options,
    });

    // Setear equipos en el store cuando se cargan
    useEffect(() => {
        if (query.data) {
            setEquipos(query.data);
        }
    }, [query.data, setEquipos]);

    return query;
};

