import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CategoriaSeleccionada } from '../types/categoria';

interface CategoriaStore {
    categoriaSeleccionada: CategoriaSeleccionada | null;
    setCategoriaSeleccionada: (categoria: CategoriaSeleccionada) => void;
    clearCategoriaSeleccionada: () => void;
    isCategoriaSelected: () => boolean;
}

export const useCategoriaStore = create<CategoriaStore>()(
    persist(
        (set, get) => ({
            categoriaSeleccionada: null,

            setCategoriaSeleccionada: (categoria: CategoriaSeleccionada) => {
                set({ categoriaSeleccionada: categoria });
            },

            clearCategoriaSeleccionada: () => {
                set({ categoriaSeleccionada: null });
            },

            isCategoriaSelected: () => {
                const { categoriaSeleccionada } = get();
                return categoriaSeleccionada !== null;
            },
        }),
        {
            name: 'categoria-storage',
            partialize: (state) => ({
                categoriaSeleccionada: state.categoriaSeleccionada
            }),
        }
    )
);

