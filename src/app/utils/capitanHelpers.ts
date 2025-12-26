import { usePlayerStore } from "../stores/playerStore";

export interface CapitanData {
    id_jugador: number;
    id_equipo: number;
    id_categoria_edicion: number;
}

/**
 * Obtiene los datos del capitán desde el store.
 * IMPORTANTE: Solo usar en el cliente (hooks, componentes), NO en servicios.
 * Para servicios, usar useCapitanData() hook y pasar los datos como parámetro.
 */
export const getCapitanData = (): CapitanData | null => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') {
        return null;
    }

    const { equipoSeleccionado, jugador } = usePlayerStore.getState();
    
    if (!equipoSeleccionado || !jugador || !equipoSeleccionado.es_capitan) {
        return null;
    }

    return {
        id_jugador: jugador.id_jugador,
        id_equipo: equipoSeleccionado.id_equipo,
        id_categoria_edicion: equipoSeleccionado.id_categoria_edicion,
    };
};

export const esCapitanDelEquipoSeleccionado = (): boolean => {
    if (typeof window === 'undefined') {
        return false;
    }
    const { equipoSeleccionado } = usePlayerStore.getState();
    return equipoSeleccionado?.es_capitan ?? false;
};

/**
 * Hook para usar en componentes React que necesitan los datos del capitán.
 * Retorna los datos de forma reactiva.
 */
export const useCapitanData = (): CapitanData | null => {
    const { equipoSeleccionado, jugador } = usePlayerStore();
    
    if (!equipoSeleccionado || !jugador || !equipoSeleccionado.es_capitan) {
        return null;
    }

    return {
        id_jugador: jugador.id_jugador,
        id_equipo: equipoSeleccionado.id_equipo,
        id_categoria_edicion: equipoSeleccionado.id_categoria_edicion,
    };
};
