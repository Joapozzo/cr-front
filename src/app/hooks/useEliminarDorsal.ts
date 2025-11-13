import { useMutation, useQueryClient } from '@tanstack/react-query';
import { planilleroService } from '../services/planillero.services';

interface EliminarDorsalData {
    idCategoriaEdicion: number;
    idPartido: number;
    idJugador: number;
    idEquipo: number;
}

export const useEliminarDorsal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ idCategoriaEdicion, idPartido, idJugador, idEquipo }: EliminarDorsalData) => {
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