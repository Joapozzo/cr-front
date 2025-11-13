import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import { usePlayerStore } from '@/app/stores/playerStore';
import { authService } from '@/app/services/auth.services';

type LogoutState = 'idle' | 'loading' | 'success' | 'error';

interface UseLogoutReturn {
  logout: () => Promise<void>;
  state: LogoutState;
  error: string | null;
  retry: () => Promise<void>;
}

export const useLogout = (): UseLogoutReturn => {
  const router = useRouter();
  const { logout: clearAuthStore } = useAuthStore();
  const { reset: clearPlayerStore } = usePlayerStore();
  
  const [state, setState] = useState<LogoutState>('idle');
  const [error, setError] = useState<string | null>(null);

  const performLogout = async () => {
    try {
      setState('loading');
      setError(null);

      // 1. Cerrar sesión en Firebase
      await authService.cerrarSesion();

      // 2. Limpiar stores
      clearAuthStore();
      clearPlayerStore();

      // 3. Limpiar localStorage manualmente (por si acaso)
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('player-storage');
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');

      // 4. Esperar un momento para que se vea el loader
      await new Promise((resolve) => setTimeout(resolve, 800));

      setState('success');

      // 5. Redirigir después de mostrar el success
      setTimeout(() => {
        router.push('/login');
        router.refresh();
      }, 1000);

    } catch (err: any) {
      console.error('Error al cerrar sesión:', err);
      setState('error');
      setError(err.message || 'No se pudo cerrar sesión. Intenta de nuevo.');
      
      // Si falla, limpiar stores localmente de todos modos
      clearAuthStore();
      clearPlayerStore();
    }
  };

  const logout = async () => {
    await performLogout();
  };

  const retry = async () => {
    await performLogout();
  };

  return {
    logout,
    state,
    error,
    retry,
  };
};

