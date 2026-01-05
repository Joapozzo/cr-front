'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import { useRegistrationContext, type RegistrationStep } from '@/app/contexts/RegistrationContext';

/**
 * Hook principal que maneja la lógica del flujo de registro
 * Separa la lógica de negocio del renderizado para mejor rendimiento
 */
export const useRegistrationFlow = () => {
  const router = useRouter();
  const { usuario: storeUsuario, isHydrated } = useAuthStore();
  const {
    currentStep,
    setStep,
    updateUserData,
    setUsuario,
    userData,
    usuario: contextUsuario,
  } = useRegistrationContext();

  // Ref para rastrear si ya se estableció el step inicial
  const stepInitializedRef = useRef(false);

  // Sincronizar usuario del store con el contexto
  useEffect(() => {
    if (storeUsuario && storeUsuario !== contextUsuario) {
      setUsuario(storeUsuario);
    }
  }, [storeUsuario, contextUsuario, setUsuario]);

  // Determinar el step inicial basado en el estado del usuario (solo una vez)
  useEffect(() => {
    if (!isHydrated || stepInitializedRef.current) return;

    const usuario = storeUsuario || contextUsuario;
    if (!usuario) {
      setStep('REGISTER');
      stepInitializedRef.current = true;
      return;
    }

    // Si el usuario ya tiene cuenta activada, redirigir al home
    if (usuario.cuenta_activada && usuario.estado === 'A') {
      router.replace('/home');
      stepInitializedRef.current = true;
      return;
    }

    // Leer politicasAceptadas desde sessionStorage si no está en userData
    const politicasAceptadasStorage = typeof window !== 'undefined' 
      ? sessionStorage.getItem('politicas_aceptadas') 
      : null;
    const politicasAceptadas = userData.politicasAceptadas || !!politicasAceptadasStorage;
    
    // Si hay en sessionStorage pero no en userData, actualizar
    if (politicasAceptadasStorage && !userData.politicasAceptadas) {
      updateUserData({ politicasAceptadas: true });
    }

    // Determinar step basado en el estado del usuario
    let nextStep: RegistrationStep = 'REGISTER';

    if (!usuario.email_verificado) {
      nextStep = 'EMAIL_VERIFICATION';
    } else if (!politicasAceptadas) {
      nextStep = 'POLICIES';
    } else if (!usuario.dni_validado) {
      nextStep = 'DNI_VALIDATION';
    } else if (!usuario.cuenta_activada) {
      nextStep = 'SELFIE';
    }

    setStep(nextStep);
    stepInitializedRef.current = true;
  }, [isHydrated, storeUsuario, contextUsuario, userData.politicasAceptadas, setStep, router, updateUserData]);

  // Siempre mostrar los 5 steps completos
  const availableSteps = useMemo(() => {
    return [
      'REGISTER',
      'EMAIL_VERIFICATION',
      'POLICIES',
      'DNI_VALIDATION',
      'SELFIE',
    ];
  }, []);

  // Obtener el número del step actual (1-based) basado en availableSteps
  const currentStepNumber = useMemo(() => {
    return availableSteps.indexOf(currentStep) + 1;
  }, [currentStep, availableSteps]);

  // Siempre 5 steps
  const totalSteps = 5;

  return {
    currentStep,
    currentStepNumber,
    totalSteps,
    availableSteps,
    userData,
    updateUserData,
  };
};

