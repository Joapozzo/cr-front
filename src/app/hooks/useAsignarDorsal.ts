import { useMutation, useQueryClient } from '@tanstack/react-query';
import { planilleroService } from '../services/planillero.services'; 

interface AsignarDorsalData {
    idCategoriaEdicion: number;
    idPartido: number;
    idEquipo: number;
    idJugador: number;
    dorsal: number;
}

export const useAsignarDorsal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ idCategoriaEdicion, idPartido, idEquipo, idJugador, dorsal }: AsignarDorsalData) => {
            return await planilleroService.asignarDorsal(idCategoriaEdicion, idPartido, idEquipo, idJugador, dorsal);
        },
        onSuccess: (data, variables) => {
            // Usar la misma queryKey que usa el hook de query
            queryClient.refetchQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
            });
        }
    });
};