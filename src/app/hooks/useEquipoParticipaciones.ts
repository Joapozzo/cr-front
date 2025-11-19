import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { equipoParticipacionesService } from '../services/equipoParticipaciones.services';
import { ParticipacionEquipo } from '../types/participacionEquipo';

export const equipoParticipacionesKeys = {
    all: ['equipoParticipaciones'] as const,
    participaciones: (id_equipo: number) => 
        [...equipoParticipacionesKeys.all, 'participaciones', id_equipo] as const,
};

/**
 * Hook para obtener participaciones del equipo
 * @param id_equipo - ID del equipo (requerido)
 */
export const useEquipoParticipaciones = (
    id_equipo: number | null,
    options?: Omit<UseQueryOptions<ParticipacionEquipo[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: equipoParticipacionesKeys.participaciones(id_equipo || 0),
        queryFn: () => equipoParticipacionesService.obtenerParticipacionesEquipo(id_equipo!),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_equipo,
        ...options,
    });
};

