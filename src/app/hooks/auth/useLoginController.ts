import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useLogin } from './useLogin';
import { useLoginGoogle } from './useLoginGoogle';
import { useAuth } from './useAuth';
import { determinarRutaRedireccion } from '@/app/utils/authRedirect';
import { useEmailExpansion } from './useEmailExpansion';
import { useAuthStore } from '@/app/stores/authStore';

type LoginState = 'idle' | 'loading' | 'success' | 'error';

export const useLoginController = () => {
    const router = useRouter();
    const { usuario: storeUsuario, isHydrated } = useAuthStore();
    
    // 🔒 Redirigir si ya está autenticado
    useAuth({ redirectIfAuthenticated: true });
    
    const { mutate: login, isPending } = useLogin();
    const { mutate: loginGoogle, isPending: isPendingGoogle } = useLoginGoogle();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginState, setLoginState] = useState<LoginState>('idle');
    const [waitingForGoogleUser, setWaitingForGoogleUser] = useState(false);
    
    // Hook personalizado para manejar la expansión del formulario de email
    const { isEmailExpanded, expandEmail } = useEmailExpansion();

    const isFormValid = email.trim() !== '' && password.trim() !== '';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Limpiar toasts anteriores antes de iniciar un nuevo intento
        toast.dismiss();
        setLoginState('loading');

        login(
            { email, password },
            {
                onSuccess: (data) => {
                    setLoginState('success');

                    setTimeout(() => {
                        // Usar función centralizada para determinar ruta según el estado del usuario
                        const { ruta } = determinarRutaRedireccion(data.usuario);
                        router.push(ruta);
                    }, 1200);
                },
                onError: (error) => {
                    setLoginState('idle');
                    // Mantener el formulario expandido cuando falla el login para mejor UX
                    // No se colapsa el formulario, permitiendo al usuario corregir y reintentar
                    toast.error(error.message);
                },
            }
        );
    };

    // ✅ useEffect para manejar redirección después de que Google procesa el usuario
    useEffect(() => {
        if (!waitingForGoogleUser || !isHydrated || !storeUsuario) return;
        
        console.log('✅ [LOGIN] Usuario de Google detectado en store, redirigiendo...', storeUsuario);
        
        // Determinar ruta y redirigir según el estado de la cuenta
        const { ruta } = determinarRutaRedireccion(storeUsuario);
        console.log('🔵 [LOGIN] Usuario procesado, redirigiendo a:', ruta, 'para usuario:', storeUsuario);
        
        // Limpiar flag de espera
        setWaitingForGoogleUser(false);
        
        // ✅ Si la cuenta está incompleta (va a /registro), redirigir INMEDIATAMENTE
        // Si está completa, mostrar success brevemente y luego redirigir
        if (ruta === '/registro') {
            // Cuenta incompleta: redirigir inmediatamente sin mostrar success
            setLoginState('idle'); // Limpiar estado antes de redirigir
            router.replace(ruta); // Redirigir inmediatamente
        } else {
            // Cuenta completa: mostrar success brevemente
            setLoginState('success');
            setTimeout(() => {
                router.push(ruta);
                // Limpiar estado después de redirigir
                setTimeout(() => setLoginState('idle'), 100);
            }, 1200);
        }
    }, [waitingForGoogleUser, isHydrated, storeUsuario, router]);

    const handleLoginGoogle = () => {
        // Limpiar toasts anteriores antes de iniciar un nuevo intento
        toast.dismiss();
        setLoginState('loading');
        setWaitingForGoogleUser(true); // ✅ Marcar que estamos esperando el usuario de Google
        console.log('🚀 [LOGIN] Iniciando login con Google...');
        
        loginGoogle(undefined, {
            onSuccess: () => {
                // ✅ No hacer nada aquí - el useEffect detectará cuando el usuario esté en el store
                console.log('✅ [LOGIN] useLoginGoogle procesó el usuario, esperando actualización del store...');
                // El useEffect se encargará de redirigir cuando storeUsuario se actualice
            },
            onError: (error) => {
                console.error('❌ [LOGIN] Error en handleLoginGoogle:', error);
                setLoginState('idle');
                setWaitingForGoogleUser(false); // Limpiar flag de espera
                toast.error(error.message);
            },
        });
    };

    return {
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
    };
};

