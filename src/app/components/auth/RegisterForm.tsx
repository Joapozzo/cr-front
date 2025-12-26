'use client';

import { useState, useEffect, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { AiOutlineLock } from 'react-icons/ai';
import { MdEmail, MdMarkEmailRead } from 'react-icons/md';
import { FaAngleRight } from 'react-icons/fa6';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegistroEmail } from '@/app/hooks/auth/useRegistroEmail';
import { useVerificarEmail, useReenviarEmailVerificacion } from '@/app/hooks/auth/useVerificarEmail';
import { useAuth } from '@/app/hooks/auth/useAuth';
import { useLoginGoogle } from '@/app/hooks/auth/useLoginGoogle';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { BsGoogle } from 'react-icons/bs';
import { registroEmailSchema, type RegistroEmailFormData } from '@/app/lib/auth.validation';
import { proximoPasoARuta } from '@/app/utils/authRedirect';
import { useAuthStore } from '@/app/stores/authStore';

export const RegisterForm = () => {
    const router = useRouter();
    const usuario = useAuthStore((state) => state.usuario);
    
    // 🔒 Redirigir si ya está autenticado Y tiene cuenta activada (no durante registro)
    // Si está en proceso de registro (sin cuenta activada), permitir quedarse en /registro
    useAuth({ 
        redirectIfAuthenticated: usuario?.cuenta_activada === true 
    });
    
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [emailRegistrado, setEmailRegistrado] = useState('');

    const { mutate: registrarse, isPending } = useRegistroEmail();
    const { mutate: verificarEmail, isPending: isPendingVerificacion } = useVerificarEmail();
    const { mutate: reenviarEmail, isPending: isPendingReenvio } = useReenviarEmailVerificacion();
    const { mutate: loginGoogle, isPending: isPendingGoogle } = useLoginGoogle();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm<RegistroEmailFormData>({
        resolver: zodResolver(registroEmailSchema),
        mode: 'onChange',
    });
    const password = watch('password');
    const email = watch('email');

    // Si el usuario está autenticado pero no tiene email verificado y estamos en /registro,
    // mostrar pantalla de verificación automáticamente
    useEffect(() => {
        if (usuario && !usuario.email_verificado && !usuario.cuenta_activada && !registroExitoso) {
            // Usuario autenticado pero sin email verificado - mostrar pantalla de verificación
            setEmailRegistrado(usuario.email);
            setRegistroExitoso(true);
        }
        // Si el usuario ya tiene email verificado, no mostrar pantalla de verificación
        // (puede estar en proceso de redirección)
        if (usuario && usuario.email_verificado && registroExitoso) {
            // El email ya está verificado, no mostrar pantalla de verificación
            // El componente se redirigirá en handleVerificarEmail
        }
    }, [usuario, registroExitoso]);

    // Validaciones visuales de password
    const hasMinLength = password?.length >= 8;
    const hasLowerCase = /[a-z]/.test(password || '');
    const hasUpperCase = /[A-Z]/.test(password || '');
    const hasNumber = /[0-9]/.test(password || '');
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password || '');

    const onSubmit = (data: RegistroEmailFormData) => {
        registrarse(
            { email: data.email, password: data.password },
            {
                onSuccess: (result: any) => {
                    // TODOS los usuarios (incluyendo eventuales) deben verificar email primero
                    // Obtener email del resultado o del usuario en store
                    const emailParaMostrar = result?.usuario?.email || result?.user?.email || data.email;
                    
                    toast.success('¡Registro exitoso! Revisa tu email para verificar tu cuenta.');
                    setEmailRegistrado(emailParaMostrar);
                    setRegistroExitoso(true);
                },
                onError: (error) => {
                    toast.error(error.message);
                },
            }
        );
    };

    const handleVerificarEmail = () => {
        verificarEmail(undefined, {
            onSuccess: (result) => {
                // Usar el proximoPaso del backend para redirigir correctamente
                const proximoPaso = result?.proximoPaso || 'VALIDAR_DNI';
                const ruta = proximoPasoARuta(proximoPaso, usuario?.rol);
                
                startTransition(() => {
                    router.replace(ruta);
                });
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    };

    const handleReenviarEmail = () => {
        reenviarEmail(undefined, {
            onSuccess: () => {
                toast.success('Email de verificación reenviado. Revisa tu bandeja de entrada.');
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    };

    const handleRegistroGoogle = () => {
        loginGoogle(undefined, {
            onSuccess: (data) => {
                // Usar función centralizada para determinar ruta según el estado del usuario
                startTransition(() => {
                    const { ruta } = determinarRutaRedireccion(data.usuario);
                    router.replace(ruta);
                });
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    };

    // Si el usuario ya tiene email verificado, redirigir directamente
    useEffect(() => {
        if (usuario && usuario.email_verificado && !usuario.cuenta_activada) {
            // El email ya está verificado, redirigir al siguiente paso
            const { ruta } = determinarRutaRedireccion(usuario);
            if (ruta !== '/registro') {
                router.replace(ruta);
            }
        }
    }, [usuario, router]);

    // Si el registro fue exitoso, mostrar la pantalla de verificación
    // PERO solo si el email aún no está verificado
    if (registroExitoso && usuario && !usuario.email_verificado) {
        return (
            <div className="flex flex-col gap-6 w-full">
                {/* Icono y mensaje */}
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--green)]/10 flex items-center justify-center">
                        <MdMarkEmailRead size={32} className="text-[var(--green)]" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            Verifica tu email
                        </h3>
                        <p className="text-sm text-[var(--gray-200)]">
                            Hemos enviado un email de verificación a:
                        </p>
                        <p className="text-sm font-medium text-[var(--green)] mt-1">
                            {emailRegistrado}
                        </p>
                    </div>
                </div>

                {/* Instrucciones */}
                <div className="bg-[var(--gray-400)] rounded-lg p-4">
                    <p className="text-xs text-[var(--gray-200)] leading-relaxed">
                        Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación.
                        Una vez verificado, presiona el botón de abajo para continuar.
                    </p>
                </div>

                {/* Botones */}
                <div className="flex flex-col gap-3">
                    <Button
                        onClick={handleVerificarEmail}
                        disabled={isPendingVerificacion}
                        className="flex items-center justify-center gap-2 w-full"
                    >
                        {isPendingVerificacion ? (
                            <>
                                Verificando <Loader2 className="animate-spin w-4 h-4" />
                            </>
                        ) : (
                            <>
                                Ya verifiqué mi email <FaAngleRight />
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={handleReenviarEmail}
                        disabled={isPendingReenvio}
                        variant="secondary"
                        className="flex items-center justify-center gap-2 w-full"
                    >
                        {isPendingReenvio ? (
                            <>
                                Reenviando <Loader2 className="animate-spin w-4 h-4" />
                            </>
                        ) : (
                            'Reenviar email de verificación'
                        )}
                    </Button>
                </div>

                {/* Link a login */}
                <div className="flex justify-center pt-2">
                    <Link
                        href="/login"
                        className="text-sm text-[var(--gray-200)] hover:text-[var(--green)] transition-colors"
                    >
                        Volver al inicio de sesión
                    </Link>
                </div>

                <Toaster position="top-center" />
            </div>
        );
    }

    // Formulario de registro normal
    return (
        <div className="flex flex-col gap-4 lg:gap-5 w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 lg:gap-5 w-full">
                {/* Inputs */}
                <div className="flex flex-col gap-4">
                    <Input
                        type="email"
                        placeholder="Email"
                        icon={<MdEmail size={20} />}
                        error={errors.email?.message}
                        {...register('email')}
                        autoComplete="email"
                    />

                    <Input
                        type="password"
                        placeholder="Contraseña"
                        icon={<AiOutlineLock size={20} />}
                        error={errors.password?.message}
                        {...register('password')}
                        autoComplete="new-password"
                    />

                    <Input
                        type="password"
                        placeholder="Confirmar contraseña"
                        icon={<AiOutlineLock size={20} />}
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                        autoComplete="new-password"
                    />
                </div>

                {/* Validaciones visuales */}
                {password && (
                    <div className="bg-[var(--gray-400)] rounded-lg p-4 space-y-2">
                        <p className="text-xs font-medium text-[var(--gray-200)] mb-2">
                            Tu contraseña debe contener:
                        </p>
                        <div className="space-y-1.5">
                            <PasswordRequirement met={hasMinLength} text="Al menos 8 caracteres" />
                            <PasswordRequirement met={hasLowerCase} text="Una letra minúscula" />
                            <PasswordRequirement met={hasUpperCase} text="Una letra mayúscula" />
                            <PasswordRequirement met={hasNumber} text="Un número" />
                            <PasswordRequirement met={hasSpecialChar} text="Un carácter especial (!@#$%^&*)" />
                        </div>
                    </div>
                )}

                {/* Botón registrar */}
                <Button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 w-full"
                >
                    {isPending ? (
                        <>
                            Registrando <Loader2 className="animate-spin w-4 h-4" />
                        </>
                    ) : (
                        <>
                            Crear cuenta <FaAngleRight />
                        </>
                    )}
                </Button>
            </form>

            <div className="flex items-center gap-3 lg:gap-4 w-full py-2">
                <div className="flex-1 border-t border-[var(--gray-300)]"></div>
                <span className="text-xs lg:text-sm text-[var(--gray-300)] whitespace-nowrap">
                    O regístrate con
                </span>
                <div className="flex-1 border-t border-[var(--gray-300)]"></div>
            </div>

            <Button
                onClick={handleRegistroGoogle}
                disabled={isPendingGoogle}
                className="flex items-center justify-center gap-2 w-full"
            >
                {isPendingGoogle ? (
                    <>
                        Registrando <Loader2 className="animate-spin w-4 h-4" />
                    </>
                ) : (
                    <>
                        <BsGoogle size={18} />
                        Continuar con Google
                    </>
                )}
            </Button>

            {/* Link a login */}
            <div className="flex justify-center pt-2 lg:pt-4">
                <Link
                    href="/login"
                    className="text-xs lg:text-sm text-[var(--gray-200)] hover:text-[var(--green)] transition-colors"
                >
                    ¿Ya tienes cuenta? Inicia sesión
                </Link>
            </div>

            <Toaster position="top-center" />
        </div>
    );
};

// Componente auxiliar para los requisitos de password
const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2">
        <div
            className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-[var(--green)]' : 'bg-[var(--gray-200)]'
                }`}
        />
        <span
            className={`text-xs ${met ? 'text-[var(--green)]' : 'text-[var(--gray-200)]'
                }`}
        >
            {text}
        </span>
    </div>
);