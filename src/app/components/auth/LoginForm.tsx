'use client';

import Link from 'next/link';
import { AiOutlineLock } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';
import { FaAngleRight } from 'react-icons/fa6';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { GoogleAuthButton } from '../ui/GoogleAuthButton';
import { EmailAuthButton } from '../ui/EmailAuthButton';
import { useLoginController } from '@/app/hooks/auth/useLoginController';
import { LoadingScreen } from '../LoadingScreen';

interface LoginFormProps {
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    isFormValid: boolean;
    isPending: boolean;
    isPendingGoogle: boolean;
    handleSubmit: (e: React.FormEvent) => void;
    handleLoginGoogle: () => void;
    isEmailExpanded: boolean;
    expandEmail: () => void;
}

const LoginFormUI = ({
    email,
    setEmail,
    password,
    setPassword,
    isFormValid,
    isPending,
    isPendingGoogle,
    handleSubmit,
    handleLoginGoogle,
    isEmailExpanded,
    expandEmail,
}: LoginFormProps) => {

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
                    onClick={handleLoginGoogle}
                    disabled={isPendingGoogle}
                    isPending={isPendingGoogle}
                    isEmailExpanded={isEmailExpanded}
                    label="Ingresá con Google"
                />

                {/* 2. Email Card (Secundaria) */}
                <EmailAuthButton
                    onClick={expandEmail}
                    disabled={isEmailExpanded}
                    isEmailExpanded={isEmailExpanded}
                    label="Ingresá con tu mail"
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
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full bg-[var(--gray-400)]/30 border border-[var(--gray-300)] rounded-2xl p-6 lg:p-10 mb-6">
                            <div className="flex flex-col gap-4">
                                <Input
                                    type="text"
                                    placeholder="Email"
                                    icon={<MdEmail size={20} />}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                    className="h-12 text-base"
                                />

                                <Input
                                    type="password"
                                    placeholder="Contraseña"
                                    icon={<AiOutlineLock size={20} />}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                    className="h-12 text-base"
                                />

                                <div className="flex justify-end">
                                    <Link
                                        href="/recuperar-password"
                                        className="text-sm text-[var(--gray-200)] hover:text-[var(--color-primary)] transition-colors"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={!isFormValid || isPending}
                                className="h-12 text-base flex items-center justify-center gap-2 w-full mt-2"
                            >
                                {isPending ? (
                                    <>
                                        Iniciando <Loader2 className="animate-spin w-5 h-5" />
                                    </>
                                ) : (
                                    <>
                                        Iniciar sesión <FaAngleRight />
                                    </>
                                )}
                            </Button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Link to Register - Keeping it accessible */}
            <div className="flex justify-center mt-2">
                <Link
                    href="/registro"
                    className="text-sm text-[var(--gray-200)] hover:text-[var(--color-primary)] transition-colors"
                >
                    ¿No tenes cuenta? <span className="font-semibold text-white">Regístrate</span>
                </Link>
            </div>
        </div>
    );
};

export const LoginForm = () => {
    const {
        email,
        setEmail,
        password,
        setPassword,
        loginState,
        isFormValid,
        isPending,
        isPendingGoogle,
        handleSubmit,
        handleLoginGoogle,
        isEmailExpanded,
        expandEmail,
    } = useLoginController();

    // Mostrar LoadingScreen si está en proceso de login
    if (loginState === 'loading' || loginState === 'success') {
        return (
            <LoadingScreen
                message="Iniciando sesión"
                successMessage="¡Bienvenido!"
                state={loginState}
            />
        );
    }

    return (
        <LoginFormUI
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isFormValid={isFormValid}
            isPending={isPending}
            isPendingGoogle={isPendingGoogle}
            handleSubmit={handleSubmit}
            handleLoginGoogle={handleLoginGoogle}
            isEmailExpanded={isEmailExpanded}
            expandEmail={expandEmail}
        />
    );
};