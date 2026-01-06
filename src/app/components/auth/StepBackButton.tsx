'use client';

import { HiArrowLeft } from 'react-icons/hi';
import { useRegistrationContext, type RegistrationStep } from '@/app/contexts/RegistrationContext';

interface StepBackButtonProps {
  className?: string;
}

/**
 * Botón para volver al step anterior en el flujo de registro
 */
export const StepBackButton = ({ className = '' }: StepBackButtonProps) => {
  const { goToPreviousStep, currentStep } = useRegistrationContext();

  const steps: RegistrationStep[] = [
    'REGISTER',
    'EMAIL_VERIFICATION',
    'POLICIES',
    'DNI_VALIDATION',
    'SELFIE',
  ];
  const currentIndex = steps.indexOf(currentStep);

  // No mostrar si estamos en el primer step
  if (currentIndex <= 0) {
    return null;
  }

  const handleGoBack = () => {
    goToPreviousStep();
  };

  return (
    <button
      onClick={handleGoBack}
      className={`
        flex items-center gap-2 text-[var(--gray-200)] hover:text-[var(--color-primary)] 
        transition-colors cursor-pointer w-fit
        ${className}
      `}
    >
      <HiArrowLeft />
      <span className="text-xs">Volver</span>
    </button>
  );
};

