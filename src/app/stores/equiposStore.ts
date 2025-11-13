import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Equipo } from '../types/equipo';

interface EquiposStore {
    equipos: Equipo[];
    setEquipos: (equipos: any[]) => void;
    clearEquipos: () => void;
}

export const useEquiposStore = create<EquiposStore>()(
    persist(
        (set) => ({
            equipos: [],
            setEquipos: (equipos) => set({ equipos }),
            clearEquipos: () => set({ equipos: [] }),
        }),
        {
            name: 'equipos-storage',
            partialize: (state) => ({ equipos: state.equipos }),
        }
    )
);