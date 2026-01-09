'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { AiOutlineLock } from 'react-icons/ai';
import { FaAngleRight } from 'react-icons/fa6';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/app/lib/firebase.config';

// Validación para nueva contraseña
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);

  // Obtener el oobCode del link del email
  const oobCode = searchParams.get('oobCode');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const password = watch('password');

  // Validaciones visuales
  const hasMinLength = password?.length >= 8;
  const hasLowerCase = /[a-z]/.test(password || '');
  const hasUpperCase = /[A-Z]/.test(password || '');
  const hasNumber = /[0-9]/.test(password || '');
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password || '');

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!oobCode) {
      toast.error('Código de recuperación inválido o expirado');
      return;
    }

    setIsPending(true);
    try {
      // Cambiar contraseña usando el oobCode de Firebase
      await confirmPasswordReset(auth, oobCode, data.password);

      toast.success('¡Contraseña actualizada correctamente!');

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Error al restablecer contraseña:', error);

      let mensaje = 'Error al restablecer la contraseña';
      if (error.code === 'auth/expired-action-code') {
        mensaje = 'El enlace ha expirado. Solicita uno nuevo.';
      } else if (error.code === 'auth/invalid-action-code') {
        mensaje = 'Enlace inválido o ya usado. Solicita uno nuevo.';
      } else if (error.code === 'auth/weak-password') {
        mensaje = 'La contraseña es muy débil';
      }

      toast.error(mensaje);
    } finally {
      setIsPending(false);
    }
  };

  // Si no hay código, mostrar error
  if (!oobCode) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="bg-[var(--color-danger)]/10 border border-[var(--color-danger)] rounded-lg p-4">
          <p className="text-sm text-[var(--color-danger)] text-center">
            Enlace inválido o expirado
          </p>
        </div>
        <Button onClick={() => router.push('/recuperar-password')}>
          Solicitar nuevo enlace
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
        {/* Descripción */}
        <p className="text-sm text-[var(--gray-200)]">
          Ingresa tu nueva contraseña. Asegúrate de que sea segura.
        </p>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <Input
            type="password"
            placeholder="Nueva contraseña"
            icon={<AiOutlineLock size={20} />}
            error={errors.password?.message}
            {...register('password')}
            autoComplete="new-password"
            autoFocus
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
            <div className="space-y-1">
              <PasswordRequirement met={hasMinLength} text="Al menos 8 caracteres" />
              <PasswordRequirement met={hasLowerCase} text="Una letra minúscula" />
              <PasswordRequirement met={hasUpperCase} text="Una letra mayúscula" />
              <PasswordRequirement met={hasNumber} text="Un número" />
              <PasswordRequirement met={hasSpecialChar} text="Un carácter especial (!@#$%^&*)" />
            </div>
          </div>
        )}

        {/* Botón */}
        <Button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 w-full"
        >
          {isPending ? (
            <>
              Actualizando <Loader2 className="animate-spin w-4 h-4" />
            </>
          ) : (
            <>
              Cambiar contraseña <FaAngleRight />
            </>
          )}
        </Button>
      </form>

      {/* Link para volver */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => router.push('/login')}
          className="text-sm text-[var(--gray-200)] hover:text-[var(--color-primary)] transition-colors"
        >
          Volver al inicio de sesión
        </button>
      </div>

      <Toaster position="top-center" />
    </div>
  );
};

// Componente auxiliar para los requisitos de password
const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-1.5 h-1.5 rounded-full ${
        met ? 'bg-[var(--color-primary)]' : 'bg-[var(--gray-200)]'
      }`}
    />
    <span
      className={`text-xs ${
        met ? 'text-[var(--color-primary)]' : 'text-[var(--gray-200)]'
      }`}
    >
      {text}
    </span>
  </div>
);

