import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { dreamteamService } from '../services/dreamteam.services';
import { 
    DreamTeam,
    AgregarJugadorRequest, 
    AgregarJugadorResponse 
} from '../types/dreamteam';


const jugadoresKeys = {
    all: ['jugadores'] as const,
    destacados: (id_categoria_edicion: number, jornada: number) =>
        ['jugadores', 'destacados', id_categoria_edicion, jornada] as const,
};

// Keys para manejo de cache
export const dreamteamKeys = {
    all: ['dreamteams'] as const,
    byId: (id: number) => [...dreamteamKeys.all, 'id', id] as const,
    categoria: (id_categoria_edicion: number) =>
        [...dreamteamKeys.all, 'categoria', id_categoria_edicion] as const,
    categoriaJornada: (id_categoria_edicion: number, jornada: number) =>
        [...dreamteamKeys.categoria(id_categoria_edicion), 'jornada', jornada] as const,
};


// ==================== QUERIES ====================

// Hook para obtener dreamteam por categoría y jornada
export const useDreamteamCategoriaJornada = (
    id_categoria_edicion: number,
    jornada: number,
    options?: Omit<UseQueryOptions<DreamTeam | null, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: dreamteamKeys.categoriaJornada(id_categoria_edicion, jornada),
        queryFn: () => dreamteamService.obtenerDreamTeamCategoriaJornada(id_categoria_edicion, jornada),
        enabled: !!id_categoria_edicion && !!jornada,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

// ==================== MUTATIONS ====================

// Hook para agregar jugador al dreamteam
export const useAgregarJugadorDreamteam = (
    options?: UseMutationOptions<AgregarJugadorResponse, Error, AgregarJugadorRequest>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AgregarJugadorRequest) => 
            dreamteamService.agregarJugadorADreamteam(data),
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas al dreamteam
            queryClient.invalidateQueries({
                queryKey: dreamteamKeys.categoriaJornada(
                    variables.id_categoria_edicion,
                    variables.jornada
                ),
            });
            queryClient.invalidateQueries({
                queryKey: dreamteamKeys.byId(data.dreamteam.id_dreamteam),
            });
            queryClient.invalidateQueries({
                queryKey: dreamteamKeys.all,
            });

            // Invalidar TODAS las queries de jugadores destacados
            queryClient.invalidateQueries({
                queryKey: jugadoresKeys.all,
            });
            
            // Forzar refetch inmediato de los jugadores destacados específicos
            queryClient.refetchQueries({
                queryKey: jugadoresKeys.destacados(
                    variables.id_categoria_edicion,
                    variables.jornada
                ),
            });
        },
        ...options,
    });
};

// Hook para publicar dreamteam
export const usePublicarDreamteam = (
    options?: UseMutationOptions<
        { mensaje: string },
        Error,
        { id_dreamteam: number; formacion?: string }
    >
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_dreamteam, formacion }: { id_dreamteam: number; formacion?: string }) =>
            dreamteamService.publicarDreamteam(id_dreamteam, formacion),
        onSuccess: (data, { id_dreamteam }) => {
            // Invalidar todas las queries de dreamteam para asegurar actualización
            queryClient.invalidateQueries({
                queryKey: dreamteamKeys.all,
            });
        },
        ...options,
    });
};

// Hook para eliminar jugador del dreamteam
export const useEliminarJugadorDreamteam = (
    options?: UseMutationOptions<
        { mensaje: string },
        Error,
        { id_dreamteam: number; id_partido: number; id_jugador: number }
    >
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_dreamteam, id_partido, id_jugador }) =>
            dreamteamService.eliminarJugadorDeDreamteam(id_dreamteam, id_partido, id_jugador),
        onSuccess: (data, variables) => {
            // Invalidar todas las queries de dreamteam para asegurar actualización
            queryClient.invalidateQueries({
                queryKey: dreamteamKeys.all,
            });

            // Invalidar TODAS las queries de jugadores destacados
            queryClient.invalidateQueries({
                queryKey: jugadoresKeys.all,
            });
        },
        ...options,
    });
};

// Hook para vaciar formación del dreamteam
export const useVaciarFormacionDreamteam = (
    options?: UseMutationOptions<
        { mensaje: string },
        Error,
        number
    >
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id_dreamteam: number) =>
            dreamteamService.vaciarFormacion(id_dreamteam),
        onSuccess: (_, id_dreamteam) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({
                queryKey: dreamteamKeys.byId(id_dreamteam),
            });
            queryClient.invalidateQueries({
                queryKey: dreamteamKeys.all,
            });

            // Invalidar TODAS las queries de jugadores destacados
            queryClient.invalidateQueries({
                queryKey: jugadoresKeys.all,
            });
        },
        ...options,
    });
};

// ==================== HOOK COMPUESTO ====================

// Hook que combina queries y mutations para uso conveniente
export const useDreamteamManager = (
    id_categoria_edicion: number,
    jornada: number
) => {
    const dreamteam = useDreamteamCategoriaJornada(id_categoria_edicion, jornada);
    const agregarJugador = useAgregarJugadorDreamteam();
    const publicar = usePublicarDreamteam();
    const eliminarJugador = useEliminarJugadorDreamteam();
    const vaciarFormacion = useVaciarFormacionDreamteam();

    return {
        // Data
        dreamteam: dreamteam.data,
        isLoading: dreamteam.isLoading,
        isError: dreamteam.isError,
        error: dreamteam.error,

        // Estados de carga
        isAgregandoJugador: agregarJugador.isPending,
        isPublicando: publicar.isPending,
        isEliminandoJugador: eliminarJugador.isPending,
        isVaciandoFormacion: vaciarFormacion.isPending,
        
        // Métodos
        agregarJugador: (data: AgregarJugadorRequest) => agregarJugador.mutateAsync(data),
        publicarDreamteam: (id_dreamteam: number, formacion?: string) =>
            publicar.mutateAsync({ id_dreamteam, formacion }),
        eliminarJugador: (id_dreamteam: number, id_partido: number, id_jugador: number) =>
            eliminarJugador.mutateAsync({ id_dreamteam, id_partido, id_jugador }),
        vaciarFormacion: (id_dreamteam: number) => vaciarFormacion.mutateAsync(id_dreamteam),

        // Refetch
        refetch: dreamteam.refetch,
    };
};