'use client';

import { useRef, useState } from 'react';
import { MdQrCodeScanner, MdCameraAlt } from 'react-icons/md';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import jsQR from 'jsqr'; // npm install jsqr

interface ScannerDNINativoProps {
  onScan: (codigo: string) => void;
}

export const ScannerDNINativo = ({ onScan }: ScannerDNINativoProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setPreview(URL.createObjectURL(file));

    try {
      // Leer la imagen
      const image = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('No se pudo crear el contexto del canvas');
      }

      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);

      // Obtener datos de imagen
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // Intentar leer QR Code
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (qrCode) {
        ('✅ QR detectado:', qrCode.data);
        onScan(qrCode.data);
        toast.success('Código QR detectado');
        setPreview(null);
        setIsProcessing(false);
        return;
      }

      // Si no es QR, intentar con código de barras usando Quagga
      // O puedes usar una librería como @zxing/library para múltiples formatos
      const { default: Quagga } = await import('quagga');

      Quagga.decodeSingle(
        {
          src: URL.createObjectURL(file),
          numOfWorkers: 0,
          locate: true,
          inputStream: {
            size: canvas.width,
          },
          decoder: {
            readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader', 'code_39_vin_reader', 'codabar_reader', 'upc_reader', 'upc_e_reader', 'i2of5_reader']
          },
        },
        (result) => {
          if (result && result.codeResult) {
            ('✅ Código de barras detectado:', result.codeResult.code);
            onScan(result.codeResult.code);
            toast.success('Código de barras detectado');
          } else {
            toast.error('No se detectó ningún código. Intenta con mejor iluminación y enfoque.');
          }
          setPreview(null);
          setIsProcessing(false);
        }
      );

    } catch (error) {
      console.error('Error al procesar imagen:', error);
      toast.error('Error al procesar la imagen. Intenta nuevamente.');
      setPreview(null);
      setIsProcessing(false);
    }

    // Limpiar input para permitir seleccionar la misma foto nuevamente
    event.target.value = '';
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Input oculto que abre la cámara nativa */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment" // Abre cámara trasera en móviles
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview de la imagen capturada */}
      {preview && (
        <div className="relative w-full rounded-lg overflow-hidden">
          <img src={preview} alt="Vista previa" className="w-full" />
          {isProcessing && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" />
                <p className="text-sm text-white">Procesando imagen...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botón para abrir cámara */}
      {!preview && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="w-full h-64 bg-[var(--gray-400)] rounded-lg border-2 border-dashed border-[var(--gray-300)] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[var(--gray-300)] hover:border-[var(--green)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdCameraAlt size={48} className="text-[var(--gray-200)]" />
          <p className="text-sm text-[var(--gray-200)] font-medium text-center">
            Abrir cámara
          </p>
          <p className="text-xs text-[var(--gray-300)] text-center px-4">
            Toma una foto del código de barras de tu DNI
          </p>
          <div className="flex items-center gap-2 text-xs text-[var(--green)]">
            <MdQrCodeScanner size={16} />
            <span>Zoom disponible</span>
          </div>
        </button>
      )}

      {/* Instrucciones */}
      <div className="bg-[var(--gray-400)] rounded-lg p-4">
        <p className="text-xs text-[var(--gray-200)] mb-2">💡 Consejos:</p>
        <ul className="text-xs text-[var(--gray-300)] space-y-1 list-disc list-inside">
          <li>Usa buena iluminación</li>
          <li>Mantén el DNI estable</li>
          <li>Usa el zoom de tu cámara para enfocar mejor</li>
          <li>Asegúrate que el código esté completo en la foto</li>
        </ul>
      </div>
    </div>
  );
};