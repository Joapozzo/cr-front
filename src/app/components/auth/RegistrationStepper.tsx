'use client';

import { useRegistrationFlow } from '@/app/hooks/auth/useRegistrationFlow';
import { useRegistrationContext, type RegistrationStep } from '@/app/contexts/RegistrationContext';
import { Check } from 'lucide-react';

const stepLabels: Record<RegistrationStep, string> = {
  REGISTER: 'Registro',
  EMAIL_VERIFICATION: 'Verificar',
  POLICIES: 'Políticas',
  DNI_VALIDATION: 'Validar',
  SELFIE: 'Selfie',
  COMPLETE: 'Completo',
};

interface StepItemProps {
  step: RegistrationStep;
  stepNumber: number;
  isActive: boolean;
  isCompleted: boolean;
  isAvailable: boolean;
  onClick: () => void;
  isLast: boolean;
}

const StepItem = ({ step, stepNumber, isActive, isCompleted, isAvailable, onClick, isLast }: StepItemProps) => {
  if (!isAvailable) return null;

  return (
    <div className="flex-1 relative flex flex-col items-center">
      {/* Circle and Label Container */}
      <div className="flex flex-col items-center cursor-pointer relative z-10" onClick={onClick}>
        {/* Circle */}
        <div
          className={`
            w-10 h-10 rounded-full flex items-center justify-center
            transition-all duration-300 ease-out
            ${
              isCompleted
                ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90'
                : isActive
                ? 'bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/20'
                : 'bg-[var(--gray-400)] text-[var(--gray-200)] border-2 border-[var(--gray-300)] hover:border-[var(--color-primary)]/50'
            }
          `}
        >
          {isCompleted ? (
            <Check size={20} className="text-white" />
          ) : (
            <span className="text-sm font-semibold">{stepNumber}</span>
          )}
        </div>
        
        {/* Label */}
        <span
          className={`
            mt-2 text-xs font-medium text-center whitespace-nowrap
            transition-colors duration-200
            ${
              isActive
                ? 'text-[var(--color-primary)]'
                : isCompleted
                ? 'text-[var(--gray-200)] hover:text-[var(--color-primary)]'
                : 'text-[var(--gray-300)]'
            }
          `}
        >
          {stepLabels[step]}
        </span>
      </div>
      
      {/* Connector Line - from center of this circle to next circle center */}
      {!isLast && (
        <div
          className={`
            absolute top-5 left-1/2 h-0.5
            transition-colors duration-300 z-0
            ${isCompleted ? 'bg-[var(--color-primary)]' : 'bg-[var(--gray-400)]'}
          `}
          style={{
            width: '100%',
            transform: 'translateY(-50%)',
          }}
        />
      )}
    </div>
  );
};

export const RegistrationStepper = () => {
  const { currentStep, currentStepNumber, totalSteps, availableSteps } = useRegistrationFlow();
  const { setStep } = useRegistrationContext();

  const handleStepClick = (step: RegistrationStep) => {
    const currentIndex = availableSteps.indexOf(currentStep);
    const clickedIndex = availableSteps.indexOf(step);
    
    // Solo permitir navegar a steps completados o al actual
    if (clickedIndex <= currentIndex) {
      setStep(step);
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="flex items-start w-full">
        {availableSteps.map((step, index) => {
          const stepNumber = index + 1;
          const stepTyped = step as RegistrationStep;
          const isActive = stepTyped === currentStep;
          const isCompleted = availableSteps.indexOf(currentStep) > index;
          const isLast = index === availableSteps.length - 1;

          return (
            <StepItem
              key={step}
              step={stepTyped}
              stepNumber={stepNumber}
              isActive={isActive}
              isCompleted={isCompleted}
              isAvailable={true}
              onClick={() => handleStepClick(stepTyped)}
              isLast={isLast}
            />
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4 w-full h-1 bg-[var(--gray-400)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] transition-all duration-500 ease-out"
          style={{
            width: `${(currentStepNumber / totalSteps) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
