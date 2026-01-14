import { useEffect, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useRegistroEmail } from './useRegistroEmail';
import { useVerificarEmail, useReenviarEmailVerificacion } from './useVerificarEmail';
import { useAuth } from './useAuth';
import { useLoginGoogle } from './useLoginGoogle';
import { proximoPasoARuta, determinarRutaRedireccion } from '@/app/utils/authRedirect';
import { useAuthStore } from '@/app/stores/authStore';
import type { RegistroEmailFormData } from '@/app/lib/auth.validation';

export const useRegisterController = () => {
    const router = useRouter();
    const usuario = useAuthStore((state) => state.usuario);
    
    // 🔒 Redirigir si ya está autenticado Y tiene cuenta activada (no durante registro)
    // Si está en proceso de registro (sin cuenta activada), permitir quedarse en /registro
    useAuth({ 
        redirectIfAuthenticated: usuario?.cuenta_activada === true 
    });
    
    const { mutate: registrarse, isPending } = useRegistroEmail();
    const { mutate: verificarEmail, isPending: isPendingVerificacion } = useVerificarEmail();
    const { mutate: reenviarEmail, isPending: isPendingReenvio } = useReenviarEmailVerificacion();
    const { mutate: loginGoogle, isPending: isPendingGoogle } = useLoginGoogle();

    const onSubmit = (data: RegistroEmailFormData, onSuccess: (email: string) => void) => {
        registrarse(
            { email: data.email, password: data.password },
            {
                onSuccess: (result: any) => {
                    // TODOS los usuarios (incluyendo eventuales) deben verificar email primero
                    // Obtener email del resultado o del usuario en store
                    const emailParaMostrar = result?.usuario?.email || result?.user?.email || data.email;
                    
                    // Si el email ya existía, mostrar mensaje diferente
                    if (result?.emailYaExiste) {
                        toast.success('Sesión iniciada. Revisa tu email para verificar tu cuenta.');
                    } else {
                        toast.success('¡Registro exitoso! Revisa tu email para verificar tu cuenta.');
                    }
                    
                    onSuccess(emailParaMostrar);
                },
                onError: (error) => {
                    toast.error(error.message);
                },
            }
        );
    };

    const handleVerificarEmail = (onSuccess: () => void) => {
        verificarEmail(undefined, {
            onSuccess: (result) => {
                // Usar el proximoPaso del backend para redirigir correctamente
                const proximoPaso = result?.proximoPaso || 'VALIDAR_DNI';
                const ruta = proximoPasoARuta(proximoPaso, usuario?.rol);
                
                startTransition(() => {
                    router.replace(ruta);
                });
                
                onSuccess();
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
                // Si es redirect, no hacer nada (el redirect se maneja en useEffect de useLoginGoogle)
                if ('isRedirect' in data && data.isRedirect) return;

                // Type guard: verificar que data tiene usuario (es el objeto de login normal)
                if (!('usuario' in data)) return;

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

    return {
        onSubmit,
        handleVerificarEmail,
        handleReenviarEmail,
        handleRegistroGoogle,
        isPending,
        isPendingVerificacion,
        isPendingReenvio,
        isPendingGoogle,
    };
};

