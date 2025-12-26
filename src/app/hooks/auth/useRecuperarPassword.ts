import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth.services';

export const useRecuperarPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const result = await authService.recuperarPassword(email);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      ('Email de recuperación enviado');
    },
    onError: (error: Error) => {
      console.error('Error al enviar email de recuperación:', error);
    },
  });
};