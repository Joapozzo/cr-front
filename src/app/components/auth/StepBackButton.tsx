'use client';

import { HiArrowLeft } from 'react-icons/hi';
import { useRegistrationContext, type RegistrationStep } from '@/app/contexts/RegistrationContext';
import { limpiarDatosRegistro } from '@/app/utils/registrationCleanup';

interface StepBackButtonProps {
  className?: string;
}

/**
 * Botón para volver al step anterior en el flujo de registro
 * Cuando se hace clic, limpia todos los datos del registro y vuelve al step REGISTER
 */
export const StepBackButton = ({ className = '' }: StepBackButtonProps) => {
  const { currentStep, reset, setStep, setUsuario } = useRegistrationContext();

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
    // Limpiar todos los datos del registro
    limpiarDatosRegistro();
    
    // Limpiar el usuario del contexto (para evitar que useRegistrationFlow recalcule)
    setUsuario(null);
    
    // Resetear el contexto de registro
    reset();
    
    // Volver al step REGISTER
    setStep('REGISTER');
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

