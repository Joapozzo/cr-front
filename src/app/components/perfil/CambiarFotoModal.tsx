'use client';

import { useState, useRef } from 'react';
import { X, Camera, Upload, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useActualizarFotoPerfil } from '@/app/hooks/perfil/useActualizarFotoPerfil';
import { Button } from '@/app/components/ui/Button';

interface CambiarFotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string;
}

export const CambiarFotoModal = ({
  isOpen,
  onClose,
  currentImage,
}: CambiarFotoModalProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [_selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const { mutate: actualizarFoto, isPending } = useActualizarFotoPerfil();

  if (!isOpen) return null;

  // Comprimir imagen a base64
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Redimensionar a máximo 512x512 manteniendo aspect ratio
          let width = img.width;
          let height = img.height;
          const maxSize = 512;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx?.drawImage(img, 0, 0, width, height);

          // Convertir a base64 con calidad 85%
          const base64 = canvas.toDataURL('image/jpeg', 0.85);
          resolve(base64);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Manejar selección de archivo
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen es muy grande. Máximo 5MB');
      return;
    }

    try {
      const base64 = await compressImage(file);
      setPreview(base64);
      setSelectedFile(file);
    } catch (error) {
      toast.error('Error al procesar la imagen');
      console.error(error);
    }
  };

  // Activar cámara
  const handleActivarCamara = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 512, height: 512 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (error) {
      toast.error('Error al acceder a la cámara');
      console.error(error);
    }
  };

  // Capturar foto desde cámara
  const handleCapturarFoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 512, 512);
      const base64 = canvas.toDataURL('image/jpeg', 0.85);
      setPreview(base64);
      
      // Detener cámara
      handleDetenerCamara();
    }
  };

  // Detener cámara
  const handleDetenerCamara = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  // Guardar foto
  const handleGuardar = () => {
    if (!preview) {
      toast.error('No hay imagen seleccionada');
      return;
    }

    console.log('📤 Enviando foto al servidor...');
    
    actualizarFoto(preview, {
      onSuccess: (data) => {
        console.log('✅ Foto actualizada exitosamente:', data);
        console.log('🖼️ Nueva URL:', data.img);
        toast.success('Foto de perfil actualizada');
        handleClose();
      },
      onError: (error: any) => {
        console.error('❌ Error al actualizar foto:', error);
        toast.error(error.message || 'Error al actualizar la foto');
      },
    });
  };

  // Cerrar modal
  const handleClose = () => {
    handleDetenerCamara();
    setPreview(null);
    setSelectedFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--gray-500)] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--gray-400)]">
          <h2 className="text-xl font-bold text-white">Cambiar foto de perfil</h2>
          <button
            onClick={handleClose}
            className="text-[var(--gray-200)] hover:text-white transition-colors"
            disabled={isPending}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Vista previa */}
          <div className="flex justify-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden bg-[var(--gray-400)] border-4 border-[var(--gray-300)]">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : currentImage ? (
                <img src={currentImage} alt="Current" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--gray-200)]">
                  <Upload size={48} />
                </div>
              )}
            </div>
          </div>

          {/* Cámara activa */}
          {isCameraActive && (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg bg-black"
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleCapturarFoto}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Camera size={20} />
                  Capturar
                </Button>
                <Button
                  onClick={handleDetenerCamara}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Opciones */}
          {!isCameraActive && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
                disabled={isPending}
              >
                <Upload size={20} />
                Subir desde archivo
              </Button>

              <Button
                onClick={handleActivarCamara}
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
                disabled={isPending}
              >
                <Camera size={20} />
                Tomar foto con cámara
              </Button>
            </div>
          )}

          {/* Botón guardar */}
          {preview && !isCameraActive && (
            <Button
              onClick={handleGuardar}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  Guardando <Loader2 className="animate-spin w-4 h-4" />
                </>
              ) : (
                'Guardar cambios'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

