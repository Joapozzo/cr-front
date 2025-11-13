import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ObtenerEquiposActualesDelJugadorResponse } from '../types/jugador';
import { PosicionJugador } from '../types/partido';

// Tipos para el store
export interface PlayerData {
  id_jugador: number;
  id_usuario: string;
  nombre: string;
  apellido: string;
  img: string;
  posicion: PosicionJugador | null;
}

interface PlayerState {
  // 📦 Data del jugador
  jugador: PlayerData | null;
  equipos: ObtenerEquiposActualesDelJugadorResponse[];
  equipoSeleccionado: ObtenerEquiposActualesDelJugadorResponse | null;

  // ✅ Setters simples (solo guardar data)
  setJugador: (jugador: PlayerData | null) => void;
  setEquipos: (equipos: ObtenerEquiposActualesDelJugadorResponse[]) => void;
  setEquipoSeleccionado: (equipo: ObtenerEquiposActualesDelJugadorResponse | null) => void;
  
  // 🔄 Reset (para logout)
  reset: () => void;

  // 🔍 Helpers (solo lectura)
  esCapitanDeEquipo: (idEquipo: number) => boolean;
  esCapitanDeAlgunEquipo: () => boolean;
  tieneEquipos: () => boolean;
}

const initialState = {
  jugador: null,
  equipos: [],
  equipoSeleccionado: null,
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ✅ Setters simples - solo guardan data
      setJugador: (jugador) => set({ jugador }),
      
      setEquipos: (equipos) => 
        set({ 
          equipos,
          // Si hay equipos y no hay seleccionado, elegir el primero
          equipoSeleccionado: equipos.length > 0 && !get().equipoSeleccionado 
            ? equipos[0] 
            : get().equipoSeleccionado
        }),
      
      setEquipoSeleccionado: (equipo) => set({ equipoSeleccionado: equipo }),

      // 🔄 Reset - limpiar todo (para logout)
      reset: () => set(initialState),

      // 🔍 Helpers - solo lectura
      esCapitanDeEquipo: (idEquipo) => {
        const { equipos } = get();
        const equipo = equipos.find((eq) => eq.id_equipo === idEquipo);
        return equipo?.es_capitan || false;
      },

      esCapitanDeAlgunEquipo: () => {
        const { equipos } = get();
        return equipos.some((eq) => eq.es_capitan);
      },

      tieneEquipos: () => {
        const { equipos } = get();
        return equipos.length > 0;
      },
    }),
    {
      name: 'player-storage',
    }
  )
);

