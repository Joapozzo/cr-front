import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import { usePlayerStore } from '@/app/stores/playerStore';
import { useEquiposStore } from '@/app/stores/equiposStore';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { useEdicionStore } from '@/app/stores/edicionStore';
import { useEquipoSeleccionadoStore } from '@/app/stores/equipoStore';
import usePartidoStore from '@/app/stores/partidoStore';
import { authService } from '@/app/services/auth.services';

type LogoutState = 'idle' | 'loading' | 'success' | 'error';

interface UseLogoutReturn {
  logout: () => Promise<void>;
  state: LogoutState;
  error: string | null;
  retry: () => Promise<void>;
}

/**
 * Limpia todo el localStorage relacionado con la aplicación
 */
const limpiarLocalStorageCompleto = () => {
  try {
    // Limpiar todos los stores de Zustand con persist
    const storesPersistidos = [
      'auth',
      'player-storage',
      'equipos-storage',
      'categoria-storage',
      'edicion-storage',
      'equipo-seleccionado-storage',
    ];

    storesPersistidos.forEach((storeName) => {
      localStorage.removeItem(storeName);
    });

    // Limpiar estado del partido (usa localStorage directamente)
    localStorage.removeItem('partidoEstado');

    // Limpiar cualquier otro dato que pueda estar en localStorage
    // (por si hay datos legacy o de otras versiones)
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.includes('auth') ||
        key.includes('player') ||
        key.includes('equipo') ||
        key.includes('categoria') ||
        key.includes('edicion') ||
        key.includes('partido') ||
        key.includes('storage')
      )) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Error al limpiar localStorage:', error);
  }
};

export const useLogout = (): UseLogoutReturn => {
  const router = useRouter();
  const { logout: clearAuthStore } = useAuthStore();
  const { reset: clearPlayerStore } = usePlayerStore();
  const { clearEquipos: clearEquiposStore } = useEquiposStore();
  const { clearCategoriaSeleccionada: clearCategoriaStore } = useCategoriaStore();
  const { clearEdicionSeleccionada: clearEdicionStore } = useEdicionStore();
  const { clearEquipoSeleccionado: clearEquipoSeleccionadoStore } = useEquipoSeleccionadoStore();
  const { limpiarEstadoPersistido: clearPartidoStore } = usePartidoStore();
  
  const [state, setState] = useState<LogoutState>('idle');
  const [error, setError] = useState<string | null>(null);

  const performLogout = async () => {
    try {
      setState('loading');
      setError(null);

      // 1. Cerrar sesión en Firebase
      await authService.cerrarSesion();

      // 2. Limpiar todos los stores (resetear estado en memoria)
      clearAuthStore();
      clearPlayerStore();
      clearEquiposStore();
      clearCategoriaStore();
      clearEdicionStore();
      clearEquipoSeleccionadoStore();
      clearPartidoStore();

      // 3. Limpiar todo el localStorage completamente
      limpiarLocalStorageCompleto();

      // 4. Limpiar también sessionStorage por si acaso
      try {
        sessionStorage.clear();
      } catch (error) {
        console.warn('Error al limpiar sessionStorage:', error);
      }

      // 5. Esperar un momento para que se vea el loader
      await new Promise((resolve) => setTimeout(resolve, 800));

      setState('success');

      // 6. Redirigir después de mostrar el success
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
      clearEquiposStore();
      clearCategoriaStore();
      clearEdicionStore();
      clearEquipoSeleccionadoStore();
      clearPartidoStore();
      limpiarLocalStorageCompleto();
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

