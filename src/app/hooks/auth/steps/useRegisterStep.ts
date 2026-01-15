'use client';

import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useRegistroEmail } from '../useRegistroEmail';
import { useLoginGoogle } from '../useLoginGoogle';
import { useRegistrationContext } from '@/app/contexts/RegistrationContext';
import { useAuthStore } from '@/app/stores/authStore';

/**
 * Hook separado para la lógica del step de registro
 * Evita cargar lógica innecesaria en el render
 */
export const useRegisterStep = () => {
  const { updateUserData, setUsuario, goToNextStep, setIsPendingGoogle } = useRegistrationContext();
  const { mutate: registrarse, isPending: isPendingRegister } = useRegistroEmail();
  const { mutate: loginGoogle, isPending: isPendingGoogle } = useLoginGoogle();

  // ✅ Sincronizar isPendingGoogle con el contexto
  useEffect(() => {
    setIsPendingGoogle(isPendingGoogle);
  }, [isPendingGoogle, setIsPendingGoogle]);

  const handleRegisterEmail = (email: string, password: string) => {
    registrarse(
      { email, password },
      {
        onSuccess: (result: any) => {
          const emailParaMostrar = result?.usuario?.email || result?.user?.email || email;
          
          if (result?.emailYaExiste) {
            toast.success('Sesión iniciada. Revisa tu email para verificar tu cuenta.');
          } else {
            toast.success('¡Registro exitoso! Revisa tu email para verificar tu cuenta.');
          }
          
          // Actualizar contexto
          updateUserData({ email: emailParaMostrar });
          
          // Si hay usuario en el resultado, actualizar
          if (result?.usuario) {
            setUsuario(result.usuario);
          }
          
          // Ir al siguiente step (verificación de email)
          goToNextStep();
        },
        onError: (error: Error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleRegisterGoogle = () => {
    // ✅ useLoginGoogle procesa el usuario inmediatamente y lo guarda en el store
    // useRegistrationFlow detectará el cambio y actualizará el step automáticamente
    loginGoogle(undefined, {
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  };

  return {
    handleRegisterEmail,
    handleRegisterGoogle,
    isPendingRegister,
    isPendingGoogle,
  };
};

