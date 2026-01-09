import { useMutation, useQueryClient } from '@tanstack/react-query';
import { planilleroService } from '../services/planillero.services';
import { useAuthStore } from '../stores/authStore';
import { DatosCompletosPlanillero } from '../types/partido';
import { planilleroKeys } from './usePartidosPlanillero';

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
        // Optimistic update: actualizar inmediatamente
        onMutate: async ({ idPartido, idJugador, idEquipo }) => {
            // Cancelar queries en progreso
            await queryClient.cancelQueries({ 
                queryKey: ['planillero', 'datos-completos', idPartido] 
            });

            // Snapshot del valor anterior
            const previousData = queryClient.getQueryData<DatosCompletosPlanillero>(
                ['planillero', 'datos-completos', idPartido]
            );

            // Actualizar optimísticamente
            if (previousData) {
                const equipoKey = idEquipo === previousData.partido.equipoLocal?.id_equipo 
                    ? 'plantel_local' 
                    : 'plantel_visita';
                
                const plantel = previousData[equipoKey] || [];
                const jugadorIndex = plantel.findIndex(j => j.id_jugador === idJugador);
                
                if (jugadorIndex !== -1) {
                    const updatedPlantel = [...plantel];
                    updatedPlantel[jugadorIndex] = {
                        ...updatedPlantel[jugadorIndex],
                        dorsal: null
                    };

                    queryClient.setQueryData<DatosCompletosPlanillero>(
                        ['planillero', 'datos-completos', idPartido],
                        {
                            ...previousData,
                            [equipoKey]: updatedPlantel
                        }
                    );
                }
            }

            return { previousData };
        },
        onError: (err, variables, context) => {
            // Revertir en caso de error
            if (context?.previousData) {
                queryClient.setQueryData(
                    ['planillero', 'datos-completos', variables.idPartido],
                    context.previousData
                );
            }
        },
        onSuccess: (data, variables) => {
            // Invalidar solo el plantel del equipo afectado
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.plantel(variables.idPartido, variables.idEquipo)
            });
            // También invalidar datos completos por compatibilidad
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosCompletos(variables.idPartido)
            });
        }
    });
};