import { useState, useEffect } from 'react';
import { useAuthStore } from '@/app/stores/authStore';

export const useRegisterUI = () => {
    const usuario = useAuthStore((state) => state.usuario);
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [emailRegistrado, setEmailRegistrado] = useState('');

    // Asegurar que emailRegistrado tenga el email del usuario cuando se muestra la pantalla de verificación
    useEffect(() => {
        if (usuario && !usuario.email_verificado && usuario.email && !emailRegistrado) {
            setEmailRegistrado(usuario.email);
        }
    }, [usuario, emailRegistrado]);

    const handleRegistroExitoso = (email: string) => {
        setEmailRegistrado(email);
        setRegistroExitoso(true);
    };

    const handleVerificacionExitosa = () => {
        setRegistroExitoso(false);
    };

    const getPasswordValidations = (password: string | undefined) => {
        if (!password) {
            return {
                hasMinLength: false,
                hasLowerCase: false,
                hasUpperCase: false,
                hasNumber: false,
                hasSpecialChar: false,
            };
        }

        return {
            hasMinLength: password.length >= 8,
            hasLowerCase: /[a-z]/.test(password),
            hasUpperCase: /[A-Z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[^a-zA-Z0-9]/.test(password),
        };
    };

    const shouldShowVerificationView = () => {
        return (usuario && !usuario.email_verificado && !usuario.cuenta_activada) || registroExitoso;
    };

    return {
        registroExitoso,
        emailRegistrado,
        handleRegistroExitoso,
        handleVerificacionExitosa,
        getPasswordValidations,
        shouldShowVerificationView,
        usuario,
    };
};

