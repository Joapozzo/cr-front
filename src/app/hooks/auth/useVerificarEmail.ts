import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth.services';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';

/**
 * Hook para verificar si el email ya fue verificado (Firebase + Backend)
 * Retorna true cuando el email está verificado en ambos sistemas
 * Actualiza el store con el nuevo estado del usuario después de verificar
 */
export const useVerificarEmail = () => {
  const { setUsuario, setToken } = useAuthStore();

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

      // 🔄 Actualizar el store con el nuevo estado del usuario desde el backend
      // Hacer un login para obtener el estado actualizado del usuario
      const user = authService.obtenerUsuarioActual();
      let proximoPaso: 'VERIFICAR_EMAIL' | 'VALIDAR_DNI' | 'SELFIE' | 'COMPLETO' = 'VALIDAR_DNI';
      
      if (user) {
        try {
          const token = await user.getIdToken();
          
          // Obtener el estado actualizado del usuario desde el backend
          const loginResponse = await api.post<{
            success: boolean;
            usuario: any;
            proximoPaso: 'VERIFICAR_EMAIL' | 'VALIDAR_DNI' | 'SELFIE' | 'COMPLETO';
          }>('/auth/login', null, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Actualizar el store con el nuevo estado
          setToken(token);
          setUsuario(loginResponse.usuario);
          proximoPaso = loginResponse.proximoPaso;
        } catch (error) {
          console.error('Error al actualizar estado del usuario después de verificar email:', error);
          // No lanzar error aquí, la verificación ya fue exitosa
        }
      }

      // Retornar el proximoPaso para que el componente pueda redirigir correctamente
      return { proximoPaso };
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