'use client';

import { motion } from 'framer-motion';
import { ValidarDniForm } from '../ValidarDNIForm';
import { ValidarDniProvider } from '@/app/contexts/ValidarDniContext';
import { useRegistrationContext } from '@/app/contexts/RegistrationContext';
import { useAuthStore } from '@/app/stores/authStore';
import { StepBackButton } from '../StepBackButton';
import { useEffect, useRef } from 'react';

/**
 * Step de validación de DNI
 * Wrapper del ValidarDniForm existente para integrarlo en el flujo
 */
export const DniValidationStep = () => {
  const { updateUserData, goToNextStep, setUsuario, currentStep } = useRegistrationContext();
  const usuario = useAuthStore((state) => state.usuario);
  const hasNavigatedRef = useRef(false);

  // Detectar cuando el DNI se valida exitosamente y navegar al siguiente step
  useEffect(() => {
    // Solo ejecutar si estamos en el step de DNI_VALIDATION y aún no hemos navegado
    if (currentStep !== 'DNI_VALIDATION' || hasNavigatedRef.current) {
      return;
    }

    const storeUsuario = useAuthStore.getState().usuario;
    const currentUsuario = storeUsuario || usuario;
    
    if (currentUsuario?.dni_validado) {
      hasNavigatedRef.current = true;
      updateUserData({ dniValidado: true });
      // Actualizar usuario en contexto
      if (currentUsuario) {
        setUsuario(currentUsuario);
      }
      // Navegar al siguiente step (SELFIE)
      goToNextStep();
    }
  }, [usuario?.dni_validado, updateUserData, setUsuario, goToNextStep, currentStep]);

  // Reset el ref cuando cambiamos de step
  useEffect(() => {
    if (currentStep !== 'DNI_VALIDATION') {
      hasNavigatedRef.current = false;
    }
  }, [currentStep]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <div className="mb-4">
        <StepBackButton />
      </div>
      <ValidarDniProvider>
        <ValidarDniForm />
      </ValidarDniProvider>
    </motion.div>
  );
};

