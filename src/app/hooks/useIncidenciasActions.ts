import toast from 'react-hot-toast';
import { IncidenciaPartido, JugadorPlantel } from '@/app/types/partido';
import { useEliminarGol, useEliminarAmonestacion, useEliminarExpulsion } from '@/app/hooks/useIncidentsEditDelete';

export const useIncidenciasActions = (idPartido: number, todosLosJugadores: JugadorPlantel[]) => {
    const { mutateAsync: eliminarGol, isPending: isEliminandoGol } = useEliminarGol();
    const { mutateAsync: eliminarAmonestacion, isPending: isEliminandoAmonestacion } = useEliminarAmonestacion();
    const { mutateAsync: eliminarExpulsion, isPending: isEliminandoExpulsion } = useEliminarExpulsion();

    const handleEditAction = (action: IncidenciaPartido, onOpenAccionModal: (jugador: JugadorPlantel, accion: IncidenciaPartido) => void) => {
        const jugadorAsociado = todosLosJugadores.find(j => j.id_jugador === action.id_jugador);
        if (jugadorAsociado) {
            onOpenAccionModal(jugadorAsociado, action);
        }
    };

    const handleDeleteAction = async (action: IncidenciaPartido) => {
        try {
            switch (action.tipo) {
                case 'gol':
                    await eliminarGol({ idGol: action.id, idPartido });
                    toast.success('Gol eliminado correctamente');
                    break;
                case 'amarilla':
                    await eliminarAmonestacion({ idAmonestacion: action.id, idPartido });
                    toast.success('Tarjeta amarilla eliminada correctamente');
                    break;
                case 'roja':
                case 'doble_amarilla':
                    await eliminarExpulsion({ idExpulsion: action.id, idPartido });
                    toast.success('Expulsión eliminada correctamente');
                    break;
                default:
                    toast.error('Tipo de incidencia no reconocido');
                    throw new Error('Tipo no reconocido');
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || error?.message || 'Error al eliminar incidencia';
            toast.error(errorMessage);
            throw error;
        }
    };

    const isEliminandoIncidencia = isEliminandoGol || isEliminandoAmonestacion || isEliminandoExpulsion;

    return {
        handleEditAction,
        handleDeleteAction,
        isEliminandoIncidencia
    };
};