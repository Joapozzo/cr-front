import toast from 'react-hot-toast';
import { JugadorPlantel } from '@/app/types/partido';

interface UseJugadorActionsProps {
    todosLosJugadores: JugadorPlantel[];
    permitirCambioDorsal: boolean;
    permitirAcciones: boolean;
    onOpenDorsalModal: (jugador: JugadorPlantel) => void;
    onOpenAccionModal: (jugador: JugadorPlantel) => void;
    onOpenDeleteModal: (jugador: JugadorPlantel) => void;
}

export const useJugadorActions = ({
    todosLosJugadores,
    permitirCambioDorsal,
    permitirAcciones,
    onOpenDorsalModal,
    onOpenAccionModal,
    onOpenDeleteModal
}: UseJugadorActionsProps) => {

    const handleJugadorClick = (jugadorId: number, equipoId: number) => {
        if (!permitirCambioDorsal) {
            toast.error('No se puede modificar el dorsal en este estado del partido');
            return;
        }
        const jugador = todosLosJugadores.find(j => Number(j.id_jugador) === Number(jugadorId));
        if (jugador) {
            onOpenDorsalModal(jugador);
        }
    };

    const handleJugadorAction = (jugadorId: number, equipoId: number) => {
        if (!permitirAcciones) {
            toast.error('No se pueden registrar acciones en este estado del partido');
            return;
        }

        const jugador = todosLosJugadores.find(j => j.id_jugador === jugadorId);

        if (!jugador || !jugador.dorsal || jugador.dorsal === 0) {
            toast.error('El jugador debe tener un dorsal asignado para registrar acciones');
            return;
        }

        onOpenAccionModal(jugador);
    };

    const handleDeleteDorsal = (jugadorId: number) => {
        const jugador = todosLosJugadores.find(j => j.id_jugador === jugadorId);
        if (jugador && jugador.dorsal) {
            onOpenDeleteModal(jugador);
        } else {
            toast.error('El jugador no tiene dorsal asignado');
        }
    };

    return {
        handleJugadorClick,
        handleJugadorAction,
        handleDeleteDorsal
    };
};