import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useLogin } from './useLogin';
import { useLoginGoogle } from './useLoginGoogle';
import { useAuth } from './useAuth';
import { determinarRutaRedireccion } from '@/app/utils/authRedirect';

type LoginState = 'idle' | 'loading' | 'success' | 'error';

export const useLoginController = () => {
    const router = useRouter();
    
    // 🔒 Redirigir si ya está autenticado
    useAuth({ redirectIfAuthenticated: true });
    
    const { mutate: login, isPending } = useLogin();
    const { mutate: loginGoogle, isPending: isPendingGoogle } = useLoginGoogle();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginState, setLoginState] = useState<LoginState>('idle');

    const isFormValid = email.trim() !== '' && password.trim() !== '';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
                    toast.error(error.message);
                },
            }
        );
    };

    const handleLoginGoogle = () => {
        setLoginState('loading');
        
        loginGoogle(undefined, {
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
    };
};

