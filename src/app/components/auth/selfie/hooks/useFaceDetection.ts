import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  validarRostro,
  detectarRostroEnTiempoReal,
  loadFaceModels,
} from '@/app/services/faceDetection.service';
import { capturarFrameVideo } from '@/app/services/upload.service';
import { comprimirImagen } from '@/app/services/upload.service';
import type { ModoCaptura } from './useSelfieState';

export interface DeteccionRostro {
  tieneRostro: boolean;
  valido: boolean;
  mensaje?: string;
}

export interface UseFaceDetectionReturn {
  deteccionRostro: DeteccionRostro;
  setDeteccionRostro: (det: DeteccionRostro) => void;
  contador: number | null;
  setContador: (contador: number | null) => void;
  contadorRef: React.MutableRefObject<number | null>;
  contadorIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>;
  stopDetectionRef: React.MutableRefObject<(() => void) | null>;
  modelsCargados: boolean;
  setModelsCargados: (loaded: boolean) => void;
  capturarFoto: () => Promise<void>;
  startDetection: (videoElement: HTMLVideoElement) => Promise<void>;
  stopDetection: () => void;
}

/**
 * Hook para manejar toda la lógica de detección facial
 * Incluye: modelos, detección en tiempo real, contador, captura automática
 */
export const useFaceDetection = (
  videoRef: React.RefObject<HTMLVideoElement>,
  setLoading: (loading: boolean) => void,
  setLoadingMessage: (message: string) => void,
  setSelfieBase64: (base64: string | null) => void,
  setSelfiePreview: (preview: string | null) => void,
  setModo: (modo: ModoCaptura) => void,
  setRostroValidado: (validado: boolean) => void,
  detenerCamera: () => void
): UseFaceDetectionReturn => {
  const [deteccionRostro, setDeteccionRostro] = useState<DeteccionRostro>({ tieneRostro: false, valido: false });
  const [contador, setContador] = useState<number | null>(null);
  const [modelsCargados, setModelsCargados] = useState(false);
  const contadorRef = useRef<number | null>(null);
  const contadorIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stopDetectionRef = useRef<(() => void) | null>(null);

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
  }, [setModelsCargados]);

  // Sincronizar contadorRef con contador
  useEffect(() => {
    contadorRef.current = contador;
  }, [contador]);

  // Cleanup de detección al desmontar
  useEffect(() => {
    return () => {
      if (stopDetectionRef.current) {
        stopDetectionRef.current();
        stopDetectionRef.current = null;
      }
      if (contadorIntervalRef.current) {
        clearInterval(contadorIntervalRef.current);
        contadorIntervalRef.current = null;
      }
    };
  }, []);

  // Detener detección
  const stopDetection = useCallback(() => {
    if (stopDetectionRef.current) {
      stopDetectionRef.current();
      stopDetectionRef.current = null;
    }
    if (contadorIntervalRef.current) {
      clearInterval(contadorIntervalRef.current);
      contadorIntervalRef.current = null;
    }
    setContador(null);
  }, []);

  // Iniciar detección en tiempo real
  const startDetection = useCallback(async (videoElement: HTMLVideoElement) => {
    if (!modelsCargados) return;

    const stopDetection = await detectarRostroEnTiempoReal(
      videoElement,
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
  }, [modelsCargados]);

  // Capturar foto
  const capturarFoto = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      setLoading(true);
      setLoadingMessage('Capturando foto...');

      // Detener detección antes de capturar
      stopDetection();

      const base64Raw = capturarFrameVideo(videoRef.current, 0.8);

      // Validar que la foto capturada tenga un rostro válido
      setLoadingMessage('Validando rostro...');
      const validacion = await validarRostro(base64Raw);

      if (!validacion.valido) {
        toast.error(validacion.mensaje || 'No se detectó un rostro válido en la foto');
        setLoading(false);
        setLoadingMessage('');
        // Reiniciar detección
        if (videoRef.current && modelsCargados) {
          await startDetection(videoRef.current);
        }
        return;
      }

      setLoadingMessage('Procesando imagen...');
      const blob = await fetch(base64Raw).then(r => r.blob());
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });

      setLoadingMessage('Comprimiendo imagen...');
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
      setLoadingMessage('');
    }
  }, [
    videoRef,
    modelsCargados,
    setLoading,
    setLoadingMessage,
    stopDetection,
    startDetection,
    setSelfieBase64,
    setSelfiePreview,
    setModo,
    setRostroValidado,
    detenerCamera,
  ]);

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
  }, [contador, deteccionRostro.valido, capturarFoto, videoRef]);

  return {
    deteccionRostro,
    setDeteccionRostro,
    contador,
    setContador,
    contadorRef,
    contadorIntervalRef,
    stopDetectionRef,
    modelsCargados,
    setModelsCargados,
    capturarFoto,
    startDetection,
    stopDetection,
  };
};

