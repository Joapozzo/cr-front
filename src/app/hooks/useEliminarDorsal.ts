import { useMutation, useQueryClient } from '@tanstack/react-query';
import { planilleroService } from '../services/planillero.services';
import { useAuthStore } from '../stores/authStore';

interface EliminarDorsalData {
    idCategoriaEdicion: number;
    idPartido: number;
    idJugador: number;
    idEquipo: number;
}

export const useEliminarDorsal = () => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation({
        mutationFn: async ({ idCategoriaEdicion, idPartido, idJugador, idEquipo }: EliminarDorsalData) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return await planilleroService.eliminarDorsal(idCategoriaEdicion, idPartido, idJugador, idEquipo);
        },
        onSuccess: (data, variables) => {
            // Refetch datos del partido
            queryClient.refetchQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
            });
        }
    });
};