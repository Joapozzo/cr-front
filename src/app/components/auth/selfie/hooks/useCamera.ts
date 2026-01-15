import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { detenerCamara as detenerCamaraUtil } from '@/app/services/upload.service';
import type { ModoCaptura } from './useSelfieState';

export interface CameraDevice {
  deviceId: string;
  label: string;
}

export interface UseCameraReturn {
  stream: MediaStream | null;
  setStream: (stream: MediaStream | null) => void;
  cameras: CameraDevice[];
  setCameras: (cameras: CameraDevice[]) => void;
  selectedCamera: string;
  setSelectedCamera: (cameraId: string) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  iniciarCamara: (deviceId?: string, isMobile?: boolean, onStreamReady?: (stream: MediaStream) => void) => Promise<void>;
  detenerStream: () => void;
}

/**
 * Hook para manejar toda la lógica de cámara
 * Incluye: stream, dispositivos, iniciar/detener, refs
 */
export const useCamera = (
  setLoading: (loading: boolean) => void,
  setLoadingMessage: (message: string) => void
): UseCameraReturn => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup de stream al desmontar
  useEffect(() => {
    return () => {
      if (stream) {
        detenerCamaraUtil(stream);
      }
    };
  }, [stream]);

  // Cargar lista de cámaras (función interna, no exportada)
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
  const iniciarCamara = useCallback(async (
    deviceId?: string,
    isMobile?: boolean,
    onStreamReady?: (stream: MediaStream) => void
  ) => {
    try {
      setLoading(true);
      setLoadingMessage('Iniciando cámara...');

      if (stream) {
        detenerCamaraUtil(stream);
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

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        if (onStreamReady) {
          onStreamReady(mediaStream);
        }

        toast.success('Cámara iniciada');
      } catch (primaryError: unknown) {
        // Fallback: intentar sin restricciones
        console.warn('Error con constraints específicos, intentando fallback:', primaryError);
        setLoadingMessage('Intentando con configuración alternativa...');

        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });

        setStream(fallbackStream);

        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }

        if (onStreamReady) {
          onStreamReady(fallbackStream);
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
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  }, [stream, selectedCamera, setLoading, setLoadingMessage]);

  // Detener stream de cámara (solo el stream, sin lógica de estado)
  const detenerStream = useCallback(() => {
    if (stream) {
      detenerCamaraUtil(stream);
      setStream(null);
    }
  }, [stream]);

  return {
    stream,
    setStream,
    cameras,
    setCameras,
    selectedCamera,
    setSelectedCamera,
    videoRef,
    fileInputRef,
    iniciarCamara,
    detenerStream,
  };
};

