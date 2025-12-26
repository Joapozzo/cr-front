import { EstadoPartido } from "../types/partido";

/**
 * Obtiene el texto del tiempo del partido según el estado
 */
export const getTiempoTexto = (estado: EstadoPartido): string => {
    switch (estado) {
        case 'C1':
            return 'PT'; // Primer Tiempo
        case 'E':
            return 'ET'; // Entre tiempo
        case 'C2':
            return 'ST'; // Segundo Tiempo
        default:
            return '';
    }
};

/**
 * Verifica si el partido está en vivo
 */
export const estaEnVivo = (estado: EstadoPartido): boolean => {
    return ['C1', 'E', 'C2'].includes(estado);
};

