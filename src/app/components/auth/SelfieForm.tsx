'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { Loader2, Camera, Upload, X, CheckCircle2, AlertCircle, ScanFace } from 'lucide-react';
import { Button } from '../ui/Button';
import { useSubirSelfie } from '@/app/hooks/auth/useSubirSelfie';
import { useAuth } from '@/app/hooks/auth/useAuth';
import {
  comprimirImagen,
  validarImagen,
  capturarDesdeCamara,
  capturarFrameVideo,
  detenerCamara,
} from '@/app/services/upload.service';
import { validarSelfie, descargarModelosFaciales } from '@/app/services/face-detection.service';
import Image from 'next/image';

type ModoCaptura = 'ninguno' | 'camara' | 'archivo';

export const SelfieForm = () => {
  const router = useRouter();
  const { mutate: subirSelfie, isPending } = useSubirSelfie();
  const { usuario, isAuthenticated } = useAuth(true);

  // Si no está autenticado, no renderizar nada (useAuth redirige automáticamente)
  if (!isAuthenticated) return null;

  const [modoCaptura, setModoCaptura] = useState<ModoCaptura>('ninguno');
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [selfieBase64, setSelfieBase64] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [validandoRostro, setValidandoRostro] = useState(false);
  const [rostroValidado, setRostroValidado] = useState(false);
  const [advertenciasRostro, setAdvertenciasRostro] = useState<string[]>([]);
  const [cameras, setCameras] = useState<{ deviceId: string; label: string }[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar lista de cámaras disponibles
  const cargarCamaras = async () => {
    try {
      // Solicitar permisos primero
      await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Pequeño delay para que el sistema liste las cámaras
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length > 0) {
        const camarasLista = videoDevices.map((device, index) => ({
          deviceId: device.deviceId,
          label: device.label || `Cámara ${index + 1}`,
        }));
        
        setCameras(camarasLista);
        
        // Seleccionar cámara frontal por defecto (user)
        const frontCamera = videoDevices.find((d) =>
          d.label.toLowerCase().includes('front') ||
          d.label.toLowerCase().includes('frontal') ||
          d.label.toLowerCase().includes('user')
        );
        
        setSelectedCamera(frontCamera?.deviceId || videoDevices[0].deviceId);
      } else {
        toast.error('No se detectaron cámaras');
      }
    } catch (error: any) {
      console.error('Error al cargar cámaras:', error);
      toast.error('Error al acceder a las cámaras. Verifica los permisos.');
    }
  };

  // Iniciar cámara con dispositivo específico
  const iniciarCamara = async (deviceId?: string) => {
    try {
      setLoading(true);
      
      // Detener stream anterior si existe
      if (stream) {
        detenerCamara(stream);
      }
      
      const cameraId = deviceId || selectedCamera;

      // Preparar restricciones flexibles
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: cameraId 
          ? {
              deviceId: cameraId, // Sin "exact" para ser más flexible
              width: { ideal: 1280, max: 1920 },
              height: { ideal: 720, max: 1080 },
            }
          : {
              facingMode: 'user',
              width: { ideal: 1280, max: 1920 },
              height: { ideal: 720, max: 1080 },
            }
      };

      console.log('Intentando iniciar cámara con constraints:', constraints);

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(mediaStream);
      setModoCaptura('camara');

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      console.log('✅ Cámara iniciada exitosamente');
      toast.success('Cámara iniciada');
    } catch (error: any) {
      console.error('❌ Error al iniciar cámara:', error);
      
      // Mensaje de error más específico
      let mensaje = 'Error al acceder a la cámara';
      
      if (error.name === 'OverconstrainedError') {
        // Intentar sin restricciones específicas
        try {
          console.log('Reintentando sin restricciones específicas...');
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          
          setStream(fallbackStream);
          setModoCaptura('camara');

          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
          }
          
          console.log('✅ Cámara iniciada con configuración básica');
          toast.success('Cámara iniciada');
          return;
        } catch (fallbackError) {
          mensaje = 'Esta cámara no es compatible con las configuraciones solicitadas';
        }
      } else if (error.name === 'NotAllowedError') {
        mensaje = 'Permiso de cámara denegado';
      } else if (error.name === 'NotFoundError') {
        mensaje = 'No se encontró cámara';
      } else if (error.name === 'NotReadableError') {
        mensaje = 'La cámara está siendo usada por otra aplicación';
      }
      
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  // Cambiar cámara
  const cambiarCamara = async (deviceId: string) => {
    setSelectedCamera(deviceId);
    await iniciarCamara(deviceId);
  };

  // Detener cámara
  const detenerCamera = () => {
    if (stream) {
      detenerCamara(stream);
      setStream(null);
    }
    setModoCaptura('ninguno');
  };

  // Capturar foto desde cámara
  const capturarFoto = async () => {
    if (!videoRef.current) return;

    try {
      setLoading(true);
      
      // Capturar frame directamente y comprimir
      const base64Raw = capturarFrameVideo(videoRef.current, 0.8);
      
      // Convertir a blob y luego a file para comprimir
      const blob = await fetch(base64Raw).then(r => r.blob());
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      
      // Comprimir a máximo 800x800 con calidad 0.8
      const base64Comprimido = await comprimirImagen(file, 800, 800, 0.8);
      
      setSelfieBase64(base64Comprimido);
      setSelfiePreview(base64Comprimido);
      detenerCamera();
      
      // Validar rostro
      await validarRostroEnFoto(base64Comprimido);
      
      toast.success('Foto capturada');
    } catch (error) {
      console.error('Error al capturar foto:', error);
      toast.error('Error al capturar foto');
    } finally {
      setLoading(false);
    }
  };

  // Validar rostro en la foto
  const validarRostroEnFoto = async (base64: string) => {
    try {
      setValidandoRostro(true);
      setRostroValidado(false);
      setAdvertenciasRostro([]);

      const resultado = await validarSelfie(base64);

      if (resultado.valido) {
        setRostroValidado(true);
        toast.success(resultado.mensaje);
        
        if (resultado.advertencias && resultado.advertencias.length > 0) {
          setAdvertenciasRostro(resultado.advertencias);
        }
      } else {
        setRostroValidado(false);
        toast.error(resultado.mensaje);
        if (resultado.advertencias) {
          setAdvertenciasRostro(resultado.advertencias);
        }
      }
    } catch (error) {
      console.error('Error al validar rostro:', error);
      toast.error('Error al validar la foto. Intenta nuevamente.');
      setRostroValidado(false);
    } finally {
      setValidandoRostro(false);
    }
  };

  // Manejar selección de archivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar imagen
    const validacion = validarImagen(file);
    if (!validacion.valido) {
      toast.error(validacion.error || 'Archivo inválido');
      return;
    }

    try {
      setLoading(true);
      // Comprimir imagen más agresivamente: 800x800, calidad 0.8
      const base64Comprimido = await comprimirImagen(file, 800, 800, 0.8);
      setSelfieBase64(base64Comprimido);
      setSelfiePreview(base64Comprimido);
      setModoCaptura('ninguno');
      
      // Validar rostro
      await validarRostroEnFoto(base64Comprimido);
      
      toast.success('Imagen cargada');
    } catch (error) {
      toast.error('Error al procesar imagen');
    } finally {
      setLoading(false);
    }
  };

  // Limpiar selfie
  const limpiarSelfie = () => {
    setSelfieBase64(null);
    setSelfiePreview(null);
    setModoCaptura('ninguno');
    setRostroValidado(false);
    setAdvertenciasRostro([]);
    detenerCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Subir selfie
  const handleSubmit = () => {
    if (!selfieBase64) {
      toast.error('Debe capturar o subir una foto');
      return;
    }

    if (!rostroValidado) {
      toast.error('La foto debe contener un rostro válido');
      return;
    }

    subirSelfie(
      { selfieBase64 },
      {
        onSuccess: () => {
          toast.success('¡Registro completado exitosamente!');
          setTimeout(() => {
            router.push('/login');
          }, 1500);
        },
        onError: (error) => {
          toast.error(error.message || 'Error al subir selfie');
        },
      }
    );
  };

  // Cargar token, cámaras y modelos al montar
  useEffect(() => {
    // Obtener y guardar token de Firebase en el store
    const syncToken = async () => {
      const { auth } = await import('../../lib/firebase.config');
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        const token = await currentUser.getIdToken();
        const { useAuthStore } = await import('../../stores/authStore');
        useAuthStore.getState().setToken(token);
        console.log('Token sincronizado con el store');
      }
    };
    
    syncToken();
    
    descargarModelosFaciales().catch((error) => {
      console.error('Error al descargar modelos:', error);
    });
    
    cargarCamaras();
  }, []);

  // Limpiar stream al desmontar
  useEffect(() => {
    return () => {
      if (stream) {
        detenerCamara(stream);
      }
    };
  }, [stream]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-bold text-white">Verificación de Identidad</h2>
        <p className="text-sm text-[var(--gray-200)]">
          Tome una selfie clara para verificar su identidad
        </p>
      </div>

      {/* Recomendaciones */}
      <div className="bg-[var(--gray-400)] rounded-xl p-4 border border-[var(--gray-300)]">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[var(--yellow)] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white mb-2">
              Recomendaciones para una foto clara:
            </h3>
            <ul className="space-y-1 text-xs text-[var(--gray-200)]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-[var(--green)]" />
                Buena iluminación (luz natural preferible)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-[var(--green)]" />
                Rostro completamente visible y centrado
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-[var(--green)]" />
                Sin gafas de sol ni accesorios que cubran el rostro
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-[var(--green)]" />
                Fondo neutro (evitar fondos complicados)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-[var(--green)]" />
                Expresión neutral (sin sonreír exageradamente)
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preview o Captura */}
      <div className="bg-[var(--gray-400)] rounded-xl p-6 border border-[var(--gray-300)]">
        {!selfiePreview && modoCaptura === 'ninguno' && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[var(--gray-200)] text-center mb-2">
              Elija cómo desea proporcionar su foto:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={iniciarCamara}
                disabled={loading}
                variant="secondary"
                className="flex flex-col items-center gap-3 h-auto py-8"
              >
                {loading ? (
                  <Loader2 className="w-12 h-12 animate-spin" />
                ) : (
                  <Camera className="w-12 h-12" />
                )}
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Tomar Foto</span>
                  <span className="text-xs text-[var(--gray-200)]">
                    Usar cámara web
                  </span>
                </div>
              </Button>

              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                variant="secondary"
                className="flex flex-col items-center gap-3 h-auto py-8"
              >
                <Upload className="w-12 h-12" />
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Subir Foto</span>
                  <span className="text-xs text-[var(--gray-200)]">
                    Desde tu dispositivo
                  </span>
                </div>
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* Vista de cámara */}
        {modoCaptura === 'camara' && !selfiePreview && (
          <div className="flex flex-col gap-4">
            {/* Selector de cámaras */}
            {cameras.length > 1 && (
              <div className="flex items-center gap-2 bg-[var(--gray-300)] rounded-lg p-3">
                <Camera className="w-5 h-5 text-[var(--gray-200)]" />
                <select
                  value={selectedCamera}
                  onChange={(e) => cambiarCamara(e.target.value)}
                  className="flex-1 bg-[var(--gray-400)] text-white rounded-lg px-3 py-2 text-sm outline-none border border-[var(--gray-300)] focus:border-[var(--green)]"
                >
                  {cameras.map((camera) => (
                    <option key={camera.deviceId} value={camera.deviceId}>
                      {camera.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Guía de rostro */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-80 border-4 border-[var(--green)] rounded-full opacity-30"></div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={capturarFoto}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Capturar Foto
              </Button>

              <Button
                onClick={detenerCamera}
                variant="secondary"
                className="flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Preview de selfie */}
        {selfiePreview && (
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square max-w-md mx-auto w-full bg-black rounded-lg overflow-hidden">
              <Image
                src={selfiePreview}
                alt="Selfie preview"
                fill
                className="object-cover"
              />
              
              {/* Indicador de validación */}
              {validandoRostro && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                    <p className="text-sm text-white">Analizando rostro...</p>
                  </div>
                </div>
              )}
              
              {!validandoRostro && rostroValidado && (
                <div className="absolute top-4 right-4 bg-[var(--green)] text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Rostro detectado
                </div>
              )}
              
              {!validandoRostro && !rostroValidado && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium">
                  <X className="w-4 h-4" />
                  Rostro no válido
                </div>
              )}
            </div>

            {/* Advertencias */}
            {advertenciasRostro.length > 0 && (
              <div className="bg-[var(--yellow)]/10 border border-[var(--yellow)] rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[var(--yellow)] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[var(--yellow)] mb-1">
                      Sugerencias:
                    </p>
                    <ul className="space-y-1">
                      {advertenciasRostro.map((adv, idx) => (
                        <li key={idx} className="text-xs text-[var(--gray-200)]">
                          • {adv}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={isPending || !rostroValidado}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    Subiendo <Loader2 className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Confirmar y Completar Registro
                  </>
                )}
              </Button>

              <Button
                onClick={limpiarSelfie}
                disabled={isPending}
                variant="secondary"
                className="flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Tomar Otra
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Nota de privacidad */}
      <div className="text-center">
        <p className="text-xs text-[var(--gray-300)]">
          🔒 Tu foto es privada y solo se usa para verificación interna
        </p>
      </div>

      <Toaster position="top-center" />
    </div>
  );
};

