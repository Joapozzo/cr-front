import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth.services';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'react-hot-toast';
// Removido import de jugadorService - los equipos se cargarán cuando se necesiten
import { determinarRutaRedireccion } from '../../utils/authRedirect';

export const useLoginGoogle = () => {
  const { login: setAuthState } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      // 1. Login con Google en Firebase
      const firebaseResult = await authService.loginConGoogle();
      
      if (!firebaseResult.success) {
        throw new Error(firebaseResult.error);
      }

      const user = firebaseResult.user!;

      // 2. Obtener token de Firebase
      const token = await user.getIdToken();
      
      // Pequeño delay para asegurar que el usuario esté establecido en Firebase
      await new Promise(resolve => setTimeout(resolve, 100));

      // 3. Intentar login en backend (con token explícito)
      try {
        // Intentar login primero usando api.post que maneja mejor los errores
        try {
          const loginData = await api.post<{
            success: boolean;
            usuario: any;
            proximoPaso: 'VERIFICAR_EMAIL' | 'VALIDAR_DNI' | 'SELFIE' | 'COMPLETO';
          }>('/auth/login', { uid: user.uid }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          return loginData;
        } catch (loginError: any) {
          // Si el error es 401/404, el usuario no existe, registrarlo
          const errorMessage = loginError.message || String(loginError);
          const isUserNotFound = 
            errorMessage.includes('401') || 
            errorMessage.includes('404') ||
            errorMessage.includes('Usuario no encontrado') ||
            errorMessage.includes('No autorizado') ||
            errorMessage.includes('Unauthorized');
          
          if (isUserNotFound) {
            // Registrar usuario en backend (con email)
            await api.post('/auth/register', { 
              uid: user.uid,
              email: user.email 
            }, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            // Ahora intentar login nuevamente
            const loginData = await api.post<{
              success: boolean;
              usuario: any;
              proximoPaso: 'VERIFICAR_EMAIL' | 'VALIDAR_DNI' | 'SELFIE' | 'COMPLETO';
            }>('/auth/login', { uid: user.uid }, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            return loginData;
          }
          
          // Si es otro error, relanzarlo
          throw loginError;
        }
      } catch (error: any) {
        console.error('Error en login con Google:', error);
        // Mejorar el mensaje de error para el usuario
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
          throw new Error('Error de conexión. Verifica que el servidor esté corriendo y tu conexión a internet.');
        }
        throw error;
      }
    },
    onSuccess: async (data) => {
      // Obtener el token de Firebase actualizado
      const user = authService.obtenerUsuarioActual();
      if (user) {
        // Obtener token actualizado
        const token = await user.getIdToken(true);
        
        // Guardar en authStore con los datos que ya recibimos del login (sin hacer otra llamada)
        setAuthState(token, data.usuario);

        // El mensaje de bienvenida se muestra solo en /home mediante useWelcomeToast

        // Los equipos se cargarán cuando se necesiten (en home o páginas que los requieran)
        // No cargar aquí para evitar llamadas innecesarias
      }
    },
    onError: (error: Error) => {
      console.error('Error en login con Google:', error);
    },
  });
};