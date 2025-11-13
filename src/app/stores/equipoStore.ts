import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EquipoSeleccionadoState {
    equipoSeleccionado: string | number;
    setEquipoSeleccionado: (equipo: string | number) => void;
    clearEquipoSeleccionado: () => void;
}

export const useEquipoSeleccionadoStore = create<EquipoSeleccionadoState>()(
    persist(
        (set) => ({
            equipoSeleccionado: '',
            setEquipoSeleccionado: (equipo) => set({ equipoSeleccionado: equipo }),
            clearEquipoSeleccionado: () => set({ equipoSeleccionado: '' }),
        }),
        {
            name: 'equipo-seleccionado-storage',
            partialize: (state) => ({ equipoSeleccionado: state.equipoSeleccionado }),
        }
    )
);