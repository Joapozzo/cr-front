import { useMutation, useQueryClient } from '@tanstack/react-query';
import { planilleroService } from '../services/planillero.services';

interface InscribirJugadorEventualData {
    idPartido: number;
    jugadorData: any;
}

export const useInscribirJugadorEventual = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ idPartido, jugadorData }: InscribirJugadorEventualData) => {
            return await planilleroService.inscribirJugadorEventual(idPartido, jugadorData);
        },
        onSuccess: (data, variables) => {
            // Invalidar y refrescar las queries relacionadas al partido
            queryClient.refetchQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
            });
        }
    });
};