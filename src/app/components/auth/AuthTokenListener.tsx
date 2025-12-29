'use client';

import { useEffect } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '@/app/lib/firebase.config';
import { useAuthStore } from '@/app/stores/authStore';

/**
 * Componente que escucha los cambios de token de Firebase
 * y actualiza el store automáticamente cuando el token se renueva
 */
export const AuthTokenListener = () => {
  const { setToken, usuario } = useAuthStore();

  useEffect(() => {
    // Solo configurar el listener si hay un usuario autenticado
    if (!usuario) return;

    // Listener de cambios de token de Firebase
    // Este listener se ejecuta cuando el token cambia (renovación automática de Firebase)
    const unsubscribe = onIdTokenChanged(
      auth,
      async (user) => {
        if (user) {
          try {
            // Obtener el token actualizado (Firebase ya lo renovó automáticamente)
            // No forzar refresh aquí porque Firebase ya lo hizo
            const token = await user.getIdToken(false);
            // Actualizar el token en el store solo si cambió
            const { token: currentToken } = useAuthStore.getState();
            if (currentToken !== token) {
              setToken(token);
              console.log('Token actualizado automáticamente por Firebase');
            }
          } catch (error) {
            console.error('Error al actualizar token:', error);
          }
        } else {
          // Usuario cerró sesión, limpiar token
          setToken(null);
        }
      },
      (error) => {
        console.error('Error en listener de token:', error);
      }
    );

    // Renovar token proactivamente cada 50 minutos (los tokens expiran en 1 hora)
    // Esto asegura que el token siempre esté fresco antes de expirar
    const intervalId = setInterval(async () => {
      const user = auth.currentUser;
      if (user && usuario) {
        try {
          // Forzar renovación antes de que expire
          const token = await user.getIdToken(true); // Force refresh
          setToken(token);
          console.log('Token renovado proactivamente');
        } catch (error) {
          console.error('Error al renovar token periódicamente:', error);
        }
      }
    }, 50 * 60 * 1000); // 50 minutos (antes de que expire en 1 hora)

    // Cleanup
    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [usuario, setToken]);

  return null; // Este componente no renderiza nada
};

