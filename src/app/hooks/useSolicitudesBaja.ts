import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { equiposService } from '../services/equipos.services';
import { SolicitarBajaParams } from '../types/solicitudes';
import toast from 'react-hot-toast';

export const useSolicitarBaja = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: SolicitarBajaParams) => {
            const { id_equipo, id_jugador_capitan, id_categoria_edicion, id_jugador_baja, motivo, observaciones } = params;
            return await equiposService.solicitarBajaJugador(
                id_equipo,
                id_jugador_capitan,
                id_categoria_edicion,
                id_jugador_baja,
                motivo,
                observaciones
            );
        },
        onSuccess: (data, variables) => {
            toast.success(data.message || 'Solicitud de baja enviada exitosamente');
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ['solicitudes-baja'] });
            queryClient.invalidateQueries({ queryKey: ['solicitudes-baja-jugador'] });
            queryClient.invalidateQueries({ queryKey: ['plantel'] });
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Error al enviar la solicitud de baja';
            toast.error(errorMessage);
        }
    });
};

export const useObtenerSolicitudesBajaPorJugador = (id_jugador: number) => {
    return useQuery({
        queryKey: ['solicitudes-baja-jugador', id_jugador],
        queryFn: async () => {
            return await equiposService.obtenerSolicitudesBajaPorJugador(id_jugador);
        },
        enabled: !!id_jugador && id_jugador > 0,
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
    });
};
