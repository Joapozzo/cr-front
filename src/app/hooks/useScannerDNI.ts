import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import toast from 'react-hot-toast';
import {
  convertFileToBase64,
  validateImageFile,
  isSecureContext,
  isMediaDevicesAvailable,
  getErrorMessage,
} from '../utils/scannerUtils';

interface UseScannerDNIProps {
  isScanning: boolean;
  setIsScanning: (value: boolean) => void;
  onScan: (codigo: string) => void;
  onPhotoScan?: (imagenBase64: string) => void;
}

export const useScannerDNI = ({
  isScanning,
  setIsScanning,
  onScan,
  onPhotoScan,
}: UseScannerDNIProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputGalleryRef = useRef<HTMLInputElement | null>(null);
  const fileInputCameraRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [error, setError] = useState('');
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [showPhotoButton, setShowPhotoButton] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  /**
   * Limpia el timer si existe
   */
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  /**
   * Detiene y limpia el escáner
   */
  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
        setIsRequestingPermission(false);
      } catch (err) {
        console.error('Error al detener scanner:', err);
      }
    }
  };

  /**
   * Maneja cuando se selecciona una foto
   */
  const handlePhotoSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Detener escaneo si está activo
    if (isScanning) {
      setIsScanning(false);
    }

    try {
      // Validar archivo
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error || 'Error al validar la imagen');
        return;
      }

      // Convertir a base64
      const imagenBase64 = await convertFileToBase64(file);

      // Guardar imagen para recortar y mostrar cropper
      setImageToCrop(imagenBase64);
      setShowCropper(true);
    } catch (error) {
      console.error('Error al procesar foto:', error);
      toast.error('Error al procesar la foto. Intenta nuevamente.');
    } finally {
      // Limpiar los inputs
      if (fileInputGalleryRef.current) {
        fileInputGalleryRef.current.value = '';
      }
      if (fileInputCameraRef.current) {
        fileInputCameraRef.current.value = '';
      }
    }
  };

  /**
   * Maneja cuando se confirma el recorte
   */
  const handleCropComplete = async (croppedImageBase64: string) => {
    setShowCropper(false);
    setImageToCrop(null);

    // Enviar imagen recortada al callback
    if (onPhotoScan) {
      setIsProcessingPhoto(true);
      try {
        await onPhotoScan(croppedImageBase64);
      } finally {
        setIsProcessingPhoto(false);
      }
    }
  };

  /**
   * Maneja cuando se cancela el recorte
   */
  const handleCropCancel = () => {
    setShowCropper(false);
    setImageToCrop(null);
  };

  /**
   * Abre el selector de galería
   */
  const handleOpenGallery = () => {
    fileInputGalleryRef.current?.click();
  };

  /**
   * Abre la cámara para tomar foto
   */
  const handleOpenCamera = () => {
    fileInputCameraRef.current?.click();
  };

  /**
   * Inicia el escaneo directamente
   */
  const startScanningDirectly = async () => {
    try {
      setIsRequestingPermission(true);
      setError('');
      setShowPhotoButton(false);
      clearTimer();

      // Validar contexto seguro
      if (!isSecureContext()) {
        throw new Error('La cámara solo funciona en HTTPS o localhost.');
      }

      // Validar disponibilidad de mediaDevices
      if (!isMediaDevicesAvailable()) {
        throw new Error('Tu navegador no soporta acceso a la cámara.');
      }

      // Crear e iniciar escáner
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      // Iniciar timer de 18 segundos para mostrar botón de foto
      timerRef.current = setTimeout(() => {
        if (isScanning && scannerRef.current) {
          setShowPhotoButton(true);
        }
      }, 18000);

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 280, height: 180 },
          aspectRatio: 1.777,
        },
        (decodedText) => {
          // Limpiar timer si se detecta código
          clearTimer();
          setShowPhotoButton(false);

          const stopAndScan = async () => {
            try {
              await stopScanner();
              setIsScanning(false);
              setTimeout(() => onScan(decodedText), 100);
            } catch (err) {
              console.error('Error al detener el escáner:', err);
            }
          };
          stopAndScan();
        },
        (errorMessage) => {
          if (
            errorMessage?.includes('NotFoundError') ||
            errorMessage?.includes('NotReadableError') ||
            errorMessage?.includes('PermissionDeniedError') ||
            errorMessage?.includes('NotAllowedError')
          ) {
            clearTimer();
            setShowPhotoButton(false);
            setIsRequestingPermission(false);
            setIsScanning(false);

            const friendlyError = getErrorMessage(errorMessage);
            setError(friendlyError);
            
            if (errorMessage.includes('PermissionDeniedError') || errorMessage.includes('NotAllowedError')) {
              toast.error('Permisos de cámara denegados');
            } else if (errorMessage.includes('NotFoundError')) {
              toast.error('No se encontró cámara');
            }
          }
        }
      );

      setIsRequestingPermission(false);
    } catch (startError: any) {
      clearTimer();
      setShowPhotoButton(false);
      setIsRequestingPermission(false);
      setIsScanning(false);

      const errorMessage = startError?.message || '';
      const friendlyError = getErrorMessage(errorMessage);
      setError(friendlyError);

      if (errorMessage.includes('PermissionDenied') || errorMessage.includes('NotAllowedError')) {
        toast.error('Permisos denegados');
      } else if (errorMessage.includes('NotFoundError') || errorMessage.includes('No camera')) {
        toast.error('No se encontró cámara');
      } else if (errorMessage.includes('HTTPS') || errorMessage.includes('secure')) {
        toast.error('Se requiere HTTPS');
      } else {
        toast.error('Error al iniciar cámara');
      }
    }
  };

  /**
   * Maneja el inicio del escaneo
   */
  const handleStartScanning = () => {
    if (!isSecureContext() || !isMediaDevicesAvailable()) {
      toast.error('Cámara no disponible');
      return;
    }
    setError('');
    setIsScanning(true);
  };

  /**
   * Maneja el reintento después de un error
   */
  const handleRetry = () => {
    setError('');
    setIsScanning(true);
  };

  // Effect para manejar el ciclo de vida del escáner
  useEffect(() => {
    if (!isScanning) {
      clearTimer();
      setShowPhotoButton(false);
      stopScanner();
      return;
    }

    if (scannerRef.current) return;

    startScanningDirectly();

    return () => {
      clearTimer();
      setShowPhotoButton(false);
      stopScanner();
    };
  }, [isScanning]);

  return {
    // Refs
    fileInputGalleryRef,
    fileInputCameraRef,
    
    // Estados
    error,
    isRequestingPermission,
    showPhotoButton,
    isProcessingPhoto,
    imageToCrop,
    showCropper,
    
    // Handlers
    handlePhotoSelected,
    handleOpenGallery,
    handleOpenCamera,
    handleStartScanning,
    handleRetry,
    handleCropComplete,
    handleCropCancel,
    
    // Utilidades
    isSecureContext: isSecureContext(),
    isMediaDevicesAvailable: isMediaDevicesAvailable(),
  };
};

