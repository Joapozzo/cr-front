import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useEffect } from 'react';
import { jugadorService } from '../services/jugador.services';
import { useAuthStore } from '../stores/authStore';
import { usePlayerStore, PlayerData } from '../stores/playerStore';

export const jugadorUsuarioKeys = {
    all: ['jugadorUsuario'] as const,
    perfil: () => [...jugadorUsuarioKeys.all, 'perfil'] as const,
};

/**
 * Hook para obtener o crear el jugador del usuario autenticado
 * Automáticamente setea el jugador en el playerStore cuando se carga
 */
export const useJugadorUsuario = (
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
    const usuario = useAuthStore((state) => state.usuario);
    const { setJugador } = usePlayerStore();
    
    const query = useQuery({
        queryKey: jugadorUsuarioKeys.perfil(),
        queryFn: () => jugadorService.obtenerJugadorAutenticado(),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!usuario,
        ...options,
    });

    // Setear jugador en el store cuando se carga
    useEffect(() => {
        if (query.data) {
            const jugadorData: PlayerData = {
                id_jugador: query.data.id_jugador,
                id_usuario: query.data.id_usuario,
                nombre: query.data.usuario.nombre,
                apellido: query.data.usuario.apellido,
                img: query.data.usuario.img || '/img/default-avatar.png',
                posicion: query.data.posicion ? {
                    id_posicion: query.data.posicion.id_posicion,
                    codigo: query.data.posicion.codigo,
                    nombre: query.data.posicion.nombre
                } : null,
            };
            setJugador(jugadorData);
        }
    }, [query.data, setJugador]);

    return query;
};

