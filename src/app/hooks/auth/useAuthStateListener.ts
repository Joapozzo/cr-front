/**
 * Hook para escuchar cambios en el estado de autenticación de Firebase
 * SOLO para restauración de sesión (refresh, reopen browser)
 * NO procesa nuevos logins - eso se hace inmediatamente en useLoginGoogle
 */
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/app/lib/firebase.config';
import { useAuthStore } from '@/app/stores/authStore';
import { determinarRutaRedireccion } from '@/app/utils/authRedirect';
import { procesarUsuarioGoogle } from '@/app/utils/googleRedirectHandler';
import { toast } from 'react-hot-toast';

// Set global para trackear usuarios procesados (por UID)
// Esto previene procesamiento duplicado incluso si hay múltiples listeners
// COMPARTIDO con useLoginGoogle para evitar race conditions
export const usuariosProcesados = new Set<string>();

/**
 * Limpia el tracking de usuarios procesados (útil para testing o logout)
 */
export const limpiarUsuariosProcesados = () => {
  usuariosProcesados.clear();
};

interface UseAuthStateListenerOptions {
  /**
   * Si es true, redirige automáticamente después de procesar el usuario
   * @default true
   */
  redirigir?: boolean;
  
  /**
   * Callback opcional que se ejecuta después de procesar el usuario exitosamente
   */
  onUsuarioProcesado?: (usuario: any) => void;
  
  /**
   * Callback opcional que se ejecuta cuando hay un error
   */
  onError?: (error: Error) => void;
}

/**
 * Hook que escucha cambios en el estado de autenticación
 * SOLO para restauración de sesión (refresh, reopen browser)
 */
export const useAuthStateListener = (options: UseAuthStateListenerOptions = {}) => {
  const router = useRouter();
  const { login: setAuthState, usuario: usuarioEnStore } = useAuthStore();
  const { redirigir = true, onUsuarioProcesado, onError } = options;
  
  const procesandoRef = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        procesandoRef.current = null;
        return;
      }

      const uid = user.uid;

      // ✅ GUARD #1: Si ya está en store, no procesar (ya fue procesado inmediatamente)
      if (usuarioEnStore?.uid === uid) {
        console.log(`[AUTH LISTENER] Usuario ${uid} ya está en store, saltando...`);
        usuariosProcesados.add(uid);
        return;
      }

      // ✅ GUARD #2: Si ya fue procesado, no procesar de nuevo
      if (usuariosProcesados.has(uid)) {
        console.log(`[AUTH LISTENER] Usuario ${uid} ya procesado, saltando...`);
        return;
      }

      // ✅ GUARD #3: Evitar procesamiento concurrente
      if (procesandoRef.current === uid) {
        console.log(`[AUTH LISTENER] Usuario ${uid} ya se está procesando, saltando...`);
        return;
      }

      // Marcar como procesando
      procesandoRef.current = uid;
      usuariosProcesados.add(uid);

      try {
        console.log(`[AUTH LISTENER] Restaurando sesión para usuario ${uid}...`);

        // Procesar el usuario (restauración de sesión)
        const resultado = await procesarUsuarioGoogle(user);

        if (!resultado.success || !resultado.data?.usuario) {
          throw new Error('No se pudo procesar el usuario');
        }

        // Obtener token actualizado
        const token = await user.getIdToken(true);

        // Guardar en store
        setAuthState(token, resultado.data.usuario);

        console.log(`[AUTH LISTENER] Sesión restaurada para usuario ${uid}`);

        if (onUsuarioProcesado) {
          onUsuarioProcesado(resultado.data.usuario);
        }

        if (redirigir) {
          const { ruta } = determinarRutaRedireccion(resultado.data.usuario);
          console.log(`[AUTH LISTENER] Redirigiendo a: ${ruta}`);
          router.replace(ruta);
        }

        procesandoRef.current = null;
      } catch (error: any) {
        console.error(`[AUTH LISTENER] Error restaurando sesión ${uid}:`, error);
        
        usuariosProcesados.delete(uid);
        procesandoRef.current = null;

        const errorMessage = error.message || 'Error al restaurar la sesión';
        toast.error(errorMessage);

        if (onError) {
          onError(error);
        }
      }
    });

    // Cleanup: desuscribirse cuando se desmonte
    return () => {
      unsubscribe();
    };
  }, [router, setAuthState, usuarioEnStore, redirigir, onUsuarioProcesado, onError]);
};


