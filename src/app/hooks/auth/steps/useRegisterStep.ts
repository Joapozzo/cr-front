'use client';

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
  const { updateUserData, setUsuario, goToNextStep } = useRegistrationContext();
  const { login } = useAuthStore();
  const { mutate: registrarse, isPending: isPendingRegister } = useRegistroEmail();
  const { mutate: loginGoogle, isPending: isPendingGoogle } = useLoginGoogle();

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
    loginGoogle(undefined, {
      onSuccess: (data) => {
        // Actualizar contexto con usuario
        setUsuario(data.usuario);
        updateUserData({ email: data.usuario.email });
        
        // El flujo se actualizará automáticamente según el estado del usuario
        // No necesitamos llamar a goToNextStep manualmente aquí
        // El useRegistrationFlow detectará el cambio y ajustará el step
      },
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

