'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registroEmailSchema, type RegistroEmailFormData } from '@/app/lib/auth.validation';
import { useRegisterController } from '@/app/hooks/auth/useRegisterController';
import { useRegisterUI } from '@/app/hooks/auth/useRegisterUI';
import { EmailVerificationView } from './EmailVerificationView';
import { RegisterFormView } from './RegisterFormView';

export const RegisterForm = () => {
    const {
        onSubmit: onSubmitController,
        handleVerificarEmail,
        handleReenviarEmail,
        handleRegistroGoogle,
        isPending,
        isPendingVerificacion,
        isPendingReenvio,
        isPendingGoogle,
    } = useRegisterController();

    const {
        registroExitoso,
        emailRegistrado,
        handleRegistroExitoso,
        handleVerificacionExitosa,
        getPasswordValidations,
        shouldShowVerificationView,
        usuario,
    } = useRegisterUI();

    const form = useForm<RegistroEmailFormData>({
        resolver: zodResolver(registroEmailSchema),
        mode: 'onChange',
    });
    const { watch } = form;
    const password = watch('password');

    const passwordValidations = getPasswordValidations(password);

    const onSubmit = (data: RegistroEmailFormData) => {
        onSubmitController(data, handleRegistroExitoso);
    };

    const handleVerificar = () => {
        handleVerificarEmail(handleVerificacionExitosa);
    };

    // Si el usuario está autenticado pero no tiene email verificado, mostrar la pantalla de verificación
    // Esto funciona tanto para usuarios que acaban de registrarse como para usuarios que vuelven después de verificar
    // También mostrar si el registro fue exitoso (para cuando el usuario aún no está completamente en el store)
    if (shouldShowVerificationView()) {
        return (
            <EmailVerificationView
                email={emailRegistrado || usuario?.email || ''}
                isPendingVerificacion={isPendingVerificacion}
                isPendingReenvio={isPendingReenvio}
                onVerificar={handleVerificar}
                onReenviar={handleReenviarEmail}
            />
        );
    }

    // Formulario de registro normal
    return (
        <RegisterFormView
            form={form}
            password={password}
            passwordValidations={passwordValidations}
            isPending={isPending}
            isPendingGoogle={isPendingGoogle}
            onSubmit={onSubmit}
            onRegistroGoogle={handleRegistroGoogle}
        />
    );
};