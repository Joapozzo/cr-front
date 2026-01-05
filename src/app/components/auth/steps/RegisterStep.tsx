'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { registroEmailSchema, type RegistroEmailFormData } from '@/app/lib/auth.validation';
import { useRegisterStep } from '@/app/hooks/auth/steps/useRegisterStep';
import { useRegisterUI } from '@/app/hooks/auth/useRegisterUI';
import { RegisterFormView } from '../RegisterFormView';
import { StepBackButton } from '../StepBackButton';

export const RegisterStep = () => {
  const { handleRegisterEmail, handleRegisterGoogle, isPendingRegister, isPendingGoogle } = useRegisterStep();
  const { getPasswordValidations } = useRegisterUI();

  const form = useForm<RegistroEmailFormData>({
    resolver: zodResolver(registroEmailSchema),
    mode: 'onChange',
  });
  
  const { watch } = form;
  const password = watch('password');
  const passwordValidations = getPasswordValidations(password);

  const onSubmit = (data: RegistroEmailFormData) => {
    handleRegisterEmail(data.email, data.password);
  };

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
      <RegisterFormView
        form={form}
        password={password}
        passwordValidations={passwordValidations}
        isPending={isPendingRegister}
        isPendingGoogle={isPendingGoogle}
        onSubmit={onSubmit}
        onRegistroGoogle={handleRegisterGoogle}
      />
    </motion.div>
  );
};

