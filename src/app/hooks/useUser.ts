import { useQuery } from '@tanstack/react-query';
import { jugadorService } from '../services/jugador.services';
import { IPlantel } from '../types/plantel';

interface UsePlayerOptions {
    enabled?: boolean;
}

export const usePlayer = (id_jugador: number, options: UsePlayerOptions = {}) => {
    const { enabled = true } = options;

    const query = useQuery({
        queryKey: ['player', id_jugador],
        queryFn: () => jugadorService.obtenerPerfilJugador(id_jugador),
        enabled: enabled && !!id_jugador,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        refetchOnWindowFocus: false,
        retry: 2,
    });

    // Helper functions para trabajar con los equipos
    const getTeamsByCategory = (id_categoria_edicion?: number) => {
        const teamsPlayer = query.data?.teamsPlayer || [];
        if (!id_categoria_edicion) return teamsPlayer;
        return teamsPlayer.filter(team => team.id_categoria_edicion === id_categoria_edicion);
    };

    const isPlayerInTeam = (id_equipo: number, id_categoria_edicion: number): boolean => {
        const teamsPlayer = query.data?.teamsPlayer || [];
        return teamsPlayer.some(
            team => team.id_equipo === id_equipo && team.id_categoria_edicion === id_categoria_edicion
        );
    };

    const getPlayerTeamInCategory = (id_categoria_edicion: number): IPlantel | undefined => {
        const teamsPlayer = query.data?.teamsPlayer || [];
        return teamsPlayer.find(team => team.id_categoria_edicion === id_categoria_edicion);
    };

    const isEventualPlayer = (id_equipo: number, id_categoria_edicion: number): boolean => {
        const teamsPlayer = query.data?.teamsPlayer || [];
        const team = teamsPlayer.find(
            team => team.id_equipo === id_equipo && team.id_categoria_edicion === id_categoria_edicion
        );
        return team?.eventual === "si";
    };

    const isSanctionedPlayer = (id_equipo: number, id_categoria_edicion: number): boolean => {
        const teamsPlayer = query.data?.teamsPlayer || [];
        const team = teamsPlayer.find(
            team => team.id_equipo === id_equipo && team.id_categoria_edicion === id_categoria_edicion
        );
        return team?.sancionado === "si";
    };

    return {
        // Data from API
        userData: query.data?.userData || null,
        userPlayer: query.data?.userPlayer || null,
        teamsPlayer: query.data?.teamsPlayer || [],
        posicion: query.data?.posicion || null,
        
        // Query states
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,

        // Helper functions
        getTeamsByCategory,
        isPlayerInTeam,
        getPlayerTeamInCategory,
        isEventualPlayer,
        isSanctionedPlayer,
    };
};