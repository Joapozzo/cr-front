'use client';

import { AnimatePresence } from 'framer-motion';
import { useRegistrationFlow } from '@/app/hooks/auth/useRegistrationFlow';
import { RegisterStep } from './steps/RegisterStep';
import { EmailVerificationStep } from './steps/EmailVerificationStep';
import { PoliciesStep } from './steps/PoliciesStep';
import { DniValidationStep } from './steps/DniValidationStep';
import { SelfieStep } from './steps/SelfieStep';
import { LoadingScreen } from '../LoadingScreen';

/**
 * Componente principal que maneja el flujo de registro
 * Renderiza el step actual con transiciones fluidas
 */
export const RegistrationFlow = () => {
  const { currentStep, isInitializing, isPendingGoogle } = useRegistrationFlow();

  // ✅ Mostrar loading si Google está procesando O si se está inicializando el flujo
  // Esto asegura que el loader sea continuo desde que se hace clic en Google hasta que se muestra el step
  if (isInitializing || isPendingGoogle) {
    return (
      <LoadingScreen
        message={isPendingGoogle ? "Iniciando sesión con Google..." : "Cargando información..."}
        state="loading"
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      {currentStep === 'REGISTER' && (
        <RegisterStep key="register" />
      )}
      {currentStep === 'EMAIL_VERIFICATION' && (
        <EmailVerificationStep key="email-verification" />
      )}
      {currentStep === 'POLICIES' && (
        <PoliciesStep key="policies" />
      )}
      {currentStep === 'DNI_VALIDATION' && (
        <DniValidationStep key="dni-validation" />
      )}
      {currentStep === 'SELFIE' && (
        <SelfieStep key="selfie" />
      )}
    </AnimatePresence>
  );
};

