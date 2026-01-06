'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import { AiOutlineLock } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';
import { FaAngleRight } from 'react-icons/fa6';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { GoogleAuthButton } from '@/app/components/ui/GoogleAuthButton';
import { EmailAuthButton } from '@/app/components/ui/EmailAuthButton';
import { PasswordRequirements } from './PasswordRequirements';
import type { RegistroEmailFormData } from '@/app/lib/auth.validation';

interface RegisterFormViewProps {
    form: UseFormReturn<RegistroEmailFormData>;
    password: string | undefined;
    passwordValidations: {
        hasMinLength: boolean;
        hasLowerCase: boolean;
        hasUpperCase: boolean;
        hasNumber: boolean;
        hasSpecialChar: boolean;
    };
    isPending: boolean;
    isPendingGoogle: boolean;
    onSubmit: (data: RegistroEmailFormData) => void;
    onRegistroGoogle: () => void;
}

export const RegisterFormView = ({
    form,
    password,
    passwordValidations,
    isPending,
    isPendingGoogle,
    onSubmit,
    onRegistroGoogle,
}: RegisterFormViewProps) => {
    const { register, handleSubmit, formState: { errors } } = form;
    const [isEmailExpanded, setIsEmailExpanded] = useState(false);

    return (
        <div className="w-full flex flex-col items-center">
            {/* Cards Container */}
            <motion.div
                layout
                className="w-full grid grid-cols-1 gap-4 mb-6"
                animate={{
                    scale: isEmailExpanded ? 0.95 : 1,
                    opacity: isEmailExpanded ? 0.8 : 1,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                {/* 1. Google Card (Principal) */}
                <GoogleAuthButton
                    onClick={onRegistroGoogle}
                    disabled={isPendingGoogle}
                    isPending={isPendingGoogle}
                    isEmailExpanded={isEmailExpanded}
                    label="Regístrate con Google"
                />

                {/* 2. Email Card (Secundaria) */}
                <EmailAuthButton
                    onClick={() => setIsEmailExpanded(true)}
                    disabled={isEmailExpanded}
                    isEmailExpanded={isEmailExpanded}
                    label="Regístrate con tu mail"
                />
            </motion.div>

            {/* Expandable Email Form Section */}
            <AnimatePresence>
                {isEmailExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: 20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="w-full overflow-hidden"
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full bg-[var(--gray-400)]/30 border border-[var(--gray-300)] rounded-2xl p-6 lg:p-8 mb-6">
                            <div className="flex flex-col gap-4">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    icon={<MdEmail size={20} />}
                                    error={errors.email?.message}
                                    {...register('email')}
                                    autoComplete="email"
                                    className="h-12 text-base"
                                />

                                <Input
                                    type="password"
                                    placeholder="Contraseña"
                                    icon={<AiOutlineLock size={20} />}
                                    error={errors.password?.message}
                                    {...register('password')}
                                    autoComplete="new-password"
                                    className="h-12 text-base"
                                />

                                <Input
                                    type="password"
                                    placeholder="Confirmar contraseña"
                                    icon={<AiOutlineLock size={20} />}
                                    error={errors.confirmPassword?.message}
                                    {...register('confirmPassword')}
                                    autoComplete="new-password"
                                    className="h-12 text-base"
                                />
                            </div>

                            {/* Validaciones visuales */}
                            {password && (
                                <PasswordRequirements
                                    hasMinLength={passwordValidations.hasMinLength}
                                    hasLowerCase={passwordValidations.hasLowerCase}
                                    hasUpperCase={passwordValidations.hasUpperCase}
                                    hasNumber={passwordValidations.hasNumber}
                                    hasSpecialChar={passwordValidations.hasSpecialChar}
                                />
                            )}

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="h-12 text-base flex items-center justify-center gap-2 w-full mt-2"
                            >
                                {isPending ? (
                                    <>
                                        Registrando <Loader2 className="animate-spin w-5 h-5" />
                                    </>
                                ) : (
                                    <>
                                        Crear cuenta <FaAngleRight />
                                    </>
                                )}
                            </Button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Link to Login - Keeping it accessible */}
            <div className="flex justify-center mt-2">
                <Link
                    href="/login"
                    className="text-sm text-[var(--gray-200)] hover:text-[var(--color-primary)] transition-colors"
                >
                    ¿Ya tienes cuenta? <span className="font-semibold text-white">Inicia sesión</span>
                </Link>
            </div>

            <Toaster position="top-center" />
        </div>
    );
};

