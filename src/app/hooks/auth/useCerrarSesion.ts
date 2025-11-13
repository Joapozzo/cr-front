// src/hooks/auth/useCerrarSesion.ts
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth.services';
import { useRouter } from 'next/navigation';

export const useCerrarSesion = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const result = await authService.cerrarSesion();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      // Limpiar localStorage
      localStorage.removeItem('usuario');
      
      // Redirigir a login
      router.push('/login');
    },
    onError: (error: Error) => {
      console.error('Error al cerrar sesión:', error);
    },
  });
};