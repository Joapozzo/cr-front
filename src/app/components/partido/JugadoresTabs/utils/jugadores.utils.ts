import { JugadorPlantel } from '@/app/types/partido';

/**
 * Ordena jugadores:
 * 1. Primero los titulares/suplentes que entraron (en_cancha === true)
 * 2. Luego por dorsal de menor a mayor
 * Los que no tienen dorsal van al final
 */
export const ordenarJugadoresPorDorsal = (jugadores: JugadorPlantel[]): JugadorPlantel[] => {
    return [...jugadores].sort((a, b) => {
        const aEnCancha = a.en_cancha ?? false;
        const bEnCancha = b.en_cancha ?? false;
        const aTieneDorsal = !!a.dorsal;
        const bTieneDorsal = !!b.dorsal;

        // 1. Primero los que están en cancha
        if (aEnCancha && !bEnCancha) return -1;
        if (!aEnCancha && bEnCancha) return 1;

        // 2. Si ambos están en cancha o ambos no están, ordenar por dorsal
        // Jugadores con dorsal primero (ordenados por número)
        if (aTieneDorsal && !bTieneDorsal) return -1;
        if (!aTieneDorsal && bTieneDorsal) return 1;
        
        // Si ambos tienen dorsal, ordenar por número (menor a mayor)
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

