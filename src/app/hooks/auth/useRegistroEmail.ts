// src/hooks/auth/useRegistroEmail.ts
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth.services';

export const useRegistroEmail = () => {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const result = await authService.registrarseConEmail(email, password);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return result.user;
    },
    onSuccess: (user) => {
      console.log('Usuario registrado. Email de verificación enviado:', user.email);
    },
    onError: (error: Error) => {
      console.error('Error en registro:', error);
    },
  });
};