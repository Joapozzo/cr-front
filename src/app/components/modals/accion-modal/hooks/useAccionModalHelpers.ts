import { useCronometroPartido } from "@/app/hooks/useCronometroPartido";
import { IncidenciaPartido } from "@/app/types/partido";
import { ActionType, JugadorInfo } from "../types";

interface UseAccionModalHelpersProps {
    jugador?: JugadorInfo;
    accionToEdit?: IncidenciaPartido;
}

export const useAccionModalHelpers = ({
    jugador,
    accionToEdit
}: UseAccionModalHelpersProps) => {
    const cronometro = useCronometroPartido();

    const getActionLabel = (action: ActionType) => {
        const labels = {
            gol: 'Gol',
            amarilla: 'Tarjeta amarilla',
            roja: 'Expulsión'
        };
        return labels[action];
    };

    const getMinutoActual = () => {
        const [minutos] = cronometro.tiempoFormateado.split(':').map(Number);
        return minutos + (cronometro.shouldShowAdicional ? cronometro.tiempoAdicional : 0);
    };

    const getCurrentJugador = (): JugadorInfo => {
        return jugador || {
            id: accionToEdit?.id_jugador || 0,
            nombre: accionToEdit?.nombre || '',
            apellido: accionToEdit?.apellido || '',
            dorsal: null
        };
    };

    return {
        getActionLabel,
        getMinutoActual,
        getCurrentJugador
    };
};

