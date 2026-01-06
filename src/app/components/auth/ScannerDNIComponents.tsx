'use client';

import { MdCameraAlt, MdPhotoLibrary } from 'react-icons/md';
import { Loader2, ArrowRight, Info } from 'lucide-react';
import { RefObject, useState } from 'react';

interface ScannerIdleViewProps {
  error?: string;
  onStartScanning: () => void;
  onRetry: () => void;
  onOpenGallery: () => void;
  onOpenCamera: () => void;
  onPhotoSelected: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoScan?: (imagenBase64: string) => void;
  fileInputGalleryRef: RefObject<HTMLInputElement | null>;
  fileInputCameraRef: RefObject<HTMLInputElement | null>;
  isSecureContext: boolean;
  isMediaDevicesAvailable: boolean;
}

export const ScannerIdleView = ({
  error,
  onStartScanning,
  onRetry,
  onOpenGallery,
  onOpenCamera,
  onPhotoSelected,
  onPhotoScan,
  fileInputGalleryRef,
  fileInputCameraRef,
  isSecureContext,
  isMediaDevicesAvailable,
}: ScannerIdleViewProps) => {
  const [showTips, setShowTips] = useState(false);

  return (
    <div className="w-full flex flex-col gap-4 lg:gap-5 flex-1 lg:flex-none justify-center lg:justify-start">
      {/* Inputs ocultos para seleccionar foto */}
      <input
        ref={fileInputGalleryRef}
        type="file"
        accept="image/*"
        onChange={onPhotoSelected}
        className="hidden"
      />

      <input
        ref={fileInputCameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onPhotoSelected}
        className="hidden"
      />

      {/* Consejos - Popup arriba cerca de títulos */}
      <div className="relative flex justify-end -mt-6 lg:-mt-6 mb-1">
        {/* Botón de info */}
        <button
          onClick={() => setShowTips(!showTips)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--gray-400)] hover:bg-[var(--gray-300)] text-[var(--gray-200)] transition-colors"
          aria-label="Ver consejos"
        >
          <Info size={18} />
        </button>

        {/* Popup de consejos */}
        {showTips && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowTips(false)}
            />
            <div className="absolute top-full right-0 mt-2 w-64 bg-[var(--gray-400)] rounded-lg p-4 shadow-xl z-50 border border-[var(--gray-300)]">
              <p className="text-xs text-[var(--gray-200)] font-medium mb-2">💡 Consejos:</p>
              <ul className="text-xs text-[var(--gray-200)] space-y-1">
                <li>• Mantén el DNI a 15-20 cm de distancia</li>
                <li>• Usa buena iluminación</li>
                <li>• Mantén el celular firme</li>
                <li>• Si no enfoca, aléjalo un poco</li>
              </ul>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="bg-[var(--color-secondary)]/20 border border-[var(--color-secondary)] rounded-lg p-4">
          <p className="text-sm text-[var(--color-secondary)] mb-3 text-center">{error}</p>
          <button
            onClick={onRetry}
            className="w-full py-3 bg-[var(--color-primary)] text-[var(--black)] rounded-lg text-sm font-medium"
          >
            Intentar nuevamente
          </button>
        </div>
      )}

      <button
        onClick={onStartScanning}
        disabled={!isSecureContext || !isMediaDevicesAvailable}
        className="w-full h-56 lg:h-48 bg-[var(--gray-400)] rounded-lg border-2 border-dashed border-[var(--gray-300)] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[var(--gray-300)] hover:border-[var(--color-primary)] transition-all disabled:opacity-50 overflow-hidden relative"
      >
        {/* SKELETON DNI */}
        <div className="relative w-56 lg:w-52 h-36 lg:h-32 bg-gradient-to-br from-[var(--gray-400)] to-[var(--gray-500)] rounded-xl shadow-2xl border-2 border-[var(--color-primary)]/30 overflow-hidden">
  {/* Efecto de barra de escaneo */}
  <div className="absolute inset-0">
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent animate-scan-line" />
  </div>
  
  {/* Contenido del DNI */}
  <div className="absolute inset-0 p-4 flex flex-col gap-2">
    {/* Foto placeholder - izquierda */}
    <div className="absolute left-4 top-6 w-14 h-16 bg-[var(--gray-300)]/20 rounded border border-[var(--gray-300)]/40" />
    
    {/* Líneas de texto simuladas - derecha de la foto */}
    <div className="ml-20 mt-2 space-y-2">
      <div className="h-3 bg-[var(--gray-300)]/30 rounded w-3/4 animate-pulse" />
      <div className="h-2 bg-[var(--gray-300)]/20 rounded w-1/2" />
      <div className="h-2 bg-[var(--gray-300)]/20 rounded w-2/3" />
      <div className="h-2 bg-[var(--gray-300)]/20 rounded w-1/2" />
    </div>
    
    {/* Número de documento - abajo izquierda */}
    <div className="absolute bottom-4 left-4">
      <div className="h-3 bg-[var(--gray-300)]/30 rounded w-24 animate-pulse" />
    </div>
    
    {/* Código de barras PDF417 - abajo derecha más rectangular y bajo */}
    <div className="absolute bottom-3 right-3 w-24 h-10 bg-[var(--gray-100)]/90 rounded flex items-center justify-center p-1">
      {/* Simulación de código PDF417 */}
      <div className="w-full h-full flex flex-col gap-[1px]">
        {Array.from({ length: 7 }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-[1px] h-full">
            {Array.from({ length: 16 }).map((_, colIndex) => {
              const shouldFill = (rowIndex * 7 + colIndex * 3) % 3 !== 0;
              return (
                <div
                  key={colIndex}
                  className={`flex-1 ${shouldFill ? 'bg-[var(--gray-600)]' : 'bg-[var(--gray-100)]'}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Indicador de pulso en el código de barras */}
      <div className="absolute inset-0 rounded border-2 border-[var(--color-primary)] animate-pulse opacity-80" />
    </div>
    
    {/* Flecha señalando el código de barras */}
    <div className="absolute bottom-6 right-28 animate-bounce">
      <ArrowRight className="w-6 h-6 text-[var(--color-primary)] drop-shadow-lg" strokeWidth={3} />
    </div>
  </div>

  {/* Efecto de brillo que se mueve */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
</div>

        <p className="text-sm text-[var(--gray-200)] font-medium text-center">
          Escanear código de barras
        </p>
      </button>

      {/* Botones para tomar foto directamente (fallback) */}
      {onPhotoScan && (
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-3">
          <button
            onClick={onOpenCamera}
            className="w-full lg:flex-1 py-3 bg-[var(--color-primary)] text-[var(--black)] rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-[var(--color-primary)]/90 transition-colors"
          >
            <MdCameraAlt size={20} />
            <span className="hidden lg:inline">Tomar foto</span>
            <span className="lg:hidden">Tomar foto del código de barras</span>
          </button>
          <button
            onClick={onOpenGallery}
            className="w-full lg:flex-1 py-3 bg-[var(--gray-400)] text-[var(--gray-200)] border border-[var(--gray-300)] rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-[var(--gray-300)] transition-colors"
          >
            <MdPhotoLibrary size={20} />
            Elegir de galería
          </button>
        </div>
      )}

    </div>
  );
};

interface ScannerActiveViewProps {
  isRequestingPermission: boolean;
  isProcessingPhoto: boolean;
  error?: string;
  showPhotoButton: boolean;
  onOpenGallery: () => void;
  onOpenCamera: () => void;
  onPhotoSelected: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoScan?: (imagenBase64: string) => void;
  onCancel: () => void;
  fileInputGalleryRef: RefObject<HTMLInputElement | null>;
  fileInputCameraRef: RefObject<HTMLInputElement | null>;
}

export const ScannerActiveView = ({
  isRequestingPermission,
  isProcessingPhoto,
  error,
  showPhotoButton,
  onOpenGallery,
  onOpenCamera,
  onPhotoSelected,
  onPhotoScan,
  onCancel,
  fileInputGalleryRef,
  fileInputCameraRef,
}: ScannerActiveViewProps) => {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Inputs ocultos */}
      <input
        ref={fileInputGalleryRef}
        type="file"
        accept="image/*"
        onChange={onPhotoSelected}
        className="hidden"
      />

      <input
        ref={fileInputCameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onPhotoSelected}
        className="hidden"
      />

      <div id="qr-reader" className="w-full rounded-lg overflow-hidden" />

      {isRequestingPermission && (
        <div className="flex flex-col items-center gap-2 p-4 bg-[var(--gray-400)] rounded-lg">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
          <p className="text-sm text-[var(--gray-200)]">
            Solicitando acceso a la cámara...
          </p>
        </div>
      )}

      {isProcessingPhoto && (
        <div className="flex flex-col items-center gap-2 p-4 bg-[var(--gray-400)] rounded-lg">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
          <p className="text-sm text-[var(--gray-200)]">
            Procesando foto... Esto puede tardar unos segundos.
          </p>
        </div>
      )}

      {!error && !isRequestingPermission && !isProcessingPhoto && (
        <>
          <div className="flex items-center justify-center gap-2 text-[var(--color-primary)]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <p className="text-sm">Buscando código...</p>
          </div>

          <div className="bg-[var(--gray-400)] rounded-lg p-3">
            <p className="text-xs text-[var(--gray-200)] text-center">
              Mantén el código de barras a 15-20 cm. Si no enfoca, aléjalo.
            </p>
          </div>

          {/* Botones fallback para tomar foto */}
          {showPhotoButton && onPhotoScan && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-[var(--gray-200)] text-center mb-1">
                ¿No puedes escanear? Elige una opción:
              </p>
              <div className="bg-[var(--yellow)]/10 border border-[var(--yellow)]/30 rounded-lg p-2 mb-2">
                <p className="text-xs text-[var(--yellow)] text-center">
                  ⚠️ Saca foto al código de barras del <strong>DORSO</strong> del DNI
                </p>
              </div>
              <button
                onClick={onOpenCamera}
                className="w-full py-3 bg-[var(--color-primary)] text-[var(--black)] rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-[var(--color-primary)]/90 transition-colors"
              >
                <MdCameraAlt size={20} />
                Tomar foto del código de barras
              </button>
              <button
                onClick={onOpenGallery}
                className="w-full py-3 bg-[var(--gray-400)] text-[var(--gray-200)] border border-[var(--gray-300)] rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-[var(--gray-300)] transition-colors"
              >
                <MdPhotoLibrary size={20} />
                Elegir de galería
              </button>
            </div>
          )}
        </>
      )}

      <button
        onClick={onCancel}
        className="text-sm text-[var(--gray-200)] hover:text-[var(--color-secondary)] transition-colors text-center"
      >
        Cancelar
      </button>
    </div>
  );
};

