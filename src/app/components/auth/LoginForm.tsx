'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { AiOutlineLock } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';
import { FaAngleRight } from 'react-icons/fa6';
import { useLogin } from '@/app/hooks/auth/useLogin';
import { useAuth } from '@/app/hooks/auth/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { BsGoogle } from 'react-icons/bs';
import { useLoginGoogle } from '@/app/hooks/auth/useLoginGoogle';
import { Loader2 } from 'lucide-react';
import { LoadingScreen } from '../LoadingScreen';

type LoginState = 'idle' | 'loading' | 'success' | 'error';


export const LoginForm = () => {
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
                        const paso = data.proximoPaso;

                        if (paso === 'VALIDAR_DNI') {
                            router.push('/validar-dni');
                            return;
                        }

                        if (paso === 'SELFIE') {
                            router.push('/selfie');
                            return;
                        }

                        // ✅ Login completo según rol
                        if (data.usuario.rol === 'ADMIN') {
                            router.push('/adm/dashboard');
                        } else if (data.usuario.rol === 'PLANILLERO') {
                            router.push('/planillero');
                        } else {
                            router.push('/home');
                        }
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
                    const paso = data.proximoPaso;

                    if (paso === 'VALIDAR_DNI') {
                        router.push('/validar-dni');
                        return;
                    }

                    if (paso === 'SELFIE') {
                        router.push('/selfie');
                        return;
                    }

                    // ✅ Login completo según rol
                    if (data.usuario.rol === 'ADMIN') {
                        router.push('/admin/dashboard');
                    } else if (data.usuario.rol === 'PLANILLERO') {
                        router.push('/planillero');
                    } else {
                        router.push('/perfil');
                    }
                }, 1200);
            },
            onError: (error) => {
                setLoginState('idle');
                toast.error(error.message);
            },
        });
    }

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
        <div className="flex flex-col gap-6 w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
                <div className="flex flex-col gap-4">
                    <Input
                        type="email"
                        placeholder="Email"
                        icon={<MdEmail size={20} />}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />

                    <Input
                        type="password"
                        placeholder="Contraseña"
                        icon={<AiOutlineLock size={20} />}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />

                    <div className="flex justify-end">
                        <Link
                            href="/recuperar-password"
                            className="text-sm text-[var(--gray-300)] hover:text-[var(--green)] transition-colors"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={!isFormValid || isPending}
                    className="flex items-center justify-center gap-2 w-full"
                >
                    {isPending ? (
                        <>
                            Iniciando <Loader2 className="animate-spin w-4 h-4" />
                        </>
                    ) : (
                        <>
                            Iniciar sesión <FaAngleRight />
                        </>
                    )}
                </Button>
            </form>

            <div className="flex items-center gap-4 w-full">
                <div className="flex-1 border-t border-[var(--gray-300)]"></div>
                <span className="text-sm text-[var(--gray-300)] whitespace-nowrap">
                    O inicia con
                </span>
                <div className="flex-1 border-t border-[var(--gray-300)]"></div>
            </div>

            <Button
                onClick={handleLoginGoogle}
                disabled={isPendingGoogle}
                className="flex items-center justify-center gap-2 w-full"
            >
                {isPendingGoogle ? (
                    <>
                        Iniciando <Loader2 className="animate-spin w-4 h-4" />
                    </>
                ) : (
                    <>
                        <BsGoogle size={18} />
                        Continuar con Google
                    </>
                )}
            </Button>

            <div className="flex justify-center pt-2">
                <Link
                    href="/registro"
                    className="text-sm text-[var(--gray-200)] hover:text-[var(--green)] transition-colors"
                >
                    ¿No tenes cuenta? Regístrate
                </Link>
            </div>

            <Toaster position="top-center" />
        </div>
    );
};