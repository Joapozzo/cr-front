'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { MdEmail, MdMarkEmailRead } from 'react-icons/md';
import { FaAngleRight } from 'react-icons/fa6';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { useAuth } from '@/app/hooks/auth/useAuth';
import { authService } from '@/app/services/auth.services';

// Validación simple solo para email
const recuperarPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

type RecuperarPasswordFormData = z.infer<typeof recuperarPasswordSchema>;

export const RecuperarPasswordForm = () => {
  const router = useRouter();
  
  // 🔒 Redirigir si ya está autenticado
  useAuth({ redirectIfAuthenticated: true });
  
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [emailRegistrado, setEmailRegistrado] = useState('');
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RecuperarPasswordFormData>({
    resolver: zodResolver(recuperarPasswordSchema),
    mode: 'onChange',
  });

  const email = watch('email');

  const onSubmit = async (data: RecuperarPasswordFormData) => {
    setIsPending(true);
    try {
      const result = await authService.recuperarPassword(data.email);

      if (result.success) {
        setEmailRegistrado(data.email);
        setEmailEnviado(true);
        toast.success('Email de recuperación enviado');
      } else {
        toast.error('Error al enviar el email');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar el email');
    } finally {
      setIsPending(false);
    }
  };

  const handleReenviar = async () => {
    setIsPending(true);
    try {
      const result = await authService.recuperarPassword(emailRegistrado);

      if (result.success) {
        toast.success('Email reenviado correctamente');
      } else {
        toast.error('Error al reenviar el email');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al reenviar el email');
    } finally {
      setIsPending(false);
    }
  };

  // Si el email fue enviado, mostrar pantalla de confirmación
  if (emailEnviado) {
    return (
      <div className="flex flex-col gap-6 w-full">
        {/* Icono y mensaje */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
            <MdMarkEmailRead size={32} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Revisa tu email
            </h3>
            <p className="text-sm text-[var(--gray-200)]">
              Hemos enviado un enlace de recuperación a:
            </p>
            <p className="text-sm font-medium text-[var(--color-primary)] mt-1">
              {emailRegistrado}
            </p>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-[var(--gray-400)] rounded-lg p-4 space-y-3">
          <p className="text-xs text-[var(--gray-200)] leading-relaxed">
            Haz clic en el enlace del email para restablecer tu contraseña.
          </p>
          <p className="text-xs text-[var(--gray-200)] leading-relaxed">
            Si no ves el email, revisa tu carpeta de spam o correo no deseado.
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleReenviar}
            disabled={isPending}
            variant="secondary"
            className="flex items-center justify-center gap-2 w-full"
          >
            {isPending ? (
              <>
                Reenviando <Loader2 className="animate-spin w-4 h-4" />
              </>
            ) : (
              'Reenviar email'
            )}
          </Button>

          <button
            onClick={() => router.push('/login')}
            className="text-sm text-[var(--gray-200)] hover:text-[var(--color-primary)] transition-colors"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  // Formulario para ingresar email
  return (
    <div className="flex flex-col gap-6 w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
        {/* Descripción */}
        <p className="text-sm text-[var(--gray-200)]">
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {/* Input Email */}
        <Input
          type="email"
          placeholder="Email"
          icon={<MdEmail size={20} />}
          error={errors.email?.message}
          {...register('email')}
          autoComplete="email"
          autoFocus
        />

        {/* Botón Enviar */}
        <Button
          type="submit"
          disabled={!email || isPending}
          className="flex items-center justify-center gap-2 w-full"
        >
          {isPending ? (
            <>
              Enviando <Loader2 className="animate-spin w-4 h-4" />
            </>
          ) : (
            <>
              Enviar enlace <FaAngleRight />
            </>
          )}
        </Button>
      </form>

      {/* Link para volver al login */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => router.push('/login')}
          className="text-sm text-[var(--gray-200)] hover:text-[var(--color-primary)] transition-colors"
        >
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
};

