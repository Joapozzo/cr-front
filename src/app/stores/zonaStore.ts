import { create } from 'zustand';

interface ZonaStore {
    zonaSeleccionada: number;
    setZonaSeleccionada: (idZona: number) => void;
    clearZonaSeleccionada: () => void;
}

export const useZonaStore = create<ZonaStore>((set) => ({
    zonaSeleccionada: 0,

    setZonaSeleccionada: (idZona: number) => {
        set({ zonaSeleccionada: idZona });
    },

    clearZonaSeleccionada: () => {
        set({ zonaSeleccionada: 0 });
    },
}));
