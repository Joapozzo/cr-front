import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UsuarioAuth } from '../services/auth.services';

export interface EquipoUsuario {
  id: number;
  nombre: string;
  img: string | null;
}

interface AuthState {
  token: string | null;
  usuario: UsuarioAuth | null;
  equipos: EquipoUsuario[];
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setUsuario: (usuario: UsuarioAuth | null) => void;
  setEquipos: (equipos: EquipoUsuario[]) => void;
  login: (token: string, usuario: UsuarioAuth) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      equipos: [],
      isAuthenticated: false,
      setToken: (token) => set(() => ({ token, isAuthenticated: !!token })),
      setUsuario: (usuario) => set(() => ({ usuario })),
      setEquipos: (equipos) => set(() => ({ equipos: equipos || [] })),
      login: (token, usuario) => set(() => ({ token, usuario, isAuthenticated: true })),
      logout: () => set(() => ({ token: null, usuario: null, equipos: [], isAuthenticated: false })),
    }),
    {
      name: 'auth', // nombre en localStorage (cambió de 'auth-storage' a 'auth')
      partialize: (state) => ({
        token: state.token,
        usuario: state.usuario,
        equipos: state.equipos,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
