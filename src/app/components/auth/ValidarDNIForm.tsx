'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { FaAngleRight } from 'react-icons/fa6';
import { MdPerson } from 'react-icons/md';
import { HiIdentification } from 'react-icons/hi';
import { BsCalendarDate, BsPhone } from 'react-icons/bs';
import { useParsearCodigoDNI } from '@/app/hooks/auth/useScanearDNI';
import { useValidarDniYDatos } from '@/app/hooks/auth/useValidarDniYDatos';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { ScannerDNI } from './ScanerDni';
import { authService } from '@/app/services/auth.services';
import {
  validarDniYDatosSchema,
  type ValidarDniYDatosFormData,
} from '@/app/lib/auth.validation';
import { useAuth } from '@/app/hooks/auth/useAuth';

export const ValidarDniForm = () => {
  const router = useRouter();

  // ✅ Todos los hooks PRIMERO (antes de cualquier return)
  const { isAuthenticated } = useAuth(true);
  const [step, setStep] = useState<'scan' | 'form'>('scan');
  const [isScanning, setIsScanning] = useState(false);
  const parsearCodigo = useParsearCodigoDNI();
  const { mutate: validarDni, isPending: isPendingValidacion } = useValidarDniYDatos();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ValidarDniYDatosFormData>({
    resolver: zodResolver(validarDniYDatosSchema),
    mode: 'onChange',
  });

  // Handler cuando se escanea el código
  const handleScan = async (codigoBarras: string) => {
    try {
      const data = await parsearCodigo.mutateAsync({ codigoBarras });

      if (!data.exito || !data.datos) {
        toast.error(data.error || 'Código de barras inválido');
        return;
      }

      // Actualizar el formulario
      setValue('dni', data.datos.dni);
      setValue('nombre', data.datos.nombre);
      setValue('apellido', data.datos.apellido);
      setValue('fechaNacimiento', data.datos.fechaNacimiento);

      // Cambiar vista primero
      setIsScanning(false);
      setStep('form');
      
      // Toast después del cambio de vista (pequeño delay para que el DOM se actualice)
      setTimeout(() => {
        toast.success('DNI escaneado correctamente', {
          duration: 3000,
        });
      }, 100);

    } catch (error: unknown) {
      if (typeof error === "object" && error && "message" in error) {
        toast.error((error as { message: string }).message);
      } else {
        toast.error("Error desconocido al escanear DNI");
      }
    }
  };

  // Handler para confirmar datos
  const onSubmit = (data: ValidarDniYDatosFormData) => {
    const user = authService.obtenerUsuarioActual();
    if (!user) {
      toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
      router.push('/login');
      return;
    }

    validarDni(
      {
        uid: user.uid,
        dni: data.dni,
        nombre: data.nombre,
        apellido: data.apellido,
        fechaNacimiento: data.fechaNacimiento,
        username: data.username,
        telefono: data.telefono,
      },
      {
        onSuccess: () => {
          toast.success('¡Datos registrados! Ahora sube tu selfie.');

          setTimeout(() => {
            router.push('/selfie');
          }, 1500);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  // ✅ Return condicional si no está autenticado
  if (!isAuthenticated) return null;

  // Render: wrapper con Toaster siempre montado
  return (
    <>
      {/* Toaster global - siempre montado */}
      <Toaster position="top-center" />

      {/* Vista condicional según step */}
      {step === 'scan' ? (
        <ScannerDNI
          onScan={handleScan}
          isScanning={isScanning}
          setIsScanning={setIsScanning}
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
          {/* Datos extraídos (readonly) */}
          <div className="flex flex-col gap-4">
            <div className="bg-[var(--green)]/10 border border-[var(--green)] rounded-lg p-4">
              <p className="text-xs text-[var(--green)]">
                ✓ Datos extraídos de tu DNI
              </p>
            </div>

            <Input
              placeholder="DNI"
              icon={<HiIdentification size={20} />}
              {...register('dni')}
              disabled
              className="opacity-70"
            />

            <Input
              placeholder="Nombre"
              icon={<MdPerson size={20} />}
              {...register('nombre')}
              disabled
              className="opacity-70"
            />

            <Input
              placeholder="Apellido"
              icon={<MdPerson size={20} />}
              {...register('apellido')}
              disabled
              className="opacity-70"
            />

            <Input
              placeholder="Fecha de nacimiento (DD/MM/YYYY)"
              icon={<BsCalendarDate size={18} />}
              {...register('fechaNacimiento')}
              disabled
              className="opacity-70"
            />
          </div>

          {/* Datos a completar */}
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium text-white">
              Completa tus datos
            </p>

            <Input
              placeholder="Nombre de usuario"
              icon={<MdPerson size={20} />}
              error={errors.username?.message}
              {...register('username')}
              autoComplete="username"
            />

            <Input
              type="tel"
              placeholder="Teléfono"
              icon={<BsPhone size={18} />}
              error={errors.telefono?.message}
              {...register('telefono')}
              autoComplete="tel"
            />
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isPendingValidacion}
              className="flex items-center justify-center gap-2"
            >
              {isPendingValidacion ? (
                <>
                  Validando <Loader2 className="animate-spin w-4 h-4" />
                </>
              ) : (
                <>
                  Confirmar datos <FaAngleRight />
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={() => setStep('scan')}
              className="text-sm text-[var(--gray-200)] hover:text-[var(--green)] transition-colors"
            >
              Volver a escanear DNI
            </button>
          </div>
        </form>
      )}
    </>
  );
};