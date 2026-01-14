import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '../../services/auth.services';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'react-hot-toast';
// Removido import de jugadorService - los equipos se cargarán cuando se necesiten
import { determinarRutaRedireccion } from '../../utils/authRedirect';

/**
 * Procesar usuario autenticado con Google (compartido entre popup y redirect)
 * Maneja login/registro en backend y retorna los datos del usuario
 */
const procesarUsuarioGoogle = async (user: any) => {
  // 1. Obtener token de Firebase
  const token = await user.getIdToken();
  
  // Pequeño delay para asegurar que el usuario esté establecido en Firebase
  await new Promise(resolve => setTimeout(resolve, 100));

  // 2. Intentar login en backend
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
    
    return { success: true, data: loginData, token };
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
      
      return { success: true, data: loginData, token };
    }
    
    // Si es otro error, relanzarlo
    throw loginError;
  }
};

export const useLoginGoogle = () => {
  const { login: setAuthState } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Manejar resultado del redirect cuando el usuario vuelve de Google
  useEffect(() => {
    // Solo procesar redirect en páginas de auth
    const authPages = ['/login', '/registro'];
    if (!authPages.includes(pathname)) return;

    const procesarRedirect = async () => {
      try {
        const redirectResult = await authService.obtenerResultadoRedirect();
        
        if (redirectResult.success && redirectResult.user) {
          // Procesar el usuario del redirect
          const resultado = await procesarUsuarioGoogle(redirectResult.user);
          
          if (resultado.success) {
            // Obtener token actualizado
            const token = await redirectResult.user.getIdToken(true);
            
            // Guardar en store
            setAuthState(token, resultado.data.usuario);
            
            // Redirigir según el estado del usuario
            const { ruta } = determinarRutaRedireccion(resultado.data.usuario);
            router.replace(ruta);
          }
        }
      } catch (error: any) {
        console.error('Error procesando redirect de Google:', error);
        
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
          toast.error('Error de conexión. Verifica que el servidor esté corriendo y tu conexión a internet.');
        } else {
          toast.error('Error al procesar la autenticación');
        }
      }
    };

    procesarRedirect();
  }, [pathname, router, setAuthState]);

  return useMutation({
    mutationFn: async () => {
      // 1. Login con Google en Firebase
      const firebaseResult = await authService.loginConGoogle();
      
      // Si es redirect, no hacer nada más (el useEffect manejará el resultado)
      if (firebaseResult.isRedirect) {
        return { isRedirect: true };
      }
      
      if (!firebaseResult.success) {
        throw new Error(firebaseResult.error);
      }

      const user = firebaseResult.user!;

      // 2. Procesar usuario (login/registro en backend)
      const resultado = await procesarUsuarioGoogle(user);
      
      if (!resultado.success) {
        throw new Error('Error al procesar usuario');
      }

      return resultado.data;
    },
    onSuccess: async (data) => {
      // Solo procesar si no es redirect (el redirect se maneja en useEffect)
      if ('isRedirect' in data && data.isRedirect) return;

      // Type guard: verificar que data tiene usuario (es el objeto de login normal)
      if (!('usuario' in data)) return;

      // Obtener el token de Firebase actualizado
      const user = authService.obtenerUsuarioActual();
      if (user && data.usuario) {
        // Obtener token actualizado
        const token = await user.getIdToken(true);
        
        // Guardar en authStore con los datos que ya recibimos del login
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