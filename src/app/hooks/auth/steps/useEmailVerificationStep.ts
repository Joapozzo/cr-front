'use client';

import { toast } from 'react-hot-toast';
import { useVerificarEmail, useReenviarEmailVerificacion } from '../useVerificarEmail';
import { useRegistrationContext } from '@/app/contexts/RegistrationContext';
import { useAuthStore } from '@/app/stores/authStore';

/**
 * Hook separado para la lógica del step de verificación de email
 */
export const useEmailVerificationStep = () => {
  const { goToNextStep, usuario: contextUsuario, setUsuario } = useRegistrationContext();
  const usuarioStore = useAuthStore((state) => state.usuario);
  const { mutate: verificarEmail, isPending: isPendingVerificacion } = useVerificarEmail();
  const { mutate: reenviarEmail, isPending: isPendingReenvio } = useReenviarEmailVerificacion();

  // Usar usuario del store si está disponible, sino del contexto
  const usuario = usuarioStore || contextUsuario;

  const handleVerificar = () => {
    verificarEmail(undefined, {
      onSuccess: (result) => {
        toast.success('Email verificado correctamente');
        
        // Actualizar usuario en contexto si hay cambios
        const storeUsuario = useAuthStore.getState().usuario;
        if (storeUsuario) {
          setUsuario(storeUsuario);
        }
        
        // Ir al siguiente step (políticas)
        goToNextStep();
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  };

  const handleReenviar = () => {
    reenviarEmail(undefined, {
      onSuccess: () => {
        toast.success('Email de verificación reenviado. Revisa tu bandeja de entrada.');
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  };

  return {
    handleVerificar,
    handleReenviar,
    isPendingVerificacion,
    isPendingReenvio,
    email: usuario?.email || '',
  };
};

