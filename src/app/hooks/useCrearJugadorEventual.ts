import { useMutation, useQueryClient } from '@tanstack/react-query';
import { planilleroService } from '../services/planillero.services';
import { useAuthStore } from '../stores/authStore';

interface InscribirJugadorEventualData {
    idPartido: number;
    jugadorData: any;
}

export const useInscribirJugadorEventual = () => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation({
        mutationFn: async ({ idPartido, jugadorData }: InscribirJugadorEventualData) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
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