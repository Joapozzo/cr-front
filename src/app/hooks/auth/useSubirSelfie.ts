// src/hooks/auth/useSubirSelfie.ts
import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';

interface SubirSelfieInput {
  selfieBase64: string;
}

interface SubirSelfieResponse {
  success: boolean;
  mensaje: string;
  selfieUrl: string;
}

export const useSubirSelfie = () => {
  return useMutation({
    mutationFn: async ({ selfieBase64 }: SubirSelfieInput) => {
      const response = await api.post<SubirSelfieResponse>(
        '/auth/register/subir-selfie',
        { selfieBase64 }
      );
      
      return response;
    },
    onSuccess: (data) => {
      // Selfie subida exitosamente
    },
    onError: (error: Error) => {
      console.error('Error al subir selfie:', error);
    },
  });
};
