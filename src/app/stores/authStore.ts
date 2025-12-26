import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UsuarioAuth } from '../services/auth.services';

export interface EquipoUsuario {
  id: number;
  nombre: string;
  img: string | null;
}

export interface DniEscaneadoData {
  dni: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  sexo?: string;
  timestamp: number; // Timestamp para expiración
}

interface AuthState {
  token: string | null;
  usuario: UsuarioAuth | null;
  equipos: EquipoUsuario[];
  isAuthenticated: boolean;
  dniEscaneado: DniEscaneadoData | null;
  isHydrated: boolean; // Indica si el store ha terminado de cargar desde localStorage
  setToken: (token: string | null) => void;
  setUsuario: (usuario: UsuarioAuth | null) => void;
  setEquipos: (equipos: EquipoUsuario[]) => void;
  setDniEscaneado: (dniData: DniEscaneadoData | null) => void;
  clearDniEscaneado: () => void;
  login: (token: string, usuario: UsuarioAuth) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
}

// Tiempo de expiración para datos del DNI escaneado (24 horas)
const DNI_DATA_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      usuario: null,
      equipos: [],
      isAuthenticated: false,
      dniEscaneado: null,
      isHydrated: false,
      setToken: (token) => {
        // Sincronizar cookie cuando se establece el token
        if (typeof document !== 'undefined') {
          if (token) {
            document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
          } else {
            document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Lax';
          }
        }
        set(() => ({ token, isAuthenticated: !!token }));
      },
      setUsuario: (usuario) => set(() => ({ usuario })),
      setEquipos: (equipos) => set(() => ({ equipos: equipos || [] })),
      setDniEscaneado: (dniData) => {
        // Si se pasa null, limpiar
        if (!dniData) {
          set(() => ({ dniEscaneado: null }));
          return;
        }
        // Agregar timestamp actual
        const dniDataWithTimestamp: DniEscaneadoData = {
          ...dniData,
          timestamp: Date.now(),
        };
        set(() => ({ dniEscaneado: dniDataWithTimestamp }));
      },
      clearDniEscaneado: () => set(() => ({ dniEscaneado: null })),
      login: (token, usuario) => {
        // Guardar cookie para que el middleware pueda verificar autenticación
        if (typeof document !== 'undefined') {
          document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`; // 7 días
        }
        set(() => ({ token, usuario, isAuthenticated: true }));
      },
      logout: () => {
        // Eliminar cookie al hacer logout
        if (typeof document !== 'undefined') {
          document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Lax';
        }
        set(() => ({ 
          token: null, 
          usuario: null, 
          equipos: [], 
          isAuthenticated: false,
          dniEscaneado: null, // Limpiar datos del DNI al hacer logout
        }));
        // Nota: La limpieza completa de localStorage se hace en useLogout
        // para asegurar que todos los stores se limpien juntos
      },
      setHydrated: (hydrated) => set(() => ({ isHydrated: hydrated })),
    }),
    {
      name: 'auth', // nombre en localStorage (cambió de 'auth-storage' a 'auth')
      partialize: (state) => {
        // Verificar si los datos del DNI han expirado antes de persistir
        let dniEscaneado = state.dniEscaneado;
        if (dniEscaneado) {
          const now = Date.now();
          const elapsed = now - dniEscaneado.timestamp;
          // Si han pasado más de 24 horas, no persistir
          if (elapsed > DNI_DATA_EXPIRATION_TIME) {
            dniEscaneado = null;
          }
        }
        
        return {
          token: state.token,
          usuario: state.usuario,
          equipos: state.equipos,
          isAuthenticated: state.isAuthenticated,
          dniEscaneado,
        };
      },
      onRehydrateStorage: () => (state, error) => {
        // Marcar como hidratado cuando termine de cargar desde localStorage
        // Esto se ejecuta incluso si no hay datos persistidos (primera carga)
        if (state) {
          // Sincronizar cookie si hay token al hidratar
          if (state.token && typeof document !== 'undefined') {
            document.cookie = `auth-token=${state.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
          }
          state.setHydrated(true);
        } else {
          // Si no hay estado, también marcar como hidratado (primera carga sin datos)
          useAuthStore.getState().setHydrated(true);
        }
      },
    }
  )
);

// Función helper para verificar si los datos del DNI están expirados
export const isDniDataExpired = (dniData: DniEscaneadoData | null): boolean => {
  if (!dniData || !dniData.timestamp) return true;
  const now = Date.now();
  const elapsed = now - dniData.timestamp;
  return elapsed > DNI_DATA_EXPIRATION_TIME;
};
