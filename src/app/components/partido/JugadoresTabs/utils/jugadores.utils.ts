import { JugadorPlantel } from '@/app/types/partido';

/**
 * Ordena jugadores por dorsal (menor a mayor), los que no tienen dorsal al final
 */
export const ordenarJugadoresPorDorsal = (jugadores: JugadorPlantel[]): JugadorPlantel[] => {
    return [...jugadores].sort((a, b) => {
        const aTieneDorsal = !!a.dorsal;
        const bTieneDorsal = !!b.dorsal;

        // Jugadores con dorsal primero (ordenados por número)
        if (aTieneDorsal && !bTieneDorsal) return -1;
        if (!aTieneDorsal && bTieneDorsal) return 1;
        
        // Si ambos tienen dorsal, ordenar por número
        if (aTieneDorsal && bTieneDorsal) {
            return a.dorsal! - b.dorsal!;
        }

        // Sin dorsal al final (mantener orden original)
        return 0;
    });
};

/**
 * Calcula la cantidad de jugadores en cancha
 */
export const calcularJugadoresEnCancha = (jugadores: JugadorPlantel[]): number => {
    return jugadores.filter(j => j.en_cancha && j.dorsal).length;
};

