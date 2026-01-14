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
  // Ref para rastrear el usuario anterior y detectar cuando cambia de null a un usuario
  const previousUsuarioRef = useRef<typeof storeUsuario>(null);

  // Sincronizar usuario del store con el contexto
  useEffect(() => {
    if (storeUsuario && storeUsuario !== contextUsuario) {
      setUsuario(storeUsuario);
    }
    // Actualizar la referencia del usuario anterior
    previousUsuarioRef.current = storeUsuario || contextUsuario;
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

  // Detectar cambios en el usuario después de la inicialización
  // Esto permite actualizar el step cuando el usuario se registra con Google u otros métodos
  useEffect(() => {
    // Solo ejecutar después de la inicialización
    if (!isHydrated || !stepInitializedRef.current) return;

    const usuario = storeUsuario || contextUsuario;
    const previousUsuario = previousUsuarioRef.current;
    
    // Detectar si el usuario cambió de null/undefined a un usuario con datos (registro nuevo)
    // Comparar por uid para detectar cambios reales
    const usuarioAcabaDeLlegar = (!previousUsuario || !previousUsuario.uid) && usuario && usuario.uid;
    const usuarioCambio = previousUsuario?.uid !== usuario?.uid;

    // Si el usuario está en REGISTER y NO es un usuario que acaba de llegar o cambió, no recalcular
    // Esto permite que el usuario pueda volver al inicio sin que se recalcule el step
    if (currentStep === 'REGISTER' && !usuarioAcabaDeLlegar && !usuarioCambio) {
      // Actualizar la referencia antes de salir
      previousUsuarioRef.current = usuario;
      return;
    }

    if (!usuario) {
      previousUsuarioRef.current = null;
      return;
    }

    // Si el usuario ya tiene cuenta activada, redirigir al home
    if (usuario.cuenta_activada && usuario.estado === 'A') {
      router.replace('/home');
      previousUsuarioRef.current = usuario;
      return;
    }

    // Leer politicasAceptadas desde sessionStorage si no está en userData
    const politicasAceptadasStorage = typeof window !== 'undefined' 
      ? sessionStorage.getItem('politicas_aceptadas') 
      : null;
    const politicasAceptadas = userData.politicasAceptadas || !!politicasAceptadasStorage;

    // Determinar step basado en el estado actual del usuario
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

    // Actualizar el step si es diferente al actual O si el usuario acaba de llegar o cambió
    if (nextStep !== currentStep || usuarioAcabaDeLlegar || usuarioCambio) {
      setStep(nextStep);
    }

    // Actualizar la referencia después de procesar
    previousUsuarioRef.current = usuario;
  }, [storeUsuario, contextUsuario, userData.politicasAceptadas, currentStep, setStep, router, isHydrated]);

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

