'use client';

import { useEffect } from 'react';
import { LoadingScreen } from '@/app/components/LoadingScreen';
import { useLogout } from '@/app/hooks/auth/useLogout';

export default function LogoutPage() {
  const { logout, state, error, retry } = useLogout();

  useEffect(() => {
    logout();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMessages = () => {
    switch (state) {
      case 'loading':
        return {
          message: 'Cerrando sesión',
          success: '',
          error: '',
        };
      case 'success':
        return {
          message: '',
          success: '¡Sesión cerrada exitosamente!',
          error: '',
        };
      case 'error':
        return {
          message: '',
          success: '',
          error: error || 'No se pudo cerrar sesión',
        };
      default:
        return {
          message: 'Procesando',
          success: '',
          error: '',
        };
    }
  };

  const messages = getMessages();

  return (
    <LoadingScreen
      message={messages.message}
      successMessage={messages.success}
      errorMessage={messages.error}
      state={state === 'idle' ? 'loading' : state}
      onRetry={state === 'error' ? retry : undefined}
    />
  );
}

