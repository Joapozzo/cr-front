import { useQuery } from '@tanstack/react-query';
import { equiposService } from '../services/equipos.services'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jugadorService } from '../services/jugador.services';
import toast from 'react-hot-toast';

interface SolicitarBajaParams {
    id_jugador_baja: number;
    motivo: string;
    observaciones: string;
}

export const useSolicitudesBajaEquipo = (id_equipo: number, id_jugador: number, id_categoria_edicion: number) => {
    return useQuery({
        queryKey: ['solicitudes-baja', id_equipo, id_categoria_edicion],
        queryFn: () => equiposService.obtenerSolicitudesBajaEquipo(id_equipo, id_jugador, id_categoria_edicion),
        // enabled: !!selectedTeam?.es_capitan && !!id_equipo && !!id_jugador && !!id_categoria_edicion,
        retry: false,
    });
};

export const useSolicitarBaja = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id_jugador_baja, motivo, observaciones }: SolicitarBajaParams) => {
            return await jugadorService.solicitarBajaJugador(id_jugador_baja, motivo, observaciones);
        },
        onSuccess: () => {
            toast.success('Solicitud de baja enviada correctamente');
            queryClient.invalidateQueries({ queryKey: ['solicitudes-baja'] });
            queryClient.invalidateQueries({ queryKey: ['estadisticas-plantel'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Error al solicitar la baja');
        }
    });
};