'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
    isPendingGoogle,
  } = useRegistrationContext();

  // Ref para rastrear si ya se estableció el step inicial
  const stepInitializedRef = useRef(false);
  // Ref para rastrear el usuario anterior y detectar cuando cambia de null a un usuario
  const previousUsuarioRef = useRef<typeof storeUsuario>(null);
  
  // ✅ Estado de inicialización: true mientras se determina el step inicial
  const [isInitializing, setIsInitializing] = useState(true);

  // Sincronizar usuario del store con el contexto
  useEffect(() => {
    if (storeUsuario && storeUsuario !== contextUsuario) {
      setUsuario(storeUsuario);
    }
    // ❌ NO actualizar previousUsuarioRef aquí - el segundo useEffect lo maneja
    // Esto permite que el segundo useEffect detecte cambios cuando el usuario se actualiza
  }, [storeUsuario, contextUsuario, setUsuario]);

  // Determinar el step inicial basado en el estado del usuario (solo una vez)
  useEffect(() => {
    if (!isHydrated || stepInitializedRef.current) {
      // Si ya está hidratado pero no inicializado, marcar como no inicializando
      if (isHydrated && stepInitializedRef.current) {
        setIsInitializing(false);
      }
      return;
    }

    const usuario = storeUsuario || contextUsuario;
    
    // ✅ Inicializar previousUsuarioRef en el primer render
    if (previousUsuarioRef.current === null) {
      previousUsuarioRef.current = usuario || null;
    }
    
    if (!usuario) {
      setStep('REGISTER');
      stepInitializedRef.current = true;
      setIsInitializing(false);
      return;
    }

    // Si el usuario ya tiene cuenta activada, redirigir al home
    if (usuario.cuenta_activada && usuario.estado === 'A') {
      router.replace('/home');
      stepInitializedRef.current = true;
      previousUsuarioRef.current = usuario;
      setIsInitializing(false);
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
    previousUsuarioRef.current = usuario; // ✅ Inicializar referencia después de determinar step inicial
    setIsInitializing(false);
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
    
    // ✅ También detectar si el usuario tiene datos diferentes (mismo UID pero diferentes estados)
    // Esto es importante cuando el usuario se actualiza después del login con Google
    const usuarioSeActualizo = usuario && previousUsuario && 
      usuario.uid === previousUsuario.uid && 
      (usuario.email_verificado !== previousUsuario.email_verificado ||
       usuario.dni_validado !== previousUsuario.dni_validado ||
       usuario.cuenta_activada !== previousUsuario.cuenta_activada);

    console.log('[REGISTRATION FLOW] Verificando cambios de usuario', {
      usuarioAcabaDeLlegar,
      usuarioCambio,
      usuarioSeActualizo,
      previousUid: previousUsuario?.uid,
      currentUid: usuario?.uid,
      previousEmailVerificado: previousUsuario?.email_verificado,
      currentEmailVerificado: usuario?.email_verificado,
      currentStep,
    });

    // ✅ Si el usuario acaba de llegar o cambió, SIEMPRE procesar
    // Si el usuario está en REGISTER y NO hay cambios detectados, no recalcular
    if (currentStep === 'REGISTER' && !usuarioAcabaDeLlegar && !usuarioCambio && !usuarioSeActualizo) {
      // Solo actualizar la referencia si no hay cambios (evitar loops)
      if (usuario && (!previousUsuario || previousUsuario.uid === usuario.uid)) {
        previousUsuarioRef.current = usuario;
      }
      return;
    }

    if (!usuario) {
      previousUsuarioRef.current = null;
      return;
    }

    // ✅ Si el usuario cambió o se actualizó, mostrar loading durante la transición
    if (usuarioAcabaDeLlegar || usuarioCambio || usuarioSeActualizo) {
      setIsInitializing(true);
    }

    // Si el usuario ya tiene cuenta activada, redirigir al home
    if (usuario.cuenta_activada && usuario.estado === 'A') {
      router.replace('/home');
      previousUsuarioRef.current = usuario;
      setIsInitializing(false);
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

    // Actualizar el step si es diferente al actual O si el usuario acaba de llegar, cambió o se actualizó
    if (nextStep !== currentStep || usuarioAcabaDeLlegar || usuarioCambio || usuarioSeActualizo) {
      console.log(`[REGISTRATION FLOW] ✅ Actualizando step de "${currentStep}" a "${nextStep}"`, {
        usuarioAcabaDeLlegar,
        usuarioCambio,
        usuarioSeActualizo,
        usuarioEstado: {
          email_verificado: usuario.email_verificado,
          dni_validado: usuario.dni_validado,
          cuenta_activada: usuario.cuenta_activada,
        },
        politicasAceptadas,
      });
      setStep(nextStep);
      // ✅ Usar requestAnimationFrame para actualizar inmediatamente sin delay
      requestAnimationFrame(() => {
        setIsInitializing(false);
        console.log('[REGISTRATION FLOW] Step actualizado, ocultando loading');
      });
    } else {
      console.log('[REGISTRATION FLOW] No se requiere actualización de step', {
        nextStep,
        currentStep,
      });
      setIsInitializing(false);
    }

    // ✅ Actualizar la referencia DESPUÉS de procesar el cambio
    // Esto asegura que el próximo cambio se detecte correctamente
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
    isInitializing, // ✅ Exponer estado de inicialización
    isPendingGoogle, // ✅ Exponer estado de loading de Google
  };
};

