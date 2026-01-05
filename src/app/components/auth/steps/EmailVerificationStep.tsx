'use client';

import { motion } from 'framer-motion';
import { useEmailVerificationStep } from '@/app/hooks/auth/steps/useEmailVerificationStep';
import { EmailVerificationView } from '../EmailVerificationView';
import { StepBackButton } from '../StepBackButton';

export const EmailVerificationStep = () => {
  const {
    handleVerificar,
    handleReenviar,
    isPendingVerificacion,
    isPendingReenvio,
    email,
  } = useEmailVerificationStep();

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
      <EmailVerificationView
        email={email}
        isPendingVerificacion={isPendingVerificacion}
        isPendingReenvio={isPendingReenvio}
        onVerificar={handleVerificar}
        onReenviar={handleReenviar}
      />
    </motion.div>
  );
};

