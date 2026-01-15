import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { toast } from 'react-hot-toast';
import { useSubirSelfie } from '@/app/hooks/auth/useSubirSelfie';
import { obtenerToken, UsuarioAuth } from '@/app/services/auth.services';
import { api } from '@/app/lib/api';
import { useAuthStore } from '@/app/stores/authStore';
import { obtenerRutaHomePorRol } from '@/app/utils/authRedirect';
import { validarImagen, comprimirImagen } from '@/app/services/upload.service';
import { validarRostro } from '@/app/services/faceDetection.service';
import type { ModoCaptura } from './useSelfieState';

export interface UseSelfieUploadReturn {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSubmit: () => void;
  reiniciar: () => void;
  isPending: boolean;
}

/**
 * Hook para manejar la subida y validación de selfies
 * Incluye: carga de archivo, validación, compresión, subida al servidor, login automático
 */
export const useSelfieUpload = (
  fileInputRef: React.RefObject<HTMLInputElement>,
  selfieBase64: string | null,
  rostroValidado: boolean,
  setSelfieBase64: (base64: string | null) => void,
  setSelfiePreview: (preview: string | null) => void,
  setModo: (modo: ModoCaptura) => void,
  setRostroValidado: (validado: boolean) => void,
  setLoading: (loading: boolean) => void,
  setLoadingMessage: (message: string) => void,
  setLoginState: (state: 'idle' | 'loading' | 'success' | 'error') => void,
  detenerCamera: () => void
): UseSelfieUploadReturn => {
  const router = useRouter();
  const { mutate: subirSelfie, isPending } = useSubirSelfie();
  const { login } = useAuthStore();

  // Manejar archivo
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validacion = validarImagen(file);
    if (!validacion.valido) {
      toast.error(validacion.error || 'Archivo inválido');
      return;
    }

    try {
      setLoading(true);
      setLoadingMessage('Cargando imagen...');

      // Crear URL temporal para la imagen
      const imageUrl = URL.createObjectURL(file);

      // Validar que tenga un rostro válido
      setLoadingMessage('Validando rostro...');
      const validacionRostro = await validarRostro(imageUrl);

      if (!validacionRostro.valido) {
        URL.revokeObjectURL(imageUrl);
        toast.error(validacionRostro.mensaje || 'No se detectó un rostro válido en la imagen');
        setLoading(false);
        setLoadingMessage('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setLoadingMessage('Comprimiendo imagen...');
      const base64Comprimido = await comprimirImagen(file, 800, 800, 0.8);
      URL.revokeObjectURL(imageUrl);

      setSelfieBase64(base64Comprimido);
      setSelfiePreview(base64Comprimido);
      setModo('preview');
      setRostroValidado(true);

      toast.success('Imagen cargada y validada');
    } catch {
      toast.error('Error al procesar imagen');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  }, [
    fileInputRef,
    setLoading,
    setLoadingMessage,
    setSelfieBase64,
    setSelfiePreview,
    setModo,
    setRostroValidado,
  ]);

  // Limpiar y reiniciar
  const reiniciar = useCallback(() => {
    setSelfieBase64(null);
    setSelfiePreview(null);
    setModo('inicial');
    setRostroValidado(false);
    detenerCamera();
    localStorage.removeItem('selfie_preview');
    localStorage.removeItem('selfie_base64');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [
    setSelfieBase64,
    setSelfiePreview,
    setModo,
    setRostroValidado,
    detenerCamera,
    fileInputRef,
  ]);

  // Subir selfie
  const handleSubmit = useCallback(() => {
    if (!selfieBase64) {
      toast.error('Debe capturar o subir una foto');
      return;
    }

    if (!rostroValidado) {
      toast.error('La foto debe contener un rostro válido');
      return;
    }

    // Validar una vez más antes de subir (por seguridad)
    const validarFinal = async () => {
      try {
        const validacionFinal = await validarRostro(selfieBase64);
        if (!validacionFinal.valido) {
          toast.error(validacionFinal.mensaje || 'La foto no contiene un rostro válido');
          return false;
        }
        return true;
      } catch (error) {
        console.error('Error en validación final:', error);
        toast.error('Error al validar la foto');
        return false;
      }
    };

    validarFinal().then((isValid) => {
      if (!isValid) return;

      subirSelfie(
        { selfieBase64 },
        {
          onSuccess: async () => {
            // Cambiar a estado de loading
            setLoginState('loading');

            try {
              // Limpiar localStorage
              localStorage.removeItem('selfie_preview');
              localStorage.removeItem('selfie_base64');

              // Obtener token de Firebase (el usuario ya está autenticado)
              const token = await obtenerToken();
              if (!token) {
                throw new Error('No se pudo obtener el token de autenticación');
              }

              // Hacer login automático llamando al backend
              const response = await api.post('/auth/login', null, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              const data = response as {
                success: boolean;
                usuario: UsuarioAuth;
                proximoPaso: 'VERIFICAR_EMAIL' | 'VALIDAR_DNI' | 'SELFIE' | 'COMPLETO';
              };

              // Guardar datos en Zustand
              login(token, data.usuario);

              // Marcar que viene del registro completo para mostrar toast de bienvenida
              sessionStorage.setItem('registro_completo', 'true');
              sessionStorage.setItem('usuario_nombre', data.usuario.nombre);

              // Cambiar a estado de éxito
              setLoginState('success');

              // Obtener ruta home según el rol del usuario
              const rutaHome = obtenerRutaHomePorRol(data.usuario.rol);

              // Redirigir al home del usuario después de un breve delay
              setTimeout(() => {
                startTransition(() => {
                  router.replace(rutaHome);
                });
              }, 1200);
            } catch (err: unknown) {
              const error = err as { message?: string };
              console.error('Error al iniciar sesión automáticamente:', err);
              setLoginState('error');
              toast.error(error.message || 'Error al iniciar sesión');
              // Si falla, volver al modo preview después de un delay
              setTimeout(() => {
                setLoginState('idle');
                setModo('preview');
              }, 2000);
            }
          },
          onError: (error) => {
            toast.error(error.message || 'Error al subir selfie');
          },
        }
      );
    });
  }, [
    selfieBase64,
    rostroValidado,
    subirSelfie,
    setLoginState,
    setModo,
    login,
    router,
  ]);

  return {
    handleFileChange,
    handleSubmit,
    reiniciar,
    isPending,
  };
};

