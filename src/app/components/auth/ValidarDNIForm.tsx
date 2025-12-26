'use client';

import { useState, useEffect, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { FaAngleRight } from 'react-icons/fa6';
import { MdPerson } from 'react-icons/md';
import { HiIdentification } from 'react-icons/hi';
import { BsCalendarDate, BsPhone } from 'react-icons/bs';
import { GiSoccerBall } from 'react-icons/gi';
import { useQuery } from '@tanstack/react-query';
import { useParsearCodigoDNI } from '@/app/hooks/auth/useScanearDNI';
import { useParsearDniFoto } from '@/app/hooks/auth/useParsearDniFoto';
import { useValidarDniYDatos } from '@/app/hooks/auth/useValidarDniYDatos';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { ScannerDNI } from './ScanerDni';
import { ScanningAnimation } from './ScanningAnimation';
import { authService } from '@/app/services/auth.services';
import {
  validarDniYDatosSchema,
  type ValidarDniYDatosFormData,
} from '@/app/lib/auth.validation';
import { useAuth } from '@/app/hooks/auth/useAuth';
import { useValidarDniContext } from '@/app/contexts/ValidarDniContext';
import { useAuthStore, isDniDataExpired } from '@/app/stores/authStore';

export const ValidarDniForm = () => {
  const router = useRouter();
  const { step, setStep } = useValidarDniContext();
  const { dniEscaneado, setDniEscaneado, clearDniEscaneado } = useAuthStore();

  // ✅ Todos los hooks PRIMERO (antes de cualquier return)
  // Usar requireAuth: false para no bloquear la navegación, la validación se hace en el layout
  const { isAuthenticated } = useAuth({ requireAuth: false });
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('Escaneando DNI...');
  const parsearCodigo = useParsearCodigoDNI();
  const parsearFoto = useParsearDniFoto();
  const { mutate: validarDni, isPending: isPendingValidacion } = useValidarDniYDatos();

  // Hook para obtener posiciones de jugador
  const { data: posiciones, isLoading: isLoadingPosiciones } = useQuery({
    queryKey: ['posiciones-jugador-registro'],
    queryFn: () => authService.obtenerPosicionesJugador(),
    staleTime: 30 * 60 * 1000, // 30 minutos
    retry: 2,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ValidarDniYDatosFormData>({
    resolver: zodResolver(validarDniYDatosSchema),
    mode: 'onChange',
  });

  // Función auxiliar para actualizar formulario con datos del DNI
  const actualizarFormularioConDatosDNI = (
    datos: {
      dni: string;
      nombre: string;
      apellido: string;
      fechaNacimiento: string;
      sexo?: string;
    },
    guardarEnStore: boolean = true // Por defecto guardar en store
  ) => {
    setValue('dni', datos.dni);
    setValue('nombre', datos.nombre);
    setValue('apellido', datos.apellido);
    setValue('fechaNacimiento', datos.fechaNacimiento);

    // Guardar en store para persistencia (solo si se solicita)
    if (guardarEnStore) {
      setDniEscaneado({
        dni: datos.dni,
        nombre: datos.nombre,
        apellido: datos.apellido,
        fechaNacimiento: datos.fechaNacimiento,
        sexo: datos.sexo,
        timestamp: Date.now(),
      });
    }

    // Cambiar a vista de formulario
    setIsScanning(false);
    setIsProcessing(false);
    setStep('form');
    
    // Toast después del cambio de vista (pequeño delay para que el DOM se actualice)
    setTimeout(() => {
      toast.success('DNI procesado correctamente', {
        duration: 3000,
      });
    }, 100);
  };

  // Cargar datos del DNI escaneado si existen y no están expirados
  useEffect(() => {
    if (dniEscaneado && !isDniDataExpired(dniEscaneado)) {
      // Si hay datos guardados y no están expirados, cargarlos automáticamente
      setValue('dni', dniEscaneado.dni);
      setValue('nombre', dniEscaneado.nombre);
      setValue('apellido', dniEscaneado.apellido);
      setValue('fechaNacimiento', dniEscaneado.fechaNacimiento);
      
      // Cambiar directamente a vista de formulario sin mostrar toast
      setIsScanning(false);
      setIsProcessing(false);
      setStep('form');
    } else if (dniEscaneado && isDniDataExpired(dniEscaneado)) {
      // Si están expirados, limpiarlos
      clearDniEscaneado();
    }
  }, []); // Solo ejecutar al montar el componente

  // Handler cuando se escanea el código
  const handleScan = async (codigoBarras: string) => {
    try {
      // Mostrar estado de procesamiento INMEDIATAMENTE
      setIsScanning(false);
      setIsProcessing(true);
      setProcessingMessage('Procesando código de barras...');
      setStep('processing');

      // Pequeño delay para asegurar que React renderice el cambio de estado
      await new Promise(resolve => setTimeout(resolve, 100));

      const data = await parsearCodigo.mutateAsync({ codigoBarras });

      if (!data.exito || !data.datos) {
        setIsProcessing(false);
        setStep('scan');
        toast.error(data.error || 'Código de barras inválido');
        return;
      }

      actualizarFormularioConDatosDNI(data.datos);

    } catch (error: unknown) {
      setIsProcessing(false);
      setStep('scan');
      if (typeof error === "object" && error && "message" in error) {
        toast.error((error as { message: string }).message);
      } else {
        toast.error("Error desconocido al escanear DNI");
      }
    }
  };

  // Handler cuando se toma una foto
  const handlePhotoScan = async (imagenBase64: string) => {
    try {
      // Mostrar estado de procesamiento INMEDIATAMENTE
      setIsScanning(false);
      setIsProcessing(true);
      setProcessingMessage('Procesando foto...');
      setStep('processing');

      // Pequeño delay para asegurar que React renderice el cambio de estado
      await new Promise(resolve => setTimeout(resolve, 100));

      const data = await parsearFoto.mutateAsync({ imagenBase64 });

      if (!data.exito || !data.datos) {
        setIsProcessing(false);
        setStep('scan');
        toast.error(data.error || 'No se pudo leer el DNI. Asegúrate de que la foto sea clara y vuelve a intentar.');
        return;
      }

      actualizarFormularioConDatosDNI(data.datos);

    } catch (error: unknown) {
      console.error('Error al procesar foto del DNI:', error);
      setIsProcessing(false);
      setStep('scan');
      
      if (typeof error === "object" && error && "message" in error) {
        const errorMessage = (error as { message: string }).message;
        
        // Mensajes más específicos según el tipo de error
        if (errorMessage.includes('ERR_CERT_AUTHORITY_INVALID') || errorMessage.includes('certificado SSL') || errorMessage.includes('Error de certificado SSL')) {
          toast.error('Error de certificado SSL. En desarrollo, cambia NEXT_PUBLIC_API_URL a HTTP (http://192.168.0.13:3001) en tu archivo .env.local', {
            duration: 6000,
          });
        } else if (errorMessage.includes('timeout')) {
          toast.error('La solicitud tardó demasiado. Intenta con una imagen más pequeña o verifica tu conexión.');
        } else if (errorMessage.includes('No se pudieron extraer')) {
          toast.error('No se pudieron leer los datos del DNI. Asegúrate de que la foto muestre claramente: nombre, apellido, DNI y fecha de nacimiento.');
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("Error desconocido al procesar foto del DNI. Intenta nuevamente.");
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
        id_posicion: data.id_posicion, // Posición del jugador
      },
      {
        onSuccess: () => {
          // Redirigir inmediatamente al siguiente paso (selfie) sin bloquear
          startTransition(() => {
            router.replace('/selfie');
          });
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  // ✅ Mostrar skeleton durante la carga inicial o si no está autenticado
  if (isAuthenticated === undefined || !isAuthenticated) {
    // Mostrar skeleton durante la carga - mantener estructura
    return (
      <div className="w-full flex flex-col gap-4 lg:gap-5 flex-1 lg:flex-none justify-start">
        <div className="w-full h-56 lg:h-48 bg-[var(--gray-400)] rounded-lg border-2 border-dashed border-[var(--gray-300)] flex flex-col items-center justify-center gap-3 animate-pulse">
          <div className="relative w-56 lg:w-52 h-36 lg:h-32 bg-gradient-to-br from-[var(--gray-400)] to-[var(--gray-500)] rounded-xl border-2 border-[var(--green)]/30" />
        </div>
      </div>
    );
  }

  // Render: wrapper con Toaster siempre montado
  return (
    <>
      {/* Toaster global - siempre montado */}
      <Toaster position="top-center" />

      {/* Vista condicional según step */}
      {step === 'scan' ? (
        <ScannerDNI
          onScan={handleScan}
          onPhotoScan={handlePhotoScan}
          isScanning={isScanning}
          setIsScanning={setIsScanning}
        />
      ) : step === 'processing' ? (
        <ScanningAnimation message={processingMessage} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 lg:gap-5 w-full flex-1 lg:flex-none justify-center lg:justify-start">
          {/* Datos extraídos (readonly) */}
          <div className="flex flex-col gap-4">
            <div className="bg-[var(--green)]/10 border border-[var(--green)] rounded-lg p-4">
              <p className="text-xs text-[var(--green)]">
                ✓ Datos extraídos de tu DNI
              </p>
            </div>

            {/* Grid 2x2 para los 4 inputs */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="DNI"
                icon={<HiIdentification size={20} />}
                {...register('dni')}
                value={watch('dni') || ''}
                disabled
                className="opacity-70"
              />

              <Input
                placeholder="Nombre"
                icon={<MdPerson size={20} />}
                {...register('nombre')}
                value={watch('nombre') || ''}
                disabled
                className="opacity-70"
              />

              <Input
                placeholder="Apellido"
                icon={<MdPerson size={20} />}
                {...register('apellido')}
                value={watch('apellido') || ''}
                disabled
                className="opacity-70"
              />

              <Input
                placeholder="Fecha de nacimiento"
                icon={<BsCalendarDate size={18} />}
                {...register('fechaNacimiento')}
                value={watch('fechaNacimiento') || ''}
                disabled
                className="opacity-70"
              />
            </div>
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

            {/* Select de posición del jugador */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gray-200)]">
                  <GiSoccerBall size={18} />
                </div>
                <select
                  className="w-full h-12 pl-10 pr-4 bg-[var(--gray-400)] border border-[var(--gray-300)] rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--green)] focus:border-transparent transition-all"
                  {...register('id_posicion', { 
                    setValueAs: (v) => v === '' ? undefined : Number(v) 
                  })}
                  disabled={isLoadingPosiciones}
                >
                  <option value="" className="bg-[var(--gray-400)]">
                    {isLoadingPosiciones ? 'Cargando posiciones...' : 'Selecciona tu posición (opcional)'}
                  </option>
                  {posiciones?.map((pos) => (
                    <option 
                      key={pos.id_posicion} 
                      value={pos.id_posicion}
                      className="bg-[var(--gray-400)]"
                    >
                      {pos.nombre}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--gray-200)]">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <p className="text-xs text-[var(--gray-200)]">
                ¿En qué posición jugás habitualmente?
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col lg:flex-row gap-3">
            <Button
              type="submit"
              disabled={isPendingValidacion}
              className="flex items-center justify-center gap-2 w-full lg:flex-1"
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
              className="text-sm text-[var(--gray-200)] hover:text-[var(--green)] transition-colors text-center lg:text-left"
            >
              Volver a escanear DNI
            </button>
          </div>
        </form>
      )}
    </>
  );
};