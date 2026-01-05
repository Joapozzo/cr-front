'use client';

import { AnimatePresence } from 'framer-motion';
import { useRegistrationFlow } from '@/app/hooks/auth/useRegistrationFlow';
import { RegisterStep } from './steps/RegisterStep';
import { EmailVerificationStep } from './steps/EmailVerificationStep';
import { PoliciesStep } from './steps/PoliciesStep';
import { DniValidationStep } from './steps/DniValidationStep';
import { SelfieStep } from './steps/SelfieStep';

/**
 * Componente principal que maneja el flujo de registro
 * Renderiza el step actual con transiciones fluidas
 */
export const RegistrationFlow = () => {
  const { currentStep } = useRegistrationFlow();

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

