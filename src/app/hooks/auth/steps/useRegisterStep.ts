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
  const { updateUserData, setUsuario, goToNextStep, setStep } = useRegistrationContext();
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
        // Solo procesar si no es redirect (el redirect se maneja en useEffect de useLoginGoogle)
        if ('isRedirect' in data && data.isRedirect) return;
        
        // Type guard: verificar que data tiene usuario
        if (!('usuario' in data)) return;
        
        // Actualizar contexto con usuario
        setUsuario(data.usuario);
        updateUserData({ email: data.usuario.email });
        
        // Forzar actualización del step basado en el estado del usuario
        // Esto asegura que el step se actualice inmediatamente sin esperar al useEffect
        const politicasAceptadasStorage = typeof window !== 'undefined' 
          ? sessionStorage.getItem('politicas_aceptadas') 
          : null;
        const politicasAceptadas = !!politicasAceptadasStorage;
        
        let nextStep: 'REGISTER' | 'EMAIL_VERIFICATION' | 'POLICIES' | 'DNI_VALIDATION' | 'SELFIE' = 'REGISTER';
        
        if (!data.usuario.email_verificado) {
          nextStep = 'EMAIL_VERIFICATION';
        } else if (!politicasAceptadas) {
          nextStep = 'POLICIES';
        } else if (!data.usuario.dni_validado) {
          nextStep = 'DNI_VALIDATION';
        } else if (!data.usuario.cuenta_activada) {
          nextStep = 'SELFIE';
        }
        
        // Actualizar el step inmediatamente
        setStep(nextStep);
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

