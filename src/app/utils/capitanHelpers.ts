import { usePlayerStore } from "../stores/playerStore";


export interface CapitanData {
    id_jugador: number;
    id_equipo: number;
    id_categoria_edicion: number;
}

export const getCapitanData = (): CapitanData | null => {
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
    const { equipoSeleccionado } = usePlayerStore.getState();
    return equipoSeleccionado?.es_capitan ?? false;
};