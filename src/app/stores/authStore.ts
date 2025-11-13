import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UsuarioAuth } from '../services/auth.services';

interface AuthState {
  token: string | null;
  usuario: UsuarioAuth | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setUsuario: (usuario: UsuarioAuth | null) => void;
  login: (token: string, usuario: UsuarioAuth) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,
      setToken: (token) => set(() => ({ token, isAuthenticated: !!token })),
      setUsuario: (usuario) => set(() => ({ usuario })),
      login: (token, usuario) => set(() => ({ token, usuario, isAuthenticated: true })),
      logout: () => set(() => ({ token: null, usuario: null, isAuthenticated: false })),
    }),
    {
      name: 'auth-storage', // nombre en localStorage
    }
  )
);
