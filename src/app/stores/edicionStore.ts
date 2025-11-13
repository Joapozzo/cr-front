import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EdicionSeleccionada {
    id_edicion: number;
    nombre: string;
    temporada: number;
    cantidad_eventuales: number;
    partidos_eventuales: number;
    apercibimientos: number;
    puntos_descuento: number;
    img: string | null;
}

interface EdicionStore {
    edicionSeleccionada: EdicionSeleccionada | null;
    setEdicionSeleccionada: (edicion: EdicionSeleccionada) => void;
    clearEdicionSeleccionada: () => void;
    isEdicionSelected: () => boolean;
}

export const useEdicionStore = create<EdicionStore>()(
    persist(
        (set, get) => ({
            edicionSeleccionada: null,

            setEdicionSeleccionada: (edicion: EdicionSeleccionada) => {
                set({ edicionSeleccionada: edicion });
            },

            clearEdicionSeleccionada: () => {
                set({ edicionSeleccionada: null });
            },

            isEdicionSelected: () => {
                const { edicionSeleccionada } = get();
                return edicionSeleccionada !== null;
            },
        }),
        {
            name: 'edicion-storage', // nombre único para el localStorage
            // Solo persistir los datos necesarios
            partialize: (state) => ({
                edicionSeleccionada: state.edicionSeleccionada
            }),
        }
    )
);