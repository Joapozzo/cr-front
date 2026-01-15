'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { UsuarioAuth } from '@/app/services/auth.services';

export type RegistrationStep = 
  | 'REGISTER'           // Paso 1: Formulario de registro
  | 'EMAIL_VERIFICATION' // Paso 2: Verificar email  
  | 'POLICIES'           // Paso 3: Políticas (todos los usuarios)
  | 'DNI_VALIDATION'     // Paso 4: Validar DNI
  | 'SELFIE'             // Paso 5: Selfie
  | 'COMPLETE';          // Paso 6: Completado

export interface RegistrationData {
  email?: string;
  password?: string;
  emailVerificado?: boolean;
  politicasAceptadas?: boolean;
  dniEscaneado?: {
    dni: string;
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    sexo?: string;
  };
  dniValidado?: boolean;
  selfieCompletado?: boolean;
}

interface RegistrationContextType {
  currentStep: RegistrationStep;
  userData: RegistrationData;
  usuario: UsuarioAuth | null;
  setStep: (step: RegistrationStep) => void;
  updateUserData: (data: Partial<RegistrationData>) => void;
  setUsuario: (usuario: UsuarioAuth | null) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  reset: () => void;
  isPendingGoogle: boolean;
  setIsPendingGoogle: (pending: boolean) => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

const initialStep: RegistrationStep = 'REGISTER';
const initialData: RegistrationData = {
  emailVerificado: false,
  politicasAceptadas: false,
  dniValidado: false,
  selfieCompletado: false,
};

export const RegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(initialStep);
  const [userData, setUserData] = useState<RegistrationData>(initialData);
  const [usuario, setUsuarioState] = useState<UsuarioAuth | null>(null);
  const [isPendingGoogle, setIsPendingGoogle] = useState(false);

  const setStep = useCallback((step: RegistrationStep) => {
    setCurrentStep(step);
  }, []);

  const updateUserData = useCallback((data: Partial<RegistrationData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  }, []);

  const setUsuario = useCallback((usuario: UsuarioAuth | null) => {
    setUsuarioState(usuario);
  }, []);

  const goToNextStep = useCallback(() => {
    const steps: RegistrationStep[] = [
      'REGISTER',
      'EMAIL_VERIFICATION',
      'POLICIES',
      'DNI_VALIDATION',
      'SELFIE',
      'COMPLETE',
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep]);

  const goToPreviousStep = useCallback(() => {
    const steps: RegistrationStep[] = [
      'REGISTER',
      'EMAIL_VERIFICATION',
      'POLICIES',
      'DNI_VALIDATION',
      'SELFIE',
      'COMPLETE',
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep]);

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
    setUserData(initialData);
    setUsuarioState(null);
  }, []);

  return (
    <RegistrationContext.Provider
      value={{
        currentStep,
        userData,
        usuario,
        setStep,
        updateUserData,
        setUsuario,
        goToNextStep,
        goToPreviousStep,
        reset,
        isPendingGoogle,
        setIsPendingGoogle,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistrationContext = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistrationContext must be used within RegistrationProvider');
  }
  return context;
};

