// src/hooks/auth/useRegistroEmail.ts
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth.services';
import { useAuthStore } from '../../stores/authStore';
import { obtenerToken } from '../../services/auth.services';
import { api } from '../../lib/api';

export const useRegistroEmail = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const result = await authService.registrarseConEmail(email, password);
      
      // Si el resultado indica que es un eventual que necesita establecer contraseña
      if (!result.success && (result as any).esEventual) {
        // Establecer contraseña para el eventual
        const passwordResult = await authService.establecerPasswordEventual(email, password);
        
        if (!passwordResult.success) {
          throw new Error(passwordResult.error || 'Error al establecer contraseña');
        }

        // Obtener token y hacer login en backend
        const token = await obtenerToken();
        if (!token) {
          throw new Error('No se pudo obtener el token de autenticación.');
        }

        // Llamar al backend para obtener datos del usuario
        const response = await api.post('/auth/login', null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response as {
          success: boolean;
          usuario: any;
          proximoPaso: 'VERIFICAR_EMAIL' | 'VALIDAR_DNI' | 'SELFIE' | 'COMPLETO';
        };

        // Guardar en store
        login(token, data.usuario);

        return {
          user: passwordResult.user,
          esEventual: true,
          proximoPaso: data.proximoPaso,
          usuario: data.usuario,
        };
      }
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return { user: result.user, esEventual: false };
    },
    onSuccess: (data) => {
      // TODOS los usuarios (incluyendo eventuales) deben verificar email primero
      console.log('Usuario registrado. Email de verificación enviado:', data.user?.email || 'N/A');
    },
    onError: (error: Error) => {
      console.error('Error en registro:', error);
    },
  });
};