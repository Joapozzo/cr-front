import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth.services';
import { API_BASE_URL } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

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

      // 3. Intentar login en backend (con token explícito)
      try {
        const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ uid: user.uid }),
        });

        // Si el login es exitoso, retornar los datos
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          return loginData;
        }

        // Si no existe el usuario (401/404), registrarlo primero
        if (loginResponse.status === 401 || loginResponse.status === 404) {
          console.log('Usuario no existe en backend, registrando...');
          
          // Registrar usuario en backend (con email)
          const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ 
              uid: user.uid,
              email: user.email 
            }),
          });

          if (!registerResponse.ok) {
            const errorData = await registerResponse.json();
            throw new Error(errorData.error || 'Error al registrar usuario');
          }

          // Ahora intentar login nuevamente
          const retryLoginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ uid: user.uid }),
          });

          if (!retryLoginResponse.ok) {
            const errorData = await retryLoginResponse.json();
            throw new Error(errorData.error || 'Error al iniciar sesión después del registro');
          }

          const loginData = await retryLoginResponse.json();
          return loginData;
        }

        // Si es otro error, lanzar excepción
        const errorData = await loginResponse.json();
        throw new Error(errorData.error || 'Error al iniciar sesión');
        
      } catch (error: any) {
        console.error('Error en login con Google:', error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      // Guardar en localStorage (compatibilidad)
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      // Obtener el token de Firebase actualizado
      const user = authService.obtenerUsuarioActual();
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem('token', token);
        // Guardar en authStore (Zustand con persistencia)
        setAuthState(token, data.usuario);
      }
    },
    onError: (error: Error) => {
      console.error('Error en login con Google:', error);
    },
  });
};