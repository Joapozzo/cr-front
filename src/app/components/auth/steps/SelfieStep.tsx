'use client';

import { motion } from 'framer-motion';
import { SelfieForm } from '../SelfieForm';
import { useRegistrationContext } from '@/app/contexts/RegistrationContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/stores/authStore';
import { StepBackButton } from '../StepBackButton';

/**
 * Step de selfie
 * Wrapper del SelfieForm existente para integrarlo en el flujo
 */
export const SelfieStep = () => {
  const { updateUserData } = useRegistrationContext();
  const router = useRouter();
  const usuario = useAuthStore((state) => state.usuario);
  const [isLoading, setIsLoading] = useState(false);

  // Cuando el selfie se complete, el usuario tendrá cuenta_activada = true
  // El flujo detectará esto y redirigirá automáticamente
  useEffect(() => {
    if (usuario?.cuenta_activada) {
      updateUserData({ selfieCompletado: true });
      // Redirigir al home
      router.replace('/home');
    }
  }, [usuario?.cuenta_activada, updateUserData, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <div className="mb-4">
        <StepBackButton disabled={isLoading} />
      </div>
      <SelfieForm onLoadingChange={setIsLoading} />
    </motion.div>
  );
};

