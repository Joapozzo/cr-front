import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth.services';
import { useAuthStore } from '../../stores/authStore';
import { determinarRutaRedireccion } from '../../utils/authRedirect';
import { procesarUsuarioGoogle } from '../../utils/googleRedirectHandler';
import { usuariosProcesados } from './useAuthStateListener';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

/**
 * Hook para iniciar sesión con Google
 * 
 * Procesa INMEDIATAMENTE después del popup (desktop y mobile)
 * Igual que el proyecto que funciona
 */
export const useLoginGoogle = () => {
  const router = useRouter();
  const { login: setAuthState } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const firebaseResult = await authService.loginConGoogle();
      
      if (!firebaseResult.success) {
        throw new Error(firebaseResult.error || 'Error al iniciar sesión con Google');
      }

      // Siempre retornar el user (ya no hay redirect)
      return { user: firebaseResult.user! };
    },
    onSuccess: async (data) => {
      // ✅ PROCESAR INMEDIATAMENTE después del popup (como el proyecto que funciona)
      if (data.user) {
        const uid = data.user.uid;

        // ✅ GUARD: Verificar si ya está siendo procesado
        if (usuariosProcesados.has(uid)) {
          console.log(`[LOGIN GOOGLE] Usuario ${uid} ya está siendo procesado, saltando...`);
          return;
        }

        // Marcar como procesando ANTES de procesar
        usuariosProcesados.add(uid);

        try {
          console.log('[LOGIN GOOGLE] Procesando usuario inmediatamente...');
          
          // Procesar el usuario (login/registro en backend)
          const resultado = await procesarUsuarioGoogle(data.user);
          
          if (!resultado.success || !resultado.data?.usuario) {
            throw new Error('No se pudo procesar el usuario');
          }

          // Obtener token actualizado
          const token = await data.user.getIdToken(true);

          // Guardar en store
          setAuthState(token, resultado.data.usuario);

          console.log('[LOGIN GOOGLE] Usuario procesado exitosamente');

          // ✅ Determinar ruta pero NO redirigir si estamos en /login (dejar que useLoginController lo maneje)
          // Solo redirigir si estamos en /registro y la ruta es diferente, o si estamos en otra ruta
          const { ruta } = determinarRutaRedireccion(resultado.data.usuario);
          const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
          
          // ✅ Si estamos en /login, NO redirigir - useLoginController manejará la redirección
          // Esto permite que useLoginController controle el loginState correctamente
          if (currentPath === '/login') {
            console.log('[LOGIN GOOGLE] Estamos en /login, useLoginController manejará la redirección');
            return; // No redirigir aquí, el onSuccess de useLoginController lo hará
          }
          
          // ✅ NO redirigir si ya estamos en /registro (para evitar perder el estado del step)
          // El useEffect de useRegistrationFlow detectará el cambio de usuario y actualizará el step
          if (ruta === '/registro' && currentPath === '/registro') {
            console.log('[LOGIN GOOGLE] Ya estamos en /registro, el step se actualizará automáticamente');
            return;
          }
          
          // ✅ Redirigir si estamos en otra ruta
          console.log(`[LOGIN GOOGLE] Redirigiendo a: ${ruta}`);
          router.replace(ruta);
        } catch (error: any) {
          console.error('[LOGIN GOOGLE] Error procesando usuario:', error);
          
          // Remover del set para permitir reintento
          usuariosProcesados.delete(uid);
          
          toast.error(error.message || 'Error al procesar la autenticación');
          throw error; // Re-lanzar para que onError lo maneje
        }
      }
    },
    onError: (error: Error) => {
      console.error('❌ Error en login con Google:', error);
      const errorMessage = error.message || 'Error desconocido al autenticarse con Google';
      toast.error(errorMessage);
    },
  });
};