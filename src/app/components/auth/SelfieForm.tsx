'use client';

import { useState, useRef, useEffect, useCallback, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { Loader2, Camera, Upload, X, CheckCircle2, ScanFace, RefreshCw, Info } from 'lucide-react';
import { LoadingScreen } from '../LoadingScreen';
import { Button } from '../ui/Button';
import { useSubirSelfie } from '@/app/hooks/auth/useSubirSelfie';
import { useAuth } from '@/app/hooks/auth/useAuth';
import { obtenerToken, UsuarioAuth } from '@/app/services/auth.services';
import { api } from '@/app/lib/api';
import { useAuthStore } from '@/app/stores/authStore';
import { obtenerRutaHomePorRol } from '@/app/utils/authRedirect';
import {
  comprimirImagen,
  validarImagen,
  capturarFrameVideo,
  detenerCamara,
} from '@/app/services/upload.service';
import {
  validarRostro,
  detectarRostroEnTiempoReal,
  loadFaceModels,
} from '@/app/services/faceDetection.service';
import Image from 'next/image';

type ModoCaptura = 'inicial' | 'capturando' | 'preview';

export const SelfieForm = () => {
  const router = useRouter();
  const { mutate: subirSelfie, isPending } = useSubirSelfie();
  const { usuario, isAuthenticated } = useAuth({ requireAuth: false });
  const { login } = useAuthStore();

  // TODOS LOS HOOKS DEBEN IR ANTES DE CUALQUIER EARLY RETURN
  const [modo, setModo] = useState<ModoCaptura>('inicial');
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [selfieBase64, setSelfieBase64] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [rostroValidado, setRostroValidado] = useState(false);
  const [cameras, setCameras] = useState<{ deviceId: string; label: string }[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [showTips, setShowTips] = useState(false);

  // Estados para detección facial en tiempo real
  const [deteccionRostro, setDeteccionRostro] = useState<{
    tieneRostro: boolean;
    valido: boolean;
    mensaje?: string;
  }>({ tieneRostro: false, valido: false });
  const [contador, setContador] = useState<number | null>(null);
  const [modelsCargados, setModelsCargados] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stopDetectionRef = useRef<(() => void) | null>(null);
  const contadorIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const contadorRef = useRef<number | null>(null);

  // Detectar si es mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cargar modelos de face-api al montar
  useEffect(() => {
    loadFaceModels()
      .then(() => {
        setModelsCargados(true);
      })
      .catch((error) => {
        console.error('Error al cargar modelos:', error);
        toast.error('Error al cargar modelos de detección facial');
      });
  }, []);

  // Cargar selfie persistida al montar
  useEffect(() => {
    const savedSelfie = localStorage.getItem('selfie_preview');
    const savedBase64 = localStorage.getItem('selfie_base64');
    if (savedSelfie && savedBase64) {
      setSelfiePreview(savedSelfie);
      setSelfieBase64(savedBase64);
      setRostroValidado(true);
      setModo('preview');
    }
  }, []);

  // Persistir selfie cuando cambia
  useEffect(() => {
    if (selfiePreview && selfieBase64) {
      localStorage.setItem('selfie_preview', selfiePreview);
      localStorage.setItem('selfie_base64', selfieBase64);
    } else {
      localStorage.removeItem('selfie_preview');
      localStorage.removeItem('selfie_base64');
    }
  }, [selfiePreview, selfieBase64]);

  // Sincronizar token al montar (solo una vez, solo si no hay token)
  useEffect(() => {
    let mounted = true;

    const syncToken = async () => {
      try {
        const { useAuthStore } = await import('../../stores/authStore');
        const currentToken = useAuthStore.getState().token;

        // Solo sincronizar si no hay token en el store
        if (!currentToken) {
          const { auth } = await import('../../lib/firebase.config');
          const currentUser = auth.currentUser;

          if (mounted && currentUser) {
            const token = await currentUser.getIdToken();
            // Solo actualizar si el token es diferente
            if (token !== currentToken) {
              useAuthStore.getState().setToken(token);
            }
          }
        }
      } catch (error) {
        console.error('Error al sincronizar token:', error);
      }
    };

    syncToken();

    return () => {
      mounted = false;
    };
  }, []);

  // Cleanup de stream y detección
  useEffect(() => {
    return () => {
      if (stream) {
        detenerCamara(stream);
      }
      if (stopDetectionRef.current) {
        stopDetectionRef.current();
        stopDetectionRef.current = null;
      }
      if (contadorIntervalRef.current) {
        clearInterval(contadorIntervalRef.current);
        contadorIntervalRef.current = null;
      }
    };
  }, [stream]);

  // Sincronizar contadorRef con contador
  useEffect(() => {
    contadorRef.current = contador;
  }, [contador]);

  // Detener cámara (definido antes de capturarFoto para poder usarlo)
  const detenerCamera = useCallback(() => {
    if (stopDetectionRef.current) {
      stopDetectionRef.current();
      stopDetectionRef.current = null;
    }
    if (contadorIntervalRef.current) {
      clearInterval(contadorIntervalRef.current);
      contadorIntervalRef.current = null;
    }
    if (stream) {
      detenerCamara(stream);
      setStream(null);
    }
    setModo('inicial');
    setContador(null);
    setDeteccionRostro({ tieneRostro: false, valido: false });
  }, [stream]);

  // Capturar foto
  const capturarFoto = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      setLoading(true);

      // Detener detección antes de capturar
      if (stopDetectionRef.current) {
        stopDetectionRef.current();
        stopDetectionRef.current = null;
      }
      if (contadorIntervalRef.current) {
        clearInterval(contadorIntervalRef.current);
        contadorIntervalRef.current = null;
      }
      setContador(null);

      const base64Raw = capturarFrameVideo(videoRef.current, 0.8);

      // Validar que la foto capturada tenga un rostro válido
      const validacion = await validarRostro(base64Raw);

      if (!validacion.valido) {
        toast.error(validacion.mensaje || 'No se detectó un rostro válido en la foto');
        setLoading(false);
        // Reiniciar detección
        if (videoRef.current && modelsCargados) {
          const stopDetection = await detectarRostroEnTiempoReal(
            videoRef.current,
            (resultado) => {
              setDeteccionRostro(resultado);
              if (resultado.valido && contadorRef.current === null) {
                setContador(3);
                contadorRef.current = 3;
              } else if (!resultado.valido && contadorRef.current !== null) {
                setContador(null);
                contadorRef.current = null;
                if (contadorIntervalRef.current) {
                  clearInterval(contadorIntervalRef.current);
                  contadorIntervalRef.current = null;
                }
              }
            }
          );
          stopDetectionRef.current = stopDetection;
        }
        return;
      }

      const blob = await fetch(base64Raw).then(r => r.blob());
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });

      const base64Comprimido = await comprimirImagen(file, 800, 800, 0.8);

      setSelfieBase64(base64Comprimido);
      setSelfiePreview(base64Comprimido);
      detenerCamera();
      setModo('preview');
      setRostroValidado(true);

      toast.success('Foto capturada correctamente');
    } catch (error) {
      console.error('Error al capturar foto:', error);
      toast.error('Error al capturar foto');
    } finally {
      setLoading(false);
    }
  }, [modelsCargados, detenerCamera]);

  // Efecto para manejar el contador y captura automática
  useEffect(() => {
    if (contador === null) {
      contadorRef.current = null;
      return;
    }

    if (contador > 0) {
      contadorIntervalRef.current = setInterval(() => {
        setContador((prev) => {
          contadorRef.current = prev === null || prev <= 1 ? 0 : prev - 1;
          if (prev === null || prev <= 1) {
            if (contadorIntervalRef.current) {
              clearInterval(contadorIntervalRef.current);
              contadorIntervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (contador === 0 && deteccionRostro.valido && videoRef.current) {
      // Capturar automáticamente cuando el contador llega a 0
      void capturarFoto();
    }

    return () => {
      if (contadorIntervalRef.current) {
        clearInterval(contadorIntervalRef.current);
        contadorIntervalRef.current = null;
      }
    };
  }, [contador, deteccionRostro.valido, capturarFoto]);

  // Early return DESPUÉS de todos los hooks
  if (!isAuthenticated || !usuario) {
    return null;
  }

  // Cargar lista de cámaras
  const _cargarCamaras = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      await new Promise(resolve => setTimeout(resolve, 100));

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices.length > 0) {
        const camarasLista = videoDevices.map((device, index) => ({
          deviceId: device.deviceId,
          label: device.label || `Cámara ${index + 1}`,
        }));

        setCameras(camarasLista);

        const frontCamera = videoDevices.find((d) =>
          d.label.toLowerCase().includes('front') ||
          d.label.toLowerCase().includes('frontal') ||
          d.label.toLowerCase().includes('user')
        );

        setSelectedCamera(frontCamera?.deviceId || videoDevices[0].deviceId);
        return true;
      } else {
        toast.error('No se detectaron cámaras');
        return false;
      }
    } catch (err: unknown) {
      console.error('Error al cargar cámaras:', err);
      toast.error('Error al acceder a las cámaras. Verifica los permisos.');
      return false;
    }
  };


  // Iniciar cámara
  const iniciarCamara = async (deviceId?: string) => {
    try {
      setLoading(true);

      if (stream) {
        detenerCamara(stream);
      }

      const cameraId = deviceId || selectedCamera;

      // Para mobile, usar facingMode primero
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: isMobile
          ? {
              facingMode: 'user', // Prioridad para cámara frontal en mobile
              width: { ideal: 1280, max: 1920 },
              height: { ideal: 720, max: 1080 },
            }
          : cameraId
          ? {
              deviceId: cameraId,
              width: { ideal: 1280, max: 1920 },
              height: { ideal: 720, max: 1080 },
            }
          : {
              width: { ideal: 1280, max: 1920 },
              height: { ideal: 720, max: 1080 },
            }
      };

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

        setStream(mediaStream);
        setModo('capturando');
        setContador(null);
        setDeteccionRostro({ tieneRostro: false, valido: false });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;

          // Esperar a que el video esté listo antes de iniciar detección
          videoRef.current.onloadedmetadata = async () => {
            if (videoRef.current && modelsCargados) {
              // Iniciar detección en tiempo real
              const stopDetection = await detectarRostroEnTiempoReal(
                videoRef.current,
                (resultado) => {
                  setDeteccionRostro(resultado);

                  // Si el rostro es válido y no hay contador activo, iniciar contador de 3 segundos
                  if (resultado.valido && contadorRef.current === null) {
                    setContador(3);
                    contadorRef.current = 3;
                  } else if (!resultado.valido && contadorRef.current !== null) {
                    // Si el rostro deja de ser válido, cancelar contador
                    setContador(null);
                    contadorRef.current = null;
                    if (contadorIntervalRef.current) {
                      clearInterval(contadorIntervalRef.current);
                      contadorIntervalRef.current = null;
                    }
                  }
                }
              );
              stopDetectionRef.current = stopDetection;
            }
          };
        }

        toast.success('Cámara iniciada');
      } catch (primaryError: unknown) {
        // Fallback: intentar sin restricciones
        console.warn('Error con constraints específicos, intentando fallback:', primaryError);

        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });

        setStream(fallbackStream);
        setModo('capturando');
        setContador(null);
        setDeteccionRostro({ tieneRostro: false, valido: false });

        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;

          // Esperar a que el video esté listo antes de iniciar detección
          videoRef.current.onloadedmetadata = async () => {
            if (videoRef.current && modelsCargados) {
              // Iniciar detección en tiempo real
              const stopDetection = await detectarRostroEnTiempoReal(
                videoRef.current,
                (resultado) => {
                  setDeteccionRostro(resultado);

                  // Si el rostro es válido y no hay contador activo, iniciar contador de 3 segundos
                  if (resultado.valido && contadorRef.current === null) {
                    setContador(3);
                    contadorRef.current = 3;
                  } else if (!resultado.valido && contadorRef.current !== null) {
                    // Si el rostro deja de ser válido, cancelar contador
                    setContador(null);
                    contadorRef.current = null;
                    if (contadorIntervalRef.current) {
                      clearInterval(contadorIntervalRef.current);
                      contadorIntervalRef.current = null;
                    }
                  }
                }
              );
              stopDetectionRef.current = stopDetection;
            }
          };
        }

        toast.success('Cámara iniciada');
      }
    } catch (err: unknown) {
      console.error('Error al iniciar cámara:', err);

      const error = err as { name?: string };
      if (error.name === 'NotAllowedError') {
        toast.error('Permiso de cámara denegado');
      } else if (error.name === 'NotFoundError') {
        toast.error('No se encontró cámara');
      } else if (error.name === 'NotReadableError') {
        toast.error('La cámara está siendo usada por otra aplicación');
      } else {
        toast.error('Error al iniciar cámara');
      }

      setModo('inicial');
    } finally {
      setLoading(false);
    }
  };


  // Manejar archivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validacion = validarImagen(file);
    if (!validacion.valido) {
      toast.error(validacion.error || 'Archivo inválido');
      return;
    }

    try {
      setLoading(true);

      // Crear URL temporal para la imagen
      const imageUrl = URL.createObjectURL(file);

      // Validar que tenga un rostro válido
      const validacionRostro = await validarRostro(imageUrl);

      if (!validacionRostro.valido) {
        URL.revokeObjectURL(imageUrl);
        toast.error(validacionRostro.mensaje || 'No se detectó un rostro válido en la imagen');
        setLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

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
    }
  };

  // Limpiar y reiniciar
  const reiniciar = () => {
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
  };

  // Subir selfie
  const handleSubmit = async () => {
    if (!selfieBase64) {
      toast.error('Debe capturar o subir una foto');
      return;
    }

    if (!rostroValidado) {
      toast.error('La foto debe contener un rostro válido');
      return;
    }

    // Validar una vez más antes de subir (por seguridad)
    try {
      const validacionFinal = await validarRostro(selfieBase64);
      if (!validacionFinal.valido) {
        toast.error(validacionFinal.mensaje || 'La foto no contiene un rostro válido');
        return;
      }
    } catch (error) {
      console.error('Error en validación final:', error);
      toast.error('Error al validar la foto');
      return;
    }

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
  };


  // Render por modo
  return (
    <div className="flex flex-col gap-4 lg:gap-5 w-full h-full flex-1 min-h-0 overflow-y-auto lg:overflow-y-auto lg:max-h-full">
      <Toaster position="top-center" />

      {/* MODO: INICIAL */}
      {modo === 'inicial' && (
        <>
          {/* Consejos - Popup arriba */}
          <div className="relative flex justify-end -mt-2 lg:-mt-4 mb-1 flex-shrink-0">
            <button
              onClick={() => setShowTips(!showTips)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--gray-400)] hover:bg-[var(--gray-300)] text-[var(--gray-200)] transition-colors mt-5"
              aria-label="Ver consejos"
            >
              <Info size={18} />
            </button>

            {showTips && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowTips(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-64 bg-[var(--gray-400)] rounded-lg p-4 shadow-xl z-50 border border-[var(--gray-300)]">
                  <p className="text-xs text-[var(--gray-200)] font-medium mb-2">📋 Requisitos para la foto:</p>
                  <ul className="text-xs text-[var(--gray-200)] space-y-1">
                    <li>• Buena iluminación (preferiblemente luz natural)</li>
                    <li>• Rostro completamente visible y centrado</li>
                    <li>• Sin gafas de sol ni accesorios que cubran el rostro</li>
                    <li>• Fondo neutro</li>
                    <li>• Solo debe aparecer una persona</li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Ilustración/Guía */}
          <div className="bg-[var(--gray-400)] rounded-xl p-6 border border-[var(--gray-300)] flex-shrink-0">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-[var(--gray-300)] flex items-center justify-center">
                <ScanFace className="w-12 h-12 lg:w-16 lg:h-16 text-[var(--color-primary)]" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-base lg:text-lg font-semibold text-white">
                  Asegúrate de estar en un lugar bien iluminado
                </h3>
                <p className="text-xs lg:text-sm text-[var(--gray-200)]">
                  Te guiaremos paso a paso para obtener una foto perfecta
                </p>
              </div>
            </div>
          </div>

          {/* Botón único */}
          <div className="flex flex-col gap-3 flex-shrink-0">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="flex items-center justify-center gap-3 h-14 text-base flex-1"
            >
              <Upload className="w-5 h-5" />
              Subir Foto
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </>
      )}


      {/* MODO: CAPTURANDO */}
      {modo === 'capturando' && (
        <>
          {/* Consejos - Popup arriba */}
          <div className="relative flex justify-end -mt-2 lg:-mt-4 mb-1 flex-shrink-0">
            <button
              onClick={() => setShowTips(!showTips)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--gray-400)] hover:bg-[var(--gray-300)] text-[var(--gray-200)] transition-colors mt-5"
              aria-label="Ver consejos"
            >
              <Info size={18} />
            </button>

            {showTips && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowTips(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-64 bg-[var(--gray-400)] rounded-lg p-4 shadow-xl z-50 border border-[var(--gray-300)]">
                  <p className="text-xs text-[var(--gray-200)] font-medium mb-2">📋 Requisitos para la foto:</p>
                  <ul className="text-xs text-[var(--gray-200)] space-y-1">
                    <li>• Buena iluminación (preferiblemente luz natural)</li>
                    <li>• Rostro completamente visible y centrado</li>
                    <li>• Sin gafas de sol ni accesorios que cubran el rostro</li>
                    <li>• Fondo neutro</li>
                    <li>• Solo debe aparecer una persona</li>
                  </ul>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 flex-shrink-0">
            <h2 className="text-xl lg:text-2xl font-bold text-white">Posiciona tu rostro</h2>
            <p className="text-sm text-[var(--gray-200)]">
              Asegúrate de que tu rostro esté visible y bien iluminado
            </p>
          </div>

          {/* Video con overlay - Modal fullscreen en mobile */}
          {isMobile ? (
            <div className="fixed inset-0 z-50 bg-black flex flex-col">
              {/* Header con instrucciones */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 pt-safe">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={detenerCamera}
                    className="p-2 bg-black/50 rounded-full text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div className="flex-1 text-center">
                    <p className="text-white text-sm font-medium">
                      {deteccionRostro.valido ? 'Mantén la posición' : 'Posiciona tu rostro en el óvalo'}
                    </p>
                  </div>
                  <div className="w-10" /> {/* Spacer */}
                </div>
                {!deteccionRostro.valido && deteccionRostro.mensaje && (
                  <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-xs text-center">
                    {deteccionRostro.mensaje}
                  </div>
                )}
              </div>

              {/* Video fullscreen */}
              <div className="relative flex-1 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Guía oval grande para mobile */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`w-72 h-96 border-4 rounded-full transition-all ${deteccionRostro.valido
                    ? 'border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/50'
                    : 'border-white/50'
                    }`} />

                  {/* Contador */}
                  {contador !== null && contador > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-40 rounded-full bg-[var(--color-primary)]/90 flex items-center justify-center shadow-2xl">
                        <span className="text-7xl font-bold text-white">{contador}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones en la parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4 pb-safe">
                <div className="flex flex-col gap-3">
                  {contador === null && (
                    <Button
                      onClick={capturarFoto}
                      disabled={loading || !deteccionRostro.valido}
                      className="w-full h-14 text-base"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Capturando...
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5" />
                          {deteccionRostro.valido ? 'Capturar Foto' : 'Esperando rostro...'}
                        </>
                      )}
                    </Button>
                  )}
                  {contador !== null && contador > 0 && (
                    <div className="text-center">
                      <p className="text-white text-lg font-medium">
                        Mantén la posición... {contador}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--gray-400)] rounded-xl p-4 border border-[var(--gray-300)] flex-1 min-h-0 flex flex-col">
              <div className="relative flex-1 min-h-0 bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Guía oval con estado de detección */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`w-64 lg:w-80 border-4 rounded-full transition-all ${deteccionRostro.valido
                    ? 'border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/50'
                    : 'border-white/30'
                    }`} style={{ aspectRatio: '3/4' }} />

                  {/* Contador */}
                  {contador !== null && contador > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-[var(--color-primary)]/90 flex items-center justify-center shadow-2xl">
                        <span className="text-6xl font-bold text-white">{contador}</span>
                      </div>
                    </div>
                  )}

                  {/* Mensaje de estado */}
                  {contador === null && deteccionRostro.mensaje && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm max-w-xs text-center">
                      {deteccionRostro.mensaje}
                    </div>
                  )}
                </div>

                {/* Cambiar cámara (si hay múltiples y desktop) */}
                {cameras.length > 1 && (
                  <button
                    onClick={() => {
                      const currentIndex = cameras.findIndex(c => c.deviceId === selectedCamera);
                      const nextIndex = (currentIndex + 1) % cameras.length;
                      iniciarCamara(cameras[nextIndex].deviceId);
                    }}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors z-10"
                  >
                    <RefreshCw className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Controles - Solo en desktop */}
          {!isMobile && (
            <div className="flex flex-col lg:flex-row gap-3 flex-shrink-0">
              <Button
                onClick={detenerCamera}
                variant="secondary"
                className="flex items-center justify-center gap-2 flex-1"
                disabled={loading || contador !== null}
              >
                <X className="w-5 h-5" />
                Cancelar
              </Button>

              {/* Solo mostrar botón manual si no hay detección automática activa */}
              {contador === null && (
                <Button
                  onClick={capturarFoto}
                  disabled={loading || !deteccionRostro.valido}
                  className="flex items-center justify-center gap-2 flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Capturando...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" />
                      {deteccionRostro.valido ? 'Capturar Foto' : 'Esperando rostro...'}
                    </>
                  )}
                </Button>
              )}

              {/* Mostrar mensaje cuando está contando */}
              {contador !== null && contador > 0 && (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-[var(--gray-200)]">
                    Mantén la posición... {contador}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* MODO: PREVIEW */}
      {modo === 'preview' && selfiePreview && (
        <>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <h2 className="text-lg lg:text-xl font-semibold text-white">Revisa tu foto</h2>
          </div>

          <div className="bg-[var(--gray-400)] rounded-xl p-6 border border-[var(--gray-300)] flex-1 min-h-0 flex flex-col">
            <div className="relative aspect-square max-w-md mx-auto w-full bg-black rounded-lg overflow-hidden border-4 border-[var(--gray-300)] flex-shrink-0">
              <Image
                src={selfiePreview}
                alt="Selfie preview"
                fill
                className="object-cover"
              />

              {rostroValidado && (
                <div className="absolute top-4 right-4 bg-[var(--color-primary)] text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium shadow-lg">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Foto lista</span>
                </div>
              )}
            </div>

          </div>

          {/* Botones finales */}

          <div className="flex flex-col lg:flex-row gap-3 flex-shrink-0">
            <Button
              onClick={handleSubmit}
              disabled={isPending || !rostroValidado}
              className="flex items-center justify-center gap-2 flex-1"
              variant="success"
            >
              {isPending ? (
                <>
                  Subiendo...
                  <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  Confirmar
                  <CheckCircle2 className="w-5 h-5" />
                </>
              )}
            </Button>
            
            <Button
              onClick={reiniciar}
              disabled={isPending}
              variant="default"
              className="flex items-center justify-center gap-2 flex-1"
            >
              <RefreshCw className="w-5 h-5" />
              Tomar Otra
            </Button>
          </div>
        </>
      )}

      {/* Nota de privacidad */}
      <div className="text-center flex-shrink-0 pt-2">
        <p className="text-xs text-[var(--gray-300)]">
          🔒 Tu foto es privada y solo se usa para verificación de identidad en partidos
        </p>
      </div>

      {/* LoadingScreen para iniciar sesión */}
      {(loginState === 'loading' || loginState === 'success') && (
        <LoadingScreen
          message="Iniciando sesión"
          successMessage="¡Bienvenido!"
          state={loginState}
        />
      )}
    </div>
  );
};
