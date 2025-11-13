import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth.services';

/**
 * Hook para verificar si el email ya fue verificado (Firebase + Backend)
 * Retorna true cuando el email está verificado en ambos sistemas
 */
export const useVerificarEmail = () => {
  return useMutation({
    mutationFn: async () => {
      const resultado = await authService.verificarEmailVerificado();

      if (!resultado.verificado) {
        throw new Error('El email aún no ha sido verificado');
      }

      // Si está verificado en Firebase pero no sincronizado con el backend
      if (!resultado.sincronizado) {
        throw new Error('Error al sincronizar verificación con el servidor');
      }

      // Todo OK: verificado en Firebase y sincronizado con el backend
      return true;
    },
  });
};

/**
 * Hook para reenviar email de verificación
 */
export const useReenviarEmailVerificacion = () => {
  return useMutation({
    mutationFn: async () => {
      const result = await authService.reenviarEmailVerificacion();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      console.log('Email de verificación reenviado');
    },
  });
};