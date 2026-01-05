'use client';

import { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Loader2 } from 'lucide-react';

interface ImageCropperProps {
  image: string; // base64 o blob URL
  onCropComplete: (croppedImageBase64: string) => void;
  onCancel: () => void;
}

/**
 * Convierte el área de crop a imagen base64
 */
const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });
};


/**
 * Genera la imagen recortada
 */
const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No se pudo obtener el contexto del canvas');
  }

  // Establecer el tamaño del canvas al tamaño del crop
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Dibujar la porción recortada de la imagen
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convertir a base64 con calidad 0.9
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Error al crear el blob'));
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Remover el prefijo "data:image/...;base64,"
          const base64 = base64String.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      },
      'image/jpeg',
      0.9
    );
  });
};

export const ImageCropper = ({ image, onCropComplete, onCancel }: ImageCropperProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteCallback = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleConfirm = async () => {
    if (!croppedAreaPixels) {
      return;
    }

    setIsProcessing(true);
    try {
      // Convertir imagen base64 a blob URL si es necesario
      const imageUrl = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;

      const croppedImageBase64 = await getCroppedImg(imageUrl, croppedAreaPixels);

      onCropComplete(croppedImageBase64);
    } catch (error) {
      console.error('Error al recortar imagen:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Convertir imagen base64 a blob URL para el cropper
  const imageUrl = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[var(--gray-400)] border-b border-[var(--gray-300)]">
          <h2 className="text-lg font-bold text-[var(--gray-200)] text-center flex items-center justify-center gap-2">
            Recortar código de barras
          </h2>
          <p className="text-xs text-[var(--gray-200)] text-center mt-1 max-w-xs mx-auto">
            Ajustá el recuadro para encuadrar <span className="text-[var(--green)] font-semibold">SOLO</span> el código de barras. No incluyas el resto del DNI.
          </p>
        </div>

        {/* Cropper Container */}
        <div className="flex-1 relative bg-black">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={3.5 / 1}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
            cropShape="rect"
            showGrid={true}
            style={{
              containerStyle: {
                width: '100%',
                height: '100%',
                position: 'relative',
              },
            }}
          />
        </div>

        {/* Controls */}
        <div className="p-4 bg-[var(--gray-400)] border-t border-[var(--gray-300)]">
          {/* Zoom Slider */}
          <div className="mb-4">
            <label className="block text-xs text-[var(--gray-200)] mb-2 text-center">
              Zoom: {Math.round(zoom * 100)}%
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-[var(--gray-300)] rounded-lg appearance-none cursor-pointer accent-[var(--green)]"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 py-3 bg-[var(--gray-300)] text-[var(--gray-200)] rounded-lg text-sm font-medium hover:bg-[var(--gray-200)] hover:text-[var(--gray-400)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing || !croppedAreaPixels}
              className="flex-1 py-3 bg-[var(--green)] text-[var(--black)] rounded-lg text-sm font-medium hover:bg-[var(--green)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Confirmar recorte'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

